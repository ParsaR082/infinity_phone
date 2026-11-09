/**
 * Infinity Phone - Master GSAP & Motion Interactions Controller
 * Provides cinematic 3D perspective hero parallax, staggered reveals,
 * ScrollTrigger transitions, magnetic buttons & cursor ambient lighting.
 */

(function () {
  function initAnimations() {
    // Wait for GSAP and DOM
    if (typeof gsap === 'undefined') {
      setTimeout(initAnimations, 100);
      return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    setupHeroMotion();
    setupScrollTriggers();
    setupCursorGlow();
    setupMagneticButtons();
  }

  // 1. HERO MOTION & 3D PARALLAX (Matching Sirin Labs Reference)
  function setupHeroMotion() {
    const hero = document.getElementById('hero');
    const phoneStage = document.getElementById('heroPhoneStage');
    const phone3d = document.getElementById('heroPhone3d');
    const giantText = document.getElementById('heroGiantText');
    const hudRadar = document.querySelector('.hero__hud-radar');
    if (!hero || !phone3d) return;

    // Entrance Timeline
    const tl = gsap.timeline({ delay: 0.2 });

    // Background giant letters entrance
    const letters = document.querySelectorAll('.giant-letter');
    if (letters.length > 0) {
      tl.from(letters, {
        opacity: 0,
        y: 60,
        scale: 0.85,
        stagger: 0.08,
        duration: 1.2,
        ease: "power4.out"
      }, 0);
    }

    // Phone entrance (floating down majestically in 3D perspective)
    tl.from(phone3d, {
      opacity: 0,
      y: 100,
      scale: 0.9,
      duration: 1.6,
      ease: "power3.out"
    }, 0.2);

    // HUD overlays entrance
    tl.from(['.hud-timeline', '.hud-top-coords', '.hero__narrative-box', '.hud-bottom-widgets'], {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 1,
      ease: "power2.out"
    }, 0.5);

    // Subtle Continuous Idle Animations
    // 1. Phone floating
    gsap.to(phone3d, {
      y: -14,
      duration: 4.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    // 2. Letters subtle drifting
    letters.forEach((letter, i) => {
      gsap.to(letter, {
        y: (i % 2 === 0 ? -10 : 10),
        duration: 3 + (i * 0.4),
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: i * 0.15
      });
    });

    // 3. Rotating HUD Radar circles
    const outerRadar = document.querySelector('.radar-circle--outer');
    const innerRadar = document.querySelector('.radar-circle--inner');
    if (outerRadar) {
      gsap.to(outerRadar, { rotate: 360, duration: 60, repeat: -1, ease: "none" });
    }
    if (innerRadar) {
      gsap.to(innerRadar, { rotate: -360, duration: 45, repeat: -1, ease: "none" });
    }

    // 4. Diamond pulse
    const diamond = document.querySelector('.diamond-inner');
    if (diamond) {
      gsap.to(diamond, { scale: 1.4, opacity: 0.7, duration: 1.2, yoyo: true, repeat: -1, ease: "power1.inOut" });
    }

    // Interactive 3D Perspective Mouse Parallax (Desktop)
    if (window.matchMedia('(min-width: 992px)').matches) {
      let bounds = hero.getBoundingClientRect();
      window.addEventListener('resize', () => {
        bounds = hero.getBoundingClientRect();
      });

      hero.addEventListener('mousemove', e => {
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        const normX = (mouseX / bounds.width - 0.5) * 2; // -1 to 1
        const normY = (mouseY / bounds.height - 0.5) * 2; // -1 to 1

        // 3D Phone tilt & translation
        gsap.to(phone3d, {
          rotateY: normX * 18,
          rotateX: -normY * 14,
          x: normX * 22,
          y: normY * 18,
          duration: 0.9,
          ease: "power2.out",
          overwrite: "auto"
        });

        // Background giant letters move in OPPOSITE direction (creates huge depth!)
        if (giantText) {
          gsap.to(giantText, {
            x: -normX * 40,
            y: -normY * 25,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto"
          });
        }

        // Radar background subtle shift
        if (hudRadar) {
          gsap.to(hudRadar, {
            x: normX * 18,
            y: normY * 18,
            duration: 1.6,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });

      // Smooth reset when leaving hero
      hero.addEventListener('mouseleave', () => {
        gsap.to(phone3d, {
          rotateY: 0,
          rotateX: 0,
          x: 0,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          overwrite: "auto"
        });
        if (giantText) {
          gsap.to(giantText, {
            x: 0,
            y: 0,
            duration: 1.6,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
        if (hudRadar) {
          gsap.to(hudRadar, {
            x: 0,
            y: 0,
            duration: 1.8,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      });
    }
  }

  // 2. SCROLLTRIGGER ANIMATIONS ACROSS ALL SECTIONS
  function setupScrollTriggers() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Featured section cards stagger
    const fcards = document.querySelectorAll('.fcard');
    if (fcards.length > 0) {
      gsap.from(fcards, {
        scrollTrigger: {
          trigger: '#featured',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 60,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // Brands section logos pop-in
    const bcards = document.querySelectorAll('.bcard');
    if (bcards.length > 0) {
      gsap.from(bcards, {
        scrollTrigger: {
          trigger: '#brands',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        scale: 0.88,
        y: 30,
        stagger: 0.08,
        duration: 0.8,
        ease: 'back.out(1.5)'
      });
    }

    // Tech Hardware section cards
    const tcards = document.querySelectorAll('.tcard');
    if (tcards.length > 0) {
      gsap.from(tcards, {
        scrollTrigger: {
          trigger: '#tech',
          start: 'top 78%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        stagger: 0.14,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // Titanium Campaign image parallax
    const campaignImg = document.querySelector('.campaign-img');
    if (campaignImg) {
      gsap.to(campaignImg, {
        scrollTrigger: {
          trigger: '#campaign',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: -40,
        ease: 'none'
      });
    }

    // Why Us advantages cards
    const adcards = document.querySelectorAll('.adcard');
    if (adcards.length > 0) {
      gsap.from(adcards, {
        scrollTrigger: {
          trigger: '#why-us',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 45,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power2.out'
      });
    }
  }

  // 3. CURSOR AMBIENT GLOW SPOTLIGHT
  function setupCursorGlow() {
    if (window.matchMedia('(max-width: 991px)').matches) return;
    let glow = document.getElementById('cursorSpotlight');
    if (!glow) {
      glow = document.createElement('div');
      glow.id = 'cursorSpotlight';
      glow.className = 'cursor-spotlight';
      document.body.appendChild(glow);
    }

    window.addEventListener('mousemove', e => {
      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  }

  // 4. MAGNETIC BUTTONS (Framer Motion feel)
  function setupMagneticButtons() {
    if (window.matchMedia('(max-width: 991px)').matches) return;
    const magneticBtns = document.querySelectorAll('.btn--primary, .bar-icon-btn, .hero__film-link');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.25,
          y: y * 0.25,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  window.addEventListener('DOMContentLoaded', initAnimations);
})();

