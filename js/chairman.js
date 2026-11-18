/**
 * SKO Chairman's / Secretary's Message Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Helpers ---
    const toBn = (n) => Number(n).toLocaleString('bn-BD');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const card = document.querySelector('.cm-message-card');
    const body = document.querySelector('.message-body');

    let toastEl = null;
    let toastTimer;
    const toast = (msg) => {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'cm-toast';
            toastEl.setAttribute('role', 'status');
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000);
    };

    // --- Reveal animation (CSS class based) ---
    const revealEls = document.querySelectorAll('.cm-profile-card, .cm-message-card, .cm-next');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((en) => {
                    if (!en.isIntersecting) return;
                    en.target.classList.add('is-in');
                    io.unobserve(en.target);
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        revealEls.forEach((el, i) => {
            el.classList.add('cm-reveal');
            el.style.transitionDelay = `${i * 0.08}s`;
            el.addEventListener('transitionend', () => (el.style.transitionDelay = ''), { once: true });
            io.observe(el);
        });
    }

    // --- Reading time ---
    const readEl = document.getElementById('cmReadTime');
    if (readEl && body) {
        const words = body.textContent.trim().split(/\s+/).length;
        readEl.textContent = `${toBn(Math.max(1, Math.ceil(words / 180)))} মিনিটে পড়ুন`;
    }

    // --- Font size (পছন্দ মনে রাখে) ---
    const STEPS = [0.95, 1.05, 1.15, 1.25, 1.35];
    const FONT_KEY = 'sko-cm-font';
    const downBtn = document.getElementById('cmFontDown');
    const upBtn = document.getElementById('cmFontUp');
    let step = 1;

    try {
        const saved = parseInt(localStorage.getItem(FONT_KEY), 10);
        if (saved >= 0 && saved < STEPS.length) step = saved;
    } catch (e) {}

    const applyFont = (save) => {
        if (card) card.style.setProperty('--cm-fs', STEPS[step]);
        if (downBtn) downBtn.disabled = step === 0;
        if (upBtn) upBtn.disabled = step === STEPS.length - 1;
        if (save) {
            try {
                localStorage.setItem(FONT_KEY, String(step));
            } catch (e) {}
        }
    };

    if (downBtn) {
        downBtn.addEventListener('click', () => {
            if (step > 0) step--;
            applyFont(true);
        });
    }
    if (upBtn) {
        upBtn.addEventListener('click', () => {
            if (step < STEPS.length - 1) step++;
            applyFont(true);
        });
    }
    applyFont(false);

    // --- Reading progress bar ---
    const bar = document.getElementById('cmProgressBar');
    if (bar && card) {
        let ticking = false;
        const update = () => {
            const vh = window.innerHeight;
            const top = card.getBoundingClientRect().top + window.scrollY;
            const start = top - vh * 0.3;
            const end = top + card.offsetHeight - vh * 0.7;
            const pct = end > start ? Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))) : 0;
            bar.style.transform = `scaleX(${pct})`;
            ticking = false;
        };
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    // --- Share / Print ---
    const printBtn = document.getElementById('cmPrint');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    const shareBtn = document.getElementById('cmShare');
    if (shareBtn) {
        shareBtn.addEventListener('click', async() => {
            if (navigator.share) {
                try {
                    await navigator.share({ title: document.title, url: location.href });
                } catch (e) {}
                return;
            }
            try {
                await navigator.clipboard.writeText(location.href);
            } catch (e) {
                const t = document.createElement('textarea');
                t.value = location.href;
                document.body.appendChild(t);
                t.select();
                document.execCommand('copy');
                t.remove();
            }
            toast('লিংক কপি হয়েছে');
        });
    }

    // --- Profile details: মোবাইলে ভাঁজ করা, ডেস্কটপে সবসময় খোলা ---
    const more = document.querySelector('.profile-more');
    if (more) {
        const mq = window.matchMedia('(max-width: 767.98px)');
        const sync = () => {
            more.open = !mq.matches;
        };
        sync();
        if (mq.addEventListener) mq.addEventListener('change', sync);
        else if (mq.addListener) mq.addListener(sync);
    }
});