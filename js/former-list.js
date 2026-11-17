document.addEventListener("DOMContentLoaded", () => {
    // Tab Switching Logic (Visual)
    const tabs = document.querySelectorAll(".fl-tab");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            // In a real application, you would fetch/filter the table data here based on the tab clicked
        });
    });

    // Staggered Row Animation for premium feel
    const tableRows = document.querySelectorAll('.fl-table tbody tr');

    if (tableRows.length > 0) {
        tableRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(10px)';
            row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, 50 + (index * 30)); // Staggered delay
        });
    }
});