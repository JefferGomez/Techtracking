document.getElementById("revisionForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        clienteId: document.getElementById("clienteId").value,
        equipoId: document.getElementById("equipoId").value,

        equipoEnciende: document.getElementById("equipoEnciende").checked,
        displayFunciona: document.getElementById("displayFunciona").checked,
        alarmasActivas: document.getElementById("alarmasActivas").checked,
        presentaFugas: document.getElementById("presentaFugas").checked,
        cablesEnBuenEstado: document.getElementById("cablesEnBuenEstado").checked,
        nivelesCorrectos: document.getElementById("nivelesCorrectos").checked,
        limpiezaGeneral: document.getElementById("limpiezaGeneral").checked,
        filtrosLimpios: document.getElementById("filtrosLimpios").checked,
        ventilacionAdecuada: document.getElementById("ventilacionAdecuada").checked,
        botonEmergenciaFunciona: document.getElementById("botonEmergenciaFunciona").checked,
        calibracionCorrecta: document.getElementById("calibracionCorrecta").checked,
        accesoriosCompletos: document.getElementById("accesoriosCompletos").checked,
        fusiblesBuenEstado: document.getElementById("fusiblesBuenEstado").checked,
        conexionesFirmes: document.getElementById("conexionesFirmes").checked,
        tierraFisicaCorrecta: document.getElementById("tierraFisicaCorrecta").checked,
        lucesIndicadorasFuncionan: document.getElementById("lucesIndicadorasFuncionan").checked,
        ventiladoresOperativos: document.getElementById("ventiladoresOperativos").checked,
        bateriasOperativas: document.getElementById("bateriasOperativas").checked,
        gabineteSinOxido: document.getElementById("gabineteSinOxido").checked,
        perillasBuenEstado: document.getElementById("perillasBuenEstado").checked,
        manguerasBuenEstado: document.getElementById("manguerasBuenEstado").checked,
        presionAdecuada: document.getElementById("presionAdecuada").checked,
        temperaturaNormal: document.getElementById("temperaturaNormal").checked,
        sensoresFuncionales: document.getElementById("sensoresFuncionales").checked,
        softwareActualizado: document.getElementById("softwareActualizado").checked,
        sistemaSonoroFunciona: document.getElementById("sistemaSonoroFunciona").checked,
        tapasCorrectamenteColocadas: document.getElementById("tapasCorrectamenteColocadas").checked,
        puertasCierranBien: document.getElementById("puertasCierranBien").checked,
        sinVibraciones: document.getElementById("sinVibraciones").checked,
        rotulosVisibles: document.getElementById("rotulosVisibles").checked,
        manualDisponible: document.getElementById("manualDisponible").checked,

        observaciones: document.getElementById("observaciones").value,
        fecha: new Date().toISOString()
    };

    fetch("http://localhost:8080/admin/revisiones", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al guardar");
            return response.json();
        })
        .then(data => {
            alert("✅ Revisión guardada con éxito. ID: " + data.id);
            console.log("Respuesta del servidor:", data);
        })
        .catch(error => {
            alert("❌ Error: " + error.message);
            console.error(error);
        });
});
