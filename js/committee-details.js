/**
 * SKO Committee Details Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Table Search & Filter Logic ---
    const searchInput = document.querySelector('.search-box input');
    const filterSelect = document.querySelector('.filter-select');
    const tableRows = document.querySelectorAll('.cd-table tbody tr');

    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value.toLowerCase();

        tableRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const roleText = row.querySelector('.badge-role') ? row.querySelector('.badge-role').textContent.toLowerCase() : '';

            const matchesSearch = rowText.includes(searchTerm);
            const matchesFilter = filterValue === '' || roleText.includes(filterValue);

            if (matchesSearch && matchesFilter) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterTable);
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', filterTable);
    }

    // --- Simple reveal animation ---
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

    const animateElements = document.querySelectorAll('.cd-header-card, .cd-meta-strip, .leader-card, .cd-side-card, .cd-table-card');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
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