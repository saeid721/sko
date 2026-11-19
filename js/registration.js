document.addEventListener("DOMContentLoaded", () => {
    // Form Validation & Styling
    const form = document.getElementById("registrationForm");

    if (form) {
        // Add real-time validation feedback class
        const inputs = form.querySelectorAll("input[required], select[required]");

        inputs.forEach(input => {
            input.addEventListener("blur", () => {
                if (input.checkValidity()) {
                    input.classList.remove("is-invalid");
                    input.classList.add("is-valid");
                } else {
                    input.classList.remove("is-valid");
                    input.classList.add("is-invalid");
                }
            });

            input.addEventListener("input", () => {
                if (input.classList.contains("is-invalid") && input.checkValidity()) {
                    input.classList.remove("is-invalid");
                    input.classList.add("is-valid");
                }
            });
        });

        // Form Submit Handler
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!form.checkValidity()) {
                // Find first invalid element and scroll to it
                const firstInvalid = form.querySelector(":invalid");
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
                return;
            }

            // Simulate submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> প্রসেসিং হচ্ছে...';

            setTimeout(() => {
                // Show success toast
                const toast = document.createElement("div");
                toast.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #16a34a;
                    color: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(22, 163, 74, 0.3);
                    z-index: 9999;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transform: translateX(120%);
                    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                `;
                toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!`;
                document.body.appendChild(toast);

                requestAnimationFrame(() => {
                    toast.style.transform = "translateX(0)";
                });

                setTimeout(() => {
                    toast.style.transform = "translateX(120%)";
                    setTimeout(() => toast.remove(), 400);
                }, 4000);

                // Reset form and button
                form.reset();
                inputs.forEach(i => i.classList.remove("is-valid", "is-invalid"));
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

            }, 1500);
        });
    }
});


/* ============================================
   REGISTRATION ENHANCEMENTS
   Live ID preview, QR, photo upload, steps,
   progress, draft save
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    if (!form) return;

    const $ = (id) => document.getElementById(id);
    const BN = "০১২৩৪৫৬৭৮৯";
    const toBn = (s) => String(s).replace(/\d/g, (d) => BN[d]);
    const toEn = (s) => String(s).replace(/[০-৯]/g, (d) => BN.indexOf(d));

    /* ---------- Toast ---------- */
    function showToast(msg, icon = "fa-circle-check") {
        const t = document.createElement("div");
        t.className = "reg-toast";
        t.setAttribute("role", "status");
        t.innerHTML = `<i class="fa-solid ${icon}"></i> ${msg}`;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add("show"));
        setTimeout(() => {
            t.classList.remove("show");
            setTimeout(() => t.remove(), 400);
        }, 3000);
    }

    /* ---------- Digits only (NID / mobile) ---------- */
    ["nid", "mobile", "whatsapp"].forEach((id) => {
        const el = $(id);
        if (!el) return;
        el.addEventListener("input", () => {
            el.value = toEn(el.value).replace(/\D/g, "");
        });
    });

    /* ---------- Live ID preview ---------- */
    function setText(out, value) {
        const v = value.trim();
        out.textContent = v || out.dataset.default;
        out.classList.toggle("is-live", !!v);
    }

    [
        ["fullName", "pvName"],
        ["fatherName", "pvFather"],
        ["institution", "pvInstitute"],
        ["indexNo", "pvIndex"],
        ["orgPost", "pvOrgPost"],
    ].forEach(([inId, outId]) => {
        const inp = $(inId),
            out = $(outId);
        if (!inp || !out) return;
        const update = () => setText(out, inId === "indexNo" ? toBn(toEn(inp.value)) : inp.value);
        inp.addEventListener("input", update);
        form.addEventListener("reset", () => setTimeout(update));
    });

    const desig = $("designation"),
        pvDesig = $("pvDesignation");
    if (desig && pvDesig) {
        const update = () => setText(pvDesig, desig.value ? desig.options[desig.selectedIndex].text : "");
        desig.addEventListener("change", update);
        form.addEventListener("reset", () => setTimeout(update));
    }

    /* ---------- QR code ---------- */
    function renderQr() {
        const box = $("pvQr"),
            no = $("pvMember");
        if (!box || !no || typeof qrcode === "undefined") return;
        const qr = qrcode(0, "M");
        qr.addData("https://www.sko.org.bd/verify-member.html?member=" + encodeURIComponent(no.textContent.trim()));
        qr.make();
        box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
        const svg = box.querySelector("svg");
        if (svg) {
            svg.setAttribute("shape-rendering", "crispEdges");
            svg.querySelectorAll('[fill="black"]').forEach((e) => e.setAttribute("fill", "#0b1f4d"));
        }
    }
    renderQr();

    /* ---------- Photo upload ---------- */
    const pInput = $("photoInput"),
        pDrop = $("photoDrop"),
        pImg = $("photoPreview"),
        pErr = $("photoError"),
        pRemove = $("photoRemove"),
        pvPhoto = $("pvPhoto");
    const defaultPhoto = pvPhoto ? pvPhoto.getAttribute("src") : "";
    const MAX_SIZE = 2 * 1024 * 1024;
    let photoUrl = null;

    function clearPhoto(keepError) {
        if (photoUrl) { URL.revokeObjectURL(photoUrl);
            photoUrl = null; }
        pInput.value = "";
        pImg.removeAttribute("src");
        pDrop.classList.remove("has-photo");
        if (!keepError) { pDrop.classList.remove("is-invalid");
            pErr.textContent = ""; }
        if (pvPhoto) { pvPhoto.src = defaultPhoto;
            pvPhoto.style.visibility = ""; }
    }

    function photoError(msg) {
        clearPhoto(true);
        pDrop.classList.add("is-invalid");
        pErr.textContent = msg;
    }

    if (pInput && pDrop) {
        pInput.addEventListener("change", () => {
            const file = pInput.files[0];
            if (!file) return clearPhoto();
            if (!["image/jpeg", "image/png"].includes(file.type)) return photoError("শুধু JPG বা PNG ছবি দিন।");
            if (file.size > MAX_SIZE) return photoError("ছবির সাইজ সর্বোচ্চ 2MB হতে হবে।");
            if (photoUrl) URL.revokeObjectURL(photoUrl);
            photoUrl = URL.createObjectURL(file);
            pImg.src = photoUrl;
            if (pvPhoto) { pvPhoto.src = photoUrl;
                pvPhoto.style.visibility = "visible"; }
            pDrop.classList.add("has-photo");
            pDrop.classList.remove("is-invalid");
            pErr.textContent = "";
        });

        pInput.addEventListener("invalid", () => {
            pDrop.classList.add("is-invalid");
            if (!pInput.files.length) pErr.textContent = "ছবি আপলোড করা বাধ্যতামূলক।";
        });

        ["dragenter", "dragover"].forEach((ev) => pInput.addEventListener(ev, () => pDrop.classList.add("is-drag")));
        ["dragleave", "drop"].forEach((ev) => pInput.addEventListener(ev, () => pDrop.classList.remove("is-drag")));

        pRemove.addEventListener("click", (e) => { e.preventDefault();
            clearPhoto();
            updateAll(); });
        form.addEventListener("reset", () => setTimeout(() => clearPhoto()));
    }

    /* ---------- Steps, progress ---------- */
    const sections = [...form.querySelectorAll(".form-section")];
    const stepEls = [...document.querySelectorAll(".step-item")];
    // sections: personal, education, org, address, contact, photo, declaration
    const stepOf = [0, 1, 2, 3, 3, 4, 5];
    const bar = $("regProgressBar"),
        barText = $("regProgressText");

    const isOk = (f) => (f.type === "checkbox" ? f.checked : f.checkValidity());

    function updateDone() {
        stepEls.forEach((el, i) => {
            const req = sections.filter((_, k) => stepOf[k] === i).flatMap((s) => [...s.querySelectorAll("[required]")]);
            el.classList.toggle("done", req.length > 0 && req.every(isOk));
        });
        const all = [...form.querySelectorAll("[required]")];
        const pct = all.length ? Math.round((all.filter(isOk).length / all.length) * 100) : 0;
        if (bar) bar.style.width = pct + "%";
        if (barText) barText.textContent = toBn(pct) + "%";
    }

    function updateActive() {
        const line = window.innerHeight * 0.4;
        let cur = 0;
        sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= line) cur = i; });
        stepEls.forEach((el, i) => el.classList.toggle("active", i === stepOf[cur]));
    }

    function updateAll() { updateDone();
        updateActive(); }

    form.addEventListener("input", updateDone);
    form.addEventListener("change", updateDone);
    form.addEventListener("reset", () => setTimeout(updateAll));

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { updateActive();
            ticking = false; });
    }, { passive: true });

    stepEls.forEach((el, i) => {
        el.addEventListener("click", () => {
            const idx = stepOf.indexOf(i);
            if (sections[idx]) sections[idx].scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    /* ---------- Draft save (NID ও ছবি সংরক্ষণ হয় না) ---------- */
    const DRAFT_KEY = "sko_reg_draft";
    const draftFields = () => [...form.querySelectorAll("input:not([type=file]):not([type=checkbox]), select, textarea")]
        .filter((f) => f.id !== "nid");

    function restoreDraft() {
        try {
            const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
            if (!saved) return;
            draftFields().forEach((f, i) => {
                if (saved[i] === undefined) return;
                if (f.type === "radio") f.checked = !!saved[i];
                else f.value = saved[i];
                f.dispatchEvent(new Event("input", { bubbles: true }));
                f.dispatchEvent(new Event("change", { bubbles: true }));
            });
        } catch (e) { /* ignore */ }
    }

    const draftBtn = form.querySelector(".form-actions .btn-outline-primary");
    if (draftBtn) {
        draftBtn.addEventListener("click", () => {
            try {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(draftFields().map((f) => (f.type === "radio" ? f.checked : f.value))));
                showToast("খসড়া সংরক্ষিত হয়েছে");
            } catch (e) {
                showToast("খসড়া সংরক্ষণ করা যায়নি", "fa-triangle-exclamation");
            }
        });
    }

    form.addEventListener("reset", () => { try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ } });

    /* ---------- Back button ---------- */
    const backBtn = form.querySelector(".form-actions .btn-outline-secondary");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            if (history.length > 1) history.back();
            else window.location.href = "index.html";
        });
    }

    restoreDraft();
    updateAll();
});