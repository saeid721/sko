document.addEventListener("DOMContentLoaded", () => {
    // Tab Switching Logic (Visual only for now)
    const tabs = document.querySelectorAll(".fc-tab");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            // In a real app, this would trigger a filter function for the cards
        });
    });

    // Staggered Entrance Animation for Cards
    const cards = document.querySelectorAll('.committee-item');

    if (cards.length > 0) {
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 50)); // 50ms delay between each card
        });
    }
});