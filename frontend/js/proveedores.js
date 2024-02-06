document.addEventListener('DOMContentLoaded', function() {
    cargarProveedores();
});

function cargarProveedores() {
    fetch('http://localhost:3000/proveedores')
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById('proveedoresTable').getElementsByTagName('tbody')[0];
            tabla.innerHTML = ''; // Limpiar el cuerpo de la tabla

            data.forEach(proveedor => {
                const fila = tabla.insertRow();
                fila.insertCell().textContent = proveedor.id;
                fila.insertCell().textContent = proveedor.nombre;
                fila.insertCell().textContent = proveedor.anio;
                fila.insertCell().textContent = proveedor.mes;
                fila.insertCell().textContent = proveedor.compras;
            });
        })
        .catch(error => console.error('Error:', error));
}
