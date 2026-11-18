/**
 * SKO Educational Resources Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Reveal Animation ---
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

    // Elements to animate
    const animateElements = document.querySelectorAll('.ed-search-bar, .ed-section, .ed-sidebar-card, .ed-stats-bar');

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        // Stagger the animation slightly
        el.style.transform = 'translateY(15px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });

    // Add the visible class styling via JS to keep CSS clean
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ======================================================================
    // Search + filters   (data comes from the HTML: data-cat / data-level / data-keywords)
    // ======================================================================
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯' [d]);
    const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

    const form = $('#edSearchForm');
    if (!form) return;

    const input = $('#edSearch');
    const searchField = $('#edSearchField');
    const catSel = $('#edCat');
    const levelSel = $('#edLevel');
    const statusBox = $('#edStatus');
    const statusText = $('#edStatusText');
    const chipsBox = $('#edChips');
    const countEl = $('#edCount');
    const govSection = $('#edGov');
    const emptyGov = $('#edEmptyGov');
    const emptyCat = $('#edEmptyCat');
    const resCols = $$('.res-col');
    const catBoxes = $$('.cat-box');

    const state = { q: '', cat: '', level: '' };

    // read ?q=...&cat=...&level=... from the URL
    const params = new URLSearchParams(location.search);
    state.q = (params.get('q') || '').slice(0, 80);
    if (params.get('cat') && $(`#edCat option[value="${params.get('cat')}"]`)) state.cat = params.get('cat');
    if (params.get('level') && $(`#edLevel option[value="${params.get('level')}"]`)) state.level = params.get('level');

    const makeChip = (key, label) => {
        const chip = document.createElement('span');
        chip.className = 'ed-chip';
        chip.append(label + ' ');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.clear = key;
        btn.setAttribute('aria-label', label + ' মুছুন');
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        chip.appendChild(btn);
        return chip;
    };

    function apply() {
        const tokens = norm(state.q).split(' ').filter(Boolean);
        let nRes = 0;
        let nCat = 0;

        resCols.forEach((el) => {
            const hay = norm(el.textContent + ' ' + (el.dataset.keywords || ''));
            const ok = tokens.every((t) => hay.includes(t)) &&
                (!state.cat || (el.dataset.cat || '').split(' ').includes(state.cat)) &&
                (!state.level || (el.dataset.level || '').split(' ').includes(state.level));
            el.hidden = !ok;
            if (ok) nRes++;
        });

        catBoxes.forEach((el) => {
            const hay = norm(el.textContent);
            const ok = tokens.every((t) => hay.includes(t));
            const on = el.dataset.catId === state.cat;
            el.hidden = !ok;
            el.classList.toggle('is-active', on);
            el.setAttribute('aria-pressed', on ? 'true' : 'false');
            if (ok) nCat++;
        });

        emptyGov.hidden = nRes > 0;
        emptyCat.hidden = nCat > 0;
        countEl.textContent = bn(nRes) + 'টি';
        const resRowEl = $('#resRow');
        if (resRowEl) resRowEl.scrollLeft = 0;
        requestAnimationFrame(updateResNav);

        // active filters
        const active = !!(state.q || state.cat || state.level);
        statusBox.hidden = !active;
        chipsBox.textContent = '';
        if (active) {
            statusText.textContent = `${bn(nRes)}টি ওয়েবসাইট ও ${bn(nCat)}টি বিষয় পাওয়া গেছে`;
            if (state.q) chipsBox.appendChild(makeChip('q', '“' + state.q + '”'));
            if (state.cat) chipsBox.appendChild(makeChip('cat', catSel.options[catSel.selectedIndex].text));
            if (state.level) chipsBox.appendChild(makeChip('level', levelSel.options[levelSel.selectedIndex].text));
        }

        searchField.classList.toggle('has-value', !!state.q);

        // keep the filters in the URL so the page can be shared
        const p = new URLSearchParams();
        if (state.q) p.set('q', state.q);
        if (state.cat) p.set('cat', state.cat);
        if (state.level) p.set('level', state.level);
        history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : '') + location.hash);
    }

    const reset = () => {
        state.q = state.cat = state.level = '';
        input.value = '';
        catSel.value = '';
        levelSel.value = '';
        apply();
    };

    // typing (small delay so it does not run on every key)
    let typingTimer;
    input.addEventListener('input', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            state.q = input.value;
            apply();
        }, 120);
    });

    catSel.addEventListener('change', () => {
        state.cat = catSel.value;
        apply();
    });
    levelSel.addEventListener('change', () => {
        state.level = levelSel.value;
        apply();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        state.q = input.value;
        apply();
        if (govSection.getBoundingClientRect().top < 0 || window.innerWidth < 992) {
            govSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    $('#edClear').addEventListener('click', () => {
        input.value = '';
        state.q = '';
        apply();
        input.focus();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && input.value) {
            input.value = '';
            state.q = '';
            apply();
        }
    });

    // "/" focuses the search box
    document.addEventListener('keydown', (e) => {
        const tag = (document.activeElement && document.activeElement.tagName) || '';
        if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(tag)) {
            e.preventDefault();
            input.focus();
        }
    });

    // chips, reset buttons ("সব মুছুন", "সবগুলো দেখুন", empty-state button)
    document.addEventListener('click', (e) => {
        const clearBtn = e.target.closest('[data-clear]');
        if (clearBtn) {
            const key = clearBtn.dataset.clear;
            state[key] = '';
            if (key === 'q') input.value = '';
            if (key === 'cat') catSel.value = '';
            if (key === 'level') levelSel.value = '';
            apply();
            return;
        }
        if (e.target.closest('[data-reset]')) {
            e.preventDefault();
            reset();
        }
    });

    // category boxes work as filters
    catBoxes.forEach((box) => {
        box.addEventListener('click', (e) => {
            e.preventDefault();
            const id = box.dataset.catId;
            state.cat = state.cat === id ? '' : id;
            catSel.value = state.cat;
            apply();
            if (state.cat && govSection.getBoundingClientRect().top < 0) {
                govSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        box.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                box.click();
            }
        });
    });

    // ======================================================================
    // Count-up numbers in the stats bar (Bangla digits)
    // ======================================================================
    const bnFormat = new Intl.NumberFormat('bn-BD');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const end = parseInt(el.dataset.count, 10);
            countObserver.unobserve(el);

            if (reduceMotion) {
                el.textContent = bnFormat.format(end);
                return;
            }

            const start = performance.now();
            const tick = (now) => {
                const p = Math.min((now - start) / 1200, 1);
                el.textContent = bnFormat.format(Math.round(end * (1 - Math.pow(1 - p, 3))));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.6 });

    $$('[data-count]').forEach((el) => countObserver.observe(el));

    // ======================================================================
    // Government websites: one-line row with prev / next arrows
    // (arrows appear only when the cards do not all fit)
    // ======================================================================
    function updateResNav() {
        const row = $('#resRow');
        const nav = $('#resNav');
        if (!row || !nav) return;

        const overflow = row.scrollWidth - row.clientWidth > 4;
        nav.hidden = !overflow;
        if (!overflow) return;

        $('#resPrev').disabled = row.scrollLeft <= 4;
        $('#resNext').disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    }

    const resRow = $('#resRow');
    if (resRow) {
        const step = () => {
            const card = resRow.querySelector('.res-col:not([hidden])');
            return card ? card.getBoundingClientRect().width + 14 : resRow.clientWidth * 0.8;
        };
        $('#resPrev').addEventListener('click', () => resRow.scrollBy({ left: -step(), behavior: 'smooth' }));
        $('#resNext').addEventListener('click', () => resRow.scrollBy({ left: step(), behavior: 'smooth' }));
        resRow.addEventListener('scroll', updateResNav, { passive: true });
        window.addEventListener('resize', updateResNav);
        if ('ResizeObserver' in window) new ResizeObserver(updateResNav).observe(resRow);
    }

    // restore filters from the URL on first load
    input.value = state.q;
    catSel.value = state.cat;
    levelSel.value = state.level;
    apply();
});