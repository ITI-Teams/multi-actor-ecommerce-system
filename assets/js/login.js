document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('loginForm');

            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            });
        });