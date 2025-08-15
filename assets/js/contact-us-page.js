// Bootstrap validation
(function () {
    const form = document.getElementById('contactForm');
    const overlay = document.getElementById('successOverlay');
    const inputs = form.querySelectorAll('input, textarea');

    // mark fields as "dirty" once user interacts
    inputs.forEach(el => {
        el.addEventListener('input', () => el.dataset.dirty = 'true');
        el.addEventListener('blur', () => el.dataset.dirty = 'true');
    });

    // validators
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^(010|011|012|015)\d{8}$/;

    function isValidField(input) {
        const v = input.value.trim();
        switch (input.name) {
            case 'name': return v.length >= 2;
            case 'email': return emailRe.test(v);
            case 'phone': return phoneRe.test(v);
            case 'subject': return v.length >= 2;
            case 'message': return v.length >= 2;
            default: return true;
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let allValid = true;
        let firstInvalid = null;

        inputs.forEach(input => {
            const valid = isValidField(input);

            // Only show red for inputs the user touched
            if (input.dataset.dirty === 'true') {
                if (!valid) {
                    input.classList.add('is-invalid');
                    const fb = input.nextElementSibling;
                    if (fb && fb.classList.contains('invalid-feedback')) fb.style.display = 'block';
                } else {
                    input.classList.remove('is-invalid');
                    const fb = input.nextElementSibling;
                    if (fb && fb.classList.contains('invalid-feedback')) fb.style.display = 'none';
                }
            }

            // We still check all fields for actual submission
            if (!valid) {
                allValid = false;
                if (!firstInvalid) firstInvalid = input;
            }
        });

        if (!allValid) {
            // focus the first invalid field (optional)
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // save to localStorage (array of objects)
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

        // success overlay
        overlay.style.display = 'flex';
        setTimeout(() => { overlay.style.display = 'none'; }, 400);

        // reset form and clear states/dirty flags
        form.reset();
        inputs.forEach(el => {
            el.classList.remove('is-invalid');
            el.dataset.dirty = '';
            const fb = el.nextElementSibling;
            if (fb && fb.classList.contains('invalid-feedback')) fb.style.display = 'none';
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

// Ensure the DOM is ready before running
document.addEventListener("DOMContentLoaded", initMap);