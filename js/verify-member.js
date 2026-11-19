document.addEventListener("DOMContentLoaded", () => {

    /* ================= TABS ================= */
    const tabs = document.querySelectorAll(".vm-tab");
    const panes = document.querySelectorAll(".vm-tab-pane");

    function activateTab(tab) {
        tabs.forEach(t => {
            t.classList.remove("active");
            t.setAttribute("aria-selected", "false");
        });
        panes.forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        document.getElementById(tab.dataset.target).classList.add("active");
        if (tab.dataset.target !== "byQr") stopScan();
    }

    tabs.forEach(tab => tab.addEventListener("click", () => activateTab(tab)));

    /* ================= ELEMENTS ================= */
    const $ = id => document.getElementById(id);

    const formId = $("byId");
    const formNid = $("byNid");
    const memberIdInput = $("memberIdInput");
    const nidInput = $("nidInput");
    const btnVerifyId = $("btnVerifyId");
    const btnVerifyNid = $("btnVerifyNid");

    const resultCard = $("resultCard");
    const resultEmpty = $("resultEmpty");
    const resultView = $("resultView");
    const rvIcon = $("rvIcon");
    const rvTitle = $("rvTitle");
    const rvMsg = $("rvMsg");
    const rvBadge = $("rvBadge");
    const rvBody = $("rvBody");
    const resHelp = $("resHelp");
    const resultActions = $("resultActions");

    const resPhoto = $("resPhoto");
    const resOrg = $("resOrg");
    const resName = $("resName");
    const resFather = $("resFather");
    const resMother = $("resMother");
    const resSchool = $("resSchool");
    const resDesignation = $("resDesignation");
    const resIndex = $("resIndex");
    const resOrgPos = $("resOrgPos");
    const resMemberId = $("resMemberId");
    const resValidity = $("resValidity");
    const resValidityNote = $("resValidityNote");
    const resStatus = $("resStatus");
    const resStatusPillText = $("resStatusPillText");
    const resQr = $("resQr");
    const resVerifiedAt = $("resVerifiedAt");

    const btnCopyId = $("btnCopyId");
    const btnPrint = $("btnPrint");
    const btnDownload = $("btnDownload");
    const btnShare = $("btnShare");

    /* ================= DEMO DATABASE =================
       Test:
       SKO-BCTA-254001 (NID 1990123456789) -> active
       SKO-BCTA-254002                      -> expired
       SKO-BCTA-254003                      -> suspended
       In production replace fetchMember() with a real API call and
       never keep NID numbers in client-side code. */
    const MEMBER_DB = {
        'SKO-BCTA-254001': {
            name: 'মো: কামরুল ইসলাম',
            father: 'মো: রফিকুল ইসলাম',
            mother: 'মোছা: জাহানারা বেগম',
            school: 'ঢাকা সরকারি কলেজ, ঢাকা',
            designation: 'প্রভাষক',
            index: '12345',
            orgPos: 'জেলা সাধারণ সম্পাদক',
            org: 'বাংলাদেশ কলেজ শিক্ষক সমিতি (BCTA)',
            from: 2025,
            to: 2028,
            status: 'active',
            nid: '1990123456789',
            photo: 'assets/images/member/ec-01.jpg'
        },
        'SKO-BCTA-254002': {
            name: 'মোছা: শাহনাজ পারভীন',
            father: 'মো: আব্দুল করিম',
            mother: 'মোছা: রহিমা খাতুন',
            school: 'রাজশাহী সরকারি কলেজ, রাজশাহী',
            designation: 'সহকারী অধ্যাপক',
            index: '23456',
            orgPos: 'সদস্য',
            org: 'বাংলাদেশ কলেজ শিক্ষক সমিতি (BCTA)',
            from: 2023,
            to: 2025,
            status: 'active',
            nid: '1985123456789',
            photo: ''
        },
        'SKO-BCTA-254003': {
            name: 'মো: হাসান মাহমুদ',
            father: 'মো: ইউসুফ আলী',
            mother: 'মোছা: সালমা বেগম',
            school: 'চট্টগ্রাম সরকারি কলেজ, চট্টগ্রাম',
            designation: 'অধ্যাপক',
            index: '34567',
            orgPos: 'সদস্য',
            org: 'বাংলাদেশ কলেজ শিক্ষক সমিতি (BCTA)',
            from: 2025,
            to: 2028,
            status: 'suspended',
            nid: '1980123456789',
            photo: ''
        }
    };

    function fetchMember(by, value) {
        // Real API: return fetch(`/api/members?${by}=${encodeURIComponent(value)}`).then(r => r.ok ? r.json() : null);
        return new Promise(resolve => setTimeout(() => {
            if (by === 'nid') {
                const hit = Object.entries(MEMBER_DB).find(([, m]) => m.nid === value);
                return resolve(hit ? { id: hit[0], rec: hit[1] } : null);
            }
            resolve(MEMBER_DB[value] ? { id: value, rec: MEMBER_DB[value] } : null);
        }, 900));
    }

    /* ================= RESULT STATES ================= */
    const STATES = {
        active: {
            icon: 'fa-circle-check',
            badgeIcon: 'fa-circle-check',
            badge: 'বৈধ ও অনুমোদিত সদস্য',
            title: 'সদস্য যাচাই সফল হয়েছে',
            msg: 'এই সদস্য SKO ও সহযোগী সংগঠনের নিবন্ধিত সদস্য।',
            pill: 'অনুমোদিত সদস্য',
            status: 'সক্রিয় (Active)'
        },
        expired: {
            icon: 'fa-clock',
            badgeIcon: 'fa-clock',
            badge: 'মেয়াদোত্তীর্ণ',
            title: 'সদস্যপদের মেয়াদ শেষ হয়েছে',
            msg: 'সদস্য নিবন্ধিত, তবে সদস্যপদের মেয়াদ উত্তীর্ণ। নবায়ন প্রয়োজন।',
            pill: 'মেয়াদোত্তীর্ণ',
            status: 'মেয়াদোত্তীর্ণ'
        },
        suspended: {
            icon: 'fa-ban',
            badgeIcon: 'fa-ban',
            badge: 'স্থগিত',
            title: 'সদস্যপদ স্থগিত রয়েছে',
            msg: 'এই সদস্যপদ বর্তমানে স্থগিত। বিস্তারিত জানতে কেন্দ্রীয় কার্যালয়ে যোগাযোগ করুন।',
            pill: 'স্থগিত সদস্য',
            status: 'স্থগিত'
        },
        notfound: {
            icon: 'fa-circle-xmark',
            badgeIcon: 'fa-xmark',
            badge: 'পাওয়া যায়নি',
            title: 'কোনো সদস্য পাওয়া যায়নি',
            msg: 'প্রদত্ত তথ্যে SKO-এর ডাটাবেজে কোনো সদস্য পাওয়া যায়নি।'
        },
        error: {
            icon: 'fa-wifi',
            badgeIcon: 'fa-triangle-exclamation',
            badge: 'ত্রুটি',
            title: 'যাচাই করা যায়নি',
            msg: 'সংযোগে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।'
        }
    };

    /* ================= HELPERS ================= */
    const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
    const toEn = s => String(s).replace(/[০-৯]/g, d => BN_DIGITS.indexOf(d));
    const toBn = s => String(s).replace(/\d/g, d => BN_DIGITS[d]);
    const normId = v => toEn(v).replace(/\s+/g, '').replace(/[_–—]/g, '-').toUpperCase();
    const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    let busy = false;
    let current = null;

    function humanSpan(days) {
        const y = Math.floor(days / 365);
        const m = Math.floor((days % 365) / 30);
        const d = (days % 365) % 30;
        const parts = [];
        if (y) parts.push(`${toBn(y)} বছর`);
        if (m) parts.push(`${toBn(m)} মাস`);
        if (!y && d) parts.push(`${toBn(d)} দিন`);
        return parts.join(' ') || '১ দিনেরও কম সময়';
    }

    function toast(msg) {
        let t = $('vmToast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'vmToast';
            t.className = 'vm-toast';
            t.setAttribute('role', 'status');
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => t.classList.remove('show'), 3400);
    }

    function setError(input, msg) {
        const group = input.closest('.input-group');
        const err = $(input.id + 'Error');
        if (group) group.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        if (err) {
            err.textContent = msg;
            err.classList.add('show');
        }
    }

    function clearError(input) {
        const group = input.closest('.input-group');
        const err = $(input.id + 'Error');
        if (group) group.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
        if (err) {
            err.textContent = '';
            err.classList.remove('show');
        }
    }

    function setLoading(btn, on) {
        busy = on;
        btn.disabled = on;
        resultCard.classList.toggle('is-loading', on);
        if (on) {
            btn.dataset.html = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> যাচাই করা হচ্ছে...';
        } else if (btn.dataset.html) {
            btn.innerHTML = btn.dataset.html;
        }
    }

    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;opacity:0;';
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (err) { /* ignore */ }
            ta.remove();
            return ok;
        }
    }

    function shareUrl(id) {
        return `${location.href.split('#')[0].split('?')[0]}?member=${encodeURIComponent(id)}`;
    }

    /* ================= MEMBER QR (generated) ================= */
    function renderQr(id) {
        if (typeof qrcode === 'undefined') {
            resQr.innerHTML = '<i class="fa-solid fa-qrcode"></i>';
            return;
        }
        const qr = qrcode(0, 'Q');
        qr.addData(shareUrl(id));
        qr.make();
        const n = qr.getModuleCount();
        let d = '';
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (qr.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
            }
        }
        resQr.innerHTML = `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="সদস্য যাচাই QR কোড"><path d="${d}" fill="#0f172a"/></svg>`;
    }

    /* ================= SHOW RESULT ================= */
    function showResult(state, data) {
        const s = STATES[state];
        const hasData = !!data;

        resultCard.dataset.state = state;
        resultCard.classList.add('has-result');
        resultEmpty.hidden = true;
        resultView.hidden = false;

        rvIcon.className = `fa-solid ${s.icon}`;
        rvTitle.textContent = s.title;
        rvMsg.textContent = s.msg;
        rvBadge.innerHTML = `<i class="fa-solid ${s.badgeIcon}"></i> ${s.badge}`;

        rvBody.hidden = !hasData;
        resHelp.hidden = hasData;

        if (hasData) {
            const m = data.rec;
            resOrg.textContent = m.org;
            resName.textContent = m.name;
            resFather.textContent = m.father;
            resMother.textContent = m.mother;
            resSchool.textContent = m.school;
            resDesignation.textContent = m.designation;
            resIndex.textContent = toBn(m.index);
            resOrgPos.textContent = m.orgPos;
            resMemberId.textContent = data.id;
            resValidity.textContent = `${toBn(m.from)} – ${toBn(m.to)}`;
            resStatus.textContent = s.status;
            resStatusPillText.textContent = s.pill;

            const end = new Date(`${m.to}-12-31T23:59:59`);
            const days = Math.ceil((end - new Date()) / 86400000);
            resValidityNote.textContent = days > 0 ? `মেয়াদ বাকি: ${humanSpan(days)}` : 'মেয়াদ শেষ হয়েছে';

            if (m.photo) {
                resPhoto.src = m.photo;
                resPhoto.hidden = false;
            } else { resPhoto.hidden = true; }

            renderQr(data.id);
            resVerifiedAt.textContent = new Date().toLocaleString('bn-BD', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });

            resultActions.querySelectorAll('[data-show]').forEach(el => {
                el.hidden = el.dataset.show !== state;
            });
            resultActions.hidden = ![...resultActions.querySelectorAll('[data-show]')].some(el => !el.hidden);
        }

        current = hasData ? { id: data.id, rec: data.rec } : null;

        // restart entrance animation
        resultView.style.animation = 'none';
        void resultView.offsetWidth;
        resultView.style.animation = '';

        const top = resultCard.getBoundingClientRect().top;
        if (top < 70 || top > window.innerHeight * 0.6) {
            resultCard.scrollIntoView({ behavior: smooth, block: 'start' });
        }
        resultCard.focus({ preventScroll: true });
    }

    /* ================= VERIFY ================= */
    async function verify(by) {
        if (busy) return;
        const input = by === 'nid' ? nidInput : memberIdInput;
        const btn = by === 'nid' ? btnVerifyNid : btnVerifyId;
        clearError(input);

        let value;
        if (by === 'nid') {
            value = toEn(input.value).replace(/\D/g, '');
            if (!value) {
                setError(input, 'অনুগ্রহ করে NID নম্বর লিখুন।');
                input.focus();
                return;
            }
            if (!/^(\d{10}|\d{13}|\d{17})$/.test(value)) {
                setError(input, 'NID নম্বর ১০, ১৩ বা ১৭ সংখ্যার হতে হবে।');
                input.focus();
                return;
            }
        } else {
            value = normId(input.value);
            if (!value) {
                setError(input, 'অনুগ্রহ করে সদস্য নম্বর লিখুন।');
                input.focus();
                return;
            }
            if (!/^[A-Z0-9-]{6,30}$/.test(value)) {
                setError(input, 'সদস্য নম্বরের ফরম্যাট সঠিক নয়। উদাহরণ: SKO-BCTA-254001');
                input.focus();
                return;
            }
            input.value = value;
        }

        if (document.activeElement) document.activeElement.blur(); // close mobile keyboard
        setLoading(btn, true);

        let found = null;
        try {
            found = await fetchMember(by, value);
        } catch (err) {
            setLoading(btn, false);
            showResult('error');
            return;
        }
        setLoading(btn, false);

        if (!found) return showResult('notfound');

        const expired = new Date(`${found.rec.to}-12-31T23:59:59`) < new Date();
        const state = found.rec.status === 'suspended' ? 'suspended' : (expired ? 'expired' : 'active');
        showResult(state, found);
    }

    formId.addEventListener('submit', e => {
        e.preventDefault();
        verify('id');
    });
    formNid.addEventListener('submit', e => {
        e.preventDefault();
        verify('nid');
    });

    memberIdInput.addEventListener('input', () => {
        const fixed = toEn(memberIdInput.value).toUpperCase();
        if (fixed !== memberIdInput.value) memberIdInput.value = fixed;
        clearError(memberIdInput);
    });
    nidInput.addEventListener('input', () => {
        const fixed = toEn(nidInput.value).replace(/\D/g, '');
        if (fixed !== nidInput.value) nidInput.value = fixed;
        clearError(nidInput);
    });

    /* ================= ACTIONS ================= */
    btnCopyId.addEventListener('click', async() => {
        if (!current) return;
        toast((await copyText(current.id)) ? 'সদস্য নম্বর কপি হয়েছে।' : 'কপি করা যায়নি।');
    });

    /* ---------- A4 sheet (shared by Print + PDF) ---------- */
    const H2C_SRC = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    const JSPDF_SRC = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
    const scriptCache = {};

    function loadScript(src) {
        if (scriptCache[src]) return scriptCache[src];
        scriptCache[src] = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = () => { delete scriptCache[src];
                reject(new Error('script load failed')); };
            document.head.appendChild(s);
        });
        return scriptCache[src];
    }

    function waitImages(root) {
        return Promise.all([...root.querySelectorAll('img')].map(img =>
            img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; })
        ));
    }

    function removeSheet() {
        const old = $('pdfSheet');
        if (old) old.remove();
        document.body.classList.remove('has-sheet');
    }

    function buildSheet() {
        removeSheet();

        const sheet = document.createElement('div');
        sheet.id = 'pdfSheet';
        sheet.className = 'pdf-sheet';
        sheet.dataset.state = resultCard.dataset.state;
        sheet.innerHTML = `
            <div class="ps-head">
                <img src="assets/images/logo.png" alt="">
                <div>
                    <h1>শিক্ষক কর্মচারী ঐক্য জোট (SKO)</h1>
                    <p>কেন্দ্রীয় সংগঠন ও সমন্বিত ব্যবস্থাপনা</p>
                </div>
                <span class="ps-tag">সদস্য যাচাই প্রতিবেদন</span>
            </div>
            <div class="ps-banner">
                <i class="${rvIcon.className}"></i>
                <div><h2>${rvTitle.textContent}</h2><p>${rvMsg.textContent}</p></div>
            </div>
            <div class="ps-card"></div>
            <div class="ps-note">
                এই প্রতিবেদনটি SKO-এর ডিজিটাল ভেরিফিকেশন সিস্টেম থেকে স্বয়ংক্রিয়ভাবে তৈরি করা হয়েছে।
                সদস্য নম্বর বা QR কোড স্ক্যান করে যেকোনো সময় তথ্যের সত্যতা যাচাই করা যাবে।
            </div>
            <div class="ps-foot">
                <span>www.sko.org.bd · info@sko.org.bd</span>
                <span>যাচাই লিংক: ${shareUrl(current.id)}</span>
            </div>`;

        const card = resultView.querySelector('.id-card').cloneNode(true);
        card.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        sheet.querySelector('.ps-card').appendChild(card);

        document.body.appendChild(sheet);
        document.body.classList.add('has-sheet');

        // keep everything inside one A4 page
        const over = sheet.scrollHeight - sheet.clientHeight;
        if (over > 0) {
            const box = sheet.querySelector('.ps-card');
            const h = box.offsetHeight;
            const k = Math.max(0.7, (h - over - 2) / h);
            box.style.transformOrigin = 'top center';
            box.style.transform = `scale(${k})`;
            box.style.marginBottom = `-${(h * (1 - k)).toFixed(1)}px`;
        }
        return sheet;
    }

    /* ---------- Print ---------- */
    btnPrint.addEventListener('click', async() => {
        if (!current) return;
        const sheet = buildSheet();
        await waitImages(sheet);
        window.print();
    });

    // Ctrl+P also prints the A4 sheet instead of the whole page
    window.addEventListener('beforeprint', () => {
        if (current && !rvBody.hidden && !$('pdfSheet')) buildSheet();
    });
    window.addEventListener('afterprint', removeSheet);

    /* ---------- PDF download (A4) ---------- */
    btnDownload.addEventListener('click', async() => {
        if (!current || btnDownload.disabled) return;

        const original = btnDownload.innerHTML;
        btnDownload.disabled = true;
        btnDownload.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> PDF তৈরি হচ্ছে...';

        let failed = false;
        try {
            await Promise.all([loadScript(H2C_SRC), loadScript(JSPDF_SRC)]);
            const sheet = buildSheet();
            await waitImages(sheet);
            if (document.fonts && document.fonts.ready) await document.fonts.ready;

            const canvas = await window.html2canvas(sheet, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: 794,
                scrollX: 0,
                scrollY: 0,
                onclone: doc => {
                    const el = doc.getElementById('pdfSheet');
                    el.style.left = '0';
                    el.style.top = '0';
                }
            });

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
            pdf.save(`SKO-Member-${current.id}.pdf`);
            toast('PDF ডাউনলোড শুরু হয়েছে।');
        } catch (err) {
            failed = true;
        } finally {
            removeSheet();
            btnDownload.disabled = false;
            btnDownload.innerHTML = original;
        }

        if (failed) {
            toast('সরাসরি PDF তৈরি হয়নি। প্রিন্ট উইন্ডো থেকে "Save as PDF" নির্বাচন করুন।');
            setTimeout(() => window.print(), 700);
        }
    });

    btnShare.addEventListener('click', async() => {
        if (!current) return;
        const url = shareUrl(current.id);
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'SKO সদস্য যাচাই',
                    text: `সদস্য নম্বর ${current.id} — SKO কর্তৃক যাচাইকৃত`,
                    url
                });
                return;
            } catch (e) {
                if (e && e.name === 'AbortError') return;
            }
        }
        toast((await copyText(url)) ? 'যাচাই লিংক কপি হয়েছে।' : 'লিংক কপি করা যায়নি।');
    });

    /* ================= QR SCANNER ================= */
    const qrFinder = $('qrFinder');
    const qrVideo = $('qrVideo');
    const qrStatus = $('qrStatus');
    const btnQrStart = $('btnQrStart');
    const qrFileInput = $('qrFileInput');
    const scanCanvas = document.createElement('canvas');
    const scanCtx = scanCanvas.getContext('2d', { willReadFrequently: true });
    let stream = null;
    let rafId = 0;

    function setQrStatus(text, live) {
        qrStatus.textContent = text;
        qrStatus.classList.toggle('is-live', !!live);
    }

    function extractMemberId(text) {
        try {
            const q = new URL(text).searchParams.get('member');
            if (q) return normId(q);
        } catch (e) { /* not a URL */ }
        const m = toEn(text).toUpperCase().match(/SKO-[A-Z0-9]+-\d+/);
        return m ? m[0] : normId(text);
    }

    function handleQr(text) {
        stopScan();
        setQrStatus('QR কোড পড়া হয়েছে', false);
        memberIdInput.value = extractMemberId(text);
        activateTab(tabs[0]);
        toast('QR কোড পড়া হয়েছে।');
        verify('id');
    }

    function stopScan() {
        cancelAnimationFrame(rafId);
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }
        qrVideo.srcObject = null;
        qrFinder.classList.remove('is-scanning');
        btnQrStart.querySelector('span').textContent = 'ক্যামেরা চালু করুন';
        setQrStatus('ক্যামেরা বন্ধ আছে', false);
    }

    function tick() {
        if (!stream) return;
        if (qrVideo.readyState === qrVideo.HAVE_ENOUGH_DATA && qrVideo.videoWidth) {
            const scale = Math.min(1, 640 / qrVideo.videoWidth);
            const w = Math.round(qrVideo.videoWidth * scale);
            const h = Math.round(qrVideo.videoHeight * scale);
            scanCanvas.width = w;
            scanCanvas.height = h;
            scanCtx.drawImage(qrVideo, 0, 0, w, h);
            const code = jsQR(scanCtx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
            if (code && code.data) return handleQr(code.data);
        }
        rafId = requestAnimationFrame(tick);
    }

    async function startScan() {
        if (typeof jsQR === 'undefined') {
            toast('QR রিডার লোড হয়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।');
            return;
        }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            toast('এই ব্রাউজারে ক্যামেরা সমর্থিত নয়। ছবি আপলোড করুন বা নম্বর লিখুন।');
            return;
        }
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
            qrVideo.srcObject = stream;
            await qrVideo.play();
            qrFinder.classList.add('is-scanning');
            btnQrStart.querySelector('span').textContent = 'স্ক্যান বন্ধ করুন';
            setQrStatus('স্ক্যান করা হচ্ছে… QR কোড ফ্রেমে রাখুন', true);
            tick();
        } catch (err) {
            stopScan();
            toast('ক্যামেরা চালু করা যায়নি। অনুমতি দিন অথবা ছবি আপলোড করুন।');
        }
    }

    btnQrStart.addEventListener('click', () => (stream ? stopScan() : startScan()));

    qrFileInput.addEventListener('change', () => {
        const file = qrFileInput.files && qrFileInput.files[0];
        if (!file) return;
        if (typeof jsQR === 'undefined') {
            toast('QR রিডার লোড হয়নি। আবার চেষ্টা করুন।');
            qrFileInput.value = '';
            return;
        }
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);
            scanCanvas.width = w;
            scanCanvas.height = h;
            scanCtx.drawImage(img, 0, 0, w, h);
            const code = jsQR(scanCtx.getImageData(0, 0, w, h).data, w, h);
            URL.revokeObjectURL(url);
            if (code && code.data) handleQr(code.data);
            else toast('ছবিতে কোনো QR কোড পাওয়া যায়নি।');
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            toast('ছবিটি পড়া যায়নি।');
        };
        img.src = url;
        qrFileInput.value = '';
    });

    window.addEventListener('pagehide', stopScan);

    /* ================= AUTO VERIFY FROM LINK (?member=...) ================= */
    const urlMember = new URLSearchParams(location.search).get('member');
    if (urlMember) {
        memberIdInput.value = normId(urlMember);
        verify('id');
    }

});