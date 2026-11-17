/**
 * SKO Event Details Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Gallery Slider Logic (Placeholder for actual sliding logic if needed) ---
    const galleryTrack = document.querySelector('.gallery-track');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');

    if (galleryTrack && prevBtn && nextBtn) {
        let scrollAmount = 0;

        nextBtn.addEventListener('click', () => {
            // Simple scroll logic for demonstration
            galleryTrack.scrollBy({ left: 150, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            galleryTrack.scrollBy({ left: -150, behavior: 'smooth' });
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
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.ev-card');

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