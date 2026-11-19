/**
 * SKO Member Oath Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Helpers ---
    const $ = (id) => document.getElementById(id);

    const toastEl = $('oathToast');
    let toastTimer;

    function showToast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
    }

    async function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-100px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        if (!ok) throw new Error('copy failed');
    }

    // --- Name tool (fills the oath text, never stored) ---
    const nameInput = $('oathNameInput');
    const nameOut = $('oathName');
    const nameClear = $('oathNameClear');

    if (nameInput && nameOut) {
        const syncName = () => {
            const v = nameInput.value.replace(/\s+/g, ' ').trim();
            nameOut.textContent = v;
            if (nameClear) nameClear.hidden = !v;
        };
        nameInput.addEventListener('input', syncName);
        if (nameClear) {
            nameClear.addEventListener('click', () => {
                nameInput.value = '';
                syncName();
                nameInput.focus();
            });
        }
        syncName();
    }

    // --- Print (clean PDF file name + restore title after print) ---
    const originalTitle = document.title;

    window.addEventListener('beforeprint', () => {
        const n = nameOut ? nameOut.textContent.trim() : '';
        document.title = 'SKO-Member-Oath' + (n ? ' - ' + n : '');
    });

    window.addEventListener('afterprint', () => {
        document.title = originalTitle;
    });

    const printBtn = $('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
    }

    // --- Share (native share, fallback = copy link) ---
    const shareBtn = $('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async() => {
            const url = window.location.href.split('#')[0];
            const shareData = {
                title: document.title,
                text: 'শিক্ষক কর্মচারী ঐক্য জোট (SKO)-এর সদস্য শপথনামা।',
                url: url
            };
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                    return;
                }
                await copyText(url);
                showToast('লিংক কপি হয়েছে, এখন শেয়ার করতে পারেন');
            } catch (err) {
                if (err && err.name === 'AbortError') return;
                try {
                    await copyText(url);
                    showToast('লিংক কপি হয়েছে, এখন শেয়ার করতে পারেন');
                } catch (e) {
                    showToast('শেয়ার করা যায়নি, লিংকটি নিজে কপি করুন');
                }
            }
        });
    }

    // --- PDF download (if file missing -> open print / Save as PDF) ---
    const downloadBtn = $('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async(e) => {
            e.preventDefault();
            const href = downloadBtn.getAttribute('href');
            try {
                const res = await fetch(href, { method: 'HEAD' });
                if (!res.ok) throw new Error('missing');
                const a = document.createElement('a');
                a.href = href;
                a.download = downloadBtn.getAttribute('download') || '';
                document.body.appendChild(a);
                a.click();
                a.remove();
                showToast('ডাউনলোড শুরু হয়েছে');
            } catch (err) {
                showToast('PDF পাওয়া যায়নি — প্রিন্ট থেকে "Save as PDF" করুন');
                setTimeout(() => window.print(), 900);
            }
        });
    }

    // --- Preview lightbox ---
    const previewBtn = $('previewBtn');
    const lightbox = $('oathLightbox');
    if (previewBtn && lightbox) {
        const closeBtn = lightbox.querySelector('[data-close]');
        const openLb = () => {
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (closeBtn) closeBtn.focus();
        };
        const closeLb = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            previewBtn.focus();
        };
        previewBtn.addEventListener('click', openLb);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('[data-close]')) closeLb();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLb();
        });
    }

    // --- Mobile chips: keep active menu item centered ---
    const navList = document.querySelector('.oath-nav-list');
    const activeLink = navList ? navList.querySelector('a.active') : null;
    if (navList && activeLink && navList.scrollWidth > navList.clientWidth) {
        navList.scrollLeft = activeLink.offsetLeft - (navList.clientWidth - activeLink.offsetWidth) / 2;
    }

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

    const animateElements = document.querySelectorAll('.oath-sidebar-card, .oath-document-card, .oath-action-card, .oath-bottom-highlights');

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