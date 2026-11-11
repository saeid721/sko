document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  
  // ============================================
  // HERO SLIDER
  // Auto play + Dots + Touch Swipe + Accessibility
  // ============================================

  const hero = document.querySelector(".hero-section");
  const heroImg = hero?.querySelector(".hero-photo img");
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


  const play = () => {
    clearInterval(timer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(() => goTo((current + 1) % slides.length), 5000);
  };

  dots.forEach((dot, index) => dot.addEventListener("click", () => { goTo(index); play(); }));
  hero.addEventListener("mouseenter", () => clearInterval(timer));
  hero.addEventListener("mouseleave", play);
  play();

  // Partner card horizontal movement on smaller screens.
  const track = document.getElementById("partnerTrack");
  document.querySelector(".partner-next")?.addEventListener("click", () => {
    if (track) track.scrollBy({left: track.clientWidth * .8, behavior:"smooth"});
  });
  document.querySelector(".partner-prev")?.addEventListener("click", () => {
    if (track) track.scrollBy({left: -track.clientWidth * .8, behavior:"smooth"});
  });

  // Reveal-on-scroll animation.
  const animated = document.querySelectorAll(".quick-card,.partner-card,.service-card,.content-panel,.feature-video-card,.campaign-card");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), {threshold:.08});
    animated.forEach(el => observer.observe(el));
  }

  // Back to top.
  const topButton = document.getElementById("backToTop");
  window.addEventListener("scroll", () => topButton.classList.toggle("show", window.scrollY > 450), {passive:true});
  topButton.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

  // Newsletter demo validation. Connect this form to a backend endpoint later.
  document.querySelector(".newsletter")?.addEventListener("submit", event => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    if (input.checkValidity()) {
      alert("ধন্যবাদ! আপনার ইমেইলটি ডেমো হিসেবে গ্রহণ করা হয়েছে।");
      input.value = "";
    } else input.reportValidity();
  });

  // Demo video click feedback; replace with the actual video URL/modal when available.
  document.querySelectorAll(".feature-video-card,.campaign-card").forEach(card => {
    card.addEventListener("click", event => {
      event.preventDefault();
      alert("ভিডিও লিংক যুক্ত হলে এখানে ভিডিও চালু হবে।");
    });
  });
});
