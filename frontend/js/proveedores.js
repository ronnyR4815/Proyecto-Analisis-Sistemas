document.addEventListener('DOMContentLoaded', function() {
    cargarProveedores();

    document.getElementById('formNuevoProveedor').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const nuevoProveedor = {
            nombre: document.getElementById('nombreProveedor').value,
            anio: document.getElementById('anioProveedor').value,
            mes: document.getElementById('mesProveedor').value,
            compras: document.getElementById('comprasProveedor').value
        };
    
        fetch('http://localhost:3000/nuevo-proveedor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProveedor)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Proveedor agregado:', data);
            cargarProveedores();
        })
        .catch(error => console.error('Error:', error));
    });
    
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

                const editButton = document.createElement('button');
                editButton.classList.add('action-btn', 'edit-btn');
                editButton.textContent = 'Editar';
                editButton.onclick = function() { editarProveedor(fila, proveedor); };

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('action-btn', 'delete-btn');
                deleteButton.textContent = 'Eliminar';

                const actionCell = fila.insertCell();
                actionCell.appendChild(editButton);
                actionCell.appendChild(deleteButton);
                
                deleteButton.addEventListener('click', function() {
                    eliminarProveedor(proveedor.id);
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function eliminarProveedor(id) {
    if(confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
        fetch(`http://localhost:3000/proveedores/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el proveedor');
            }
            return response.json();
        })
        .then(() => {
            cargarProveedores(); // Recargar la lista de proveedores
        })
        .catch(error => console.error('Error:', error));
    }
}

function editarProveedor(fila, proveedor) {
    // Cambiar celdas de texto a campos de entrada
    fila.cells[1].innerHTML = `<input type="text" value="${proveedor.nombre}" />`;
    fila.cells[2].innerHTML = `<input type="text" value="${proveedor.anio}" />`;
    fila.cells[3].innerHTML = `<input type="text" value="${proveedor.mes}" />`;
    fila.cells[4].innerHTML = `<input type="text" value="${proveedor.compras}" />`;

    // Cambiar el botón de "Editar" a "Guardar"
    let editarBtn = fila.cells[5].getElementsByTagName('button')[0];
    editarBtn.textContent = 'Guardar';
    editarBtn.onclick = function() { guardarCambios(fila, proveedor.id); };
}

function guardarCambios(fila, id) {
    let nombreEditado = fila.cells[1].getElementsByTagName('input')[0].value;
    let anioEditado = fila.cells[2].getElementsByTagName('input')[0].value;
    let mesEditado = fila.cells[3].getElementsByTagName('input')[0].value;
    let comprasEditadas = fila.cells[4].getElementsByTagName('input')[0].value;

    // Envía los datos actualizados al servidor
    fetch(`http://localhost:3000/proveedores/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nombreEditado,
            anio: anioEditado,
            mes: mesEditado,
            compras: comprasEditadas
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Actualizar la interfaz de usuario o recargar los proveedores
        cargarProveedores();
    })
    .catch(error => console.error('Error:', error));
}