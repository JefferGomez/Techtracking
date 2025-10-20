
function togglePassword(button) {
const input = document.getElementById("password");
const eyeOpen = button.querySelector(".eye-open");
const eyeClosed = button.querySelector(".eye-closed");

    if (input.type === "password") {
      input.type = "text";
      eyeOpen.style.display = "none";
      eyeClosed.style.display = "inline";
    } else {
      input.type = "password";
      eyeOpen.style.display = "inline";
      eyeClosed.style.display = "none";
    }
}

