document.addEventListener("DOMContentLoaded", () => {

            /* ================= HELPERS ================= */
            const $ = id => document.getElementById(id);
            const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
            const toEn = s => String(s).replace(/[০-৯]/g, d => BN_DIGITS.indexOf(d));
            const toBn = s => String(s).replace(/\d/g, d => BN_DIGITS[d]);
            const normId = v => toEn(v).replace(/\s+/g, '').replace(/[_–—]/g, '-').toUpperCase();
            const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
                let t = $('vqToast');
                if (!t) {
                    t = document.createElement('div');
                    t.id = 'vqToast';
                    t.className = 'vq-toast';
                    t.setAttribute('role', 'status');
                    document.body.appendChild(t);
                }
                t.textContent = msg;
                t.classList.add('show');
                clearTimeout(toast.timer);
                toast.timer = setTimeout(() => t.classList.remove('show'), 3400);
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

            const shareUrl = id => `${location.href.split('#')[0].split('?')[0]}?member=${encodeURIComponent(id)}`;

            function qrSvg(text, level) {
                if (typeof qrcode === 'undefined') return '<i class="fa-solid fa-qrcode"></i>';
                const qr = qrcode(0, level || 'M');
                qr.addData(text);
                qr.make();
                const n = qr.getModuleCount();
                let d = '';
                for (let r = 0; r < n; r++) {
                    for (let c = 0; c < n; c++) {
                        if (qr.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
                    }
                }
                return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="সদস্য যাচাই QR কোড"><path d="${d}" fill="#0f172a"/></svg>`;
            }

            /* ================= DEMO DATABASE =================
               Test IDs: SKO-BCTA-254001 (active), SKO-BCTA-254002 (expired), SKO-BCTA-254003 (suspended)
               Replace fetchMember() with a real API call in production. */
            const MEMBER_DB = {
                'SKO-BCTA-254001': {
                    name: 'মো: কামরুল ইসলাম',
                    school: 'ঢাকা সরকারি কলেজ, ঢাকা',
                    designation: 'প্রভাষক',
                    orgPos: 'জেলা সাধারণ সম্পাদক',
                    org: 'বাংলাদেশ কলেজ শিক্ষক সমিতি (BCTA)',
                    from: 2025,
                    to: 2028,
                    status: 'active',
                    photo: 'assets/images/member/ec-01.jpg'
                },
                'SKO-BCTA-254002': {
                    name: 'মোছা: শাহনাজ পারভীন',
                    school: 'রাজশাহী সরকারি কলেজ, রাজশাহী',
                    designation: 'সহকারী অধ্যাপক',
                    orgPos: 'সদস্য',
                    org: 'বাংলাদেশ কলেজ শিক্ষক সমিতি (BCTA)',
                    from: 2023,
                    to: 2025,
                    status: 'active',
                    photo: ''
                },
                'SKO-BCTA-254003': {
                    name: 'মো: হাসান মাহমুদ',
                    school: 'চট্টগ্রাম সরকারি কলেজ, চট্টগ্রাম',
                    designation: 'অধ্যাপক',
                    orgPos: 'সদস্য',
                    org: 'বাংলাদেশ কলেজ শিক্ষক সমিতি (BCTA)',
                    from: 2025,
                    to: 2028,
                    status: 'suspended',
                    photo: ''
                }
            };

            function fetchMember(id) {
                // Real API: return fetch(`/api/members/${encodeURIComponent(id)}`).then(r => r.ok ? r.json() : null);
                return new Promise(resolve => setTimeout(() => resolve(MEMBER_DB[id] ? { id, rec: MEMBER_DB[id] } : null), 900));
            }

            /* ================= STATES ================= */
            const STATES = {
                active: {
                    icon: 'fa-circle-check',
                    badgeIcon: 'fa-circle-check',
                    badge: 'বৈধ ও অনুমোদিত পরিচয়পত্র',
                    title: 'পরিচয়পত্র যাচাই সফল হয়েছে',
                    msg: 'এই পরিচয়পত্রটি SKO কর্তৃক ইস্যুকৃত এবং বৈধ।',
                    status: 'বৈধ ও সক্রিয় (Active)',
                    stamp: '',
                    steps: ['ok', 'ok', 'ok']
                },
                expired: {
                    icon: 'fa-clock',
                    badgeIcon: 'fa-clock',
                    badge: 'মেয়াদোত্তীর্ণ',
                    title: 'সদস্যপদের মেয়াদ শেষ হয়েছে',
                    msg: 'পরিচয়পত্রটি SKO-এর, তবে সদস্যপদের মেয়াদ উত্তীর্ণ। নবায়ন প্রয়োজন।',
                    status: 'মেয়াদোত্তীর্ণ',
                    stamp: 'মেয়াদোত্তীর্ণ',
                    steps: ['ok', 'ok', 'warn']
                },
                suspended: {
                    icon: 'fa-ban',
                    badgeIcon: 'fa-ban',
                    badge: 'স্থগিত',
                    title: 'সদস্যপদ স্থগিত রয়েছে',
                    msg: 'এই সদস্যপদ বর্তমানে স্থগিত। বিস্তারিত জানতে কেন্দ্রীয় কার্যালয়ে যোগাযোগ করুন।',
                    status: 'স্থগিত',
                    stamp: 'স্থগিত',
                    steps: ['ok', 'ok', 'warn']
                },
                notfound: {
                    icon: 'fa-circle-xmark',
                    badgeIcon: 'fa-xmark',
                    badge: 'পাওয়া যায়নি',
                    title: 'পরিচয়পত্র পাওয়া যায়নি',
                    msg: 'QR কোডটি পড়া গেছে, কিন্তু এই সদস্যের তথ্য SKO-এর ডাটাবেজে নেই। পরিচয়পত্রটি সন্দেহজনক, সতর্ক থাকুন।',
                    steps: ['ok', 'fail', 'skip']
                },
                invalid: {
                    icon: 'fa-ban',
                    badgeIcon: 'fa-ban',
                    badge: 'অবৈধ QR',
                    title: 'এটি SKO-এর বৈধ QR কোড নয়',
                    msg: 'স্ক্যান করা QR কোডে কোনো SKO সদস্য নম্বর পাওয়া যায়নি।',
                    steps: ['fail', 'skip', 'skip']
                },
                error: {
                    icon: 'fa-wifi',
                    badgeIcon: 'fa-triangle-exclamation',
                    badge: 'ত্রুটি',
                    title: 'যাচাই করা যায়নি',
                    msg: 'সংযোগে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
                    steps: null
                }
            };
            const STEP_ICON = { ok: 'fa-circle-check', warn: 'fa-triangle-exclamation', fail: 'fa-circle-xmark', skip: 'fa-minus' };
            const METHODS = { camera: 'ক্যামেরা স্ক্যান', upload: 'ছবি আপলোড', link: 'সরাসরি লিংক' };

            /* ================= ELEMENTS ================= */
            const tabs = document.querySelectorAll('.vq-tab');
            const panes = document.querySelectorAll('.vq-pane');

            const resultCard = $('resultCard');
            const resultEmpty = $('resultEmpty');
            const resultView = $('resultView');
            const rvIcon = $('rvIcon');
            const rvTitle = $('rvTitle');
            const rvMsg = $('rvMsg');
            const rvBadge = $('rvBadge');
            const rvData = $('rvData');
            const vqSteps = $('vqSteps');
            const resHelp = $('resHelp');
            const resultActions = $('resultActions');
            const idc = $('idc');
            const idcScaler = $('idcScaler');

            /* ================= TABS ================= */
            function activateTab(tab) {
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                panes.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                $(tab.dataset.target).classList.add('active');
                if (tab.dataset.target !== 'paneCam') stopScan();
            }
            tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));

            /* ================= ID CARD SCALING ================= */
            function fitCard() {
                const w = idcScaler.clientWidth;
                if (!w) return;
                const k = Math.min(1.5, w / 420);
                idc.style.transform = `scale(${k})`;
                idcScaler.style.height = `${idc.offsetHeight * k}px`;
            }
            if ('ResizeObserver' in window) {
                let lastW = 0;
                new ResizeObserver(() => {
                    const w = idcScaler.clientWidth;
                    if (w !== lastW) { lastW = w;
                        fitCard(); }
                }).observe(idcScaler);
            }
            window.addEventListener('resize', fitCard);

            /* ================= SHOW RESULT ================= */
            function setText(id, value) { $(id).textContent = value; }

            function showResult(state, data, method) {
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

                // security steps
                vqSteps.hidden = !s.steps;
                if (s.steps) {
                    [...vqSteps.children].forEach((li, i) => {
                        li.className = s.steps[i];
                        li.querySelector('i').className = `fa-solid ${STEP_ICON[s.steps[i]]}`;
                    });
                }

                rvData.hidden = !hasData;
                resHelp.hidden = hasData;

                if (hasData) {
                    const m = data.rec;
                    const validity = `${toBn(m.from)} – ${toBn(m.to)}`;
                    const days = Math.ceil((new Date(`${m.to}-12-31T23:59:59`) - new Date()) / 86400000);

                    // card
                    setText('idcOrg', m.org);
                    setText('idcName', m.name);
                    setText('idcDesignation', m.designation);
                    setText('idcOrgPos', m.orgPos);
                    setText('idcMemberId', data.id);
                    setText('idcValidity', validity);
                    const photo = $('idcPhoto');
                    if (m.photo) { photo.src = m.photo;
                        photo.hidden = false; } else { photo.hidden = true; }
                    $('idcQr').innerHTML = qrSvg(shareUrl(data.id), 'M');
                    idc.className = `idc${s.stamp ? ' is-' + state : ''}`;
                    setText('idcStamp', s.stamp || '');

                    // details
                    setText('dName', m.name);
                    setText('dSchool', m.school);
                    setText('dDesignation', m.designation);
                    setText('dOrgPos', m.orgPos);
                    setText('dMemberId', data.id);
                    setText('dValidity', validity);
                    setText('dValidityNote', days > 0 ? `মেয়াদ বাকি: ${humanSpan(days)}` : 'মেয়াদ শেষ হয়েছে');
                    setText('dStatus', s.status);
                }

                setText('resMethod', METHODS[method] || METHODS.link);
                setText('resVerifiedAt', new Date().toLocaleString('bn-BD', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                }));

                resultActions.querySelectorAll('[data-show]').forEach(el => {
                    el.hidden = !(el.dataset.show === 'all' || el.dataset.show === state);
                });

                current = hasData ? { id: data.id, rec: data.rec } : null;

                // restart entrance animation
                resultView.style.animation = 'none';
                void resultView.offsetWidth;
                resultView.style.animation = '';

                fitCard();

                const top = resultCard.getBoundingClientRect().top;
                if (top < 70 || top > window.innerHeight * 0.6) {
                    resultCard.scrollIntoView({ behavior: smooth, block: 'start' });
                }
                resultCard.focus({ preventScroll: true });
            }

            /* ================= VERIFY PAYLOAD ================= */
            function extractMemberId(text) {
                const raw = String(text).trim();
                try {
                    const u = new URL(raw);
                    const q = u.searchParams.get('member') || u.searchParams.get('id');
                    if (q) return normId(q);
                } catch (e) { /* not a URL */ }
                const m = toEn(raw).toUpperCase().match(/SKO-[A-Z0-9]+-\d{3,}/);
                return m ? m[0] : '';
            }

            function setBusy(on) {
                busy = on;
                resultCard.classList.toggle('is-loading', on);
                if (on) setQrStatus('যাচাই করা হচ্ছে…', true);
            }

            async function processPayload(text, method) {
                if (busy) return;
                const id = extractMemberId(text);
                if (!id) return showResult('invalid', null, method);

                setBusy(true);
                let found = null;
                try {
                    found = await fetchMember(id);
                } catch (err) {
                    setBusy(false);
                    setQrStatus('ক্যামেরা বন্ধ আছে', false);
                    return showResult('error', null, method);
                }
                setBusy(false);
                setQrStatus('ক্যামেরা বন্ধ আছে', false);

                if (!found) return showResult('notfound', null, method);

                const expired = new Date(`${found.rec.to}-12-31T23:59:59`) < new Date();
                const state = found.rec.status === 'suspended' ? 'suspended' : (expired ? 'expired' : 'active');
                showResult(state, found, method);
            }

            /* ================= CAMERA SCANNER ================= */
            const qrFinder = $('qrFinder');
            const qrVideo = $('qrVideo');
            const qrStatus = $('qrStatus');
            const btnQrStart = $('btnQrStart');
            const btnTorch = $('btnTorch');
            const btnFlip = $('btnFlip');
            const scanCanvas = document.createElement('canvas');
            const scanCtx = scanCanvas.getContext('2d', { willReadFrequently: true });
            let stream = null;
            let rafId = 0;
            let idleTimer = 0;
            let facing = 'environment';
            let torchOn = false;

            function setQrStatus(text, live) {
                qrStatus.textContent = text;
                qrStatus.classList.toggle('is-live', !!live);
            }

            function stopScan() {
                cancelAnimationFrame(rafId);
                clearTimeout(idleTimer);
                if (stream) {
                    stream.getTracks().forEach(t => t.stop());
                    stream = null;
                }
                torchOn = false;
                qrVideo.srcObject = null;
                qrVideo.style.transform = '';
                qrFinder.classList.remove('is-scanning');
                btnTorch.hidden = true;
                btnTorch.classList.remove('is-on');
                btnFlip.hidden = true;
                btnQrStart.querySelector('span').textContent = 'ক্যামেরা চালু করুন';
                if (!busy) setQrStatus('ক্যামেরা বন্ধ আছে', false);
            }

            function handleDecoded(text) {
                stopScan();
                qrFinder.classList.add('is-success');
                setTimeout(() => qrFinder.classList.remove('is-success'), 1400);
                if (navigator.vibrate) navigator.vibrate(60);
                processPayload(text, 'camera');
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
                    if (code && code.data) return handleDecoded(code.data);
                }
                rafId = requestAnimationFrame(tick);
            }

            async function startScan() {
                if (typeof jsQR === 'undefined') {
                    toast('QR রিডার লোড হয়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।');
                    return;
                }
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    toast('এই ব্রাউজারে ক্যামেরা সমর্থিত নয়। ছবি আপলোড করুন।');
                    return;
                }
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
                        audio: false
                    });
                    qrVideo.srcObject = stream;
                    qrVideo.style.transform = facing === 'user' ? 'scaleX(-1)' : '';
                    await qrVideo.play();

                    qrFinder.classList.add('is-scanning');
                    btnQrStart.querySelector('span').textContent = 'স্ক্যান বন্ধ করুন';
                    setQrStatus('স্ক্যান করা হচ্ছে… QR কোড ফ্রেমে রাখুন', true);

                    const track = stream.getVideoTracks()[0];
                    const caps = track.getCapabilities ? track.getCapabilities() : {};
                    btnTorch.hidden = !('torch' in caps);
                    if (navigator.mediaDevices.enumerateDevices) {
                        navigator.mediaDevices.enumerateDevices().then(list => {
                            btnFlip.hidden = list.filter(d => d.kind === 'videoinput').length < 2;
                        });
                    }

                    idleTimer = setTimeout(() => {
                        stopScan();
                        toast('নিষ্ক্রিয়তার কারণে ক্যামেরা বন্ধ করা হয়েছে।');
                    }, 60000);
                    tick();
                } catch (err) {
                    stopScan();
                    toast('ক্যামেরা চালু করা যায়নি। অনুমতি দিন অথবা ছবি আপলোড করুন।');
                }
            }

            btnQrStart.addEventListener('click', () => (stream ? stopScan() : startScan()));

            btnTorch.addEventListener('click', async() => {
                if (!stream) return;
                torchOn = !torchOn;
                try {
                    await stream.getVideoTracks()[0].applyConstraints({ advanced: [{ torch: torchOn }] });
                    btnTorch.classList.toggle('is-on', torchOn);
                } catch (e) {
                    torchOn = false;
                    toast('এই ডিভাইসে ফ্ল্যাশ চালু করা যায়নি।');
                }
            });

            btnFlip.addEventListener('click', () => {
                facing = facing === 'environment' ? 'user' : 'environment';
                stopScan();
                startScan();
            });

            window.addEventListener('pagehide', stopScan);

            /* ================= IMAGE UPLOAD ================= */
            const qrFileInput = $('qrFileInput');
            const vqDrop = $('vqDrop');
            const vqPreview = $('vqPreview');
            const vqPreviewImg = $('vqPreviewImg');
            const MAX_SIZE = 5 * 1024 * 1024;
            let previewUrl = '';

            function clearFile() {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                previewUrl = '';
                qrFileInput.value = '';
                vqPreview.hidden = true;
                vqPreviewImg.removeAttribute('src');
            }
            $('btnClearFile').addEventListener('click', clearFile);

            function decodeImage(img) {
                for (const max of[1400, 800, 500]) {
                    const scale = Math.min(1, max / Math.max(img.width, img.height));
                    const w = Math.max(1, Math.round(img.width * scale));
                    const h = Math.max(1, Math.round(img.height * scale));
                    scanCanvas.width = w;
                    scanCanvas.height = h;
                    scanCtx.drawImage(img, 0, 0, w, h);
                    const code = jsQR(scanCtx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'attemptBoth' });
                    if (code && code.data) return code.data;
                }
                return null;
            }

            function handleFile(file) {
                if (!file) return;
                if (!/^image\/(jpeg|png)$/.test(file.type)) { toast('শুধু JPG বা PNG ছবি আপলোড করুন।'); return; }
                if (file.size > MAX_SIZE) { toast('ফাইলের আকার ৫MB এর বেশি হতে পারবে না।'); return; }
                if (typeof jsQR === 'undefined') { toast('QR রিডার লোড হয়নি। আবার চেষ্টা করুন।'); return; }

                clearFile();
                previewUrl = URL.createObjectURL(file);
                vqPreviewImg.src = previewUrl;
                setText('vqFileName', file.name);
                setText('vqFileMeta', `${(file.size / 1024).toFixed(0)} KB`);
                vqPreview.hidden = false;

                const img = new Image();
                img.onload = () => {
                    const text = decodeImage(img);
                    if (text) processPayload(text, 'upload');
                    else toast('ছবিতে কোনো QR কোড পাওয়া যায়নি। পরিষ্কার ও কাছ থেকে তোলা ছবি দিন।');
                };
                img.onerror = () => toast('ছবিটি পড়া যায়নি।');
                img.src = previewUrl;
            }

            qrFileInput.addEventListener('change', () => handleFile(qrFileInput.files && qrFileInput.files[0]));

            ['dragenter', 'dragover'].forEach(ev => vqDrop.addEventListener(ev, e => {
                e.preventDefault();
                vqDrop.classList.add('is-over');
            }));
            ['dragleave', 'drop'].forEach(ev => vqDrop.addEventListener(ev, e => {
                e.preventDefault();
                vqDrop.classList.remove('is-over');
            }));
            vqDrop.addEventListener('drop', e => handleFile(e.dataTransfer && e.dataTransfer.files[0]));

            document.addEventListener('paste', e => {
                const files = e.clipboardData ? [...e.clipboardData.files] : [];
                const file = files.find(f => f.type.startsWith('image/'));
                if (file) {
                    activateTab(tabs[1]);
                    handleFile(file);
                }
            });

            /* ================= ACTIONS ================= */
            $('btnCopyId').addEventListener('click', async() => {
                if (!current) return;
                toast((await copyText(current.id)) ? 'সদস্য নম্বর কপি হয়েছে।' : 'কপি করা যায়নি।');
            });

            $('btnShare').addEventListener('click', async() => {
                if (!current) return;
                const url = shareUrl(current.id);
                if (navigator.share) {
                    try {
                        await navigator.share({ title: 'SKO পরিচয়পত্র যাচাই', text: `সদস্য নম্বর ${current.id} — SKO কর্তৃক যাচাইকৃত`, url });
                        return;
                    } catch (e) {
                        if (e && e.name === 'AbortError') return;
                    }
                }
                toast((await copyText(url)) ? 'যাচাই লিংক কপি হয়েছে।' : 'লিংক কপি করা যায়নি।');
            });

            $('btnRescan').addEventListener('click', () => {
                activateTab(tabs[0]);
                if (window.innerWidth < 992) {
                    $('paneCam').scrollIntoView({ behavior: smooth, block: 'center' });
                }
                startScan();
            });

            /* ================= A4 SHEET (Print + PDF) ================= */
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
                const old = $('vqSheet');
                if (old) old.remove();
                document.body.classList.remove('has-sheet');
            }

            function buildSheet() {
                removeSheet();
                const m = current.rec;
                const state = resultCard.dataset.state;
                const s = STATES[state];

                const rows = [
                    ['নাম', m.name],
                    ['শিক্ষা প্রতিষ্ঠান', m.school],
                    ['পদবী', m.designation],
                    ['সাংগঠনিক পদবী', m.orgPos],
                    ['সদস্য নম্বর', current.id],
                    ['সদস্যপদের মেয়াদ', `${toBn(m.from)} – ${toBn(m.to)}`],
                    ['পরিচয়পত্রের অবস্থা', s.status]
                ];

                const sheet = document.createElement('div');
                sheet.id = 'vqSheet';
                sheet.className = 'vq-sheet';
                sheet.dataset.state = state;
                sheet.innerHTML = `
            <div class="ps-head">
                <img src="assets/images/logo.png" alt="">
                <div>
                    <h1>শিক্ষক কর্মচারী ঐক্য জোট (SKO)</h1>
                    <p>কেন্দ্রীয় সংগঠন ও সমন্বিত ব্যবস্থাপনা</p>
                </div>
                <span class="ps-tag">পরিচয়পত্র যাচাই প্রতিবেদন</span>
            </div>
            <div class="ps-banner">
                <i class="${esc(rvIcon.className)}"></i>
                <div><h2>${esc(s.title)}</h2><p>${esc(s.msg)}</p></div>
            </div>
            <div class="ps-card"><div class="ps-card-box"></div></div>
            <div class="ps-grid">
                ${rows.map(r => `<div class="ps-row"><small>${esc(r[0])}</small><strong>${esc(r[1])}</strong></div>`).join('')}
            </div>
            <div class="ps-note">
                এই প্রতিবেদনটি SKO-এর ডিজিটাল ভেরিফিকেশন সিস্টেম থেকে স্বয়ংক্রিয়ভাবে তৈরি করা হয়েছে।
                পরিচয়পত্রের QR কোড স্ক্যান করে যেকোনো সময় তথ্যের সত্যতা যাচাই করা যাবে।
            </div>
            <div class="ps-foot">
                <span>www.sko.org.bd · info@sko.org.bd</span>
                <span>যাচাই লিংক: ${esc(shareUrl(current.id))}</span>
            </div>`;

        const card = idc.cloneNode(true);
        card.removeAttribute('id');
        card.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        card.style.transform = '';
        const box = sheet.querySelector('.ps-card-box');
        box.appendChild(card);

        document.body.appendChild(sheet);
        document.body.classList.add('has-sheet');

        // scale card; shrink until everything fits one A4 page
        let k = 1.25;
        const apply = () => {
            card.style.transform = `scale(${k})`;
            box.style.width = `${420 * k}px`;
            box.style.height = `${card.offsetHeight * k}px`;
        };
        apply();
        while (sheet.scrollHeight > sheet.clientHeight && k > 0.8) {
            k -= 0.05;
            apply();
        }
        return sheet;
    }

    /* ---------- Print ---------- */
    $('btnPrint').addEventListener('click', async () => {
        if (!current) return;
        const sheet = buildSheet();
        await waitImages(sheet);
        window.print();
    });

    window.addEventListener('beforeprint', () => {
        if (current && !$('vqSheet')) buildSheet();
    });
    window.addEventListener('afterprint', removeSheet);

    /* ---------- PDF download (A4) ---------- */
    const btnDownload = $('btnDownload');
    btnDownload.addEventListener('click', async () => {
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
                    const el = doc.getElementById('vqSheet');
                    el.style.left = '0';
                    el.style.top = '0';
                }
            });

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
            pdf.save(`SKO-QR-Card-${current.id}.pdf`);
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
            setTimeout(() => $('btnPrint').click(), 700);
        }
    });

    /* ================= AUTO VERIFY FROM LINK (?member=...) ================= */
    const urlMember = new URLSearchParams(location.search).get('member');
    if (urlMember) processPayload(urlMember, 'link');

});