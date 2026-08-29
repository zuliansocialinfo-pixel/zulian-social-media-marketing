/* ═══════════════════════════════════════════════════════
   ZULIAN SOCIAL MEDIA MARKETING — MAIN JAVASCRIPT
   GSAP animations, Lenis smooth scroll, interactions
   Inspired by Ryder & Davis architecture
   ═══════════════════════════════════════════════════════ */

// ── Utility Functions ──
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isIPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
const isIOS = isSafari || /iP(hone|od|ad)/.test(navigator.userAgent);
const isMobileDevice = /Android|iPhone|iPod/i.test(navigator.userAgent);

const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
const isTablet = () => window.matchMedia("(max-width: 992px)").matches;

const isFirstVisit = () => !sessionStorage.getItem("hasVisited");
const markVisit = () => sessionStorage.setItem("hasVisited", "true");

function preventScroll(event) {
  if (event.touches.length > 1) return;
  event.preventDefault();
}

function disableScroll() {
  if (window.lenis) window.lenis.stop();
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  document.addEventListener("touchmove", preventScroll, { passive: false });
}

function enableScroll() {
  if (window.lenis) window.lenis.start();
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  document.removeEventListener("touchmove", preventScroll);
}

function scrollToTop(immediate = true) {
  if (window.lenis) {
    window.lenis.scrollTo(0, { immediate });
  } else {
    window.scrollTo({ top: 0 });
  }
}

// ── Register GSAP Plugins ──
gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("base", "0.36, 0, 0.1, 1");

// ═══════════════════════════════════════
// ── LENIS SMOOTH SCROLL ──
// ═══════════════════════════════════════
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  window.lenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// ═══════════════════════════════════════
// ── LOADER ANIMATION ──
// ═══════════════════════════════════════
function initLoader() {
  const hasVisited = !isFirstVisit();

  // Show body
  document.body.style.visibility = "visible";

  if (hasVisited) {
    gsap.to(".loader", {
      opacity: 0,
      ease: CustomEase.create("base", "0.36, 0, 0.1, 1"),
      duration: 0.3,
      onComplete: () => {
        document.querySelector(".loader").style.display = "none";
        initPageAnimations();
      },
    });
    return;
  }

  // First visit - full loader animation
  setTimeout(() => {
    markVisit();
  }, 8000);

  setTimeout(() => {
    scrollToTop(true);
    disableScroll();
  }, 100);

  gsap.set(".loader", { opacity: 1 });
  gsap.set(".loader-counter", { opacity: 1, ease: "power2.out", duration: 0.3 });

  const counter1 = document.querySelector(".counter-1");
  const counter2 = document.querySelector(".counter-2");
  const counter3 = document.querySelector(".counter-3");

  // Extend counter3
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 10; j++) {
      const div = document.createElement("div");
      div.className = "num";
      div.textContent = j;
      counter3.appendChild(div);
    }
  }

  const finalDiv = document.createElement("div");
  finalDiv.className = "num";
  finalDiv.textContent = "0";
  counter3.appendChild(finalDiv);

  const animate = (counter, duration, delay = 0) => {
    const numHeight = counter.querySelector(".num").clientHeight;
    const totalDistance = (counter.querySelectorAll(".num").length - 1) * numHeight;

    gsap.to(counter, {
      y: -totalDistance,
      duration: duration,
      delay: delay,
      ease: "power2.inOut",
    });
  };

  // Counters (~4.5s)
  animate(counter3, 4.5);
  animate(counter2, 4.5);
  animate(counter1, 2, 2.5);

  // Digits exit (~4.5s to 5.4s)
  gsap.to(".digit", {
    top: "-50px",
    stagger: { amount: 0.25 },
    delay: 4.5,
    duration: 0.9,
    ease: "power4.inOut",
  });

  // Fade-out loader (~7s to 7.8s)
  gsap.to(".loader", {
    opacity: 0,
    ease: CustomEase.create("base", "0.36, 0, 0.1, 1"),
    duration: 0.8,
    delay: 7,
    onComplete: () => {
      enableScroll();
      document.querySelector(".loader").style.display = "none";
      initPageAnimations();
    },
  });
}

// ═══════════════════════════════════════
// ── NAVIGATION ──
// ═══════════════════════════════════════
let isNavigationOpen = false;
let navigationTL = null;

function initNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const navContent = document.getElementById("nav-content");
  const navigation = document.getElementById("navigation");
  const links = document.querySelectorAll(".navigation-link");

  // Build navigation timeline
  navigationTL = gsap.timeline({ paused: true });

  navigationTL.set(navContent, { pointerEvents: "none" });

  navigationTL.to(navContent, {
    clipPath: "inset(0% 0 0% 0)",
    duration: 1,
    ease: "power4.out",
  });

  navigationTL.set(navContent, { pointerEvents: "auto" }, "<");

  links.forEach((link, i) => {
    const wrapper = link.querySelector(".navigation-link-wrapper");
    const line = link.querySelector(".navigation-link-line");

    const tl = gsap.timeline();

    tl.fromTo(
      wrapper,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    if (line) {
      tl.fromTo(
        line,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.5, ease: "power2.out" }
      );
    }

    navigationTL.add(tl, i * 0.1 + 0.5);
  });

  // Toggle handler
  navToggle.addEventListener("click", () => {
    if (!isNavigationOpen) {
      navigationTL.timeScale(1).play();
      disableScroll();
      navigation.classList.add("nav-open");
    } else {
      navigationTL.timeScale(2).reverse();
      enableScroll();
      setTimeout(() => {
        navigation.classList.remove("nav-open");
      }, 800);
    }
    isNavigationOpen = !isNavigationOpen;
  });

  // Close navigation on link click
  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (isNavigationOpen) {
        navigationTL.timeScale(2).reverse();
        enableScroll();
        setTimeout(() => {
          navigation.classList.remove("nav-open");
        }, 800);
        isNavigationOpen = false;
      }
    });
  });

  // Hover effect on navigation links
  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const dot = link.querySelector(".navigation-link-dot");
      const wrapper = link.querySelector(".navigation-link-wrapper");

      gsap.to(wrapper, { paddingLeft: isMobile() ? "1.5rem" : "2.5rem", duration: 0.2, ease: "sine.inOut" });
      gsap.to(dot, { opacity: 1, duration: 0.2, ease: "sine.inOut" });

      links.forEach((other) => {
        const title = other.querySelector(".navigation-link-title");
        gsap.to(title, { opacity: other === link ? 1 : 0.3, duration: 0.2 });
      });
    });

    link.addEventListener("mouseleave", () => {
      const dot = link.querySelector(".navigation-link-dot");
      const wrapper = link.querySelector(".navigation-link-wrapper");

      gsap.to(wrapper, { paddingLeft: "0.625rem", duration: 0.2, ease: "sine.inOut" });
      gsap.to(dot, { opacity: 0, duration: 0.2, ease: "sine.inOut" });

      links.forEach((other) => {
        const title = other.querySelector(".navigation-link-title");
        gsap.to(title, { opacity: 1, duration: 0.2 });
      });
    });
  });

  // Navigation background on scroll
  ScrollTrigger.create({
    trigger: document.body,
    start: "80px top",
    end: "bottom bottom",
    onEnter: () => {
      gsap.to(navigation, { backgroundColor: "rgba(10, 10, 15, 0.85)", backdropFilter: "blur(20px)", duration: 0.3 });
    },
    onLeaveBack: () => {
      gsap.to(navigation, { backgroundColor: "transparent", backdropFilter: "none", duration: 0.3 });
    },
  });
}

// ═══════════════════════════════════════
// ── ANIMATION PRESETS (Skew, Split, Fade) ──
// ═══════════════════════════════════════

const skewBaseAnimation = (el) => {
  if (!el) return;

  const y = el.dataset.skewY || "100%";
  const start = el.dataset.skewStart || "top 85%";
  const skewX = isIOS ? 0 : parseFloat(el.dataset.skewSkewX || -6);
  const delay = parseFloat(el.dataset.skewDelay || 0);
  const duration = parseFloat(el.dataset.skewDuration || 1);
  const stagger = parseFloat(el.dataset.skewStagger || 0.03);

  const split = new SplitType(el, { types: "lines, words" });

  el.style.display = "flex";
  el.style.flexDirection = "column";

  split.lines.forEach((line) => {
    line.style.overflow = "hidden";
  });

  gsap.from(split.words, {
    y,
    skewX,
    duration,
    delay,
    stagger,
    ease: "expo.out",
    scrollTrigger: {
      trigger: el,
      start: start,
      end: start,
      toggleActions: "play none none none",
    },
  });
};

const fadeBaseAnimation = (el) => {
  if (!el) return;
  const y = el.dataset.fadeY || 40;
  const duration = parseFloat(el.dataset.fadeDuration || 0.6);
  const delay = parseFloat(el.dataset.fadeDelay || 0);
  const ease = el.dataset.fadeEase || "power2.out";
  const start = el.dataset.fadeStart || "top 85%";

  gsap.fromTo(
    el,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
    }
  );
};

const animationPresets = {
  skew: skewBaseAnimation,
  fade: fadeBaseAnimation,
};

function initAnimations() {
  document.querySelectorAll("[data-anim]").forEach((el) => {
    const animType = el.dataset.anim;
    if (animationPresets[animType]) {
      animationPresets[animType](el);
    }
  });
}

// ═══════════════════════════════════════
// ── FILLING TEXT ANIMATION ──
// ═══════════════════════════════════════
function initFillingText() {
  const textEl = document.getElementById("filling-text");
  if (!textEl) return;

  const text = textEl.textContent.trim();
  textEl.innerHTML = "";

  const words = text.split(/\s+/);
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = word;
    span.style.marginRight = "0.3em";
    textEl.appendChild(span);
  });

  const wordEls = textEl.querySelectorAll(".word");

  ScrollTrigger.create({
    trigger: textEl,
    start: "top 80%",
    end: "bottom 30%",
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const activeIndex = Math.floor(progress * wordEls.length);

      wordEls.forEach((w, i) => {
        if (i <= activeIndex) {
          w.classList.add("active");
        } else {
          w.classList.remove("active");
        }
      });
    },
  });
}

// ═══════════════════════════════════════
// ── PARALLAX IMAGES ──
// ═══════════════════════════════════════
function initParallax() {
  document.querySelectorAll(".parallax-section").forEach((section) => {
    const img = section.querySelector(".parallax-image img");
    if (!img) return;

    gsap.to(img, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

// ═══════════════════════════════════════
// ── COUNTER ANIMATION ──
// ═══════════════════════════════════════
function initCounters() {
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || "";

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.floor(obj.val).toLocaleString("it-IT") + suffix;
          },
        });
      },
    });
  });
}

// ═══════════════════════════════════════
// ── BLURRED SHAPE BACKGROUND ──
// ═══════════════════════════════════════
function initBlurredShape() {
  const shape = document.getElementById("blurred-shape");
  const container = document.querySelector(".blurred-shapes");
  if (!shape || !container || isMobile()) return;

  gsap.set(shape, { opacity: 0 });

  ScrollTrigger.create({
    trigger: document.querySelector(".services-section"),
    start: "top 80%",
    onEnter: () => {
      gsap.set(container, { opacity: 1, y: "-50%" });
      gsap.set(shape, { y: "30%", left: "125%", rotation: 0 });
      gsap.to(shape, { opacity: 0.6, duration: 1 });

      gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0 }).to(shape, {
        y: "-30%",
        ease: "power1.inOut",
        duration: 10,
      });
    },
    once: true,
  });
}

// ═══════════════════════════════════════
// ── HERO HEADER REVEAL ──
// ═══════════════════════════════════════
function initHeroReveal() {
  const brandName = document.querySelector(".hero-brand-name");
  const subtitle = document.querySelector(".hero-subtitle");
  const slider = document.querySelector(".hero-slider");
  const info = document.querySelector(".hero-info");
  const navLogo = document.getElementById("nav-logo");

  const delay = isFirstVisit() ? 7.5 : 0.5;

  const tl = gsap.timeline({ delay });

  // Navigation logo
  tl.fromTo(navLogo, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0);

  // Brand name
  if (brandName) {
    const split = new SplitType(brandName, { types: "lines, words" });
    split.lines.forEach((line) => (line.style.overflow = "hidden"));

    tl.from(split.words, {
      y: "100%",
      skewX: isIOS ? 0 : -6,
      duration: 1.2,
      stagger: 0.05,
      ease: "expo.out",
    }, 0.2);
  }

  // Subtitle
  if (subtitle) {
    tl.fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.8);
  }

  // Slider
  if (slider) {
    tl.fromTo(slider, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 1);
  }

  // Info bar
  if (info) {
    tl.fromTo(info, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 1.3);
  }
}

// ═══════════════════════════════════════
// ── MOBILE LANDSCAPE WARNING ──
// ═══════════════════════════════════════
function checkOrientation() {
  const warning = document.querySelector(".mobile-landscape-warning");
  const isLandscape = window.innerWidth > window.innerHeight;

  if (isMobileDevice && isLandscape) {
    warning.style.display = "flex";
    disableScroll();
  } else {
    warning.style.display = "none";
    if (!isNavigationOpen) enableScroll();
  }
}

// ═══════════════════════════════════════
// ── SERVICE CARD HOVER TILT ──
// ═══════════════════════════════════════
function initServiceCardEffects() {
  if (isMobile()) return;

  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (y - 0.5) * 6;
      const tiltY = (x - 0.5) * -6;

      gsap.to(card, {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });
  });
}

// ═══════════════════════════════════════
// ── PORTFOLIO HOVER EFFECT ──
// ═══════════════════════════════════════
function initPortfolioEffects() {
  document.querySelectorAll(".portfolio-item").forEach((item) => {
    const overlay = item.querySelector(".portfolio-item-overlay");
    const category = item.querySelector(".portfolio-item-category");
    const title = item.querySelector(".portfolio-item-title");

    item.addEventListener("mouseenter", () => {
      gsap.to(category, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.to(title, { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: "power2.out" });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(category, { y: 10, opacity: 0.7, duration: 0.3, ease: "power2.in" });
      gsap.to(title, { y: 10, opacity: 0.7, duration: 0.3, ease: "power2.in" });
    });
  });
}

// ═══════════════════════════════════════
// ── MAIN INITIALIZATION ──
// ═══════════════════════════════════════
function initPageAnimations() {
  initAnimations();
  initFillingText();
  initParallax();
  initCounters();
  initBlurredShape();
  initHeroReveal();
  initServiceCardEffects();
  initPortfolioEffects();
}

// ═══════════════════════════════════════
// ── DOM CONTENT LOADED ──
// ═══════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initNavigation();
  checkOrientation();

  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
});

// ═══════════════════════════════════════
// ── WINDOW LOAD ──
// ═══════════════════════════════════════
window.addEventListener("load", () => {
  initLoader();
  initCirclesAnimation();
});

// ═══════════════════════════════════════
// ── CIRCLES ANIMATION ──
// ═══════════════════════════════════════
function initCirclesAnimation() {
  const circlesSection = document.querySelector('.home-circles-scroll-section');
  if (!circlesSection) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.home-circles-scroll-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      pin: '.home-circles-container',
    }
  });

  // Fade in titles and circles
  tl.to('.home-circles-title', { opacity: 1, duration: 1, stagger: 0.2 })
    .to('.circles-svg circle', { strokeWidth: 4, duration: 1 }, "<")
    .to('.svg-wrapper', { scale: 20, duration: 4, ease: "power2.inOut" }, "+=0.5")
    .to('.home-circles-title', { opacity: 0, duration: 1 }, "-=3.5")
    .to('.svg-background-mask', { opacity: 1, duration: 1 }, "-=3")
    .to('.home-circles-objective-text:nth-child(1)', { opacity: 0, scale: 1.5, duration: 1 }, "-=2")
    .to('.home-circles-objective-text:nth-child(2)', { opacity: 1, scale: 1, duration: 1 }, "-=1.5");
}
