// changeImage 
function changeImage(element) {
    let mainImg = document.getElementById('mainProductImg');
    mainImg.style.opacity = 0; // fade out
    setTimeout(() => {
        mainImg.src = element.src;
        mainImg.style.opacity = 1; // fade in
    }, 200);
    document.querySelectorAll('.thumbnail-img').forEach(img => img.classList.remove('active'));
    element.classList.add('active');
}

// ZoomOut mainProductImg
document.getElementById("mainProductImg").addEventListener("click", function () {
    this.classList.toggle("zoomout");
});

// Color Method
function selectColor(element) {
    document.querySelectorAll('.color-box').forEach(box => box.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('selectedColor').textContent = element.dataset.color;
}

// Button Size Method
function selectSize(button) {
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // CartBtn 
    let cartBtn = document.getElementById('cartBtn');
    cartBtn.disabled = false;
    cartBtn.classList.remove('btn-disabled');
}

// Rating Logic
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('ratingValue');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        highlightStars(star.dataset.value);
    });
    star.addEventListener('mouseout', () => {
        highlightStars(currentRating);
    });
    star.addEventListener('click', () => {
        currentRating = star.dataset.value;
        highlightStars(currentRating);
        ratingValue.textContent = `${currentRating} / 5`;
    });
});

// Rating Reviews
function highlightStars(rating) {
    stars.forEach(star => {
        star.classList.toggle('hover', star.dataset.value <= rating);
        star.classList.toggle('selected', star.dataset.value <= currentRating);
    });
}
