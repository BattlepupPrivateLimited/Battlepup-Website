const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.slide');
const markers = document.querySelectorAll('.slide-marker');
const prevBtn = document.getElementById('previous-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;
const totalSlides = slides.length;

function goToSlide(index) {
    if (index >= 0 && index < slides.length) {
        currentIndex = index;
    }

    // Move the carousel track
    carousel.style.transform = `translateX(-${currentIndex * 100}vw)`;

    // Update active state on markers
    markers.forEach((marker, i) => {
        if (i === currentIndex) {
            marker.setAttribute('active', '');
            marker.classList.add('active');
        } else {
            marker.removeAttribute('active');
            marker.classList.remove('active');
        }
    });
}

// Event listeners for arrow navigation
prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
});

nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
});

// Optional: Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
    }
});

// Touch swipe support for mobile friendliness
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
        goToSlide(currentIndex + 1);
    }
    if (touchEndX > touchStartX + threshold) {
        goToSlide(currentIndex - 1);
    }
}

// Initialize first slide marker state
goToSlide(0);