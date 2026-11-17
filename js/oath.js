/**
 * SKO Member Oath Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Share Button Logic ---
    const shareBtn = document.getElementById('shareBtn');

    if (shareBtn) {
        shareBtn.addEventListener('click', async function() {
            const shareData = {
                title: 'সদস্য শপথনামা - SKO',
                text: 'শিক্ষক কর্মচারী ঐক্য জোট (SKO)-এর সদস্য শপথনামা।',
                url: window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                    console.log('Successfully shared');
                } else {
                    // Fallback: Copy to clipboard
                    await navigator.clipboard.writeText(window.location.href);
                    alert('লিঙ্কটি কপি করা হয়েছে! আপনি এটি শেয়ার করতে পারেন।');
                }
            } catch (err) {
                console.error('Error sharing:', err);
            }
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

    const animateElements = document.querySelectorAll('.oath-sidebar-card, .oath-document-card, .oath-action-card, .oath-bottom-highlights');

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