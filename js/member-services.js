document.addEventListener("DOMContentLoaded", () => {
    // Staggered entrance animation for service cards
    const cards = document.querySelectorAll('.ms-card');

    if (cards.length > 0) {
        // Set initial state for animation
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            // Stagger the animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 50)); // 50ms delay between each card
        });
    }

    // Optional: Add a hover sound effect or haptic feedback for mobile
    // if you want to enhance the premium feel further.
    /*
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (navigator.vibrate) navigator.vibrate(5);
        });
    });
    */
});