const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const strengthText = document.getElementById("strengthText");
const submitBtn = document.getElementById("submitBtn");

const requirements = {
  length: document.getElementById("length"),
  uppercase: document.getElementById("uppercase"),
  lowercase: document.getElementById("lowercase"),
  number: document.getElementById("number"),
  symbol: document.getElementById("symbol"),
  match: document.getElementById("match"),
};

function updateStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) strengthText.textContent = "Débil";
  else if (strength === 3 || strength === 4) strengthText.textContent = "Media";
  else strengthText.textContent = "Fuerte";
}

function validate() {
  const pwd = newPassword.value;
  const confirm = confirmPassword.value;

  const validations = {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    symbol: /[^A-Za-z0-9]/.test(pwd),
    match: pwd === confirm && pwd !== "",
  };

  let allValid = true;

  for (let key in validations) {
    if (validations[key]) {
      requirements[key].textContent = `✅ ${requirements[key].textContent.slice(2)}`;
      requirements[key].classList.add("valid");
      requirements[key].classList.remove("invalid");
    } else {
      requirements[key].textContent = `❌ ${requirements[key].textContent.slice(2)}`;
      requirements[key].classList.add("invalid");
      requirements[key].classList.remove("valid");
      allValid = false;
    }
  }

  updateStrength(pwd);
  submitBtn.disabled = !allValid;
}

newPassword.addEventListener("input", validate);
confirmPassword.addEventListener("input", validate);

submitBtn.addEventListener("click", async function () {
  const token = document.getElementById("token").value;
  const nuevaContraseña = newPassword.value;

  if (!token) {
    alert("Token no encontrado en el formulario");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/auth/cambiarContraseña", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: token,
        nuevaContraseña: nuevaContraseña
      })
    });

    if (response.ok) {
      alert("Contraseña cambiada correctamente");
      window.location.href = "/login"; // Redirige si quieres
    } else {
      const msg = await response.text();
      alert("Error al cambiar la contraseña: " + msg);
    }
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    alert("Error inesperado");
  }
});
