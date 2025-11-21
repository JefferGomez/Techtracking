document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("tecnicosContainer");

    try {
        const res = await fetch("/admin/registros/tecnicos");
        if (!res.ok) throw new Error("Error al cargar registros");

        const tecnicos = await res.json();

        if (tecnicos.length === 0) {
            contenedor.innerHTML = "<p>No hay registros disponibles.</p>";
            return;
        }

        tecnicos.forEach(t => {
            const card = document.createElement("div");
            card.classList.add("tecnico-card"); // reutiliza tu CSS

             card.innerHTML = `
                <div class="card-header">
                    <h3>${t.tecnico}</h3>
                    <span class="badge">${t.cantidadArchivos} archivos</span>
                </div>

                <div class="card-body">
                    <div class="filtros">
                        <input type="text" class="input-filtro" data-tipo="nombre" placeholder="Filtrar por Cliente">
                        <input type="text" class="input-filtro" data-tipo="consecutivo" placeholder="Filtrar por Consecutivo">
                        <input type="text" class="input-filtro" data-tipo="fecha" placeholder="Filtrar por Fecha">
                    </div>
                    <button class="btn-ver">Ver archivos</button>
                    <div class="lista-archivos" style="display:none;">
                        ${t.archivos.map(a => `
                            <a href="/admin/registros/${t.tecnicos}/${a}" 
                               target="_blank" 
                               class="archivo-link">${a}</a>
                        `).join("")}
                    </div>
                </div>
            `;

            const btnVer = card.querySelector(".btn-ver");
            const listaArchivos = card.querySelector(".lista-archivos");
            const inputsFiltro = card.querySelectorAll(".input-filtro");

            // Toggle lista de archivos
            btnVer.addEventListener("click", () => {
                listaArchivos.style.display = listaArchivos.style.display === "none" ? "block" : "none";
            });

            // Función de filtrado combinable
            inputsFiltro.forEach(input => {
                input.addEventListener("input", () => {
                    const nombreFiltro = card.querySelector('input[data-tipo="nombre"]').value.toLowerCase();
                    const consecutivoFiltro = card.querySelector('input[data-tipo="consecutivo"]').value;
                    const fechaFiltro = card.querySelector('input[data-tipo="fecha"]').value.toLowerCase();

                    const archivos = Array.from(listaArchivos.querySelectorAll(".archivo-link"));

                    archivos.forEach(link => {
                        const parts = link.textContent.replace(".pdf", "").split("+");
                        const nombre = parts[0].toLowerCase();
                        const consecutivo = parts[1] || "";
                        const fecha = parts[2]?.toLowerCase() || "";

                        const mostrar = 
                            nombre.includes(nombreFiltro) &&
                            consecutivo.includes(consecutivoFiltro) &&
                            fecha.includes(fechaFiltro);

                        link.style.display = mostrar ? "block" : "none";
                    });
                });
            });


            contenedor.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        contenedor.innerHTML = "<p>Error al cargar los registros.</p>";
    }
});
