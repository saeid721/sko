/**
 * SKO Committee Details Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Member table: search + filter + pagination + details modal ---
    const PAGE_SIZE = 8;
    const toBn = (n) => Number(n).toLocaleString('bn-BD');

    const tbody = document.querySelector('.cd-table tbody');
    const searchInput = document.getElementById('cdSearch');
    const filterSelect = document.getElementById('cdFilter');
    const pager = document.getElementById('cdPager');
    const pageInfo = document.getElementById('cdPageInfo');
    const emptyBox = document.getElementById('cdEmpty');
    const emptyReset = document.getElementById('cdEmptyReset');
    const tableWrap = document.getElementById('cdTableWrap');
    const footBar = document.querySelector('.table-pagination');
    const tableCard = document.querySelector('.cd-table-card');

    const members = tbody ?
        Array.from(tbody.rows).map((tr) => {
            const get = (i) => (tr.cells[i] ? tr.cells[i].textContent.trim() : '');
            return { tr, no: get(0), name: get(1), role: get(2), org: get(3), phone: get(4), hay: tr.textContent.toLowerCase() };
        }) : [];

    let page = 1;

    const matchesRole = (m, v) => !v || (v === 'সম্পাদক' ? m.role.endsWith('সম্পাদক') : m.role === v);

    const getFiltered = () => {
        const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const role = filterSelect ? filterSelect.value : '';
        return members.filter((m) => (!q || m.hay.includes(q)) && matchesRole(m, role));
    };

    const pageList = (cur, total) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const nums = [...new Set([1, total, cur - 1, cur, cur + 1])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
        const out = [];
        nums.forEach((n, i) => {
            if (i && n - nums[i - 1] > 1) out.push('…');
            out.push(n);
        });
        return out;
    };

    const renderPager = (total) => {
        if (!pager) return;
        if (total <= 1) {
            pager.innerHTML = '';
            return;
        }
        const items = [
            `<li class="${page === 1 ? 'disabled' : ''}"><a href="#" data-page="${page - 1}" aria-label="আগের পাতা"><i class="fa-solid fa-angles-left"></i></a></li>`
        ];
        pageList(page, total).forEach((n) => {
            items.push(
                n === '…' ?
                '<li><span>…</span></li>' :
                `<li class="${n === page ? 'active' : ''}"><a href="#" data-page="${n}"${n === page ? ' aria-current="page"' : ''}>${toBn(n)}</a></li>`
            );
        });
        items.push(
            `<li class="${page === total ? 'disabled' : ''}"><a href="#" data-page="${page + 1}" aria-label="পরের পাতা"><i class="fa-solid fa-angles-right"></i></a></li>`
        );
        pager.innerHTML = items.join('');
    };

    const render = (scroll = false) => {
        const list = getFiltered();
        const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
        page = Math.min(Math.max(page, 1), pages);

        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const visible = list.slice(start, end);
        members.forEach((m) => m.tr.classList.toggle('is-hidden', !visible.includes(m)));

        const has = list.length > 0;
        if (tableWrap) tableWrap.hidden = !has;
        if (emptyBox) emptyBox.hidden = has;
        if (footBar) footBar.hidden = !has;
        if (pageInfo) {
            pageInfo.textContent = has ?
                `মোট ${toBn(list.length)} জন সদস্যের মধ্যে ${toBn(start + 1)} – ${toBn(Math.min(end, list.length))} জন দেখানো হচ্ছে` :
                '';
        }
        renderPager(pages);
        if (scroll && tableCard) tableCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            page = 1;
            render();
        });
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            page = 1;
            render();
        });
    }
    if (emptyReset) {
        emptyReset.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (filterSelect) filterSelect.value = '';
            page = 1;
            render();
            if (searchInput) searchInput.focus();
        });
    }
    if (pager) {
        pager.addEventListener('click', (e) => {
            const a = e.target.closest('a[data-page]');
            if (!a) return;
            e.preventDefault();
            page = Number(a.dataset.page);
            render(true);
        });
    }

    // --- Member details modal ---
    const modalEl = document.getElementById('cdMemberModal');
    const modal = modalEl && window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(modalEl) : null;
    const setText = (id, v) => {
        const el = document.getElementById(id);
        if (el) el.textContent = v;
    };
    let activePhone = '';

    const flash = (btn, html) => {
        const old = btn.innerHTML;
        btn.innerHTML = html;
        setTimeout(() => (btn.innerHTML = old), 1600);
    };

    const copyText = async(text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            const t = document.createElement('textarea');
            t.value = text;
            document.body.appendChild(t);
            t.select();
            document.execCommand('copy');
            t.remove();
        }
    };

    if (tbody) {
        tbody.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-view');
            if (!btn) return;
            e.preventDefault();
            const m = members.find((x) => x.tr === btn.closest('tr'));
            if (!m || !modal) return;

            const clean = m.name.replace(/(অধ্যাপক|অধ্যক্ষ|ড\.|মো\.|মো:)\s*/g, '').trim();
            activePhone = m.phone;
            setText('cdmAvatar', Array.from(clean)[0] || '');
            setText('cdmName', m.name);
            setText('cdmRole', m.role);
            setText('cdmNo', m.no);
            setText('cdmOrg', m.org);
            setText('cdmPhone', m.phone);
            const call = document.getElementById('cdmCall');
            if (call) call.href = 'tel:+88' + m.phone.replace(/\D/g, '');
            modal.show();
        });
    }

    const copyBtn = document.getElementById('cdmCopy');
    if (copyBtn) {
        copyBtn.addEventListener('click', async() => {
            await copyText(activePhone);
            flash(copyBtn, '<i class="fa-solid fa-check"></i> কপি হয়েছে');
        });
    }

    // --- Print / Share ---
    const printBtn = document.getElementById('cdPrint');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    const shareBtn = document.getElementById('cdShare');
    if (shareBtn) {
        shareBtn.addEventListener('click', async() => {
            if (navigator.share) {
                try {
                    await navigator.share({ title: document.title, url: location.href });
                } catch (err) {}
                return;
            }
            await copyText(location.href);
            flash(shareBtn, '<i class="fa-solid fa-check"></i> লিংক কপি হয়েছে');
        });
    }

    render();

    // --- Scroll reveal (CSS class based) ---
    const animateEls = document.querySelectorAll('.cd-header-card, .cd-meta-strip, .cd-leader, .cd-side-card, .cd-table-card');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        animateEls.forEach((el) => {
            el.classList.add('cd-reveal');
            io.observe(el);
        });
    }

});