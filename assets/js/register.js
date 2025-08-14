const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const form = document.getElementById("registerForm");

function setInvalid(input, message) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    input.nextElementSibling.textContent = message;
}

function setValid(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    input.nextElementSibling.textContent = "";
}

function validateName() {
    if (nameInput.value.trim() === "") {
        setInvalid(nameInput, "Please enter your name.");
        return false;
    }
    setValid(nameInput);
    return true;
}

function validateEmail() {
    if (!emailInput.value.endsWith("@gmail.com")) {
        setInvalid(emailInput, "Email must end with @gmail.com.");
        return false;
    }
    setValid(emailInput);
    return true;
}

function validatePassword() {
    const password = passwordInput.value;
    const strongPassword = /^(?=.*[A-Z]).{8,}$/;
    if (!strongPassword.test(password)) {
        setInvalid(passwordInput, "Password must be at least 8 characters and contain at least one uppercase letter.");
        return false;
    }
    setValid(passwordInput);
    return true;
}

function validateConfirmPassword() {
    if (!validatePassword() || confirmPasswordInput.value !== passwordInput.value) {
        setInvalid(confirmPasswordInput, "Passwords do not match or not valid.");
        return false;
    }
    setValid(confirmPasswordInput);
    return true;
}

// Validate live while typing
nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", () => {
    validatePassword();
    validateConfirmPassword();
});
confirmPasswordInput.addEventListener("input", validateConfirmPassword);

// Handle submit
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameValid = validateName();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    const confirmPasswordValid = validateConfirmPassword();

    if (nameValid && emailValid && passwordValid && confirmPasswordValid) {
        // Save to localStorage
        const userData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value //only in test
        };
        localStorage.setItem("registeredUser", JSON.stringify(userData));

        // form.reset();
        // document.querySelectorAll(".is-valid, .is-invalid").forEach(el => {
        //     el.classList.remove("is-valid", "is-invalid");
        // });

        window.location.href = "../index.html";
    }
});