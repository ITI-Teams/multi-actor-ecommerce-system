// Bootstrap validation
(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
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