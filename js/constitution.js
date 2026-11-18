/**
 * SKO Constitution Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

            // ======================================================================
            // Constitution chapters  (edit the text in CHAPTERS only)
            // Each clause = [heading, text]
            // ======================================================================
            const CHAPTERS = [{
                    ord: 'প্রথম',
                    title: 'নাম ও পরিচিতি',
                    icon: 'fa-id-card',
                    summary: 'সংগঠনের নাম, কার্যালয়, কার্যক্ষেত্র ও পরিচয় সংক্রান্ত মৌলিক বিধান এই অধ্যায়ে বর্ণিত হয়েছে।',
                    clauses: [
                        ['সংগঠনের নাম', 'সংগঠনের নাম "শিক্ষক কর্মচারী ঐক্য জোট", সংক্ষেপে SKO।'],
                        ['কেন্দ্রীয় কার্যালয়', 'সংগঠনের কেন্দ্রীয় কার্যালয় ঢাকায় অবস্থিত থাকবে।'],
                        ['কার্যক্ষেত্র', 'সংগঠনের কার্যক্ষেত্র সমগ্র বাংলাদেশ এবং কার্যক্রম কেন্দ্র থেকে তৃণমূল পর্যন্ত বিস্তৃত।'],
                        ['সংগঠনের পরিচয়', 'শিক্ষক, কর্মচারী ও শিক্ষা প্রতিষ্ঠানসমূহের অধিকার, মর্যাদা ও কল্যাণে ঐক্যবদ্ধ একটি প্ল্যাটফর্ম।']
                    ]
                },
                {
                    ord: 'দ্বিতীয়',
                    title: 'উদ্দেশ্য ও লক্ষ্য',
                    icon: 'fa-bullseye',
                    summary: 'সংগঠন কেন গঠিত হয়েছে এবং কোন লক্ষ্য সামনে রেখে কাজ করবে, তা এই অধ্যায়ে নির্ধারিত।',
                    clauses: [
                        ['অধিকার ও মর্যাদা রক্ষা', 'শিক্ষক-কর্মচারীদের ন্যায্য অধিকার ও পেশাগত মর্যাদা প্রতিষ্ঠা ও সংরক্ষণ করা।'],
                        ['পেশাগত উন্নয়ন', 'প্রশিক্ষণ, কর্মশালা ও অন্যান্য উদ্যোগের মাধ্যমে সদস্যদের পেশাগত দক্ষতা বৃদ্ধিতে সহায়তা করা।'],
                        ['কল্যাণমূলক কার্যক্রম', 'সদস্যদের কল্যাণ ও সেবামূলক কার্যক্রম পরিচালনা করা।'],
                        ['ঐক্য ও সমন্বয়', 'বিভিন্ন শিক্ষক ও কর্মচারী সংগঠনের মধ্যে ঐক্য ও সমন্বয় গড়ে তোলা।']
                    ]
                },
                {
                    ord: 'তৃতীয়',
                    title: 'সদস্যপদ',
                    icon: 'fa-user-check',
                    summary: 'সদস্য হওয়ার যোগ্যতা, নিবন্ধন, সদস্যের অধিকার ও সদস্যপদ সংক্রান্ত নিয়ম এই অধ্যায়ে রয়েছে।',
                    clauses: [
                        ['সদস্য হওয়ার যোগ্যতা', 'নির্ধারিত শর্ত পূরণ সাপেক্ষে সংশ্লিষ্ট পেশার শিক্ষক ও কর্মচারীরা সদস্য হতে পারবেন।'],
                        ['নিবন্ধন ও যাচাই', 'সদস্যপদের জন্য নির্ধারিত পদ্ধতিতে নিবন্ধন করতে হবে এবং তথ্য যাচাইয়ের মাধ্যমে সদস্যপদ নিশ্চিত হবে।'],
                        ['সদস্যের অধিকার', 'প্রত্যেক সদস্য সংগঠনের সেবা, সভা ও কার্যক্রমে অংশগ্রহণ এবং মতামত প্রদানের অধিকার পাবেন।'],
                        ['সদস্যপদ নবায়ন', 'সদস্যপদ নির্ধারিত নিয়মে নবায়ন করতে হবে।'],
                        ['সদস্যপদ স্থগিত ও বাতিল', 'গঠনতন্ত্র লঙ্ঘনের ক্ষেত্রে নির্ধারিত প্রক্রিয়া অনুসরণ করে সদস্যপদ স্থগিত বা বাতিল করা যাবে।']
                    ]
                },
                {
                    ord: 'চতুর্থ',
                    title: 'সাংগঠনিক কাঠামো',
                    icon: 'fa-sitemap',
                    summary: 'কেন্দ্র থেকে তৃণমূল পর্যন্ত সংগঠনের স্তরবিন্যাস ও কমিটির ধারাক্রম এই অধ্যায়ে বর্ণিত।',
                    clauses: [
                        ['কেন্দ্রীয় কমিটি', 'কেন্দ্রীয় কমিটি সংগঠনের সর্বোচ্চ নীতি-নির্ধারণী কমিটি।'],
                        ['সহযোগী সংগঠন', 'বিভিন্ন শিক্ষক ও কর্মচারী সংগঠন সহযোগী সংগঠন হিসেবে SKO-এর সঙ্গে যুক্ত থাকবে।'],
                        ['বিভাগ, জেলা ও উপজেলা/থানা', 'বিভাগীয়, জেলা এবং উপজেলা/থানা পর্যায়ে কমিটি গঠিত হবে এবং প্রতিটি কমিটি ওপরের স্তরের কমিটির সঙ্গে সমন্বয় রক্ষা করবে।'],
                        ['ইউনিয়ন / ওয়ার্ড কমিটি', 'তৃণমূল পর্যায়ে সদস্যদের সঙ্গে সরাসরি সংযোগ ও সেবা প্রদানের জন্য ইউনিয়ন/ওয়ার্ড কমিটি গঠিত হবে।']
                    ]
                },
                {
                    ord: 'পঞ্চম',
                    title: 'কমিটি ও নির্বাচন',
                    icon: 'fa-check-to-slot',
                    summary: 'কমিটি গঠন, কাউন্সিল, নির্বাচন ও কমিটির মেয়াদ সংক্রান্ত বিধান এই অধ্যায়ে রয়েছে।',
                    clauses: [
                        ['কমিটি গঠন', 'প্রতিটি স্তরের কমিটি গণতান্ত্রিক প্রক্রিয়ায় এবং ওপরের স্তরের অনুমোদনক্রমে গঠিত হবে।'],
                        ['কাউন্সিল ও নির্বাচন', 'সদস্যদের অংশগ্রহণে সম্মেলন বা কাউন্সিলের মাধ্যমে নেতৃত্ব নির্বাচিত হবে।'],
                        ['কমিটির মেয়াদ', 'কমিটি গঠনতন্ত্রে নির্ধারিত মেয়াদ অনুযায়ী দায়িত্ব পালন করবে।'],
                        ['অনুমোদন ও প্রকাশ', 'গঠিত কমিটির তালিকা অনুমোদনের পর আনুষ্ঠানিকভাবে প্রকাশ করা হবে।']
                    ]
                },
                {
                    ord: 'ষষ্ঠ',
                    title: 'দায়িত্ব ও কর্তব্য',
                    icon: 'fa-clipboard-list',
                    summary: 'কমিটির বিভিন্ন পদের দায়িত্ব ও কর্তব্য এই অধ্যায়ে নির্ধারিত।',
                    clauses: [
                        ['সভাপতি', 'কমিটির সভায় সভাপতিত্ব, সার্বিক নেতৃত্ব ও সিদ্ধান্ত বাস্তবায়নে দিকনির্দেশনা প্রদান।'],
                        ['সাধারণ সম্পাদক', 'দৈনন্দিন সাংগঠনিক কার্যক্রম পরিচালনা, সভা আহ্বান ও কার্যবিবরণী সংরক্ষণ।'],
                        ['কোষাধ্যক্ষ', 'তহবিল ও হিসাব সংরক্ষণ এবং নিয়মিত হিসাব-প্রতিবেদন উপস্থাপন।'],
                        ['নির্বাহী সদস্য ও অন্যান্য পদ', 'সহ-সভাপতি, যুগ্ম সাধারণ সম্পাদক, সাংগঠনিক সম্পাদক ও নির্বাহী সদস্যগণ অর্পিত দায়িত্ব পালন করবেন।']
                    ]
                },
                {
                    ord: 'সপ্তম',
                    title: 'অর্থনৈতিক বিষয়',
                    icon: 'fa-wallet',
                    summary: 'সংগঠনের তহবিল, হিসাব সংরক্ষণ ও আর্থিক স্বচ্ছতা সংক্রান্ত নিয়ম এই অধ্যায়ে রয়েছে।',
                    clauses: [
                        ['তহবিলের উৎস', 'সদস্যদের চাঁদা, অনুদান ও অন্যান্য বৈধ উৎস থেকে সংগঠনের তহবিল গঠিত হবে।'],
                        ['হিসাব সংরক্ষণ', 'সকল আয়-ব্যয়ের হিসাব নির্ধারিত পদ্ধতিতে সংরক্ষণ করতে হবে।'],
                        ['ব্যাংক হিসাব', 'সংগঠনের অর্থ ব্যাংক হিসাবের মাধ্যমে নির্ধারিত ব্যক্তিদের যৌথ স্বাক্ষরে পরিচালিত হবে।'],
                        ['নিরীক্ষা ও প্রতিবেদন', 'নিয়মিত হিসাব নিরীক্ষা ও আর্থিক প্রতিবেদন উপস্থাপন করা হবে।']
                    ]
                },
                {
                    ord: 'অষ্টম',
                    title: 'সভা ও সিদ্ধান্ত',
                    icon: 'fa-people-line',
                    summary: 'সভার ধরন, কোরাম, সিদ্ধান্ত গ্রহণ ও কার্যবিবরণী সংক্রান্ত নিয়ম এই অধ্যায়ে রয়েছে।',
                    clauses: [
                        ['সভার ধরন', 'কমিটি নিয়মিত সভা, জরুরি সভা ও সাধারণ সভা আয়োজন করতে পারবে।'],
                        ['কোরাম', 'সভার সিদ্ধান্ত বৈধ হতে নির্ধারিত কোরাম পূরণ থাকতে হবে।'],
                        ['সিদ্ধান্ত গ্রহণ', 'সিদ্ধান্ত আলোচনার ভিত্তিতে, প্রয়োজনে ভোটের মাধ্যমে গৃহীত হবে।'],
                        ['কার্যবিবরণী', 'প্রতিটি সভার কার্যবিবরণী লিখিতভাবে সংরক্ষণ করতে হবে।']
                    ]
                },
                {
                    ord: 'নবম',
                    title: 'শৃঙ্খলা ও আচরণ',
                    icon: 'fa-scale-balanced',
                    summary: 'সদস্য ও নেতৃবৃন্দের আচরণবিধি এবং শৃঙ্খলামূলক ব্যবস্থার নিয়ম এই অধ্যায়ে রয়েছে।',
                    clauses: [
                        ['আচরণবিধি', 'প্রত্যেক সদস্য সংগঠনের নীতি, আদর্শ ও গঠনতন্ত্র মেনে চলবেন।'],
                        ['অভিযোগ', 'কোনো সদস্যের বিরুদ্ধে অভিযোগ থাকলে তা নির্ধারিত পদ্ধতিতে দাখিল করতে হবে।'],
                        ['শৃঙ্খলামূলক ব্যবস্থা', 'প্রমাণিত অভিযোগের ক্ষেত্রে সতর্কীকরণ থেকে সদস্যপদ বাতিল পর্যন্ত ব্যবস্থা নেওয়া যাবে।'],
                        ['আত্মপক্ষ সমর্থন', 'কোনো ব্যবস্থা নেওয়ার আগে সংশ্লিষ্ট সদস্যকে আত্মপক্ষ সমর্থনের সুযোগ দেওয়া হবে।']
                    ]
                },
                {
                    ord: 'দশম',
                    title: 'সংশোধনী',
                    icon: 'fa-pen-to-square',
                    summary: 'গঠনতন্ত্র সংশোধন ও সংযোজনের প্রক্রিয়া এই অধ্যায়ে বর্ণিত।',
                    clauses: [
                        ['সংশোধনের প্রস্তাব', 'গঠনতন্ত্র সংশোধনের প্রস্তাব নির্ধারিত পদ্ধতিতে উত্থাপন করতে হবে।'],
                        ['অনুমোদন', 'সংশোধনী কেন্দ্রীয় কার্যনির্বাহী কমিটির অনুমোদনক্রমে কার্যকর হবে।'],
                        ['প্রকাশ', 'অনুমোদিত সংশোধনী সকল স্তরের কমিটি ও সদস্যদের জানানো হবে।']
                    ]
                },
                {
                    ord: 'একাদশ',
                    title: 'বিবিধ ও অন্যান্য',
                    icon: 'fa-layer-group',
                    summary: 'গঠনতন্ত্রের ব্যাখ্যা, বিলুপ্তি ও অন্যান্য বিবিধ বিষয় এই অধ্যায়ে রয়েছে।',
                    clauses: [
                        ['গঠনতন্ত্রের ব্যাখ্যা', 'গঠনতন্ত্রের কোনো ধারার ব্যাখ্যা নিয়ে মতভেদ দেখা দিলে কেন্দ্রীয় কার্যনির্বাহী কমিটির ব্যাখ্যা চূড়ান্ত বলে গণ্য হবে।'],
                        ['সংগঠনের বিলুপ্তি', 'সংগঠনের বিলুপ্তি সংক্রান্ত বিষয় নির্ধারিত বিশেষ প্রক্রিয়ায় সিদ্ধান্ত হবে।'],
                        ['অন্যান্য বিষয়', 'গঠনতন্ত্রে উল্লেখ নেই এমন বিষয়ে কেন্দ্রীয় কমিটি প্রয়োজনীয় সিদ্ধান্ত নিতে পারবে।'],
                        ['কার্যকারিতা', 'অনুমোদনের তারিখ থেকে এই গঠনতন্ত্র কার্যকর বলে গণ্য হবে।']
                    ]
                }
            ];

            // ======================================================================
            // Viewer logic
            // ======================================================================
            const $ = (sel) => document.querySelector(sel);
            const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯' [d]);

            const tocLinks = Array.from(document.querySelectorAll('.toc-list a'));
            const viewer = $('#cnViewer');
            const chapterView = $('#chapterView');
            const readPane = $('#viewRead');
            const pdfPane = $('#viewPdf');
            const pdfObject = $('#pdfObject');
            const progressBar = $('#readProgress');
            const chapterNav = $('#chapterNav');
            const prevBtn = $('#chPrev');
            const nextBtn = $('#chNext');
            const viewBtns = Array.from(document.querySelectorAll('.vs-btn'));

            let current = 0;

            function setView(mode) {
                viewer.dataset.mode = mode;
                viewBtns.forEach((b) => {
                    const on = b.dataset.view === mode;
                    b.classList.toggle('active', on);
                    b.setAttribute('aria-pressed', on ? 'true' : 'false');
                });
                readPane.hidden = mode !== 'read';
                pdfPane.hidden = mode !== 'pdf';
                chapterNav.hidden = mode !== 'read';

                // load the PDF only when it is opened for the first time
                if (mode === 'pdf' && !pdfObject.getAttribute('data')) {
                    pdfObject.setAttribute('data', pdfObject.dataset.src);
                }
            }

            function renderChapter(i, opts = {}) {
                current = Math.max(0, Math.min(CHAPTERS.length - 1, i));
                const ch = CHAPTERS[current];

                chapterView.innerHTML = `
            <header class="ch-head">
                <span class="ch-badge">অধ্যায় ${bn(current + 1)} / ${bn(CHAPTERS.length)}</span>
                <h2><span class="ch-ico"><i class="fa-solid ${ch.icon}"></i></span><span>${ch.ord} অধ্যায়: ${ch.title}</span></h2>
                <p class="ch-summary">${ch.summary}</p>
            </header>
            <ol class="clause-list">
                ${ch.clauses.map((c, n) => `
                <li class="clause" style="--i:${n}">
                    <span class="clause-no">${bn(n + 1)}</span>
                    <div><h3>${c[0]}</h3><p>${c[1]}</p></div>
                </li>`).join('')}
            </ol>`;

        tocLinks.forEach((l, n) => {
            const on = n === current;
            l.classList.toggle('active', on);
            l.setAttribute('aria-selected', on ? 'true' : 'false');
            l.setAttribute('tabindex', on ? '0' : '-1');
        });

        progressBar.style.width = ((current + 1) / CHAPTERS.length * 100) + '%';
        $('#chCount').textContent = `${bn(current + 1)} / ${bn(CHAPTERS.length)}`;
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === CHAPTERS.length - 1;
        $('#prevTitle').textContent = current > 0 ? CHAPTERS[current - 1].title : '';
        $('#nextTitle').textContent = current < CHAPTERS.length - 1 ? CHAPTERS[current + 1].title : '';

        // keep the active chip / item visible in the contents list
        tocLinks[current].scrollIntoView({ block: 'nearest', inline: 'center', behavior: opts.instant ? 'auto' : 'smooth' });

        if (opts.hash !== false) history.replaceState(null, '', '#chapter-' + (current + 1));

        if (opts.scroll) {
            viewer.scrollTop = 0;
            const top = viewer.getBoundingClientRect().top;
            if (top < 0 || (opts.fromToc && window.innerWidth < 992)) {
                viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // --- chapter links (tabs) ---
    tocLinks.forEach((link, i) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setView('read');
            renderChapter(i, { scroll: true, fromToc: true });
        });

        link.addEventListener('keydown', (e) => {
            let n = null;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = Math.min(i + 1, tocLinks.length - 1);
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = Math.max(i - 1, 0);
            if (e.key === 'Home') n = 0;
            if (e.key === 'End') n = tocLinks.length - 1;
            if (n !== null) {
                e.preventDefault();
                setView('read');
                renderChapter(n);
                tocLinks[n].focus();
            }
        });
    });

    prevBtn.addEventListener('click', () => renderChapter(current - 1, { scroll: true }));
    nextBtn.addEventListener('click', () => renderChapter(current + 1, { scroll: true }));
    viewBtns.forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));

    // --- text size (reading mode) ---
    let scale = 100;
    const applyScale = () => {
        viewer.style.setProperty('--read-scale', scale / 100);
        $('#fontLevel').textContent = bn(scale) + '%';
    };
    $('#fontUp').addEventListener('click', () => {
        scale = Math.min(150, scale + 10);
        applyScale();
    });
    $('#fontDown').addEventListener('click', () => {
        scale = Math.max(80, scale - 10);
        applyScale();
    });

    // --- expand / full screen ---
    const expandBtn = $('#btnExpand');
    const setExpanded = (on) => {
        viewer.classList.toggle('is-expanded', on);
        document.body.classList.toggle('cn-lock', on);
        expandBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
        expandBtn.innerHTML = `<i class="fa-solid ${on ? 'fa-compress' : 'fa-expand'}"></i>`;
    };
    expandBtn.addEventListener('click', () => setExpanded(!viewer.classList.contains('is-expanded')));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && viewer.classList.contains('is-expanded')) setExpanded(false);
    });

    // --- share ---
    const toast = document.createElement('div');
    toast.className = 'cn-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
    let toastTimer;
    const showToast = (msg) => {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    };

    const shareBtn = $('#btnShare');
    if (shareBtn) {
        shareBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const data = { title: document.title, text: 'SKO-এর গঠনতন্ত্র', url: location.href.split('#')[0] };
            try {
                if (navigator.share) {
                    await navigator.share(data);
                } else {
                    await navigator.clipboard.writeText(data.url);
                    showToast('লিংক কপি হয়েছে');
                }
            } catch (err) {
                if (!err || err.name !== 'AbortError') showToast('লিংক কপি করা যায়নি');
            }
        });
    }

    // --- open a chapter from the URL, e.g. constitution.html#chapter-4 ---
    const chapterFromHash = () => {
        const m = location.hash.match(/^#chapter-(\d+)$/);
        return m ? parseInt(m[1], 10) - 1 : -1;
    };

    window.addEventListener('hashchange', () => {
        const n = chapterFromHash();
        if (n >= 0 && n < CHAPTERS.length && n !== current) {
            setView('read');
            renderChapter(n, { hash: false });
        }
    });

    const startAt = chapterFromHash();
    setView('read');
    renderChapter(startAt >= 0 && startAt < CHAPTERS.length ? startAt : 0, { instant: true, hash: false });
    applyScale();

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