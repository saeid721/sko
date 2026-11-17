document.addEventListener("DOMContentLoaded", () => {

    // Sidebar Category Active State Logic
    const categoryLinks = document.querySelectorAll('.category-list a');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jump for demo
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Optional: Add a simple row highlight effect on hover for the table
    const tableRows = document.querySelectorAll('.nt-table tbody tr');

    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transition = 'background-color 0.2s ease';
        });
    });

});