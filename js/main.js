document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) lucide.createIcons();


    // ============================================
    // HERO SLIDER
    // Auto play + Dots + Touch Swipe + Accessibility
    // ============================================

    const hero = document.querySelector(".hero-section");
    const heroImg = hero ? hero.querySelector(".hero-photo img") : null;
    const dots = [...document.querySelectorAll(".hero-dots button")];

    const slides = [
        { position: "85% 45%", zoom: 1 },
        { position: "85% 30%", zoom: 1.06 },
        { position: "85% 62%", zoom: 1.10 }
    ];

    let current = 0;
    let timer = null;
    let startX = 0;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // Change active slide
    const goTo = (index) => {
        if (!heroImg || !slides.length) return;

        current = (index + slides.length) % slides.length;

        dots.forEach((dot, i) => {
            const active = i === current;

            dot.classList.toggle("active", active);
            dot.setAttribute("aria-current", active ? "true" : "false");
            dot.setAttribute(
                "aria-label",
                document.documentElement.lang === "en" ?
                `Select slide ${i + 1}` :
                `স্লাইড ${i + 1} নির্বাচন করুন`
            );
        });

        heroImg.style.objectPosition = slides[current].position;
        heroImg.style.transform = `scale(${slides[current].zoom})`;
    };

    // Stop autoplay
    const stop = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    // Start autoplay
    const play = () => {
        stop();

        if (reducedMotion.matches || !hero || slides.length < 2) {
            return;
        }

        timer = setInterval(() => {
            goTo(current + 1);
        }, 5000);
    };

    // Initialize slider
    if (hero && heroImg && dots.length) {

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                goTo(index);
                play();
            });
        });

        // Pause on mouse hover
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", play);

        // Pause on keyboard interaction
        hero.addEventListener("focusin", stop);
        hero.addEventListener("focusout", (event) => {
            if (!hero.contains(event.relatedTarget)) {
                play();
            }
        });

        // Mobile swipe start
        hero.addEventListener("touchstart", (event) => {
            startX = event.touches[0].clientX;
        }, { passive: true });

        // Mobile swipe end
        hero.addEventListener("touchend", (event) => {
            const endX = event.changedTouches[0].clientX;
            const difference = endX - startX;

            if (Math.abs(difference) > 50) {
                goTo(current + (difference < 0 ? 1 : -1));
                play();
            }
        }, { passive: true });

        // Stop autoplay when tab is hidden
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stop();
            } else {
                play();
            }
        });

        // Respect reduced motion preference
        reducedMotion.addEventListener("change", () => {
            if (reducedMotion.matches) {
                stop();
            } else {
                play();
            }
        });

        // Initial slide
        goTo(0);
        play();
    }

    // Partner card horizontal movement on smaller screens.
    const track = document.getElementById("partnerTrack");
    const partnerNext = document.querySelector(".partner-next");
    if (partnerNext) partnerNext.addEventListener("click", () => {
        if (track) track.scrollBy({ left: track.clientWidth * .8, behavior: "smooth" });
    });
    const partnerPrev = document.querySelector(".partner-prev");
    if (partnerPrev) partnerPrev.addEventListener("click", () => {
        if (track) track.scrollBy({ left: -track.clientWidth * .8, behavior: "smooth" });
    });

    // Reveal-on-scroll animation.
    const animated = document.querySelectorAll(".quick-card,.partner-card,.service-card,.content-panel,.feature-video-card,.campaign-card");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        }), { threshold: .08 });
        animated.forEach(el => observer.observe(el));
    }

    // Back to top.
    const topButton = document.getElementById("backToTop");
    window.addEventListener("scroll", () => topButton.classList.toggle("show", window.scrollY > 450), { passive: true });
    topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    // Newsletter demo validation. Connect this form to a backend endpoint later.
    const newsletterForm = document.querySelector(".newsletter");
    if (newsletterForm) newsletterForm.addEventListener("submit", event => {
        event.preventDefault();
        const input = event.currentTarget.querySelector("input");
        if (input.checkValidity()) {
            alert(document.documentElement.lang === "en" ?
                "Thank you! Your email was received (demo)." :
                "ধন্যবাদ! আপনার ইমেইলটি ডেমো হিসেবে গ্রহণ করা হয়েছে।");
            input.value = "";
        } else input.reportValidity();
    });

    // ============================================
    // INLINE VIDEO PLAYER (plays inside the same card)
    // ============================================
    const videoCards = document.querySelectorAll(".feature-video-card,.campaign-card");
    let activeVideoCard = null;

    const getYouTubeId = (url) => {
        try {
            const u = new URL(url, location.href);
            if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
            if (u.searchParams.get("v")) return u.searchParams.get("v");
            const m = u.pathname.match(/\/(embed|shorts)\/([\w-]{11})/);
            return m ? m[2] : "";
        } catch (e) {
            return "";
        }
    };

    const stopVideo = (card) => {
        if (!card) return;
        const player = card.querySelector(".inline-player");
        if (player) player.remove(); // removing iframe stops the video
        card.classList.remove("is-playing");
        if (activeVideoCard === card) activeVideoCard = null;
    };

    const playVideo = (card) => {
        const id = getYouTubeId(card.getAttribute("href"));
        if (!id) return;

        // only one video at a time
        if (activeVideoCard && activeVideoCard !== card) stopVideo(activeVideoCard);

        const isEn = document.documentElement.lang === "en";
        const img = card.querySelector("img");
        const title = img ? img.alt : "Video";

        const player = document.createElement("div");
        player.className = "inline-player is-loading notranslate";
        player.setAttribute("translate", "no");
        player.innerHTML =
            '<span class="inline-player__spinner" aria-hidden="true"></span>' +
            '<button type="button" class="inline-player__close" aria-label="' +
            (isEn ? "Close video" : "ভিডিও বন্ধ করুন") +
            '"><i class="fa-solid fa-xmark"></i></button>';

        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
        iframe.title = title;
        iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        iframe.allowFullscreen = true;
        iframe.addEventListener("load", () => player.classList.remove("is-loading"));
        player.appendChild(iframe);

        card.appendChild(player);
        card.classList.add("is-playing");
        activeVideoCard = card;
    };

    videoCards.forEach((card) => {
        card.addEventListener("click", (event) => {
            event.preventDefault();

            if (event.target.closest(".inline-player__close")) {
                stopVideo(card);
                return;
            }
            if (card.classList.contains("is-playing")) return;

            playVideo(card);
        });
    });

    // ESC key closes the playing video
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") stopVideo(activeVideoCard);
    });

    // Auto stop when the card scrolls out of the screen
    if ("IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting && entry.target === activeVideoCard) {
                    stopVideo(entry.target);
                }
            });
        }, { threshold: 0.2 });
        videoCards.forEach((card) => videoObserver.observe(card));
    }
});



// ============================================
// LANGUAGE SWITCHER — Bangla default <-> English (Google Translate)
// ============================================
(() => {
    const langBox = document.querySelector(".language");
    const langBtns = [...document.querySelectorAll(".lang-btn")];
    let scriptRequested = false;

    // ---- cookie helpers -------------------------------------------------
    const getCookie = (name) => {
        const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
        return m ? decodeURIComponent(m[1]) : "";
    };

    const rootHost = () => location.hostname.replace(/^www\./, "");

    const setCookie = (value) => {
        document.cookie = `googtrans=${value};path=/`;
        const root = rootHost();
        if (root.includes(".")) {
            document.cookie = `googtrans=${value};path=/;domain=${location.hostname}`;
            document.cookie = `googtrans=${value};path=/;domain=.${root}`;
        }
    };

    const clearCookie = () => {
        const past = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
        const host = location.hostname;
        const root = rootHost();
        document.cookie = `googtrans=;path=/;${past}`;
        document.cookie = `googtrans=;path=/;domain=${host};${past}`;
        document.cookie = `googtrans=;path=/;domain=.${host};${past}`;
        document.cookie = `googtrans=;path=/;domain=${root};${past}`;
        document.cookie = `googtrans=;path=/;domain=.${root};${past}`;
    };

    const isEnglishCookie = () => /^\/[^\/]*\/en$/.test(getCookie("googtrans"));

    // source of truth: sessionStorage (cookie is only a fallback)
    const getLang = () => {
        try {
            return sessionStorage.getItem("sko-lang") === "en" ? "en" : "bn";
        } catch (e) {
            return isEnglishCookie() ? "en" : "bn";
        }
    };

    const saveLang = (lang) => {
        try { sessionStorage.setItem("sko-lang", lang); } catch (e) {}
    };

    // ---- UI state -------------------------------------------------------
    const setActive = (lang) => {
        langBtns.forEach((b) => {
            const on = b.dataset.lang === lang;
            b.classList.toggle("active", on);
            b.setAttribute("aria-pressed", on ? "true" : "false");
        });
    };

    const setLoading = (on) => {
        if (langBox) langBox.classList.toggle("is-loading", on);
    };

    // ---- Google Translate loader ---------------------------------------
    window.googleTranslateElementInit = () => {
        new google.translate.TranslateElement({ pageLanguage: "bn", includedLanguages: "en,bn", autoDisplay: false },
            "google_translate_element"
        );
    };

    const loadGoogle = () => {
        if (scriptRequested) return;
        scriptRequested = true;
        const s = document.createElement("script");
        s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        s.async = true;
        s.onerror = () => {
            setLoading(false);
            setActive("bn");
            clearCookie();
        };
        document.head.appendChild(s);
    };

    // wait until Google's hidden <select> exists, then switch language live
    const waitForCombo = (tries = 0) => {
        const combo = document.querySelector("select.goog-te-combo");
        if (combo && combo.querySelector('option[value="en"]')) {
            combo.value = "en";
            combo.dispatchEvent(new Event("change"));
            setActive("en");
            setLoading(false);
            return;
        }
        if (tries > 40) { location.reload(); return; } // fallback: cookie is set, reload translates
        setTimeout(() => waitForCombo(tries + 1), 150);
    };

    // ---- actions --------------------------------------------------------
    const toEnglish = () => {
        setLoading(true);
        saveLang("en");
        setCookie("/bn/en");
        setActive("en");
        loadGoogle();
        waitForCombo();
    };

    const toBangla = () => {
        setLoading(true);
        saveLang("bn");
        clearCookie();
        setActive("bn");
        location.reload(); // reload = guaranteed clean original Bangla
    };

    langBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            if (lang === getLang()) return;
            lang === "en" ? toEnglish() : toBangla();
        })
    );

    // ---- initial state: Bangla unless English was chosen this session ----
    if (getLang() === "en") {
        setActive("en");
        setCookie("/bn/en");
        loadGoogle(); // Google translates automatically on load
    } else {
        setActive("bn");
        clearCookie(); // remove any stale cookie; translator is NOT loaded
    }
})();