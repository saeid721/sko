document.addEventListener("DOMContentLoaded", () => {

    /* ================= ELEMENTS ================= */
    const form = document.getElementById('verifyForm');
    const btnVerify = document.getElementById('btnVerify');
    const btnReset = document.getElementById('btnReset');
    const certNumberInput = document.getElementById('certNumber');
    const certNameInput = document.getElementById('certName');
    const certTypeSelect = document.getElementById('certType');

    const resultSection = document.getElementById('resultSection');
    const resultCard = document.getElementById('resultCard');
    const resIcon = document.getElementById('resIcon');
    const resTitle = document.getElementById('resTitle');
    const resMessage = document.getElementById('resMessage');
    const resBadge = document.getElementById('resBadge');
    const resBody = document.getElementById('resBody');
    const resLayout = document.getElementById('resLayout');
    const resActions = document.getElementById('resActions');
    const resHelp = document.getElementById('resHelp');
    const resCertNumber = document.getElementById('resCertNumber');
    const resCertName = document.getElementById('resCertName');
    const resCertType = document.getElementById('resCertType');
    const resIssueDate = document.getElementById('resIssueDate');
    const resValidity = document.getElementById('resValidity');
    const resStatus = document.getElementById('resStatus');
    const resVerifiedAt = document.getElementById('resVerifiedAt');
    const resProgressWrap = document.getElementById('resProgressWrap');
    const resProgress = document.getElementById('resProgress');
    const resProgressText = document.getElementById('resProgressText');

    const btnDownload = document.getElementById('btnDownload');
    const btnPrint = document.getElementById('btnPrint');
    const btnShare = document.getElementById('btnShare');
    const btnCopyNo = document.getElementById('btnCopyNo');

    /* ================= DEMO DATABASE =================
       Test numbers:
       SKO-CERT-2026-000123  -> valid
       SKO-CERT-2025-000045  -> expired
       SKO-CERT-2026-000200  -> revoked
       Add "pdf": "assets/certs/xxx.pdf" to a record to enable direct PDF download. */
    const CERT_TYPES = {
        appreciation: 'প্রশংসাপত্র',
        training: 'প্রশিক্ষণ সনদ',
        participation: 'অংশগ্রহণ সনদ'
    };

    const CERT_DB = {
        'SKO-CERT-2026-000123': { name: 'এম. এ. রহমান', type: 'appreciation', issued: '2026-01-15', expires: '2028-01-15', revoked: false, pdf: '' },
        'SKO-CERT-2025-000045': { name: 'ফারহানা আক্তার', type: 'training', issued: '2024-03-10', expires: '2025-03-10', revoked: false, pdf: '' },
        'SKO-CERT-2026-000200': { name: 'মো. কামরুল হাসান', type: 'participation', issued: '2026-02-01', expires: '2028-02-01', revoked: true, pdf: '' }
    };

    // Replace the body of this function with a real API call when the backend is ready:
    // return fetch(`/api/certificates/${encodeURIComponent(no)}`).then(r => r.ok ? r.json() : null);
    function fetchCertificate(no) {
        return new Promise(resolve => setTimeout(() => resolve(CERT_DB[no] || null), 900));
    }

    /* ================= RESULT STATES ================= */
    const STATES = {
        valid: {
            icon: 'fa-circle-check',
            badgeIcon: 'fa-check',
            badge: 'Verified',
            title: 'সনদ যাচাই সফল হয়েছে',
            msg: 'এই সনদটি SKO কর্তৃক ইস্যুকৃত এবং বৈধ।',
            status: 'বৈধ (Active)'
        },
        expired: {
            icon: 'fa-clock',
            badgeIcon: 'fa-clock',
            badge: 'Expired',
            title: 'সনদের মেয়াদ শেষ হয়েছে',
            msg: 'সনদটি SKO কর্তৃক ইস্যুকৃত, তবে এর মেয়াদ উত্তীর্ণ হয়ে গেছে।',
            status: 'মেয়াদোত্তীর্ণ'
        },
        revoked: {
            icon: 'fa-ban',
            badgeIcon: 'fa-ban',
            badge: 'Revoked',
            title: 'সনদটি বাতিল করা হয়েছে',
            msg: 'এই সনদটি SKO কর্তৃক বাতিল ঘোষণা করা হয়েছে, তাই এটি বৈধ নয়।',
            status: 'বাতিল'
        },
        notfound: {
            icon: 'fa-circle-xmark',
            badgeIcon: 'fa-xmark',
            badge: 'Not Found',
            title: 'কোনো সনদ পাওয়া যায়নি',
            msg: 'এই নম্বরে SKO-এর ডাটাবেজে কোনো সনদ পাওয়া যায়নি।'
        },
        mismatch: {
            icon: 'fa-triangle-exclamation',
            badgeIcon: 'fa-triangle-exclamation',
            badge: 'Mismatch',
            title: 'প্রদত্ত তথ্য মেলেনি',
            msg: 'সনদ নম্বরটি পাওয়া গেছে, কিন্তু আপনার দেওয়া নাম বা সনদের ধরন সনদের তথ্যের সাথে মেলেনি।'
        },
        error: {
            icon: 'fa-wifi',
            badgeIcon: 'fa-triangle-exclamation',
            badge: 'Error',
            title: 'যাচাই করা যায়নি',
            msg: 'সংযোগে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।'
        }
    };

    /* ================= HELPERS ================= */
    const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
    const BN_MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

    const toEn = s => String(s).replace(/[০-৯]/g, d => BN_DIGITS.indexOf(d));
    const toBn = s => String(s).replace(/\d/g, d => BN_DIGITS[d]);
    const fmtDate = iso => {
        const [y, m, d] = iso.split('-').map(Number);
        return `${toBn(d)} ${BN_MONTHS[m - 1]}, ${toBn(y)}`;
    };
    const normNo = v => toEn(v).replace(/\s+/g, '').replace(/[_–—]/g, '-').toUpperCase();
    const normName = v => v.normalize('NFC').toLowerCase().replace(/[.\s]+/g, '');

    /* ================= UI HELPERS ================= */
    const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const verifyBtnHtml = btnVerify.innerHTML;
    let currentCert = null;
    let busy = false;

    function toast(msg) {
        let t = document.getElementById('vcToast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'vcToast';
            t.className = 'vc-toast';
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
        const err = document.getElementById(input.id + 'Error');
        if (group) group.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        if (err) {
            err.textContent = msg;
            err.classList.add('show');
        }
    }

    function clearError(input) {
        const group = input.closest('.input-group');
        const err = document.getElementById(input.id + 'Error');
        if (group) group.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
        if (err) {
            err.textContent = '';
            err.classList.remove('show');
        }
    }

    function setLoading(on) {
        busy = on;
        btnVerify.disabled = on;
        btnReset.disabled = on;
        form.setAttribute('aria-busy', on ? 'true' : 'false');
        btnVerify.innerHTML = on ?
            '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> যাচাই করা হচ্ছে...' :
            verifyBtnHtml;
    }

    function hideResult() {
        resultSection.hidden = true;
        currentCert = null;
    }

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

    function renderValidity(state, rec) {
        const start = new Date(rec.issued + 'T00:00:00');
        const end = new Date(rec.expires + 'T23:59:59');
        const now = new Date();
        const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
        const days = Math.ceil((end - now) / 86400000);

        resProgressWrap.hidden = state === 'revoked';
        resProgressWrap.classList.toggle('is-soon', state === 'valid' && days <= 60);

        resProgress.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            resProgress.style.width = (state === 'expired' ? 100 : pct).toFixed(1) + '%';
        }));

        resProgressText.textContent = state === 'expired' ?
            `${humanSpan(Math.abs(days))} আগে মেয়াদ শেষ হয়েছে` :
            `মেয়াদ বাকি: ${humanSpan(days)}`;
    }

    function showResult(state, data = {}) {
        const s = STATES[state];
        const rec = data.rec;
        const hasDetails = !!rec;

        resultCard.dataset.state = state;
        resIcon.className = `fa-solid ${s.icon}`;
        resTitle.textContent = s.title;
        resMessage.textContent = s.msg;
        resBadge.innerHTML = `<i class="fa-solid ${s.badgeIcon}"></i> ${s.badge}`;

        resBody.hidden = !hasDetails;
        resHelp.hidden = hasDetails;

        if (hasDetails) {
            resCertNumber.textContent = data.no;
            resCertName.textContent = rec.name;
            resCertType.textContent = CERT_TYPES[rec.type] || '—';
            resIssueDate.textContent = fmtDate(rec.issued);
            resValidity.textContent = `${fmtDate(rec.issued)} – ${fmtDate(rec.expires)}`;
            resStatus.textContent = s.status;
            resActions.hidden = state !== 'valid';
            resLayout.classList.toggle('no-actions', state !== 'valid');
            renderValidity(state, rec);
            resVerifiedAt.textContent = new Date().toLocaleString('bn-BD', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        }

        currentCert = hasDetails ? { no: data.no, rec } : null;

        // restart entrance animation
        resultCard.style.animation = 'none';
        void resultCard.offsetWidth;
        resultCard.style.animation = '';

        resultSection.hidden = false;
        resultSection.scrollIntoView({ behavior: smooth, block: 'start' });
        resultSection.focus({ preventScroll: true });
    }

    /* ================= VERIFY ================= */
    async function verify() {
        if (busy) return;

        const no = normNo(certNumberInput.value);
        const name = certNameInput.value.trim();
        const type = certTypeSelect.value;

        clearError(certNumberInput);
        clearError(certNameInput);

        if (!no) {
            setError(certNumberInput, 'অনুগ্রহ করে সনদ নম্বর লিখুন।');
            certNumberInput.focus();
            return;
        }
        if (!/^[A-Z0-9-]{6,40}$/.test(no)) {
            setError(certNumberInput, 'সনদ নম্বরের ফরম্যাট সঠিক নয়। উদাহরণ: SKO-CERT-2026-000123');
            certNumberInput.focus();
            return;
        }

        certNumberInput.value = no;
        if (document.activeElement) document.activeElement.blur(); // close mobile keyboard
        hideResult();
        setLoading(true);

        let rec = null;
        try {
            rec = await fetchCertificate(no);
        } catch (err) {
            setLoading(false);
            showResult('error', { no });
            return;
        }
        setLoading(false);

        if (!rec) return showResult('notfound', { no });

        if ((name && normName(name) !== normName(rec.name)) || (type && type !== rec.type)) {
            return showResult('mismatch', { no });
        }

        const expired = new Date(rec.expires + 'T23:59:59') < new Date();
        const state = rec.revoked ? 'revoked' : (expired ? 'expired' : 'valid');
        showResult(state, { no, rec });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        verify();
    });

    /* ================= RESET ================= */
    btnReset.addEventListener('click', () => {
        form.reset();
        clearError(certNumberInput);
        clearError(certNameInput);
        hideResult();
        stopScan();
        if (location.search) history.replaceState(null, '', location.pathname);
        certNumberInput.focus();
    });

    /* ================= INPUT HANDLING ================= */
    certNumberInput.addEventListener('input', () => {
        const fixed = toEn(certNumberInput.value).toUpperCase();
        if (fixed !== certNumberInput.value) certNumberInput.value = fixed;
        clearError(certNumberInput);
    });
    certNameInput.addEventListener('input', () => clearError(certNameInput));

    /* ================= ACTIONS: PRINT / PDF / SHARE ================= */
    function shareUrl() {
        const base = location.href.split('#')[0].split('?')[0];
        return `${base}?cert=${encodeURIComponent(currentCert.no)}`;
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

    btnCopyNo.addEventListener('click', async() => {
        if (!currentCert) return;
        toast((await copyText(currentCert.no)) ? 'সনদ নম্বর কপি হয়েছে।' : 'কপি করা যায়নি।');
    });

    btnPrint.addEventListener('click', () => window.print());

    btnDownload.addEventListener('click', () => {
        if (!currentCert) return;
        if (currentCert.rec.pdf) {
            const a = document.createElement('a');
            a.href = currentCert.rec.pdf;
            a.download = `${currentCert.no}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            toast('প্রিন্ট উইন্ডো থেকে "Save as PDF" নির্বাচন করুন।');
            setTimeout(() => window.print(), 700);
        }
    });

    btnShare.addEventListener('click', async() => {
        if (!currentCert) return;
        const url = shareUrl();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'SKO ডিজিটাল সনদ যাচাই',
                    text: `সনদ নম্বর ${currentCert.no} — SKO কর্তৃক যাচাইকৃত`,
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
    const scanBox = document.getElementById('scanBox');
    const scanVideo = document.getElementById('scanVideo');
    const btnScan = document.getElementById('btnScan');
    const qrFile = document.getElementById('qrFile');
    const scanCanvas = document.createElement('canvas');
    const scanCtx = scanCanvas.getContext('2d', { willReadFrequently: true });
    let stream = null;
    let rafId = 0;

    function extractCertNo(text) {
        try {
            const q = new URL(text).searchParams.get('cert');
            if (q) return normNo(q);
        } catch (e) { /* not a URL */ }
        const m = toEn(text).toUpperCase().match(/SKO-CERT-\d{4}-\d{6}/);
        return m ? m[0] : normNo(text);
    }

    function handleQr(text) {
        stopScan();
        certNumberInput.value = extractCertNo(text);
        clearError(certNumberInput);
        toast('QR কোড পড়া হয়েছে।');
        verify();
    }

    function stopScan() {
        cancelAnimationFrame(rafId);
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }
        scanVideo.srcObject = null;
        scanBox.classList.remove('is-scanning');
        btnScan.querySelector('span').textContent = 'QR স্ক্যান করুন';
    }

    function tick() {
        if (!stream) return;
        if (scanVideo.readyState === scanVideo.HAVE_ENOUGH_DATA && scanVideo.videoWidth) {
            const scale = Math.min(1, 640 / scanVideo.videoWidth);
            const w = Math.round(scanVideo.videoWidth * scale);
            const h = Math.round(scanVideo.videoHeight * scale);
            scanCanvas.width = w;
            scanCanvas.height = h;
            scanCtx.drawImage(scanVideo, 0, 0, w, h);
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
            scanVideo.srcObject = stream;
            await scanVideo.play();
            scanBox.classList.add('is-scanning');
            btnScan.querySelector('span').textContent = 'স্ক্যান বন্ধ করুন';
            tick();
        } catch (err) {
            stopScan();
            toast('ক্যামেরা চালু করা যায়নি। অনুমতি দিন অথবা ছবি আপলোড করুন।');
        }
    }

    btnScan.addEventListener('click', () => (stream ? stopScan() : startScan()));

    qrFile.addEventListener('change', () => {
        const file = qrFile.files && qrFile.files[0];
        if (!file) return;
        if (typeof jsQR === 'undefined') {
            toast('QR রিডার লোড হয়নি। আবার চেষ্টা করুন।');
            qrFile.value = '';
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
        qrFile.value = '';
    });

    window.addEventListener('pagehide', stopScan);

    /* ================= AUTO VERIFY FROM LINK (?cert=...) ================= */
    const urlCert = new URLSearchParams(location.search).get('cert');
    if (urlCert) {
        certNumberInput.value = normNo(urlCert);
        verify();
    }

});