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

        const storedCustomers = JSON.parse(localStorage.getItem("customers")) || [];

        const matchedCustomer = storedCustomers.find(Customer => {
            if (Customer.email === enteredEmail) {
                const decryptedPassword = decryptText(Customer.password); 
                return decryptedPassword === enteredPassword;
            }
            return false;
        });

        if (matchedCustomer) {
            errorDiv.style.display = "none";
            form.classList.add('was-validated');

            localStorage.setItem("customerSession", matchedCustomer.id);
            // localStorage.setItem("isLoggedIn", "true");
            let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
            let carts = JSON.parse(localStorage.getItem("carts")) || [];
            guestCart = guestCart.map(item => ({
                ...item,
                customer_id: matchedCustomer.id
            }));
            carts = [...carts, ...guestCart];
            localStorage.setItem("carts", JSON.stringify(carts));
            localStorage.removeItem("guestCart");

        } else {
            event.preventDefault();
            errorDiv.textContent = "Invalid email or password.";
            errorDiv.style.display = "block";
        }
    });

    emailInput.addEventListener("input", () => errorDiv.style.display = "none");
    passwordInput.addEventListener("input", () => errorDiv.style.display = "none");
});
