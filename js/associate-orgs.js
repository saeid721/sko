document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('orgSearch');
    const categoryFilter = document.getElementById('orgCategoryFilter');
    const orgGrid = document.getElementById('orgGrid');
    const orgItems = orgGrid.querySelectorAll('.org-item');
    const emptyState = document.getElementById('aoEmptyState');
    const resetBtn = document.getElementById('resetFilters');

    // Staggered Entrance Animation
    orgItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });

    // Filter Logic
    const filterOrgs = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        let visibleCount = 0;

        orgItems.forEach(item => {
            const title = item.querySelector('h5').textContent.toLowerCase();
            const itemCategory = item.getAttribute('data-category');

            // Check if it matches search term and category
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = category === 'all' || itemCategory === category || itemCategory === 'all';

            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Show/Hide Empty State
        if (visibleCount === 0) {
            emptyState.classList.remove('d-none');
            orgGrid.classList.add('d-none');
        } else {
            emptyState.classList.add('d-none');
            orgGrid.classList.remove('d-none');
        }
    };

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', filterOrgs);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterOrgs);
    }

    // Reset Filters
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            categoryFilter.value = 'all';
            filterOrgs();
        });
    }
});