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

    // ============================================
    // PARTNER AUTO SLIDER
    // Auto play + loop + arrows + dots + swipe + pause on hover/touch
    // ============================================
    (() => {
        const track = document.getElementById("partnerTrack");
        if (!track) return;

        const wrap = track.closest(".partner-wrap");
        const prevBtn = wrap.querySelector(".partner-prev");
        const nextBtn = wrap.querySelector(".partner-next");
        const pipBox = document.querySelector(".partner-section .slider-pips");
        const cards = [...track.children];
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        const DELAY = 3200;

        let index = 0;
        let timer = null;
        let pips = [];
        let scrollTimer = null;

        const perView = () => parseInt(getComputedStyle(wrap).getPropertyValue("--pv"), 10) || 1;
        const maxIndex = () => Math.max(0, cards.length - perView());
        const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth);

        const syncPips = () => {
            pips.forEach((p, i) => {
                p.classList.toggle("active", i === index);
                p.setAttribute("aria-current", i === index ? "true" : "false");
            });
        };

        const goTo = (i, smooth = true) => {
            index = Math.min(Math.max(i, 0), maxIndex());
            track.scrollTo({ left: index * step(), behavior: smooth ? "smooth" : "instant" });
            syncPips();
        };

        const stop = () => {
            clearInterval(timer);
            timer = null;
        };

        const play = () => {
            stop();
            if (reduced.matches || maxIndex() === 0) return;
            timer = setInterval(() => goTo(index >= maxIndex() ? 0 : index + 1), DELAY);
        };

        const buildPips = () => {
            if (!pipBox) return;
            pipBox.innerHTML = "";
            pips = [];
            for (let i = 0; i <= maxIndex(); i++) {
                const b = document.createElement("button");
                b.type = "button";
                b.setAttribute("aria-label", (document.documentElement.lang === "en" ? "Go to slide " : "স্লাইড ") + (i + 1));
                b.addEventListener("click", () => {
                    goTo(i);
                    play();
                });
                pipBox.appendChild(b);
                pips.push(b);
            }
            pipBox.hidden = maxIndex() === 0;
            syncPips();
        };

        // arrows (loop)
        if (nextBtn) nextBtn.addEventListener("click", () => {
            goTo(index >= maxIndex() ? 0 : index + 1);
            play();
        });
        if (prevBtn) prevBtn.addEventListener("click", () => {
            goTo(index <= 0 ? maxIndex() : index - 1);
            play();
        });

        // keep dots in sync when the user swipes by hand
        track.addEventListener("scroll", () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const i = Math.min(Math.round(track.scrollLeft / step()), maxIndex());
                if (i !== index) {
                    index = i;
                    syncPips();
                }
            }, 80);
        }, { passive: true });

        // pause on hover / touch / keyboard focus / hidden tab
        wrap.addEventListener("mouseenter", stop);
        wrap.addEventListener("mouseleave", play);
        wrap.addEventListener("touchstart", stop, { passive: true });
        wrap.addEventListener("touchend", play, { passive: true });
        wrap.addEventListener("focusin", stop);
        wrap.addEventListener("focusout", play);
        document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
        reduced.addEventListener("change", play);

        // re-calc on resize / rotate
        let rz;
        window.addEventListener("resize", () => {
            clearTimeout(rz);
            rz = setTimeout(() => {
                buildPips();
                goTo(index, false);
            }, 150);
        });

        buildPips();
        play();
    })();

    // ============================================
    // MENU: highlight the current page automatically
    // ============================================
    (() => {
        const page = location.pathname.split("/").pop() || "index.html";
        const links = document.querySelectorAll("#mainNav .nav-link[href], #mainNav .dropdown-item[href]");

        links.forEach((a) => {
            const href = a.getAttribute("href") || "";
            if (!href || href === "#") return;
            const file = href.split("#")[0].split("?")[0];
            if (file !== page) return;

            if (a.classList.contains("nav-link")) {
                a.classList.add("active");
            } else {
                const parent = a.closest(".dropdown");
                const title = parent && parent.querySelector(".nav-link");
                if (title) title.classList.add("active");
                a.classList.add("active");
            }
        });
    })();

    // ============================================
    // MOBILE / TABLET SIDEBAR (offcanvas)
    // Moves the menu to <body> below 1200px so it
    // always sits above the dim overlay and the sticky header
    // ============================================
    (() => {
        const panel = document.getElementById("mainNav");
        if (!panel || !window.bootstrap) return;

        const mq = window.matchMedia("(max-width: 1199.98px)");
        const anchor = document.createComment("mainNav-home");
        panel.parentNode.insertBefore(anchor, panel);

        // dropdowns inside the sidebar must stay in normal flow (no Popper)
        panel.querySelectorAll('[data-bs-toggle="dropdown"]').forEach((t) => {
            t.setAttribute("data-bs-display", "static");
        });

        const hide = () => {
            const inst = bootstrap.Offcanvas.getInstance(panel);
            if (inst) inst.hide();
        };

        const place = () => {
            if (mq.matches) {
                if (panel.parentNode !== document.body) document.body.appendChild(panel);
            } else if (panel.parentNode === document.body && anchor.parentNode) {
                hide();
                anchor.parentNode.insertBefore(panel, anchor.nextSibling);
            }
        };

        place();
        mq.addEventListener("change", place);

        // close after tapping a normal link (not a dropdown title)
        panel.addEventListener("click", (event) => {
            if (!mq.matches) return;
            const link = event.target.closest("a");
            if (!link || link.classList.contains("dropdown-toggle")) return;
            hide();
        });

        // swipe left to close (app feel)
        let sx = 0;
        let sy = 0;
        panel.addEventListener("touchstart", (event) => {
            sx = event.touches[0].clientX;
            sy = event.touches[0].clientY;
        }, { passive: true });
        panel.addEventListener("touchend", (event) => {
            const dx = event.changedTouches[0].clientX - sx;
            const dy = event.changedTouches[0].clientY - sy;
            if (dx < -70 && Math.abs(dy) < 60) hide();
        }, { passive: true });
    })();

    // ============================================
    // NAVBAR: DROPDOWN OPENS ON HOVER (desktop only)
    // Mobile / tablet keeps normal click behaviour
    // ============================================
    (() => {
        const desktop = window.matchMedia("(min-width: 1200px) and (hover: hover)");
        const items = document.querySelectorAll(".navbar-nav .dropdown");
        const CLOSE_DELAY = 140;

        items.forEach((item) => {
            const toggle = item.querySelector('[data-bs-toggle="dropdown"]');
            if (!toggle || !window.bootstrap) return;

            const dd = bootstrap.Dropdown.getOrCreateInstance(toggle);
            let closeTimer = null;

            item.addEventListener("mouseenter", () => {
                if (!desktop.matches) return;
                clearTimeout(closeTimer);

                // close any other open dropdown first
                items.forEach((other) => {
                    if (other === item) return;
                    const t = other.querySelector('[data-bs-toggle="dropdown"]');
                    if (t && t.classList.contains("show")) bootstrap.Dropdown.getOrCreateInstance(t).hide();
                });

                dd.show();
            });

            item.addEventListener("mouseleave", () => {
                if (!desktop.matches) return;
                clearTimeout(closeTimer);
                closeTimer = setTimeout(() => dd.hide(), CLOSE_DELAY);
            });

            // on desktop, clicking the title should not toggle it closed after hover opened it
            toggle.addEventListener("click", (event) => {
                if (!desktop.matches) return;
                if (toggle.getAttribute("href") === "#") event.preventDefault();
                event.stopPropagation();
                dd.show();
            });
        });
    })();

    // ============================================
    // PREMIUM MOTION (light)
    // Scroll reveal + stats counter + progress bar + header shadow
    // ============================================
    (() => {
        const root = document.documentElement;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const hasIO = "IntersectionObserver" in window;

        // ---------- 1) scroll reveal (stagger) ----------
        const groups = [
            ".quick-card", ".section-heading", ".partner-wrap", ".service-card",
            ".content-panel", ".feature-video-card", ".campaign-card",
            ".stats-section .stat-item", ".site-footer .row > div"
        ];
        const targets = [];
        groups.forEach((sel) => {
            document.querySelectorAll(sel).forEach((el, i) => {
                el.style.setProperty("--d", (i % 6) * 70 + "ms");
                targets.push(el);
            });
        });

        const clean = (el) => {
            el.classList.remove("rv", "in", "rv-load");
            el.style.removeProperty("--d");
        };

        if (hasIO && !reduce) {
            const vh = window.innerHeight;
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    io.unobserve(el);
                    el.classList.add("in");
                    setTimeout(() => clean(el), 1200);
                });
            }, { threshold: 0.08 });

            targets.forEach((el) => {
                if (el.getBoundingClientRect().top < vh) {
                    // already on screen: play a short entrance once
                    el.classList.add("rv-load");
                    el.addEventListener("animationend", (ev) => {
                        if (ev.target === el) clean(el);
                    }, { once: true });
                } else {
                    el.classList.add("rv");
                    io.observe(el);
                }
            });
        } else {
            targets.forEach((el) => el.style.removeProperty("--d"));
        }

        // ---------- 2) stats counter ----------
        const counters = document.querySelectorAll(".counter");
        if (hasIO && !reduce && counters.length) {
            const fmt = (n) => n.toLocaleString(root.lang === "en" ? "en-US" : "bn-BD");
            const co = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    co.unobserve(el);

                    const target = parseInt(el.dataset.target, 10);
                    if (!target) return;

                    const original = el.textContent;
                    const plus = original.indexOf("+") > -1 ? "+" : "";
                    const t0 = performance.now();
                    const dur = 1600;
                    el.style.minWidth = el.offsetWidth + "px";

                    const tick = (now) => {
                        const p = Math.min((now - t0) / dur, 1);
                        const eased = 1 - Math.pow(1 - p, 3);
                        if (p < 1) {
                            el.textContent = fmt(Math.round(target * eased)) + plus;
                            requestAnimationFrame(tick);
                        } else {
                            el.textContent = original; // restore (keeps translation working)
                            el.style.minWidth = "";
                        }
                    };
                    requestAnimationFrame(tick);
                });
            }, { threshold: 0.4 });
            counters.forEach((c) => co.observe(c));
        }

        // ---------- 3) scroll progress bar + header shadow ----------
        const bar = document.createElement("div");
        bar.className = "scroll-progress";
        bar.setAttribute("aria-hidden", "true");
        document.body.appendChild(bar);

        const header = document.querySelector(".site-header");
        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const max = root.scrollHeight - window.innerHeight;
                const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
                bar.style.transform = "scaleX(" + ratio + ")";
                if (header) header.classList.toggle("is-stuck", window.scrollY > 8);
                ticking = false;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    })();

    // Back to top (null-safe)
    const topButton = document.getElementById("backToTop");
    if (topButton) {
        window.addEventListener("scroll", () => {
            topButton.classList.toggle("show", window.scrollY > 450);
        }, { passive: true });

        topButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

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
        if (player) {
            if (typeof player._cleanup === "function") player._cleanup();
            player.remove(); // removing iframe stops the video
        }
        card.classList.remove("is-playing");
        if (activeVideoCard === card) activeVideoCard = null;
    };

    // ---- YouTube IFrame API loader (loads once) ----
    let ytApiPromise = null;
    const loadYouTubeApi = () => {
        if (ytApiPromise) return ytApiPromise;
        ytApiPromise = new Promise((resolve, reject) => {
            if (window.YT && window.YT.Player) return resolve(window.YT);
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (typeof prev === "function") prev();
                resolve(window.YT);
            };
            const s = document.createElement("script");
            s.src = "https://www.youtube.com/iframe_api";
            s.async = true;
            s.onerror = () => reject(new Error("YT API failed"));
            document.head.appendChild(s);
        });
        return ytApiPromise;
    };

    const fmtTime = (sec) => {
        sec = Math.max(0, Math.floor(sec || 0));
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        const mm = h ? String(m).padStart(2, "0") : String(m);
        return (h ? h + ":" : "") + mm + ":" + String(s).padStart(2, "0");
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
            '<div class="cp-stage"><div class="cp-yt"></div></div>' +
            '<div class="cp-shield"></div>' +
            '<span class="inline-player__spinner" aria-hidden="true"></span>' +
            '<button type="button" class="inline-player__close" aria-label="' + (isEn ? "Close video" : "ভিডিও বন্ধ করুন") + '"><i class="fa-solid fa-xmark"></i></button>' +
            '<button type="button" class="cp-center" aria-label="' + (isEn ? "Play / Pause" : "চালু / বিরতি") + '"><i class="fa-solid fa-pause"></i></button>' +
            '<div class="cp-controls">' +
            '<div class="cp-progress" role="slider" tabindex="0" aria-label="' + (isEn ? "Seek" : "সময় নির্বাচন") + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
            '<div class="cp-buffer"></div><div class="cp-fill"></div><div class="cp-knob"></div></div>' +
            '<div class="cp-row">' +
            '<button type="button" class="cp-btn cp-toggle" aria-label="' + (isEn ? "Play / Pause" : "চালু / বিরতি") + '"><i class="fa-solid fa-pause"></i></button>' +
            '<button type="button" class="cp-btn cp-mute" aria-label="' + (isEn ? "Mute" : "মিউট") + '"><i class="fa-solid fa-volume-high"></i></button>' +
            '<span class="cp-time"><b class="cp-cur">0:00</b> / <span class="cp-dur">0:00</span></span>' +
            '<span class="cp-spacer"></span>' +
            '<button type="button" class="cp-btn cp-full" aria-label="' + (isEn ? "Fullscreen" : "ফুলস্ক্রিন") + '"><i class="fa-solid fa-expand"></i></button>' +
            '</div></div>';

        card.appendChild(player);
        card.classList.add("is-playing");
        activeVideoCard = card;

        const $ = (sel) => player.querySelector(sel);
        const mount = $(".cp-yt");
        const centerBtn = $(".cp-center");
        const toggleBtn = $(".cp-toggle");
        const muteBtn = $(".cp-mute");
        const fullBtn = $(".cp-full");
        const bar = $(".cp-progress");
        const fill = $(".cp-fill");
        const buffer = $(".cp-buffer");
        const knob = $(".cp-knob");
        const curEl = $(".cp-cur");
        const durEl = $(".cp-dur");
        const shield = $(".cp-shield");

        let yt = null;
        let tick = null;
        let hideTimer = null;
        let dragging = false;

        const setPlayIcons = (playing) => {
            const cls = playing ? "fa-pause" : "fa-play";
            centerBtn.innerHTML = '<i class="fa-solid ' + cls + '"></i>';
            toggleBtn.innerHTML = '<i class="fa-solid ' + cls + '"></i>';
            player.classList.toggle("is-paused", !playing);
        };

        const showUi = () => {
            player.classList.add("show-ui");
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                if (yt && yt.getPlayerState && yt.getPlayerState() === 1 && !dragging) {
                    player.classList.remove("show-ui");
                }
            }, 2500);
        };

        const update = () => {
            if (!yt || !yt.getDuration) return;
            const d = yt.getDuration() || 0;
            const t = yt.getCurrentTime() || 0;
            const pct = d ? (t / d) * 100 : 0;
            if (!dragging) {
                fill.style.width = pct + "%";
                knob.style.left = pct + "%";
                curEl.textContent = fmtTime(t);
            }
            durEl.textContent = fmtTime(d);
            buffer.style.width = ((yt.getVideoLoadedFraction ? yt.getVideoLoadedFraction() : 0) * 100) + "%";
            bar.setAttribute("aria-valuenow", Math.round(pct));
        };

        const togglePlay = () => {
            if (!yt || !yt.getPlayerState) return;
            const st = yt.getPlayerState();
            if (st === 1) yt.pauseVideo();
            else yt.playVideo();
            showUi();
        };

        const seekFromEvent = (e) => {
            const rect = bar.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const ratio = Math.min(1, Math.max(0, x / rect.width));
            const d = yt.getDuration() || 0;
            fill.style.width = ratio * 100 + "%";
            knob.style.left = ratio * 100 + "%";
            curEl.textContent = fmtTime(ratio * d);
            return ratio * d;
        };

        // controls
        shield.addEventListener("click", (e) => {
            e.stopPropagation();
            togglePlay();
        });
        centerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            togglePlay();
        });
        toggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            togglePlay();
        });

        muteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!yt) return;
            if (yt.isMuted()) {
                yt.unMute();
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            } else {
                yt.mute();
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            }
            showUi();
        });

        fullBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const el = player;
            const isFs = document.fullscreenElement || document.webkitFullscreenElement;
            if (isFs) {
                (document.exitFullscreen || document.webkitExitFullscreen).call(document);
            } else if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            }
            showUi();
        });

        // seek (mouse + touch)
        const startDrag = (e) => {
            if (!yt) return;
            e.stopPropagation();
            dragging = true;
            player.classList.add("show-ui");
            seekFromEvent(e);
            const move = (ev) => seekFromEvent(ev);
            const end = (ev) => {
                const t = seekFromEvent(ev.changedTouches ? { touches: ev.changedTouches } : ev);
                yt.seekTo(t, true);
                dragging = false;
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", end);
                document.removeEventListener("touchmove", move);
                document.removeEventListener("touchend", end);
                showUi();
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", end);
            document.addEventListener("touchmove", move, { passive: true });
            document.addEventListener("touchend", end);
        };
        bar.addEventListener("mousedown", startDrag);
        bar.addEventListener("touchstart", startDrag, { passive: true });

        bar.addEventListener("keydown", (e) => {
            if (!yt) return;
            if (e.key === "ArrowRight") {
                yt.seekTo(yt.getCurrentTime() + 5, true);
                e.preventDefault();
            }
            if (e.key === "ArrowLeft") {
                yt.seekTo(yt.getCurrentTime() - 5, true);
                e.preventDefault();
            }
        });

        player.addEventListener("mousemove", showUi);
        player.addEventListener("touchstart", showUi, { passive: true });

        // cleanup hook used by stopVideo
        player._cleanup = () => {
            clearInterval(tick);
            clearTimeout(hideTimer);
            try { if (yt && yt.destroy) yt.destroy(); } catch (err) {}
            const isFs = document.fullscreenElement || document.webkitFullscreenElement;
            if (isFs) {
                try {
                    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
                } catch (err) {}
            }
        };

        // build the hidden YouTube player
        loadYouTubeApi().then((YT) => {
            if (!player.isConnected) return; // closed before API loaded
            yt = new YT.Player(mount, {
                videoId: id,
                host: "https://www.youtube-nocookie.com",
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    fs: 0,
                    disablekb: 1,
                    iv_load_policy: 3,
                    cc_load_policy: 0,
                    origin: location.origin
                },
                events: {
                    onReady: (ev) => {
                        player.classList.remove("is-loading");
                        ev.target.playVideo();
                        update();
                        tick = setInterval(update, 250);
                        showUi();
                    },
                    onStateChange: (ev) => {
                        const st = ev.data;
                        setPlayIcons(st === 1 || st === 3);
                        if (st === 1) showUi();
                        if (st === 2 || st === 0) {
                            clearTimeout(hideTimer);
                            player.classList.add("show-ui");
                        }
                        if (st === 0) { // ended
                            ev.target.seekTo(0, true);
                            ev.target.pauseVideo();
                        }
                    },
                    onError: () => {
                        // fallback: open on YouTube in new tab
                        stopVideo(card);
                        window.open(card.getAttribute("href"), "_blank", "noopener");
                    }
                }
            });
        }).catch(() => {
            stopVideo(card);
            window.open(card.getAttribute("href"), "_blank", "noopener");
        });
    };

    videoCards.forEach((card) => {
        card.addEventListener("click", (event) => {
            event.preventDefault();

            if (event.target.closest(".inline-player__close")) {
                stopVideo(card);
                return;
            }
            if (card.classList.contains("is-playing")) return; // player-er bhitorer click ignore

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

// ============================================
// MOBILE BOTTOM NAVIGATION
// Home default + active menu gets the raised design + moving notch
// ============================================
(() => {
    const nav = document.getElementById("bottomNav");
    if (!nav) return;

    const items = [...nav.querySelectorAll(".bn-item")];
    const homeItem = nav.querySelector('[data-nav="home"]') || items[0];

    // move the white notch under the given item
    const moveNotch = (item) => {
        if (!item) return;
        const navBox = nav.getBoundingClientRect();
        const itemBox = item.getBoundingClientRect();
        if (!navBox.width) return; // hidden (desktop)
        const x = itemBox.left - navBox.left + itemBox.width / 2;
        nav.style.setProperty("--bn-x", x + "px");
    };

    const getActive = () => items.find((i) => i.classList.contains("active")) || homeItem;

    const setActive = (target) => {
        items.forEach((item) => {
            const on = item === target;
            item.classList.toggle("active", on);
            if (on) item.setAttribute("aria-current", "page");
            else item.removeAttribute("aria-current");
        });
        moveNotch(target);
    };

    // If real page links are added later, highlight the current page automatically
    const currentPage = location.pathname.split("/").pop() || "index.html";
    const matched = items.find((item) => {
        const href = item.getAttribute("href") || "";
        return href && href !== "#" && href.split("#")[0].split("/").pop() === currentPage;
    });

    // default = Home (or the matching page)
    setActive(matched || homeItem);

    items.forEach((item) => {
        item.addEventListener("click", (event) => {
            const href = item.getAttribute("href");

            // placeholder links: stay on the page
            if (!href || href === "#") event.preventDefault();

            // Home on the home page: just scroll up, do not reload
            if (item.dataset.nav === "home" && (currentPage === "index.html" || currentPage === "")) {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }

            if (item !== getActive() && navigator.vibrate) navigator.vibrate(8);
            setActive(item);
        });
    });

    // keep the notch exactly under the active item on resize / rotate / font load
    const realign = () => moveNotch(getActive());
    window.addEventListener("resize", realign);
    window.addEventListener("orientationchange", realign);
    window.addEventListener("load", realign);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(realign);

    // Hide the bar while typing (newsletter email field), so the keyboard never overlaps it
    const isField = (el) => el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);

    document.addEventListener("focusin", (event) => {
        if (isField(event.target)) nav.classList.add("bn-hide");
    });

    document.addEventListener("focusout", (event) => {
        if (isField(event.target)) {
            setTimeout(() => {
                if (!isField(document.activeElement)) nav.classList.remove("bn-hide");
            }, 120);
        }
    });
})();