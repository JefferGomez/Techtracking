document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:8080/admin/mostrarClientes')
        .then(response => response.json())
        .then(clientes => {
            const tbody = document.getElementById("clientesBody");
            const totalSpan = document.getElementById("totalClientes");
            totalSpan.textContent = clientes.length;

            clientes.forEach(cliente => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${cliente.nombre}</td>
                    <td>${cliente.direccion}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.correo}</td>
                    <td>${cliente.id}</td>
                    <td>
                        ${cliente.equipos && cliente.equipos.length > 0 ? `
                            <table class="sub-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Marca</th>
                                        <th>Modelo</th>
                                        <th>Serie</th>
                                        <th>Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${cliente.equipos.map(equipo => `
                                        <tr>
                                            <td>${equipo.id}</td>
                                            <td>${equipo.marca}</td>
                                            <td>${equipo.modelo}</td>
                                            <td>${equipo.serie}</td>
                                            <td>${equipo.tipo}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : 'Sin equipos'}
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error al cargar los clientes:", error);
        });
});
