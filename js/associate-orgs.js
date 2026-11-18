/* ============================================
   Associate Orgs — list filter + details tabs
   (safe to load on BOTH pages)
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const header = document.querySelector('.site-header');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Keep CSS var in sync with the real sticky header height */
    const syncHeader = () =>
        root.style.setProperty('--sko-header-h', (header ? header.offsetHeight : 72) + 'px');
    syncHeader();
    window.addEventListener('resize', syncHeader, { passive: true });
    window.addEventListener('load', syncHeader);

    initOrgList();
    initOrgTabs();

    /* ---------- 1) Associate Orgs list: search + filter ---------- */
    function initOrgList() {
        const orgGrid = document.getElementById('orgGrid');
        if (!orgGrid) return; // not the list page

        const searchInput = document.getElementById('orgSearch');
        const categoryFilter = document.getElementById('orgCategoryFilter');
        const emptyState = document.getElementById('aoEmptyState');
        const resetBtn = document.getElementById('resetFilters');
        const countEl = document.getElementById('aoCount');
        const items = Array.from(orgGrid.querySelectorAll('.org-item'));
        const toBn = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯' [d]);

        // stagger delay is handled in CSS via --i
        items.forEach((item, i) => item.style.setProperty('--i', i));

        const apply = () => {
            const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
            const cat = categoryFilter ? categoryFilter.value : 'all';
            let shown = 0;

            items.forEach(item => {
                const isJoin = item.dataset.category === 'all';
                const h5 = item.querySelector('h5');
                const title = (h5 ? h5.textContent : '').toLowerCase();
                const ok = isJoin ?
                    (!q && cat === 'all') // join card only on the clean view
                    :
                    title.includes(q) && (cat === 'all' || item.dataset.category === cat);
                item.hidden = !ok;
                if (ok && !isJoin) shown++;
            });

            if (countEl) countEl.textContent = toBn(shown) + 'টি সংগঠন';
            if (emptyState) emptyState.classList.toggle('d-none', shown !== 0);
            orgGrid.classList.toggle('d-none', shown === 0);
        };

        let timer;
        if (searchInput) searchInput.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(apply, 120);
        });
        if (categoryFilter) categoryFilter.addEventListener('change', apply);
        if (resetBtn) resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'all';
            apply();
            if (searchInput) searchInput.focus();
        });

        apply();
    }

    /* ---------- 2) Org details: sticky tabs + scroll-spy ---------- */
    function initOrgTabs() {
        const nav = document.querySelector('.org-nav-tabs');
        if (!nav) return; // not the details page

        const pairs = Array.from(nav.querySelectorAll('.org-tab'))
            .map(tab => ({ tab, el: document.getElementById((tab.getAttribute('href') || '').slice(1)) }))
            .filter(p => p.el);
        if (!pairs.length) return;

        const setActive = tab => {
            pairs.forEach(p => {
                const on = p.tab === tab;
                p.tab.classList.toggle('active', on);
                if (on) p.tab.setAttribute('aria-current', 'true');
                else p.tab.removeAttribute('aria-current');
            });
            // keep the active tab visible inside the swipe bar (no page jump)
            nav.scrollTo({
                left: tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        };

        let lock = false,
            lockTimer;
        pairs.forEach(({ tab, el }) => {
            tab.addEventListener('click', e => {
                e.preventDefault();
                lock = true;
                clearTimeout(lockTimer);
                lockTimer = setTimeout(() => { lock = false; }, 900);
                setActive(tab);
                // offset comes from CSS: scroll-margin-top on [id]
                el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                history.replaceState(null, '', '#' + el.id);
            });
        });

        const spy = () => {
            if (lock) return;
            const hdr = parseFloat(getComputedStyle(root).getPropertyValue('--sko-header-h')) || 72;
            const line = hdr + nav.offsetHeight + 40;
            let current = pairs[0];
            pairs.forEach(p => { if (p.el.getBoundingClientRect().top <= line) current = p; });
            if (window.innerHeight + window.scrollY >= root.scrollHeight - 4) current = pairs[pairs.length - 1];
            if (!current.tab.classList.contains('active')) setActive(current.tab);
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => { spy();
                ticking = false; });
        }, { passive: true });
        spy();
    }
});