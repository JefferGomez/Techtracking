    let socket = new WebSocket("ws://localhost:8080/websocket");
    let messageArea = document.getElementById("messageArea");
    let connectionStatus = document.getElementById("connectionStatus");

    socket.onopen = function(event) {
        console.log("Conectado al WebSocket");
        connectionStatus.innerHTML = '<span class="badge bg-success">Conectado</span>';
    };

    socket.onmessage = function(event) {
        console.log("Mensaje recibido:", event.data);

        // Crear nuevo elemento de mensaje
        let messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.textContent = event.data;

        // Agregar al área de mensajes
        messageArea.appendChild(messageDiv);

        // Scroll automático hacia abajo
        messageArea.scrollTop = messageArea.scrollHeight;
    };

    socket.onclose = function(event) {
        console.log("Conexión cerrada");
        connectionStatus.innerHTML = '<span class="badge bg-danger">Desconectado</span>';
    };

    socket.onerror = function(error) {
        console.log("Error en WebSocket:", error);
        connectionStatus.innerHTML = '<span class="badge bg-warning">Error de conexión</span>';
    };

    function sendMessage() {
        let username = document.getElementById("username");
        let messageInput = document.getElementById("messageInput");

        if (username.value.trim() === '' || messageInput.value.trim() === '') {
            alert('Por favor, completa todos los campos');
            return;
        }

        if (socket.readyState === WebSocket.OPEN) {
            let fullMessage = username.value + ": " + messageInput.value;
            socket.send(fullMessage);
            messageInput.value = '';
        } else {
            alert('No hay conexión con el servidor');
        }
    }

    // Permitir enviar con Enter
    document.getElementById("messageInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });