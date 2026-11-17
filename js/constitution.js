/**
 * SKO Constitution Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Table of Contents Smooth Scroll ---
    const tocLinks = document.querySelectorAll('.toc-list a');

    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            tocLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');

            // Note: In a real implementation, this would scroll to the specific section
            // e.preventDefault();
            // const targetId = this.getAttribute('href');
            // if(targetId !== '#') {
            //     document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            // }
        });
    });

    // --- Document Viewer Controls (UI Simulation) ---
    const zoomInBtns = document.querySelectorAll('.ctrl-btn[title="Zoom In"], .zoom-controls button:last-child');
    const zoomOutBtns = document.querySelectorAll('.ctrl-btn[title="Zoom Out"], .zoom-controls button:first-child');
    const zoomLevelTexts = document.querySelectorAll('.zoom-level, .zoom-controls span');
    const pdfPreview = document.querySelector('.pdf-page-preview');

    let currentZoom = 100;
    const zoomStep = 10;
    const minZoom = 50;
    const maxZoom = 200;

    function updateZoom() {
        zoomLevelTexts.forEach(el => el.textContent = `${currentZoom}%`);
        // Apply scale to preview for visual feedback
        if (pdfPreview) {
            pdfPreview.style.transform = `scale(${currentZoom / 100})`;
            pdfPreview.style.transformOrigin = 'top center';
            pdfPreview.style.transition = 'transform 0.2s ease';
        }
    }

    zoomInBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentZoom < maxZoom) {
                currentZoom += zoomStep;
                updateZoom();
            }
        });
    });

    zoomOutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentZoom > minZoom) {
                currentZoom -= zoomStep;
                updateZoom();
            }
        });
    });

    // --- Reveal Animation ---
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

    const animateElements = document.querySelectorAll('.cn-sidebar-card, .cn-viewer-card, .cn-info-card, .cn-action-buttons, .cn-bottom-highlights');

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
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