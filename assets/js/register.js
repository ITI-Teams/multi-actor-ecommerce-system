document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const confirmFeedback = document.getElementById('confirmPasswordFeedback');

    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (password.value !== confirmPassword.value) {
            confirmPassword.classList.add('is-invalid');
            confirmFeedback.textContent = 'Passwords do not match.';
            event.preventDefault();
            event.stopPropagation();
        } else {
            confirmPassword.classList.remove('is-invalid');
            confirmFeedback.textContent = 'Please confirm your password.';
        }

        form.classList.add('was-validated');
    });
});

