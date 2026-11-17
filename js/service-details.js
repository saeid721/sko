document.addEventListener("DOMContentLoaded", () => {
    // Initialize Bootstrap Tabs (Bootstrap 5 handles this via data attributes, 
    // but we can add custom animations or logic here if needed)

    // Add a subtle fade-in animation for the steps
    const steps = document.querySelectorAll('.sd-step');
    if (steps.length > 0) {
        steps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(10px)';
            step.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

            setTimeout(() => {
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, 200 + (index * 100)); // Staggered animation
        });
    }

    // Optional: Handle URL hash to open specific tab on load
    // e.g., service-details.html#faq will open the FAQ tab
    const hash = window.location.hash;
    if (hash) {
        const tabTrigger = document.querySelector(`[data-bs-target="${hash}"]`);
        if (tabTrigger) {
            const tab = new bootstrap.Tab(tabTrigger);
            tab.show();
        }
    }
});