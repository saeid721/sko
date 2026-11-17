/**
 * SKO Publications Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Publications Slider Logic ---
    const sliderTrack = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');

    if (sliderTrack && prevBtn && nextBtn) {
        const scrollAmount = 160; // Approximate width of one slide + gap

        nextBtn.addEventListener('click', () => {
            sliderTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            sliderTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // --- Reveal Animation ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.pub-sidebar-card, .pub-featured-card, .types-grid, .slider-wrapper, .newsletter-update-card');

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

});