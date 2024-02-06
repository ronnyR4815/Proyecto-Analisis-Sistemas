const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const session = require('express-session');

const http = require('http');
const ngrok = require('@ngrok/ngrok');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(cors());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fhalconfood',
  password: '123',
  port: 5432,
});

// Configuración de express-session
app.use(session({
    secret: '1234567890', // Clave secreta para firmar las cookies de sesión
    resave: false,
    saveUninitialized: true,
}));

// Ruta GET básica para prueba
app.get('/usuarios', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
    console.log(rows)
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos');
  }
});

app.get('/proveedores', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM proveedores');
    res.json(rows);
    console.log(rows)
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos');
  }
});

app.delete('/proveedores/:id', async (req, res) => {
  try {
      const { id } = req.params;
      // Consulta SQL para eliminar el proveedor con el ID especificado
      const query = 'DELETE FROM proveedores WHERE id = $1';
      // Ejecutar la consulta
      await pool.query(query, [id]);
      res.json({ success: true, message: 'Proveedor eliminado' });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar el proveedor');
  }
});

app.put('/proveedores/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { nombre, anio, mes, compras } = req.body;

      // Actualizar el proveedor en la base de datos
      const query = 'UPDATE proveedores SET nombre = $1, anio = $2, mes = $3, compras = $4 WHERE id = $5';
      await pool.query(query, [nombre, anio, mes, compras, id]);

      res.json({ success: true, message: 'Proveedor actualizado' });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el proveedor');
  }
});

app.post('/nuevo-proveedor', async (req, res) => {
  try {
      const { nombre, anio, mes, compras } = req.body;
      
      // Agregar el nuevo proveedor a la base de datos
      const query = 'INSERT INTO proveedores (nombre, anio, mes, compras) VALUES ($1, $2, $3, $4)';
      await pool.query(query, [nombre, anio, mes, compras]);

      res.json({ success: true, message: 'Proveedor agregado' });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al agregar el proveedor');
  }
});

app.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Realiza una consulta a la base de datos para verificar las credenciales
      const query = 'SELECT * FROM usuarios WHERE username = $1 AND password = $2';
      const { rows } = await pool.query(query, [username, password]);

      if (rows.length === 1) {
          // Crear un token
          const usuario = { name: username };
          const accessToken = jwt.sign(usuario, "123123123", { expiresIn: '1h' });

          // Si se encuentra un usuario con las credenciales, envía el token
          res.json({ accessToken: accessToken });
      } else {
          res.status(401).send('Credenciales inválidas');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Error en la autenticación');
  }
});

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
    // Destruye la sesión del usuario
    req.session.destroy((err) => {
        if (err) {
        console.error(err);
        res.status(500).send('Error al cerrar sesión');
        } else {
        res.send('Sesión cerrada');
        }
    });
});

app.post('/send-message', (req, res) => {
    const msg = req.body.message;
    const accountSid = 'AC73bbc2645229b27048dbf30eba0eedb7';
    const authToken = '801318be3f6dc25c69f95ed9d9d63560';
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: msg,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+593958905131'
        })
        .then(message => console.log(message.sid))
        .done();
    
    res.json({ message: msg });
});

app.post('/whatsapp-webhook', (req, res) => {
  try {
      const message = req.body.body;
      const sender = req.body.from;

      console.log(message);

      io.emit('whatsapp message', { sender: sender, message: message });
      
      res.status(200).send('Mensaje recibido');
  } catch (error) {
      console.error('Error en /whatsapp-webhook:', error);
      res.status(500).send('Ocurrió un error');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
