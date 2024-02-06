document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const usuario = document.querySelector('input[name="txtUsuario"]').value;
        const password = document.querySelector('input[name="txtPassword"]').value;

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: usuario, password: password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            }
            return response.json();
        })
        .then(data => {
            if (data.accessToken) {
                sessionStorage.setItem('usuario', usuario);
                mostrarPestanaProveedores();
                agregarEnlaceLogout();
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Usuario o contraseña incorrectos.');
        });
    });

    function mostrarPestanaProveedores() {
        const nav = document.querySelector('nav ul');
        const li = document.createElement('li');
        li.innerHTML = '<a href="proveedores.html">Proveedores</a>';
        nav.appendChild(li);
    }

    function agregarEnlaceLogout() {
        const nav = document.querySelector('nav ul');
        const li = document.createElement('li');
        li.innerHTML = '<a href="#" id="logout">Cerrar Sesión</a>';
        nav.appendChild(li);
    
        document.getElementById('logout').addEventListener('click', function(event) {
            event.preventDefault();
            cerrarSesion();
        });
    }
    
    function cerrarSesion() {
        sessionStorage.removeItem('usuario');
        window.location.reload(); // Recargar la página para reflejar el estado de "no autenticado"
    }

    if (sessionStorage.getItem('usuario')) {
        mostrarPestanaProveedores();
        agregarEnlaceLogout();
    }

    function mostrarError(mensaje) {
        const contenedorError = document.getElementById('errorMensaje');
        contenedorError.textContent = mensaje;
        contenedorError.style.display = 'block';
    }
});
