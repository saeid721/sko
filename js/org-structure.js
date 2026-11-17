/**
 * SKO Organizational Structure Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Tabs Logic (Placeholder for future content) ---
    const tabs = document.querySelectorAll('.org-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // In a real scenario, you would fetch and display content based on the tab ID
            // For now, we'll just log the action
            const tabName = this.textContent.trim();
            console.log(`Switched to tab: ${tabName}`);

            // Optional: Show a toast or message that content is coming soon
            // showToast(`"${tabName}" বিভাগটি শীঘ্রই আসছে...`);
        });
    });

    // --- Simple reveal animation for nodes ---
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

    const animateElements = document.querySelectorAll('.org-card, .chart-node');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Add visible class styles via JS to keep CSS clean
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});