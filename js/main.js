document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) lucide.createIcons();


    // ============================================
    // HERO SLIDER
    // Auto play + Dots + Touch Swipe + Accessibility
    // ============================================

    const hero = document.querySelector(".hero-section");
    const heroImg = hero ? .querySelector(".hero-photo img");
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
    document.querySelector(".partner-next") ? .addEventListener("click", () => {
        if (track) track.scrollBy({ left: track.clientWidth * .8, behavior: "smooth" });
    });
    document.querySelector(".partner-prev") ? .addEventListener("click", () => {
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
    document.querySelector(".newsletter") ? .addEventListener("submit", event => {
        event.preventDefault();
        const input = event.currentTarget.querySelector("input");
        if (input.checkValidity()) {
            alert(document.documentElement.lang === "en" ?
                "Thank you! Your email was received (demo)." :
                "ধন্যবাদ! আপনার ইমেইলটি ডেমো হিসেবে গ্রহণ করা হয়েছে।");
            input.value = "";
        } else input.reportValidity();
    });

    // Demo video click feedback; replace with the actual video URL/modal when available.
    document.querySelectorAll(".feature-video-card,.campaign-card").forEach(card => {
        card.addEventListener("click", event => {
            event.preventDefault();
            alert(document.documentElement.lang === "en" ?
                "The video will play here once the link is added." :
                "ভিডিও লিংক যুক্ত হলে এখানে ভিডিও চালু হবে।");
        });
    });
});


// ============================================
// LANGUAGE SWITCHER  (বাংলা default  <->  English)
// ============================================
const DICT = {
    // topbar / brand
    "সদস্য যাচাই": "Verify Member",
    "QR যাচাই": "QR Verify",
    "ডাউনলোড": "Downloads",
    "সাহায্য/FAQ": "Help / FAQ",
    "SKO লোগো": "SKO logo",
    "শিক্ষক কর্মচারী ঐক্য জোট (SKO)": "Teachers & Employees Unity Alliance (SKO)",
    "কেন্দ্রীয় সংগঠন ও সমন্বিত ব্যবস্থাপনা": "Central Organization & Integrated Management",
    "মেনু খুলুন": "Open menu",

    // nav
    "হোম": "Home",
    "SKO পরিচিতি": "About SKO",
    "আমাদের সম্পর্কে": "About Us",
    "লক্ষ্য ও উদ্দেশ্য": "Aims & Objectives",
    "গঠনতন্ত্র": "Constitution",
    "সংগঠন": "Organization",
    "সহযোগী সংগঠন": "Affiliated Organizations",
    "জেলা কমিটি": "District Committees",
    "উপজেলা কমিটি": "Upazila Committees",
    "কমিটি": "Committees",
    "কেন্দ্রীয় কমিটি": "Central Committee",
    "বিভাগীয় কমিটি": "Divisional Committees",
    "সদস্য": "Members",
    "সদস্য নিবন্ধন": "Member Registration",
    "মতামত ও নোটিশ": "Notices & Views",
    "নোটিশ": "Notices",
    "মতামত": "Opinions",
    "অনুষ্ঠান": "Events",
    "আসন্ন অনুষ্ঠান": "Upcoming Events",
    "অনুষ্ঠান আর্কাইভ": "Event Archive",
    "সেবা": "Services",
    "সদস্য সেবাসমূহ": "Member Services",
    "কল্যাণ সুবিধা": "Welfare Benefits",
    "যোগাযোগ": "Contact",
    "সদস্য লগইন": "Member Login",

    // hero
    "SKO শিক্ষক কর্মচারী সমাবেশ": "SKO teachers and employees gathering",
    "শিক্ষক, কর্মচারী ও শিক্ষা প্রতিষ্ঠানসমূহের": "For teachers, employees and educational institutions,",
    "অধিকার, মর্যাদা ও কল্যাণে ঐক্যবদ্ধ প্ল্যাটফর্ম": "a united platform for rights, dignity and welfare",
    "অধিকার রক্ষা": "Protecting Rights",
    "পেশাগত উন্নয়ন": "Professional Development",
    "কল্যাণ ও সহায়তা": "Welfare & Support",
    "সদস্য নিবন্ধন করুন": "Register as Member",
    "স্লাইড নির্বাচন": "Select slide",

    // quick cards
    "অনলাইনে আবেদন": "Apply online",
    "সদস্য নম্বর দিয়ে": "By member number",
    "পরিচয়পত্র যাচাই": "Verify ID card",
    "নবায়ন": "Renewal",
    "সদস্যপদ নবায়ন": "Renew membership",
    "সনদ ও প্রত্যয়ন": "Certificates",
    "সদস্য সহায়তা": "Member Support",
    "জিজ্ঞাসা ও অভিযোগ": "Queries & complaints",

    // partners
    "সহযোগী সংগঠনসমূহ": "Affiliated Organizations",
    "সকলটা দেখুন": "View all",
    "আগের সংগঠন": "Previous organization",
    "পরের সংগঠন": "Next organization",
    "বাংলাদেশ কলেজ": "Bangladesh College",
    "বাংলাদেশ মাদ্রাসা": "Bangladesh Madrasa",
    "বাংলাদেশ কারিগরি": "Bangladesh Technical",
    "বাংলাদেশ": "Bangladesh",
    "শিক্ষক সমিতি": "Teachers' Association",
    "শিক্ষাপ্রতিষ্ঠান কর্মচারী": "Educational Institution Employees",
    "ঐক্য ফেডারেশন": "Unity Federation",
    "অধ্যক্ষ সমিতি": "Principals' Association",

    // news / events
    "SKO কেন্দ্রীয় সাধারণ সভা ২০২৬": "SKO Central General Meeting 2026",
    "ভিডিও দেখুন: কেন্দ্রীয় সাধারণ সভা ২০২৬": "Watch video: Central General Meeting 2026",
    "সাম্প্রতিক সংবাদ": "Latest News",
    "সব দেখুন": "View all",
    "কেন্দ্রীয় সাধারণ সভা": "Central general meeting",
    "শিক্ষক কল্যাণ নীতিমালা আলোচনা": "Teachers' welfare policy discussion",
    "নতুন সদস্য নিবন্ধন": "New member registration",
    "SKO-এর কেন্দ্রীয় সাধারণ সভা ২০২৬ সফলভাবে অনুষ্ঠিত": "SKO Central General Meeting 2026 held successfully",
    "শিক্ষক কল্যাণ নীতিমালা বিষয়ে আলোচনা সভা": "Discussion meeting on teachers' welfare policy",
    "নতুন সদস্য নিবন্ধন প্রক্রিয়া শুরু": "New member registration begins",
    "আসন্ন অনুষ্ঠান ও কর্মসূচি": "Upcoming Events & Programs",
    "কেন্দ্রীয় কর্মশালা": "Central Workshop",
    "শিক্ষার মান উন্নয়ন ও পেশাগত বিকাশ": "Improving education quality & professional growth",
    "জাতীয় শিক্ষক ভবন, ঢাকা": "National Teachers' Building, Dhaka",
    "বিভাগীয় সমন্বয় সভা": "Divisional Coordination Meeting",
    "ঢাকা বিভাগ": "Dhaka Division",
    "ঢাকার প্রধান ইউনিট, ঢাকা": "Dhaka Main Unit, Dhaka",
    "সব অনুষ্ঠান দেখুন": "View all events",

    // stats
    "৫,০০,০০০+": "500,000+",
    "মোট সদস্য": "Total Members",
    "উপজেলা/থানা কমিটি": "Upazila/Thana Committees",

    // services
    "প্রশিক্ষণ ও উন্নয়ন": "Training & Development",
    "চাকরি ও সুযোগ": "Jobs & Opportunities",
    "গবেষণা ও প্রকাশনা": "Research & Publications",
    "ফরম ও ডকুমেন্ট": "Forms & Documents",

    // leadership / campaign
    "কেন্দ্রীয় নেতৃত্ব": "Central Leadership",
    "সবাই দেখুন": "View all",
    "অধ্যাপক ড. মো. আব্দুল করিম": "Prof. Dr. Md. Abdul Karim",
    "চেয়ারম্যান": "Chairman",
    "মো. কামরুজ্জামান ইসলাম": "Md. Kamruzzaman Islam",
    "মহাসচিব": "Secretary General",
    "শিক্ষার মান উন্নয়ন ও শিক্ষক-সম্পদের অধিকার নিয়ে আমাদের পথচলা": "Our journey for better education and teachers' rights",
    "শিক্ষার মান উন্নয়ন ও": "Our journey for better education",
    "শিক্ষক-সম্পদের অধিকার": "and teachers' rights",
    "নিয়ে আমাদের পথচলা": "and welfare",

    // footer
    "শিক্ষক, কর্মচারী ও শিক্ষা প্রতিষ্ঠানসমূহের অধিকার, মর্যাদা, পেশাগত উন্নয়ন ও কল্যাণে ঐক্যবদ্ধ একটি প্ল্যাটফর্ম।": "A united platform for the rights, dignity, professional development and welfare of teachers, employees and educational institutions.",
    "দ্রুত লিংক": "Quick Links",
    "গুরুত্বপূর্ণ": "Important",
    "নীতিমালা": "Policies",
    "প্রেস রিলিজ": "Press Releases",
    "সেবা সমূহ": "Services",
    "কেন্দ্রীয় কার্যালয়, ঢাকা, বাংলাদেশ": "Central Office, Dhaka, Bangladesh",
    "আমাদের সঙ্গে থাকুন": "Stay Connected",
    "আপনার ইমেইল লিখুন": "Enter your email",
    "সাবস্ক্রাইব করুন": "Subscribe",
    "© ২০২৬ শিক্ষক কর্মচারী ঐক্য জোট (SKO). সর্বস্বত্ব সংরক্ষিত।": "© 2026 Teachers & Employees Unity Alliance (SKO). All rights reserved.",
    "গোপনীয়তা নীতি": "Privacy Policy",
    "শর্তাবলি": "Terms",
    "সাইটম্যাপ": "Sitemap",
    "উপরে যান": "Back to top"
};

const MONTHS = {
    "জানুয়ারি": "January",
    "ফেব্রুয়ারি": "February",
    "মার্চ": "March",
    "এপ্রিল": "April",
    "মে": "May",
    "জুন": "June",
    "জুলাই": "July",
    "আগস্ট": "August",
    "সেপ্টেম্বর": "September",
    "অক্টোবর": "October",
    "নভেম্বর": "November",
    "ডিসেম্বর": "December"
};

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const HAS_BN = /[\u0980-\u09FF]/;
const ATTRS = ["alt", "placeholder", "aria-label", "title"];
const SKIP = "script, style, noscript, .language";

const ORIG_TITLE = document.title;
const TITLE_EN = "SKO - Teachers & Employees Unity Alliance | Home";
const META_EN = [
    ['meta[name="description"]', "A united SKO platform for the rights, dignity and welfare of teachers, employees and educational institutions."],
    ['meta[property="og:title"]', "SKO - Teachers & Employees Unity Alliance"],
    ['meta[property="og:description"]', "A united SKO platform for the rights, dignity and welfare of teachers, employees and educational institutions."],
    ['meta[property="og:locale"]', "en_US"],
    ['meta[name="twitter:title"]', "SKO - Teachers & Employees Unity Alliance"],
    ['meta[name="twitter:description"]', "A united SKO platform for the rights, dignity and welfare of teachers, employees and educational institutions."]
];

const textOrig = new WeakMap();
const attrOrig = new WeakMap();
const metaOrig = new Map();
const langBtns = [...document.querySelectorAll(".lang-btn")];

// Bangla -> English (keeps leading/trailing spaces of the text node)
const toEn = (str) => {
    const m = str.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const core = m[2].replace(/\s+/g, " ");
    if (!core || !HAS_BN.test(core)) return str;

    let out = DICT[core];
    if (!out) {
        // fallback: dates & numbers (e.g. "২২ নভেম্বর ২০২৬")
        out = core
            .split(" ")
            .map((t) => MONTHS[t] || t)
            .join(" ")
            .replace(/[০-৯]/g, (d) => BN_DIGITS.indexOf(d));
        if (HAS_BN.test(out)) return str; // unknown text: keep Bangla
    }
    return m[1] + out + m[3];
};

const applyLang = (lang) => {
    const en = lang === "en";

    // 1) text nodes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) =>
            n.parentElement && !n.parentElement.closest(SKIP) ?
            NodeFilter.FILTER_ACCEPT :
            NodeFilter.FILTER_REJECT
    });
    let node;
    while ((node = walker.nextNode())) {
        if (!textOrig.has(node)) textOrig.set(node, node.nodeValue);
        const bn = textOrig.get(node);
        node.nodeValue = en ? toEn(bn) : bn;
    }

    // 2) attributes (alt, aria-label, placeholder, title)
    document.body.querySelectorAll("[alt],[placeholder],[aria-label],[title]").forEach((el) => {
        if (el.closest(".language") || el.matches(".hero-dots button")) return;
        let store = attrOrig.get(el);
        if (!store) { store = {};
            attrOrig.set(el, store); }
        ATTRS.forEach((a) => {
            if (!el.hasAttribute(a)) return;
            if (!(a in store)) store[a] = el.getAttribute(a);
            el.setAttribute(a, en ? toEn(store[a]) : store[a]);
        });
    });

    // 3) <title> + SEO meta
    document.title = en ? TITLE_EN : ORIG_TITLE;
    META_EN.forEach(([sel, val]) => {
        const el = document.querySelector(sel);
        if (!el) return;
        if (!metaOrig.has(el)) metaOrig.set(el, el.getAttribute("content"));
        el.setAttribute("content", en ? val : metaOrig.get(el));
    });

    // 4) html lang + button state
    document.documentElement.lang = en ? "en" : "bn";
    langBtns.forEach((b) => {
        const on = b.dataset.lang === lang;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    // 5) keep the slider dot labels in the right language
    if (typeof goTo === "function" && typeof current === "number") goTo(current);

    try { sessionStorage.setItem("sko-lang", lang); } catch (e) {}
};

const setLang = (lang) => {
    if (lang === document.documentElement.lang) return;
    document.body.classList.add("lang-switching");
    setTimeout(() => {
        applyLang(lang);
        document.body.classList.remove("lang-switching");
    }, 160);
};

langBtns.forEach((btn) => btn.addEventListener("click", () => setLang(btn.dataset.lang)));

// Bangla is always the default for a new visit
let savedLang = "bn";
try { savedLang = sessionStorage.getItem("sko-lang") === "en" ? "en" : "bn"; } catch (e) {}
if (savedLang === "en") applyLang("en");