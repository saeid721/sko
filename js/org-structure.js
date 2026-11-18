/**
 * SKO Organizational Structure Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Tabs (switch panels) ---
    const tabs = Array.from(document.querySelectorAll('.org-tab'));
    const panels = Array.from(document.querySelectorAll('.org-panel'));
    const tabsSection = document.querySelector('.org-tabs-section');

    const activateTab = (tab, opts = {}) => {
        const key = tab.dataset.tab;

        tabs.forEach(t => {
            const on = t === tab;
            t.classList.toggle('active', on);
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.setAttribute('tabindex', on ? '0' : '-1');
        });

        panels.forEach(p => {
            p.hidden = p.dataset.panel !== key;
        });

        // keep the active tab visible in the scrollable tab bar (mobile)
        tab.scrollIntoView({ behavior: opts.instant ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });

        // if the user has scrolled down, bring the tab bar + new content into view
        if (opts.scroll && tabsSection && tabsSection.getBoundingClientRect().top < 80) {
            tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (opts.updateHash !== false) {
            history.replaceState(null, '', '#' + key);
        }
    };

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            activateTab(tab, { scroll: true });
        });

        // keyboard: arrows / Home / End
        tab.addEventListener('keydown', function(e) {
            let next = null;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
            if (e.key === 'Home') next = tabs[0];
            if (e.key === 'End') next = tabs[tabs.length - 1];
            if (next) {
                e.preventDefault();
                next.focus();
                activateTab(next);
            }
        });
    });

    // open a tab directly from the URL, e.g. org-structure.html#policy
    const tabFromHash = () => tabs.find(t => '#' + t.dataset.tab === location.hash);

    const initialTab = tabFromHash();
    if (initialTab) activateTab(initialTab, { instant: true, updateHash: false });

    window.addEventListener('hashchange', () => {
        const t = tabFromHash();
        if (t) activateTab(t, { updateHash: false });
    });

    // --- Simple reveal animation for nodes ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.org-card, .chart-node, .assoc-box');

    animateElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'opacity 0.5s ease ' + Math.min(i * 0.05, 0.4) + 's, transform 0.5s ease ' + Math.min(i * 0.05, 0.4) + 's';
        observer.observe(el);
    });

    // Add visible class styles via JS to keep CSS clean
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    // --- Count-up numbers (Bangla digits) ---
    const bnNumber = new Intl.NumberFormat('bn-BD');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const end = parseInt(el.dataset.count, 10);
            countObserver.unobserve(el);

            if (reduceMotion) {
                el.textContent = bnNumber.format(end);
                return;
            }

            const duration = 1200;
            const startTime = performance.now();
            const tick = (now) => {
                const p = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = bnNumber.format(Math.round(end * eased));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));


    // --- Sidebar level  <->  chart node highlight ---
    const levelItems = document.querySelectorAll('.org-level-list li');
    const levelTargets = ['.node-central', '.assoc-box', '.node-division', '.node-district', '.node-upazila', '.node-union'];

    const clearActive = () => {
        levelItems.forEach(li => li.classList.remove('is-active'));
        document.querySelectorAll('.is-active-node').forEach(n => n.classList.remove('is-active-node'));
    };

    levelItems.forEach((li, i) => {
        const target = document.querySelector(levelTargets[i]);
        if (!target) return;

        const activate = () => {
            clearActive();
            li.classList.add('is-active');
            target.classList.add('is-active-node');
        };

        li.setAttribute('tabindex', '0');
        li.addEventListener('mouseenter', activate);
        li.addEventListener('mouseleave', clearActive);
        li.addEventListener('focus', activate);
        li.addEventListener('blur', clearActive);
        li.addEventListener('click', () => {
            activate();
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                li.click();
            }
        });
    });
});