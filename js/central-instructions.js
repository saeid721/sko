/* ============================================
   CENTRAL INSTRUCTIONS PAGE — JS  (js/central-instructions.js)
   Search • Category • Filters • Pagination • URL sync
   HTML এ কোনো পরিবর্তন লাগবে না — বিদ্যমান ক্লাস/স্ট্রাকচারের সাথে কাজ করে।
   ============================================ */

(function() {
    'use strict';

    var root = document.querySelector('.ci-page');
    if (!root) return;

    /* ------------------------------------------------------------
       1) DATA  — নতুন নির্দেশনা যোগ করতে শুধু এই তালিকায় এক লাইন যোগ করুন।
       cat    : policy | circular | admin | org | member | committee | finance | event | other
       target : central | district | upazila | associate
       status : active | cancelled
       file   : PDF এর পাথ (না দিলে assets/pdf/instructions/<ref>.pdf ধরা হবে)
       ------------------------------------------------------------ */
    var DATA = [
        { ref: 'SKO/Dir-048/2026', date: '2026-11-10', cat: 'policy', target: 'central', status: 'active', isNew: true, title: '২০২৬ সালের কেন্দ্রীয় বার্ষিক কর্মপরিকল্পনা (সংযোজিত)' },
        { ref: 'SKO/Dir-047/2026', date: '2026-11-05', cat: 'circular', target: 'associate', status: 'active', title: 'সহযোগী সংগঠনসমূহের সদস্যপদ নবায়ন সংক্রান্ত নির্দেশনা' },
        { ref: 'SKO/Dir-046/2026', date: '2026-10-28', cat: 'org', target: 'district', status: 'active', title: 'জেলা ও উপজেলা কমিটি গঠন/পুনর্গঠন সংক্রান্ত নির্দেশনা' },
        { ref: 'SKO/Dir-045/2026', date: '2026-10-20', cat: 'event', target: 'central', status: 'active', title: 'কেন্দ্রীয় সম্মেলন ২০২৬ আয়োজন সংক্রান্ত নির্দেশনা' },
        { ref: 'SKO/Dir-044/2026', date: '2026-10-15', cat: 'member', target: 'central', status: 'active', title: 'সদস্য তথ্য হালনাগাদ ও ডিজিটাল নিবন্ধন কার্যক্রম' },
        { ref: 'SKO/Dir-043/2026', date: '2026-10-08', cat: 'committee', target: 'district', status: 'active', title: 'কমিটির সভা আহ্বান ও কার্যবিবরণী সংরক্ষণ নির্দেশনা' },
        { ref: 'SKO/Dir-042/2026', date: '2026-09-30', cat: 'finance', target: 'central', status: 'active', title: 'সংগঠনের আয়-ব্যয় হিসাব সংরক্ষণ ও প্রতিবেদন প্রেরণ নির্দেশনা' },
        { ref: 'SKO/Dir-041/2026', date: '2026-09-22', cat: 'circular', target: 'central', status: 'active', title: 'সদস্য পরিচয়পত্র (QR) প্রদান ও যাচাই সংক্রান্ত পরিপত্র' },
        { ref: 'SKO/Dir-040/2026', date: '2026-09-14', cat: 'admin', target: 'central', status: 'active', title: 'অফিস ব্যবস্থাপনা ও নথি সংরক্ষণ নীতিমালা' },
        { ref: 'SKO/Dir-039/2026', date: '2026-09-02', cat: 'event', target: 'central', status: 'active', title: 'সাংগঠনিক সপ্তাহ ২০২৬ পালন কর্মসূচি নির্দেশনা' },
        { ref: 'SKO/Dir-038/2026', date: '2026-08-25', cat: 'org', target: 'upazila', status: 'active', title: 'উপজেলা কমিটির কার্যক্রম মূল্যায়ন ও প্রতিবেদন পদ্ধতি' },
        { ref: 'SKO/Dir-037/2026', date: '2026-08-18', cat: 'member', target: 'district', status: 'active', title: 'নতুন সদস্য অন্তর্ভুক্তির আবেদন যাচাই-বাছাই প্রক্রিয়া' },
        { ref: 'SKO/Dir-036/2026', date: '2026-08-10', cat: 'finance', target: 'district', status: 'active', title: 'সদস্য চাঁদা আদায় ও রসিদ প্রদান সংক্রান্ত আর্থিক নির্দেশনা' },
        { ref: 'SKO/Dir-035/2026', date: '2026-07-29', cat: 'committee', target: 'district', status: 'active', title: 'কমিটি অনুমোদনের আবেদন ও প্রয়োজনীয় কাগজপত্রের তালিকা' },
        { ref: 'SKO/Dir-034/2026', date: '2026-07-20', cat: 'other', target: 'central', status: 'active', title: 'সামাজিক যোগাযোগমাধ্যম ব্যবহারে আচরণবিধি' },
        { ref: 'SKO/Dir-033/2026', date: '2026-07-12', cat: 'circular', target: 'central', status: 'active', title: 'বার্ষিক সাধারণ সভা আয়োজন সংক্রান্ত পরিপত্র' },
        { ref: 'SKO/Dir-032/2026', date: '2026-06-30', cat: 'admin', target: 'central', status: 'active', title: 'প্রশাসনিক পত্র যোগাযোগ ও স্মারক নম্বর ব্যবস্থাপনা নির্দেশনা' },
        { ref: 'SKO/Dir-031/2025', date: '2025-12-18', cat: 'policy', target: 'central', status: 'active', title: '২০২৫ সালের কেন্দ্রীয় বার্ষিক কর্মপরিকল্পনা' },
        { ref: 'SKO/Dir-030/2025', date: '2025-12-05', cat: 'org', target: 'central', status: 'active', title: 'সাংগঠনিক পুনর্গঠন কর্মসূচি ২০২৬ সংক্রান্ত নির্দেশনা' },
        { ref: 'SKO/Dir-029/2025', date: '2025-11-20', cat: 'member', target: 'associate', status: 'active', title: 'সদস্য শপথ গ্রহণ ও নিবন্ধন ফি সংক্রান্ত পরিপত্র' },
        { ref: 'SKO/Dir-028/2025', date: '2025-11-02', cat: 'finance', target: 'central', status: 'active', title: 'সম্মেলন তহবিল গঠন ও ব্যয় ব্যবস্থাপনা নির্দেশনা' },
        { ref: 'SKO/Dir-027/2025', date: '2025-10-14', cat: 'committee', target: 'district', status: 'cancelled', title: 'জেলা কমিটির মেয়াদোত্তীর্ণ কার্যক্রম নিষ্পত্তি নির্দেশনা' },
        { ref: 'SKO/Dir-026/2025', date: '2025-09-25', cat: 'event', target: 'district', status: 'active', title: 'বিভাগীয় সমাবেশ ২০২৫ আয়োজন নির্দেশনা' },
        { ref: 'SKO/Dir-025/2025', date: '2025-09-01', cat: 'policy', target: 'associate', status: 'active', title: 'সহযোগী সংগঠন অন্তর্ভুক্তি ও অনুমোদন নীতিমালা' },
        { ref: 'SKO/Dir-024/2025', date: '2025-08-12', cat: 'circular', target: 'central', status: 'cancelled', title: 'অনলাইন সদস্য নিবন্ধন সংক্রান্ত অন্তর্বর্তী পরিপত্র' },
        { ref: 'SKO/Dir-023/2025', date: '2025-07-22', cat: 'policy', target: 'central', status: 'active', title: 'তথ্য সংরক্ষণ ও গোপনীয়তা নীতিমালা' },
        { ref: 'SKO/Dir-022/2024', date: '2024-12-10', cat: 'admin', target: 'central', status: 'active', title: 'কেন্দ্রীয় কমিটির কার্যপরিধি ও দায়িত্ব বণ্টন নির্দেশনা' },
        { ref: 'SKO/Dir-021/2024', date: '2024-10-02', cat: 'member', target: 'central', status: 'active', title: 'সদস্যপদ বাতিল ও পুনর্বহাল সংক্রান্ত নির্দেশনা' }
    ];

    var CATEGORIES = [
        { key: 'policy', label: 'নীতিমালা', badge: 'নীতিমালা', icon: 'fa-regular fa-file-lines', tone: 'blue' },
        { key: 'circular', label: 'পরিপত্র', badge: 'পরিপত্র', icon: 'fa-regular fa-envelope', tone: 'green' },
        { key: 'admin', label: 'প্রশাসনিক নির্দেশনা', badge: 'প্রশাসনিক', icon: 'fa-solid fa-gear', tone: 'gray' },
        { key: 'org', label: 'সাংগঠনিক নির্দেশনা', badge: 'সাংগঠনিক', icon: 'fa-solid fa-sitemap', tone: 'purple' },
        { key: 'member', label: 'সদস্যপদ সংক্রান্ত', badge: 'সদস্যপদ', icon: 'fa-regular fa-id-card', tone: 'teal' },
        { key: 'committee', label: 'কমিটি সংক্রান্ত', badge: 'কমিটি', icon: 'fa-solid fa-users-gear', tone: 'red' },
        { key: 'finance', label: 'আর্থিক নির্দেশনা', badge: 'আর্থিক', icon: 'fa-solid fa-coins', tone: 'gold' },
        { key: 'event', label: 'অনুষ্ঠান ও কর্মসূচি', badge: 'অনুষ্ঠান', icon: 'fa-regular fa-calendar-check', tone: 'orange' },
        { key: 'other', label: 'অন্যান্য', badge: 'অন্যান্য', icon: 'fa-solid fa-ellipsis', tone: 'gray' }
    ];

    var TARGETS = [
        { key: 'central', label: 'কেন্দ্রীয়' },
        { key: 'district', label: 'জেলা' },
        { key: 'upazila', label: 'উপজেলা' },
        { key: 'associate', label: 'সহযোগী সংগঠন' }
    ];

    var STATUSES = [
        { key: 'active', label: 'সক্রিয়' },
        { key: 'cancelled', label: 'বাতিল' }
    ];

    var PAGE_SIZE = 5;
    var PDF_DIR = 'assets/pdf/instructions/';


    /* ------------------------------------------------------------
       2) HELPERS
       ------------------------------------------------------------ */
    var BN_DIGITS = '০১২৩৪৫৬৭৮৯';
    var BN_MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function toBn(n) {
        return String(n).replace(/\d/g, function(d) { return BN_DIGITS.charAt(d); });
    }

    function toEn(s) {
        return String(s).replace(/[০-৯]/g, function(d) { return BN_DIGITS.indexOf(d); });
    }

    function fmtDate(iso) {
        var p = iso.split('-');
        return toBn(p[2]) + ' ' + BN_MONTHS[Number(p[1]) - 1] + ', ' + toBn(p[0]);
    }

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function(c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function reEsc(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function norm(s) {
        return toEn(String(s)).normalize('NFC').toLowerCase().replace(/[\u200c\u200d]/g, '').replace(/\s+/g, ' ').trim();
    }

    function debounce(fn, ms) {
        var t;
        return function() {
            var args = arguments,
                ctx = this;
            clearTimeout(t);
            t = setTimeout(function() { fn.apply(ctx, args); }, ms);
        };
    }

    function byKey(list) {
        var m = {};
        list.forEach(function(x) { m[x.key] = x; });
        return m;
    }

    var CAT = byKey(CATEGORIES);
    var TGT = byKey(TARGETS);

    /* prepare data once: year, file, serial id, search haystack */
    DATA.forEach(function(it) {
        it.year = it.date.slice(0, 4);
        it.file = it.file || (PDF_DIR + it.ref.replace(/\//g, '-') + '.pdf');
        it.hay = norm([it.title, it.ref, CAT[it.cat].label, CAT[it.cat].badge, TGT[it.target].label, fmtDate(it.date), it.isNew ? 'নতুন' : '', it.status === 'cancelled' ? 'বাতিল' : ''].join(' '));
    });
    DATA.sort(function(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });


    /* ------------------------------------------------------------
       3) ELEMENTS
       ------------------------------------------------------------ */
    var catList = root.querySelector('.category-list');
    var input = root.querySelector('.search-box-wrapper input');
    var searchBtn = root.querySelector('.btn-search');
    var selects = root.querySelectorAll('.filter-row select');
    var resetBtn = root.querySelector('.btn-reset');
    var tbody = root.querySelector('.ci-table tbody');
    var tableCard = root.querySelector('.ci-table-card');
    var tableHead = root.querySelector('.ci-table-card .table-header');
    var pagInfo = root.querySelector('.pagination-info');
    var pagList = root.querySelector('.pagination-custom');

    if (!catList || !input || !tbody || !pagInfo || !pagList || selects.length < 4) return;

    var selType = selects[0],
        selTarget = selects[1],
        selYear = selects[2],
        selStatus = selects[3];

    var chip = document.createElement('span');
    chip.className = 'ci-result-chip';
    chip.setAttribute('aria-hidden', 'true');
    if (tableHead) tableHead.appendChild(chip);

    pagInfo.setAttribute('role', 'status');
    pagInfo.setAttribute('aria-live', 'polite');


    /* ------------------------------------------------------------
       4) STATE  (+ URL)
       ------------------------------------------------------------ */
    var state = { q: '', cat: 'all', target: '', year: '', status: '', page: 1 };

    function readURL() {
        var p;
        try { p = new URLSearchParams(window.location.search); } catch (e) { return; }
        var q = p.get('q'),
            cat = p.get('cat'),
            org = p.get('org'),
            yr = p.get('year'),
            st = p.get('status'),
            pg = parseInt(p.get('page'), 10);
        if (q) state.q = q.slice(0, 120);
        if (cat && CAT[cat]) state.cat = cat;
        if (org && TGT[org]) state.target = org;
        if (yr && /^\d{4}$/.test(yr)) state.year = yr;
        if (st === 'active' || st === 'cancelled') state.status = st;
        if (pg > 0) state.page = pg;
    }

    function writeURL() {
        try {
            var p = new URLSearchParams();
            if (state.q) p.set('q', state.q);
            if (state.cat !== 'all') p.set('cat', state.cat);
            if (state.target) p.set('org', state.target);
            if (state.year) p.set('year', state.year);
            if (state.status) p.set('status', state.status);
            if (state.page > 1) p.set('page', state.page);
            var qs = p.toString();
            window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
        } catch (e) { /* file:// or sandboxed — ignore */ }
    }


    /* ------------------------------------------------------------
       5) FILTERING
       ------------------------------------------------------------ */
    function tokens() {
        return norm(state.q).split(' ').filter(Boolean);
    }

    function matches(it, skipCat, toks) {
        if (!skipCat && state.cat !== 'all' && it.cat !== state.cat) return false;
        if (state.target && it.target !== state.target) return false;
        if (state.year && it.year !== state.year) return false;
        if (state.status && it.status !== state.status) return false;
        for (var i = 0; i < toks.length; i++) {
            if (it.hay.indexOf(toks[i]) === -1) return false;
        }
        return true;
    }

    function hasActiveFilters() {
        return !!(state.q || state.target || state.year || state.status || state.cat !== 'all');
    }


    /* ------------------------------------------------------------
       6) BUILD STATIC UI  (categories + select options)
       ------------------------------------------------------------ */
    function buildCategories() {
        var all = { key: 'all', label: 'সকল নির্দেশনা', icon: 'fa-solid fa-bullhorn' };
        catList.innerHTML = [all].concat(CATEGORIES).map(function(c) {
            return '<li><a href="?cat=' + c.key + '" data-cat="' + c.key + '">' +
                '<i class="' + c.icon + '" aria-hidden="true"></i>' +
                '<span class="ci-cat-name">' + esc(c.label) + '</span>' +
                '<span class="badge">০</span></a></li>';
        }).join('');
    }

    function fillSelect(sel, items) {
        var first = sel.options[0] ? sel.options[0].textContent : '';
        sel.innerHTML = '<option value="">' + esc(first) + '</option>' + items.map(function(o) {
            return '<option value="' + esc(o.key) + '">' + esc(o.label) + '</option>';
        }).join('');
    }

    function buildSelects() {
        fillSelect(selType, CATEGORIES.map(function(c) { return { key: c.key, label: c.label }; }));
        fillSelect(selTarget, TARGETS);
        var years = [];
        DATA.forEach(function(it) { if (years.indexOf(it.year) === -1) years.push(it.year); });
        years.sort().reverse();
        fillSelect(selYear, years.map(function(y) { return { key: y, label: toBn(y) }; }));
        fillSelect(selStatus, STATUSES);
    }

    /* wrap input so we can place a clear (×) button inside it */
    var clearBtn = document.createElement('button');
    (function() {
        var wrap = document.createElement('div');
        wrap.className = 'ci-input-wrap';
        input.parentNode.insertBefore(wrap, input);
        wrap.appendChild(input);
        clearBtn.type = 'button';
        clearBtn.className = 'ci-clear';
        clearBtn.setAttribute('aria-label', 'সার্চ মুছুন');
        clearBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
        wrap.appendChild(clearBtn);
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('enterkeyhint', 'search');
        input.setAttribute('aria-label', 'নির্দেশনা খুঁজুন');

        /* long placeholder gets cut on phones → use a shorter one there */
        var longPh = input.getAttribute('placeholder') || '';
        var shortPh = 'শিরোনাম বা নম্বর লিখুন…';
        if (window.matchMedia) {
            var mq = window.matchMedia('(max-width: 575.98px)');
            var setPh = function() { input.setAttribute('placeholder', mq.matches ? shortPh : longPh); };
            setPh();
            if (mq.addEventListener) mq.addEventListener('change', setPh);
        }
    })();


    /* ------------------------------------------------------------
       7) RENDER
       ------------------------------------------------------------ */
    var hlRe = null;

    function highlight(text) {
        if (!hlRe) return esc(text);
        return text.split(hlRe).map(function(part, i) {
            return i % 2 ? '<mark class="ci-mark">' + esc(part) + '</mark>' : esc(part);
        }).join('');
    }

    function rowHTML(it, i, serial) {
        var c = CAT[it.cat];
        var file = esc(it.file);
        var name = esc(it.title);
        return '<tr class="ci-row" style="--i:' + i + '">' +
            '<td><span class="ci-sn">' + toBn(serial) + '</span></td>' +
            '<td><div class="title-wrap">' +
            '<a class="title-text" href="' + file + '" target="_blank" rel="noopener">' + highlight(it.title) + '</a>' +
            (it.isNew ? '<span class="badge-new">নতুন</span>' : '') +
            (it.status === 'cancelled' ? '<span class="ci-tag-cancel">বাতিল</span>' : '') +
            '</div></td>' +
            '<td><span class="ci-ref-no">' + highlight(it.ref) + '</span><small>' + fmtDate(it.date) + '</small></td>' +
            '<td><span class="type-badge bg-' + c.tone + '">' + esc(c.badge) + '</span></td>' +
            '<td><div class="action-btns">' +
            '<a class="btn-pdf" href="' + file + '" target="_blank" rel="noopener" title="PDF দেখুন" aria-label="PDF দেখুন: ' + name + '"><span>PDF</span><span class="ci-lbl">দেখুন</span></a>' +
            '<a class="btn-dl" href="' + file + '" download title="ডাউনলোড" aria-label="ডাউনলোড: ' + name + '"><i class="fa-solid fa-download" aria-hidden="true"></i><span class="ci-lbl">ডাউনলোড</span></a>' +
            '</div></td></tr>';
    }

    function emptyHTML() {
        return '<tr class="ci-empty-row"><td colspan="5"><div class="ci-empty">' +
            '<i class="fa-regular fa-folder-open" aria-hidden="true"></i>' +
            '<strong>কোনো নির্দেশনা পাওয়া যায়নি</strong>' +
            '<span>অন্য কী-ওয়ার্ড লিখুন অথবা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</span>' +
            (hasActiveFilters() ? '<button type="button" data-ci-reset>ফিল্টার রিসেট করুন</button>' : '') +
            '</div></td></tr>';
    }

    function pageRange(cur, total) {
        if (total <= 7) {
            var all = [];
            for (var i = 1; i <= total; i++) all.push(i);
            return all;
        }
        var s = Math.max(2, cur - 1),
            e = Math.min(total - 1, cur + 1);
        if (cur <= 3) { s = 2;
            e = 4; }
        if (cur >= total - 2) { s = total - 3;
            e = total - 1; }
        var out = [1];
        if (s > 2) out.push('…');
        for (var n = s; n <= e; n++) out.push(n);
        if (e < total - 1) out.push('…');
        out.push(total);
        return out;
    }

    function pagerHTML(cur, total) {
        if (total <= 1) return '';
        var h = '<li class="' + (cur === 1 ? 'disabled' : '') + '"><a href="#" data-page="' + (cur - 1) + '" aria-label="আগের পাতা"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></a></li>';
        pageRange(cur, total).forEach(function(p) {
            if (p === '…') h += '<li class="dots"><span aria-hidden="true">…</span></li>';
            else h += '<li class="' + (p === cur ? 'active' : '') + '"><a href="#" data-page="' + p + '" aria-label="পাতা ' + toBn(p) + '"' + (p === cur ? ' aria-current="page"' : '') + '>' + p + '</a></li>';
        });
        h += '<li class="' + (cur === total ? 'disabled' : '') + '"><a href="#" data-page="' + (cur + 1) + '" aria-label="পরের পাতা"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a></li>';
        return h;
    }

    function updateCategories(toks) {
        var counts = { all: 0 };
        CATEGORIES.forEach(function(c) { counts[c.key] = 0; });
        DATA.forEach(function(it) {
            if (matches(it, true, toks)) {
                counts.all++;
                counts[it.cat]++;
            }
        });
        var links = catList.querySelectorAll('a[data-cat]');
        for (var i = 0; i < links.length; i++) {
            var a = links[i],
                k = a.getAttribute('data-cat'),
                on = k === state.cat;
            a.classList.toggle('active', on);
            a.classList.toggle('is-empty', counts[k] === 0);
            if (on) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
            a.querySelector('.badge').textContent = toBn(counts[k]);
        }
    }

    function syncControls() {
        selType.value = state.cat === 'all' ? '' : state.cat;
        selTarget.value = state.target;
        selYear.value = state.year;
        selStatus.value = state.status;
        if (input.value !== state.q) input.value = state.q;
        clearBtn.classList.toggle('show', !!state.q);
    }

    function render() {
        var toks = tokens();
        var list = DATA.filter(function(it) { return matches(it, false, toks); });
        var total = list.length;
        var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        state.page = Math.min(Math.max(1, state.page), pages);

        /* highlight both digit styles: ০৪৮ ⇄ 048 */
        var vars = [];
        state.q.trim().split(/\s+/).filter(Boolean).forEach(function(t) {
            [t, toEn(t), toBn(t)].forEach(function(v) { if (v && vars.indexOf(v) === -1) vars.push(v); });
        });
        vars.sort(function(a, b) { return b.length - a.length; });
        hlRe = vars.length ? new RegExp('(' + vars.map(reEsc).join('|') + ')', 'gi') : null;

        var start = (state.page - 1) * PAGE_SIZE;
        var slice = list.slice(start, start + PAGE_SIZE);

        tbody.innerHTML = total ?
            slice.map(function(it, i) { return rowHTML(it, i, start + i + 1); }).join('') :
            emptyHTML();

        pagInfo.textContent = total ?
            'মোট ' + toBn(total) + 'টি নির্দেশনার মধ্যে ' + toBn(start + 1) + '–' + toBn(start + slice.length) + ' দেখানো হচ্ছে' :
            'কোনো নির্দেশনা পাওয়া যায়নি';
        pagList.innerHTML = pagerHTML(state.page, pages);
        pagList.style.display = pages > 1 ? '' : 'none';
        chip.textContent = toBn(total) + 'টি';

        updateCategories(toks);
        syncControls();
        writeURL();
    }

    function scrollToResults() {
        if (!tableCard) return;
        tableCard.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }

    function resultsOutOfView() {
        if (!tableCard) return false;
        var r = tableCard.getBoundingClientRect();
        return r.top < 80 || r.top > window.innerHeight * 0.65;
    }

    function centerChip(a) {
        if (!a || catList.scrollWidth <= catList.clientWidth) return;
        var lr = catList.getBoundingClientRect(),
            ar = a.getBoundingClientRect();
        catList.scrollBy({ left: ar.left - lr.left - (lr.width - ar.width) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    }


    /* ------------------------------------------------------------
       8) EVENTS
       ------------------------------------------------------------ */
    function applySearch(fromButton) {
        state.q = input.value.trim().slice(0, 120);
        state.page = 1;
        render();
        if (fromButton) {
            input.blur();
            if (resultsOutOfView()) scrollToResults();
        }
    }

    var liveSearch = debounce(function() { applySearch(false); }, 250);

    input.addEventListener('input', function() {
        clearBtn.classList.toggle('show', !!input.value);
        liveSearch();
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            applySearch(true);
        } else if (e.key === 'Escape' && input.value) {
            input.value = '';
            applySearch(false);
        }
    });

    if (searchBtn) searchBtn.addEventListener('click', function() { applySearch(true); });

    clearBtn.addEventListener('click', function() {
        input.value = '';
        applySearch(false);
        input.focus();
    });

    catList.addEventListener('click', function(e) {
        var a = e.target.closest('a[data-cat]');
        if (!a) return;
        e.preventDefault();
        state.cat = a.getAttribute('data-cat');
        state.page = 1;
        render();
        centerChip(a);
    });

    selType.addEventListener('change', function() {
        state.cat = selType.value || 'all';
        state.page = 1;
        render();
    });
    selTarget.addEventListener('change', function() {
        state.target = selTarget.value;
        state.page = 1;
        render();
    });
    selYear.addEventListener('change', function() {
        state.year = selYear.value;
        state.page = 1;
        render();
    });
    selStatus.addEventListener('change', function() {
        state.status = selStatus.value;
        state.page = 1;
        render();
    });

    function resetAll() {
        state = { q: '', cat: 'all', target: '', year: '', status: '', page: 1 };
        input.value = '';
        render();
        centerChip(catList.querySelector('a[data-cat="all"]'));
    }

    if (resetBtn) resetBtn.addEventListener('click', resetAll);

    tbody.addEventListener('click', function(e) {
        if (e.target.closest('[data-ci-reset]')) resetAll();
    });

    pagList.addEventListener('click', function(e) {
        var a = e.target.closest('a[data-page]');
        if (!a) return;
        e.preventDefault();
        var p = parseInt(a.getAttribute('data-page'), 10);
        if (!p || p === state.page) return;
        state.page = p;
        render();
        if (resultsOutOfView()) scrollToResults();
    });

    /* demo links (href="#") should not jump to the top of the page */
    root.addEventListener('click', function(e) {
        var a = e.target.closest('a[href="#"]');
        if (a && !a.hasAttribute('data-page')) e.preventDefault();
    });

    /* browser back/forward when URL was changed externally */
    window.addEventListener('popstate', function() {
        state = { q: '', cat: 'all', target: '', year: '', status: '', page: 1 };
        readURL();
        render();
    });


    /* ------------------------------------------------------------
       9) INIT
       ------------------------------------------------------------ */
    buildCategories();
    buildSelects();
    readURL();
    render();
    centerChip(catList.querySelector('a.active'));

})();