document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("clientesContainer");

    try {
        const res = await fetch("/admin/registros");
        if (!res.ok) throw new Error("Error al cargar registros");

        const clientes = await res.json();

        if (clientes.length === 0) {
            contenedor.innerHTML = "<p>No hay registros disponibles.</p>";
            return;
        }

        clientes.forEach(c => {
            const card = document.createElement("div");
            card.classList.add("cliente-card");

            card.innerHTML = `
                <h3>${c.cliente}</h3>
                <p><strong>Archivos:</strong> ${c.cantidadArchivos}</p>
                <button class="btn-ver">Ver archivos</button>
                <div class="lista-archivos" style="display:none; margin-top:10px;">
                    ${c.archivos.map(a => `
                        <a href="/admin/registros/${c.cliente}/${a}" 
                           target="_blank" 
                           class="archivo-link">${a}</a><br>
                    `).join("")}
                </div>
            `;

            card.querySelector(".btn-ver").addEventListener("click", () => {
                const lista = card.querySelector(".lista-archivos");
                lista.style.display = lista.style.display === "none" ? "block" : "none";
            });

            contenedor.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        contenedor.innerHTML = "<p>Error al cargar los registros.</p>";
    }
});
