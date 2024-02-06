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

io.on('connection', (socket) => {
    
  socket.on('send message', (message) => {
      console.log('Mensaje recibido:', message);

  });
});

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
    const authToken = '6331a58a70418e9b4fc81ebd98a2f7da';
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: msg,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+593958905131'
        })
        .then(message => console.log(message.sid))
        .done();
    
    //res.json({ message: msg });
    res.json({ success: true, message: 'Mensaje recibido' });
});

app.post('/whatsapp-webhook', (req, res) => {
  try {
      const message = req.body.Body;
      const sender = req.body.From;

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
