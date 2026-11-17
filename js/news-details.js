document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Font Size Resizer Logic ---
    const content = document.getElementById('articleContent');
    const btnDecrease = document.getElementById('fontDecrease');
    const btnReset = document.getElementById('fontReset');
    const btnIncrease = document.getElementById('fontIncrease');

    if (content && btnDecrease && btnReset && btnIncrease) {
        btnDecrease.addEventListener('click', () => {
            content.classList.remove('font-large', 'font-xlarge');
            btnDecrease.classList.add('active');
            btnReset.classList.remove('active');
            btnIncrease.classList.remove('active');
        });

        btnReset.addEventListener('click', () => {
            content.classList.remove('font-xlarge');
            content.classList.add('font-large');
            btnReset.classList.add('active');
            btnDecrease.classList.remove('active');
            btnIncrease.classList.remove('active');
        });

        btnIncrease.addEventListener('click', () => {
            content.classList.remove('font-large');
            content.classList.add('font-xlarge');
            btnIncrease.classList.add('active');
            btnDecrease.classList.remove('active');
            btnReset.classList.remove('active');
        });
    }

    // --- 2. Gallery Navigation Logic ---
    const track = document.querySelector('.gallery-track');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');

    if (track && prevBtn && nextBtn) {
        const scrollAmount = 212; // Item width (200) + gap (12)

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // --- 3. Reaction Button Logic (Like/Love) ---
    const likeBtn = document.querySelector('.reaction-btn.like');
    const loveBtn = document.querySelector('.reaction-btn.love');

    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });
    }

    if (loveBtn) {
        loveBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });
    }
});