/**
 * SKO Educational Resources Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

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

    // Elements to animate
    const animateElements = document.querySelectorAll('.ed-search-bar, .ed-section, .ed-sidebar-card, .ed-stats-bar');

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        // Stagger the animation slightly
        el.style.transform = 'translateY(15px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });

    // Add the visible class styling via JS to keep CSS clean
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- Search and Filter Logic (Placeholder) ---
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real implementation, this would filter the DOM elements based on inputs
            alert('অনুসন্ধান কার্যকারিতা শীঘ্রই আসছে!');
        });
    }
});