// Bootstrap validation
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    const nameField = this.name;
    const emailField = this.email;
    const phoneField = this.phone;
    const subjectField = this.subject;
    const messageField = this.message;

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    const egyptPhoneRegex = /^(010|011|012|015)[0-9]{8}$/;

    if (nameField.value.trim() === '') { setInvalid(nameField); isValid = false; } else { setValid(nameField); }
    if (!emailRegex.test(emailField.value.trim())) { setInvalid(emailField); isValid = false; } else { setValid(emailField); }
    if (!egyptPhoneRegex.test(phoneField.value.trim())) { setInvalid(phoneField); isValid = false; } else { setValid(phoneField); }
    if (subjectField.value.trim() === '') { setInvalid(subjectField); isValid = false; } else { setValid(subjectField); }
    if (messageField.value.trim() === '') { setInvalid(messageField); isValid = false; } else { setValid(messageField); }

    if (isValid) {
        document.getElementById('modalDetails').innerHTML = `
            <p><strong>Name:</strong> ${nameField.value}</p>
            <p><strong>Email:</strong> ${emailField.value}</p>
            <p><strong>Phone:</strong> ${phoneField.value}</p>
            <p><strong>Subject:</strong> ${subjectField.value}</p>
            <p><strong>Message:</strong> ${messageField.value}</p>
        `;
        new bootstrap.Modal(document.getElementById('successModal')).show();
        this.reset();
        [nameField, emailField, phoneField, subjectField, messageField].forEach(f => {
            f.classList.remove('is-valid', 'is-invalid');
        });
    }
});

function setInvalid(field) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
}
function setValid(field) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
}




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