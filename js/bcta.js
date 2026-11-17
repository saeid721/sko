document.addEventListener("DOMContentLoaded", () => {

    // Smooth scrolling for tabs
    const tabs = document.querySelectorAll('.org-tab');
    const sections = document.querySelectorAll('.org-main [id]');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');

                // Calculate offset for sticky header and tabs
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const tabsHeight = document.querySelector('.org-nav-tabs').offsetHeight;
                const offset = headerHeight + tabsHeight + 20; // Extra padding

                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight tab on scroll (Scroll Spy)
    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const tabsHeight = document.querySelector('.org-nav-tabs').offsetHeight;
        const scrollPosition = window.pageYOffset + headerHeight + tabsHeight + 40;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${current}`) {
                tab.classList.add('active');
            }
        });
    });
});