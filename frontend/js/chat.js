/*socket.on('whatsapp message', function(data) {
    var messageContainer = document.getElementById('messageContainer');
    var messageDiv = document.createElement('div');
    messageDiv.textContent = data.sender + ": " + data.message;
    messageContainer.appendChild(messageDiv);
});*/

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('sendButton').addEventListener('click', function(event) {
        event.preventDefault(); // Previene el comportamiento predeterminado

        const message = document.getElementById('messageInput').value;

        // Envía el mensaje al servidor
        fetch('http://localhost:3000/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Mensaje enviado:', data);
            var messageContainer = document.getElementById('messageContainer');
            var messageDiv = document.createElement('div');
            messageDiv.textContent = "Tú: " + message; // Agrega "Tú: " antes del mensaje
            messageContainer.appendChild(messageDiv);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        // Limpia el campo de texto
        document.getElementById('messageInput').value = '';
    });
});


function closeChat() {
    document.getElementById("chatPopup").style.display = "none";
}
