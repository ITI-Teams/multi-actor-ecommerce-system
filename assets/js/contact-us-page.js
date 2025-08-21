// Define forbidden characters — includes @, but we'll allow it in email field
const forbiddenCharsRe = /[#\$%\^&*<>{}|\\"]/; // Removed @ from here so it's only blocked in non-email fields

// Bootstrap validation
(function () {
    const form = document.getElementById('contactForm');
    const overlay = document.getElementById('successOverlay');
    const inputs = form.querySelectorAll('input, textarea');

    // Regular expressions for validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Proper email format
    const phoneRe = /^(010|011|012|015)\d{8}$/;

    // Mark fields as "dirty" on interaction
    inputs.forEach(el => {
        el.addEventListener('input', function () {
            el.dataset.dirty = 'true';

            // Only filter forbidden characters in non-email fields
            if (this.name !== 'email' && forbiddenCharsRe.test(this.value)) {
                this.value = this.value.replace(forbiddenCharsRe, '');
            }
        });

        el.addEventListener('blur', () => el.dataset.dirty = 'true');
    });

    // Validation logic
    function isValidField(input) {
        const v = input.value.trim();
        const name = input.name;

        // Apply forbidden character check to non-email fields
        if (name !== 'email' && forbiddenCharsRe.test(v)) {
            return false;
        }

        // Field-specific validation
        switch (name) {
            case 'name':
            case 'subject':
            case 'message':
                return v.length >= 2;
            case 'email':
                return emailRe.test(v); // This allows @ and . in correct format
            case 'phone':
                return phoneRe.test(v);
            default:
                return true;
        }
    }

    // Form submission handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let allValid = true;
        let firstInvalid = null;

        inputs.forEach(input => {
            const valid = isValidField(input);

            // Show/hide error styles only if field was touched
            if (input.dataset.dirty === 'true') {
                if (!valid) {
                    input.classList.add('is-invalid');
                    const fb = input.nextElementSibling;
                    if (fb && fb.classList.contains('invalid-feedback')) {
                        fb.style.display = 'block';
                    }
                } else {
                    input.classList.remove('is-invalid');
                    const fb = input.nextElementSibling;
                    if (fb && fb.classList.contains('invalid-feedback')) {
                        fb.style.display = 'none';
                    }
                }
            }

            // Check validity for submission
            if (!valid) {
                allValid = false;
                if (!firstInvalid) firstInvalid = input;
            }
        });

        if (!allValid) {
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Save to localStorage
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        const newId = messages.length ? messages[messages.length - 1].id + 1 : 1;

        const payload = {
            id: newId,
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim(),
            date: new Date().toISOString().split('T')[0]
        };

        messages.push(payload);
        localStorage.setItem('messages', JSON.stringify(messages));

        // Show success overlay
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 400);

        // Reset form and clear states
        form.reset();
        inputs.forEach(el => {
            el.classList.remove('is-invalid');
            el.dataset.dirty = '';
            const fb = el.nextElementSibling;
            if (fb && fb.classList.contains('invalid-feedback')) {
                fb.style.display = 'none';
            }
        });
    });
})();

// Google Maps with current location
function initMap() {
    const defaultLat = 30.0444; // Cairo
    const defaultLon = 31.2357;

    function showMap(lat, lon) {
        const mapURL = `https://www.google.com/maps?q=${lat},${lon}&hl=en&z=14&output=embed`;
        document.getElementById('mapFrame').src = mapURL;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                showMap(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.warn('Geolocation failed:', error);
                showMap(defaultLat, defaultLon);
            }
        );
    } else {
        console.warn('Geolocation not supported');
        showMap(defaultLat, defaultLon);
    }
}

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", initMap);