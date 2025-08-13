// thumbnail -> main image
document.querySelectorAll('.thumb').forEach(t => {
    t.addEventListener('click', function () {
        document.querySelectorAll('.thumb').forEach(x => x.classList.remove('active'));
        this.classList.add('active');
        const src = this.dataset.src || this.src;
        const main = document.getElementById('main-Img');
        // smooth fade
        main.style.opacity = 0; setTimeout(() => { main.src = src; main.style.opacity = 1 }, 150);
    })
})

// color selection (highlight only)
document.querySelectorAll('.swatch').forEach(s => {
    s.addEventListener('click', function () {
        document.querySelectorAll('.swatch').forEach(x => x.classList.remove('selected'));
        this.classList.add('selected');
    })
})

// sizes
document.querySelectorAll('.size-btn').forEach(b => {
    if (b.classList.contains('disabled')) return;
    b.addEventListener('click', function () {
        document.querySelectorAll('.size-btn').forEach(x => x.classList.remove('selected'));
        this.classList.add('selected');
    })
})

// Rating Logic
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('ratingValue');
let currentRating = 0;

// Handle mouse hover
stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const value = parseInt(star.dataset.value);
        highlightStars(value);
    });

    star.addEventListener('mouseout', () => {
        highlightStars(currentRating);
    });

    // Handle click (selection)
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.value);
        highlightStars(currentRating);
        ratingValue.textContent = `${currentRating} / 5`;
    });

    // Mobile tap simulation (touch)
    star.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent click delay
        const value = parseInt(star.dataset.value);
        currentRating = value;
        highlightStars(currentRating);
        ratingValue.textContent = `${currentRating} / 5`;
    });
});

function highlightStars(rating) {
    stars.forEach(star => {
        star.classList.toggle('selected', parseInt(star.dataset.value) <= rating);
    });
}