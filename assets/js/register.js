const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const form = document.getElementById("registerForm");

const nameRe = /^[A-Za-z\s]+$/;  
const emailRe = /^[a-zA-Z][\w.-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
    const value = nameInput.value.trim();
    if (value === "") {
        setInvalid(nameInput, "Please enter your name.");
        return false;
    }
    if (!nameRe.test(value)) {
        setInvalid(nameInput, "Name must only contain letters and spaces.");
        return false;
    }
    setValid(nameInput);
    return true;
}

function validateEmail() {
    const value = emailInput.value.trim();
    if (!emailRe.test(value)) {
        setInvalid(emailInput, "Please enter a valid email (must start with a letter).");
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

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", () => {
    validatePassword();
    validateConfirmPassword();
});
confirmPasswordInput.addEventListener("input", validateConfirmPassword);

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameValid = validateName();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    const confirmPasswordValid = validateConfirmPassword();

    if (nameValid && emailValid && passwordValid && confirmPasswordValid) {
        const customers = JSON.parse(localStorage.getItem("customers")) || [];
        const newId = customers.length > 0 ? customers[customers.length - 1].id + 1 : 1;
        const emailExists = customers.some(customer => customer.email.toLowerCase() === emailInput.value.trim().toLowerCase());
        if (emailExists) {
            setInvalid(emailInput, "This email is already registered.");
            return;
        }

   
        const encryptedPassword = encryptText(passwordInput.value);

        const userData = {
            id: newId, 
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: encryptedPassword 
        };

        customers.push(userData);
        localStorage.setItem("customers", JSON.stringify(customers));

        localStorage.setItem("customerSession", userData.id);
        let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        let carts = JSON.parse(localStorage.getItem("carts")) || [];

        if (guestCart.length > 0) {
            guestCart = guestCart.map(item => ({
                ...item,
                customer_id: userData.id
            }));
            carts = [...carts, ...guestCart];
            localStorage.setItem("carts", JSON.stringify(carts));
            localStorage.removeItem("guestCart");
        }

        window.location.href = "../index.html";
    }
});
