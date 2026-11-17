/**
 * SKO History & Achievements: premium logic
 * 1) Scroll reveal  2) Timeline line draw  3) Stats count-up  4) Gallery lightbox
 */
(() => {
    "use strict";

    const doc = document;
    const root = doc.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasIO = "IntersectionObserver" in window;
    const isEn = () => root.lang === "en";

    const init = () => {
        const page = doc.querySelector(".history-page");
        if (!page) return;
        initReveal(page);
        initCounters(page);
        initGallery(page);
    };

    /* ---------------------------------------------------------
       1) SCROLL REVEAL + TIMELINE LINE
       If JS fails, nothing is hidden (classes are added by JS only)
    --------------------------------------------------------- */
    const initReveal = (page) => {
        if (!hasIO || reduce) return;

        const targets = page.querySelectorAll(
            ".hs-card, .timeline-item, .achievement-box, .gallery-item, .special-list li, .hs-stats-bar .stat-item"
        );

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                io.unobserve(el);
                el.classList.add("is-visible");

                const delay = parseFloat(el.style.getPropertyValue("--d")) || 0;
                setTimeout(() => {
                    el.classList.remove("hs-reveal", "is-visible");
                    el.style.removeProperty("--d");
                }, 900 + delay * 1000);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

        targets.forEach((el) => {
            const siblings = [...el.parentElement.children].filter(
                (c) => c.tagName === el.tagName && !c.classList.contains("stat-divider")
            );
            const index = Math.min(siblings.indexOf(el), 6);
            el.style.setProperty("--d", (index * 0.09).toFixed(2) + "s");
            el.classList.add("hs-reveal");
            io.observe(el);
        });

        // timeline line draws itself
        const timeline = page.querySelector(".hs-timeline");
        if (timeline) {
            timeline.classList.add("hs-line");
            const lineIO = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    timeline.classList.add("is-visible");
                    lineIO.disconnect();
                }
            }, { threshold: 0.15 });
            lineIO.observe(timeline);
        }
    };

    /* ---------------------------------------------------------
       2) STATS COUNT-UP (Bangla + English digits)
    --------------------------------------------------------- */
    const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
    const NUM_RE = /[০-৯0-9][০-৯0-9,]*/;

    const toNumber = (str) => {
        const latin = [...str].map((ch) => {
            const i = BN_DIGITS.indexOf(ch);
            return i > -1 ? String(i) : ch;
        }).join("");
        return parseInt(latin.replace(/[^0-9]/g, ""), 10);
    };

    const initCounters = (page) => {
        const bar = page.querySelector(".hs-stats-bar");
        if (!bar || !hasIO || reduce) return;

        const nodes = [...bar.querySelectorAll(".stat-text strong")];

        const run = (el) => {
            const text = el.textContent;
            const match = text.match(NUM_RE);
            if (!match) return;

            const target = toNumber(match[0]);
            if (!target) return;

            const bangla = /[০-৯]/.test(match[0]);
            const fmt = (n) => n.toLocaleString(bangla ? "bn-BD" : "en-US");
            const original = el.innerHTML;
            const start = performance.now();
            const duration = 1400;

            el.style.minWidth = el.offsetWidth + "px";

            const tick = (now) => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);

                if (p < 1) {
                    el.textContent = text.replace(match[0], fmt(Math.round(target * eased)));
                    requestAnimationFrame(tick);
                } else {
                    el.innerHTML = original; // restore exact text (keeps translation working)
                    el.style.minWidth = "";
                }
            };
            requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) return;
            io.disconnect();
            nodes.forEach(run);
        }, { threshold: 0.35 });

        io.observe(bar);
    };

    /* ---------------------------------------------------------
       3) GALLERY LIGHTBOX (click / Enter / Space, arrows, swipe, Esc)
    --------------------------------------------------------- */
    const initGallery = (page) => {
        const items = [...page.querySelectorAll(".gallery-item")];
        if (!items.length) return;

        const big = (src) =>
            src.includes("images.unsplash.com") ?
            src.replace(/([?&])w=\d+/, "$1w=1400").replace(/([?&])h=\d+/, "$1h=933") :
            src;

        const data = items.map((item) => {
            const img = item.querySelector("img");
            const cap = item.querySelector(".gallery-caption");
            const src = img ? (img.currentSrc || img.src) : "";
            return {
                src: big(src),
                fallback: src,
                alt: img ? img.alt : "",
                caption: cap ? cap.textContent.trim() : ""
            };
        });

        // lightbox markup
        const lb = doc.createElement("div");
        lb.className = "hs-lightbox";
        lb.setAttribute("role", "dialog");
        lb.setAttribute("aria-modal", "true");
        lb.innerHTML =
            '<button type="button" class="hs-lb-btn hs-lb-close"><i class="fa-solid fa-xmark"></i></button>' +
            '<button type="button" class="hs-lb-btn hs-lb-prev"><i class="fa-solid fa-chevron-left"></i></button>' +
            '<button type="button" class="hs-lb-btn hs-lb-next"><i class="fa-solid fa-chevron-right"></i></button>' +
            '<figure class="hs-lb-figure"><img class="hs-lb-img" alt="">' +
            '<figcaption class="hs-lb-cap"></figcaption></figure>';
        doc.body.appendChild(lb);

        const imgEl = lb.querySelector(".hs-lb-img");
        const capEl = lb.querySelector(".hs-lb-cap");
        const closeBtn = lb.querySelector(".hs-lb-close");
        const prevBtn = lb.querySelector(".hs-lb-prev");
        const nextBtn = lb.querySelector(".hs-lb-next");

        let current = 0;
        let opener = null;
        let touchX = 0;

        const setLabels = () => {
            lb.setAttribute("aria-label", isEn() ? "Photo gallery" : "ছবির গ্যালারি");
            closeBtn.setAttribute("aria-label", isEn() ? "Close" : "বন্ধ করুন");
            prevBtn.setAttribute("aria-label", isEn() ? "Previous photo" : "আগের ছবি");
            nextBtn.setAttribute("aria-label", isEn() ? "Next photo" : "পরের ছবি");
        };

        const show = (index) => {
            current = (index + data.length) % data.length;
            const d = data[current];
            imgEl.onerror = () => {
                if (d.fallback && imgEl.src !== d.fallback) imgEl.src = d.fallback;
            };
            imgEl.src = d.src;
            imgEl.alt = d.alt;
            const count = current + 1;
            const total = data.length;
            const fmt = (n) => n.toLocaleString(isEn() ? "en-US" : "bn-BD");
            capEl.innerHTML = "";
            capEl.append(d.caption);
            const small = doc.createElement("small");
            small.textContent = fmt(count) + " / " + fmt(total);
            capEl.appendChild(small);
        };

        const open = (index, from) => {
            opener = from || null;
            setLabels();
            show(index);
            lb.classList.add("is-open");
            doc.body.style.overflow = "hidden";
            closeBtn.focus({ preventScroll: true });
        };

        const close = () => {
            lb.classList.remove("is-open");
            doc.body.style.overflow = "";
            if (opener) opener.focus({ preventScroll: true });
        };

        const isOpen = () => lb.classList.contains("is-open");

        // open from the gallery
        items.forEach((item, i) => {
            item.tabIndex = 0;
            item.setAttribute("role", "button");
            item.setAttribute("aria-label", data[i].caption || data[i].alt || "ছবি");

            const img = item.querySelector("img");
            if (img) img.addEventListener("error", () => item.classList.add("is-broken"));

            item.addEventListener("click", () => open(i, item));
            item.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open(i, item);
                }
            });
        });

        // "সব ছবি দেখুন" button (only while its link is still "#")
        const viewAll = page.querySelector(".btn-view-all");
        if (viewAll) {
            viewAll.addEventListener("click", (e) => {
                if ((viewAll.getAttribute("href") || "#") !== "#") return;
                e.preventDefault();
                open(0, viewAll);
            });
        }

        // controls
        closeBtn.addEventListener("click", close);
        prevBtn.addEventListener("click", () => show(current - 1));
        nextBtn.addEventListener("click", () => show(current + 1));
        lb.addEventListener("click", (e) => {
            if (e.target === lb) close();
        });

        // keyboard: Esc, arrows, Tab stays inside the lightbox
        doc.addEventListener("keydown", (e) => {
            if (!isOpen()) return;
            if (e.key === "Escape") close();
            else if (e.key === "ArrowLeft") show(current - 1);
            else if (e.key === "ArrowRight") show(current + 1);
            else if (e.key === "Tab") {
                const f = [closeBtn, prevBtn, nextBtn];
                const i = f.indexOf(doc.activeElement);
                e.preventDefault();
                f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
            }
        });

        // swipe on touch screens
        lb.addEventListener("touchstart", (e) => {
            touchX = e.touches[0].clientX;
        }, { passive: true });

        lb.addEventListener("touchend", (e) => {
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
        }, { passive: true });
    };

    if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
    else init();
})();