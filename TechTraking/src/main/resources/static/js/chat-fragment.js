let socket = new WebSocket("ws://localhost:8080/websocket");
    let messageArea = document.getElementById("messageArea");
    let connectionStatus = document.getElementById("connectionStatus");

    socket.onopen = function(event) {
        console.log("Conectado al WebSocket");
        connectionStatus.innerHTML = '<span class="badge bg-success">✓ Conectado</span>';
    };

    function getCurrentDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const time = now.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return `${date} ${time}`;
    }

    socket.onmessage = function(event) {
        console.log("Mensaje recibido:", event.data);
        let messageDiv = document.createElement('div');
        messageDiv.className = 'message';

        let contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = event.data;

        let timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = getCurrentDateTime();

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        messageArea.appendChild(messageDiv);
        messageArea.scrollTop = messageArea.scrollHeight;
    };

    socket.onclose = function(event) {
        console.log("Conexión cerrada");
        connectionStatus.innerHTML = '<span class="badge bg-danger">✗ Desconectado</span>';
    };

    socket.onerror = function(error) {
        console.log("Error en WebSocket:", error);
        connectionStatus.innerHTML = '<span class="badge bg-warning">⚠ Error de conexión</span>';
    };

    function sendMessage() {
        let username = document.getElementById("username");
        let messageInput = document.getElementById("messageInput");

        if (messageInput.value.trim() === '') {
            alert('Por favor, escribe un mensaje');
            return;
        }

        if (socket.readyState === WebSocket.OPEN) {
            let fullMessage = username.value + ": " + messageInput.value;
            socket.send(fullMessage);
            messageInput.value = '';
            messageInput.focus();
        } else {
            alert('No hay conexión con el servidor');
        }
    }

    document.getElementById("messageInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Auto-focus en el campo de mensaje al cargar
    window.addEventListener('load', function() {
        document.getElementById("messageInput").focus();
    });


        document.getElementById('downloadChat').addEventListener('click', () => {
    if (messageArea.children.length === 0) {
        alert('No hay mensajes para descargar');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20; // Posición vertical inicial
    doc.setFontSize(12);
    doc.text("Chat Guardado - TechTracking", 105, 10, { align: "center" });

    messageArea.querySelectorAll('.message').forEach(msg => {
        const content = msg.querySelector('.message-content').textContent;
        const time = msg.querySelector('.message-time').textContent;
        
        const text = `[${time}] ${content}`;
        doc.text(text, 10, y);
        y += 10;

        // Si se llega al final de la página, agregar otra
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save('chat.pdf');
})
