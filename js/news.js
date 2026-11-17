document.addEventListener("DOMContentLoaded", () => {

    // Top Tabs Active State Logic
    const tabs = document.querySelectorAll('.nw-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jump for demo
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // In a real application, this would trigger a filter function to load news for that category
        });
    });

});