/**
 * SKO Constitution Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {

            // ======================================================================
            // Constitution viewer
            // Content is read straight from the PDF. The contents list in the HTML
            // only says which PDF pages belong to which section: data-pages="4" / "2-3"
            // ======================================================================
            const PDF_URL = 'assets/pdf/sko-constitution.pdf';
            const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            const $ = (sel) => document.querySelector(sel);
            const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯' [d]);

            // label text of a contents link (without the number badge / arrow icon)
            const titleOf = (el) => Array.from(el.childNodes)
                .filter((n) => n.nodeType === 3)
                .map((n) => n.textContent)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

            // data-pages="4" or "2-3"  ->  [4]  /  [2, 3]
            const pagesOf = (el) => {
                const [a, b] = (el.dataset.pages || '1').split('-').map(Number);
                const end = b || a;
                return Array.from({ length: end - a + 1 }, (_, i) => a + i);
            };

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
            let renderToken = 0;
            let pdfPromise = null;
            const pageCache = new Map();

            // numbers that come from the contents list / the PDF itself
            const chapterCount = tocLinks.filter((l) => (l.getAttribute('href') || '').startsWith('#chapter-')).length;
            document.querySelectorAll('[data-chapter-count]').forEach((el) => {
                el.textContent = bn(chapterCount) + 'টি';
            });

            // ---------- PDF loading (PDF.js) ----------
            function loadPdf() {
                if (pdfPromise) return pdfPromise;
                if (!window.pdfjsLib) return Promise.reject(new Error('PDF.js not loaded'));

                pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
                pdfPromise = pdfjsLib.getDocument(PDF_URL).promise
                    .then((doc) => {
                        document.querySelectorAll('[data-pdf-pages]').forEach((el) => {
                            el.textContent = bn(doc.numPages) + ' পৃষ্ঠা';
                        });
                        return doc;
                    })
                    .catch((err) => {
                        pdfPromise = null; // allow retry
                        throw err;
                    });
                return pdfPromise;
            }

            // renders one PDF page to a JPEG blob URL (cached)
            async function pageImage(n) {
                if (pageCache.has(n)) return pageCache.get(n);

                const doc = await loadPdf();
                const page = await doc.getPage(n);
                const base = page.getViewport({ scale: 1 });
                const viewport = page.getViewport({ scale: 1240 / base.width });

                const canvas = document.createElement('canvas');
                canvas.width = Math.floor(viewport.width);
                canvas.height = Math.floor(viewport.height);
                await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

                const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.92));
                const item = { url: URL.createObjectURL(blob) };
                pageCache.set(n, item);

                canvas.width = canvas.height = 0; // free memory
                return item;
            }

            // ---------- views ----------
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

                // the browser PDF viewer is loaded only when opened for the first time
                if (mode === 'pdf' && !pdfObject.getAttribute('data')) {
                    pdfObject.setAttribute('data', pdfObject.dataset.src);
                }
            }

            function showError() {
                chapterView.innerHTML = `
            <div class="pdf-error">
                <i class="fa-regular fa-file-pdf"></i>
                <h4>PDF লোড করা যায়নি</h4>
                <p>ইন্টারনেট সংযোগ বা ফাইলের পাথ (assets/pdf/sko-constitution.pdf) পরীক্ষা করুন।</p>
                <div class="pdf-error-actions">
                    <button type="button" class="btn-action-primary" id="retryPdf"><i class="fa-solid fa-rotate-right"></i> আবার চেষ্টা করুন</button>
                    <a class="btn-action-outline" href="${PDF_URL}" target="_blank" rel="noopener"><i class="fa-solid fa-up-right-from-square"></i> PDF খুলুন</a>
                </div>
            </div>`;
            }

            chapterView.addEventListener('click', (e) => {
                if (e.target.closest('#retryPdf')) renderChapter(current, { hash: false });
            });

            async function renderChapter(i, opts = {}) {
                current = Math.max(0, Math.min(tocLinks.length - 1, i));
                const link = tocLinks[current];
                const pages = pagesOf(link);
                const first = pages[0];
                const last = pages[pages.length - 1];
                const title = titleOf(link);
                const token = ++renderToken;

                chapterView.innerHTML = `
            <header class="ch-head">
                <span class="ch-badge">পৃষ্ঠা ${bn(first)}${last > first ? '–' + bn(last) : ''}</span>
                <h2><span class="ch-ico"><i class="fa-regular fa-file-lines"></i></span><span>${title}</span></h2>
                <p class="ch-summary">মূল PDF থেকে সরাসরি দেখানো হচ্ছে।</p>
            </header>
            <div class="pdf-pages">
                ${pages.map((p) => `<figure class="pdf-page is-loading" data-page="${p}"><span class="page-tag">পৃষ্ঠা ${bn(p)}</span></figure>`).join('')}
            </div>`;

        tocLinks.forEach((l, n) => {
            const on = n === current;
            l.classList.toggle('active', on);
            l.setAttribute('aria-selected', on ? 'true' : 'false');
            l.setAttribute('tabindex', on ? '0' : '-1');
        });

        progressBar.style.width = ((current + 1) / tocLinks.length * 100) + '%';
        $('#chCount').textContent = `${bn(current + 1)} / ${bn(tocLinks.length)}`;
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === tocLinks.length - 1;
        $('#prevTitle').textContent = current > 0 ? titleOf(tocLinks[current - 1]) : '';
        $('#nextTitle').textContent = current < tocLinks.length - 1 ? titleOf(tocLinks[current + 1]) : '';

        tocLinks[current].scrollIntoView({ block: 'nearest', inline: 'center', behavior: opts.instant ? 'auto' : 'smooth' });

        if (opts.hash !== false) history.replaceState(null, '', link.getAttribute('href'));

        if (opts.scroll) {
            viewer.scrollTop = 0;
            const top = viewer.getBoundingClientRect().top;
            if (top < 0 || (opts.fromToc && window.innerWidth < 992)) {
                viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // draw the pages of this section one by one
        try {
            for (const p of pages) {
                const item = await pageImage(p);
                if (token !== renderToken) return; // user already moved on
                const fig = chapterView.querySelector(`.pdf-page[data-page="${p}"]`);
                if (!fig) return;

                const img = new Image();
                img.alt = `${title} — পৃষ্ঠা ${bn(p)}`;
                img.decoding = 'async';
                img.src = item.url;
                fig.classList.remove('is-loading');
                fig.prepend(img);
            }
        } catch (err) {
            if (token === renderToken) showError();
        }
    }

    // ---------- contents list (tabs) ----------
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

    // ---------- zoom (the +/- buttons) ----------
    // phones start zoomed in, because a full A4 page is tiny at phone width
    let zoom = window.innerWidth < 576 ? 180 : 100;
    const applyZoom = () => {
        viewer.style.setProperty('--zoom', zoom / 100);
        $('#fontLevel').textContent = bn(zoom) + '%';
    };
    $('#fontUp').addEventListener('click', () => {
        zoom = Math.min(240, zoom + 20);
        applyZoom();
    });
    $('#fontDown').addEventListener('click', () => {
        zoom = Math.max(60, zoom - 20);
        applyZoom();
    });

    // ---------- expand / full screen ----------
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

    // ---------- share ----------
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

    // ---------- open a section from the URL, e.g. constitution.html#chapter-4 ----------
    const indexFromHash = () => tocLinks.findIndex((l) => l.getAttribute('href') === location.hash);

    window.addEventListener('hashchange', () => {
        const n = indexFromHash();
        if (n >= 0 && n !== current) {
            setView('read');
            renderChapter(n, { hash: false });
        }
    });

    const startAt = indexFromHash();
    setView('read');
    applyZoom();
    renderChapter(startAt >= 0 ? startAt : 0, { instant: true, hash: false });

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