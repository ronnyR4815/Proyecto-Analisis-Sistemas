document.addEventListener('DOMContentLoaded', function() {
    function mostrarPestanaLogin() {
        const nav = document.querySelector('nav ul');
        const li = document.createElement('li');
        li.innerHTML = '<a href="login.html">LogIn</a>';
        nav.appendChild(li);
    }

    function mostrarPestanaProveedores() {
        const nav = document.querySelector('nav ul');
        const li = document.createElement('li');
        li.innerHTML = '<a href="proveedores.html">Proveedores</a>';
        nav.appendChild(li);
    }

    function agregarEnlaceLogout() {
        const nav = document.querySelector('nav ul');
        const li = document.createElement('li');
        li.innerHTML = '<a href="index.html" id="logout">Cerrar Sesión</a>';
        nav.appendChild(li);
    
        document.getElementById('logout').addEventListener('click', function(event) {
            event.preventDefault();
            cerrarSesion();
        });
    }
    
    function cerrarSesion() {
        sessionStorage.removeItem('usuario');
        window.location.href = 'index.html';
    }

    if (sessionStorage.getItem('usuario')) {
        mostrarPestanaProveedores();
        agregarEnlaceLogout();
    } else {
        mostrarPestanaLogin();
    }
});
