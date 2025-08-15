document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const errorDiv = document.getElementById('error');

    // Style error div
    errorDiv.classList.add('text-danger', 'mb-2');
    errorDiv.style.fontSize = "0.9rem";
    errorDiv.style.display = "none";

    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const enteredEmail = emailInput.value.trim();
        const enteredPassword = passwordInput.value.trim();

        const storedUsers = JSON.parse(localStorage.getItem("customers")) || [];

        const matchedUser = storedUsers.find(user => 
            user.email === enteredEmail && user.password === enteredPassword
        );

        if (matchedUser) {
            errorDiv.style.display = "none";
            form.classList.add('was-validated');

            localStorage.setItem("customerSession", matchedUser.email);
            // localStorage.setItem("isLoggedIn", "true");

        } else {
            event.preventDefault();
            errorDiv.textContent = "Invalid email or password.";
            errorDiv.style.display = "block";
        }
    });

    emailInput.addEventListener("input", () => errorDiv.style.display = "none");
    passwordInput.addEventListener("input", () => errorDiv.style.display = "none");
});
