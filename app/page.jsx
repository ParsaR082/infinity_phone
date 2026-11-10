'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PRODUCTS_DATA, formatToman, toPersianNumber } from '../lib/products';

export default function HomePage() {
  const [activeBrand, setActiveBrand] = useState('all');
  const [activeStorage, setActiveStorage] = useState('all');
  const [activeSort, setActiveSort] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistIds, setWishlistIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Smooth filter transition handler
  const handleFilterChange = (type, val) => {
    setIsFiltering(true);
    setTimeout(() => {
      if (type === 'brand') setActiveBrand(val);
      else if (type === 'storage') setActiveStorage(val);
      else if (type === 'sort') setActiveSort(val);
      setTimeout(() => {
        setIsFiltering(false);
      }, 50);
    }, 150);
  };

  // Filter and sort products (defined before hooks that depend on it)
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS_DATA];

    if (activeBrand !== 'all') {
      list = list.filter((p) => p.brand === activeBrand);
    }

    if (activeStorage !== 'all') {
      list = list.filter((p) => p.storageVariants.some((v) => v.size === activeStorage));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q)
      );
    }

    if (activeSort === 'newest') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (activeSort === 'price-asc') {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (activeSort === 'price-desc') {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (activeSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [activeBrand, activeStorage, activeSort, searchQuery]);

  const featuredPhones = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => p.isFeatured).slice(0, 6);
  }, []);

  // Load wishlist and compare IDs on mount & listen to updates
  useEffect(() => {
    function refreshStoreState() {
      if (window.Store) {
        setWishlistIds([...window.Store.getWishlist()]);
        setCompareIds([...window.Store.getCompareList()]);
      }
    }
    refreshStoreState();
    window.addEventListener('store:wishlist-updated', refreshStoreState);
    window.addEventListener('store:compare-updated', refreshStoreState);

    return () => {
      window.removeEventListener('store:wishlist-updated', refreshStoreState);
      window.removeEventListener('store:compare-updated', refreshStoreState);
    };
  }, []);

  // Smooth Section Observer (Lazy Revealing Sections)
  useEffect(() => {
    const sections = document.querySelectorAll('.reveal-section');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // Master GSAP & Motion Interactions Controller (Faithful to original animations.js)
  useEffect(() => {
    let cleanup = () => {};

    function initHeroMotion() {
      if (typeof window.gsap === 'undefined') {
        setTimeout(initHeroMotion, 60);
        return;
      }

      const gsap = window.gsap;
      if (typeof window.ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(window.ScrollTrigger);
      }

      const hero = document.getElementById('hero');
      const phone3d = document.getElementById('heroPhone3d');
      const phoneImg = document.getElementById('heroPhoneImg');
      const giantText = document.getElementById('heroGiantText');
      const hudRadar = document.querySelector('.hero__hud-radar');
      const letters = document.querySelectorAll('.giant-letter');

      if (!hero || !phone3d) return;

      if (giantText) {
        gsap.set(giantText, { xPercent: -50, yPercent: -50 });
      }

      // 1. Hero Entrance Timeline (Faithful to original animations.js)
      const tl = gsap.timeline({ delay: 0.15 });

      if (letters.length > 0) {
        tl.from(letters, {
          opacity: 0,
          y: 60,
          scale: 0.85,
          stagger: 0.08,
          duration: 1.2,
          ease: 'power4.out',
        }, 0);
      }

      tl.from(phone3d, {
        opacity: 0,
        y: 100,
        scale: 0.9,
        duration: 1.6,
        ease: 'power3.out',
      }, 0.2);

      tl.from(['.hud-timeline', '.hud-top-coords', '.hero__narrative-box', '.hud-bottom-widgets'], {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 1,
        ease: 'power2.out',
      }, 0.45);

      // 2. Subtle Continuous Idle Animations
      // Float inner phone image so it breathes continuously without conflicting with 3D wrapper parallax
      const floatTarget = phoneImg || phone3d;
      const floatAnim = gsap.to(floatTarget, {
        y: -14,
        duration: 4.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

      // Background giant letters subtle drifting
      const letterTweens = [];
      letters.forEach((letter, i) => {
        const tw = gsap.to(letter, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 3 + i * 0.4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: i * 0.15,
        });
        letterTweens.push(tw);
      });

      // Rotating HUD Radar circles
      const outerRadar = document.querySelector('.radar-circle--outer');
      const innerRadar = document.querySelector('.radar-circle--inner');
      let outerTween = null;
      let innerTween = null;
      if (outerRadar) {
        outerTween = gsap.to(outerRadar, { rotate: 360, duration: 60, repeat: -1, ease: 'none' });
      }
      if (innerRadar) {
        innerTween = gsap.to(innerRadar, { rotate: -360, duration: 45, repeat: -1, ease: 'none' });
      }

      // Diamond pulse
      const diamond = document.querySelector('.diamond-inner');
      let diamondTween = null;
      if (diamond) {
        diamondTween = gsap.to(diamond, {
          scale: 1.4,
          opacity: 0.7,
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
        });
      }

      // 3. Interactive 3D Perspective Mouse Parallax (Optimized for 60/120fps)
      let bounds = hero.getBoundingClientRect();
      const updateBounds = () => {
        bounds = hero.getBoundingClientRect();
      };
      window.addEventListener('resize', updateBounds);
      hero.addEventListener('mouseenter', updateBounds);

      const handleMouseMove = (e) => {
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
          ease: 'power2.out',
          overwrite: 'auto',
        });

        // Background giant letters move in OPPOSITE direction (creates huge depth!)
        if (giantText) {
          gsap.to(giantText, {
            x: -normX * 40,
            y: -normY * 25,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }

        // Radar background subtle shift
        if (hudRadar) {
          gsap.to(hudRadar, {
            x: normX * 18,
            y: normY * 18,
            duration: 1.6,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(phone3d, {
          rotateY: 0,
          rotateX: 0,
          x: 0,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        if (giantText) {
          gsap.to(giantText, {
            x: 0,
            y: 0,
            duration: 1.6,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
        if (hudRadar) {
          gsap.to(hudRadar, {
            x: 0,
            y: 0,
            duration: 1.8,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
      };

      hero.addEventListener('mousemove', handleMouseMove);
      hero.addEventListener('mouseleave', handleMouseLeave);

      // 4. Cursor Ambient Glow Spotlight
      let glow = null;
      let onGlowMove = null;
      if (window.matchMedia('(min-width: 992px)').matches) {
        glow = document.getElementById('cursorSpotlight');
        if (!glow) {
          glow = document.createElement('div');
          glow.id = 'cursorSpotlight';
          glow.className = 'cursor-spotlight';
          document.body.appendChild(glow);
        }
        onGlowMove = (e) => {
          gsap.to(glow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };
        window.addEventListener('mousemove', onGlowMove);
      }

      // 5. Magnetic Buttons
      const magneticBtns = document.querySelectorAll('.btn--primary, .bar-icon-btn, .hero__film-link');
      const magHandlers = [];
      if (window.matchMedia('(min-width: 992px)').matches) {
        magneticBtns.forEach((btn) => {
          const onBtnMove = (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
              x: x * 0.25,
              y: y * 0.25,
              duration: 0.3,
              ease: 'power2.out',
            });
          };
          const onBtnLeave = () => {
            gsap.to(btn, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: 'elastic.out(1, 0.4)',
            });
          };
          btn.addEventListener('mousemove', onBtnMove);
          btn.addEventListener('mouseleave', onBtnLeave);
          magHandlers.push({ btn, onBtnMove, onBtnLeave });
        });
      }

      // 6. ScrollTrigger Section Animations
      const triggers = [];
      if (typeof window.ScrollTrigger !== 'undefined') {
        const fcards = document.querySelectorAll('.fcard');
        if (fcards.length > 0) {
          const a = gsap.from(fcards, {
            scrollTrigger: {
              trigger: '#featured',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 60,
            stagger: 0.12,
            duration: 1,
            ease: 'power3.out',
          });
          if (a.scrollTrigger) triggers.push(a.scrollTrigger);
        }

        const bcards = document.querySelectorAll('.bcard');
        if (bcards.length > 0) {
          const a = gsap.from(bcards, {
            scrollTrigger: {
              trigger: '#brands',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
            opacity: 0,
            scale: 0.88,
            y: 30,
            stagger: 0.08,
            duration: 0.8,
            ease: 'back.out(1.5)',
          });
          if (a.scrollTrigger) triggers.push(a.scrollTrigger);
        }

        const tcards = document.querySelectorAll('.tcard');
        if (tcards.length > 0) {
          const a = gsap.from(tcards, {
            scrollTrigger: {
              trigger: '#tech',
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 50,
            stagger: 0.14,
            duration: 1,
            ease: 'power3.out',
          });
          if (a.scrollTrigger) triggers.push(a.scrollTrigger);
        }

        const campaignImg = document.querySelector('.campaign-img');
        if (campaignImg) {
          const a = gsap.to(campaignImg, {
            scrollTrigger: {
              trigger: '#campaign',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
            y: -40,
            ease: 'none',
          });
          if (a.scrollTrigger) triggers.push(a.scrollTrigger);
        }

        const adcards = document.querySelectorAll('.adcard');
        if (adcards.length > 0) {
          const a = gsap.from(adcards, {
            scrollTrigger: {
              trigger: '#why-us',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 45,
            stagger: 0.1,
            duration: 0.9,
            ease: 'power2.out',
          });
          if (a.scrollTrigger) triggers.push(a.scrollTrigger);
        }
      }

      cleanup = () => {
        tl.kill();
        floatAnim.kill();
        letterTweens.forEach((t) => t.kill());
        if (outerTween) outerTween.kill();
        if (innerTween) innerTween.kill();
        if (diamondTween) diamondTween.kill();
        triggers.forEach((tr) => tr.kill());
        window.removeEventListener('resize', updateBounds);
        hero.removeEventListener('mouseenter', updateBounds);
        hero.removeEventListener('mousemove', handleMouseMove);
        hero.removeEventListener('mouseleave', handleMouseLeave);
        if (onGlowMove) {
          window.removeEventListener('mousemove', onGlowMove);
        }
        if (glow && glow.parentNode) {
          glow.parentNode.removeChild(glow);
        }
        magHandlers.forEach(({ btn, onBtnMove, onBtnLeave }) => {
          btn.removeEventListener('mousemove', onBtnMove);
          btn.removeEventListener('mouseleave', onBtnLeave);
        });
      };
    }

    const timer = setTimeout(initHeroMotion, 60);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  // 3D Perspective Tilt on Card Hover
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 991px)').matches) return;

    const cards = document.querySelectorAll('.js-tilt-card');
    const handlers = [];

    cards.forEach((card) => {
      const handleCardMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      };

      const handleCardMouseLeave = () => {
        card.style.transform = '';
      };

      card.addEventListener('mousemove', handleCardMouseMove);
      card.addEventListener('mouseleave', handleCardMouseLeave);
      handlers.push({ card, handleCardMouseMove, handleCardMouseLeave });
    });

    return () => {
      handlers.forEach(({ card, handleCardMouseMove, handleCardMouseLeave }) => {
        card.removeEventListener('mousemove', handleCardMouseMove);
        card.removeEventListener('mouseleave', handleCardMouseLeave);
      });
    };
  }, [filteredProducts]);

  const handleBrandSelect = (brand) => {
    handleFilterChange('brand', brand);
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleWishlist = (id) => {
    if (window.Store) {
      window.Store.toggleWishlist(id);
      setWishlistIds([...window.Store.getWishlist()]);
    }
  };

  const handleToggleCompare = (id) => {
    if (window.Store) {
      window.Store.toggleCompare(id);
      setCompareIds([...window.Store.getCompareList()]);
    }
  };

  return (
    <div className="page-smooth-enter">
      {/* Top Navigation Bar */}
      <header className="bar" id="bar">
        <div className="bar__inner">
          <Link className="bar__logo" href="/#hero" aria-label="Infinity Phone — بازگشت به بالا">
            <span className="brand-logo-text">
              <span className="brand-logo-icon">∞</span> INFINITY <span className="accent">PHONE</span>
            </span>
          </Link>

          <nav className="bar-nav-links" aria-label="منوی اصلی">
            <a href="#featured">پرچمداران برگزیده</a>
            <a href="#brands">دنیای برندها</a>
            <a href="#tech">معماری سخت‌افزار</a>
            <a href="#collection">فروشگاه و جستجو</a>
            <a href="#campaign">کمپین تیتانیوم</a>
            <a href="#why-us">مزایای خرید</a>
            <Link href="/faq">سوالات متداول</Link>
          </nav>

          <div className="bar-actions">
            <button
              type="button"
              className="bar-icon-btn"
              onClick={() => window.Store?.openSearch()}
              aria-label="جستجوی گوشی"
              title="جستجو"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              type="button"
              className="bar-icon-btn"
              onClick={() => window.Store?.openWishlist()}
              aria-label="علاقه‌مندی‌ها"
              title="نشان‌شده‌ها"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span id="wishlistBadgeCount" className="cart-counter" style={{ display: 'none' }}>
                ۰
              </span>
            </button>

            <button
              type="button"
              className="bar-icon-btn bar-icon-btn--compare"
              onClick={() => window.Store?.openCompare()}
              aria-label="مقایسه مشخصات گوشی‌ها"
              title="مقایسه"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5" />
                <path d="M4 20L21 3" />
                <path d="M21 16v5h-5" />
                <path d="M15 15l6 6" />
                <path d="M4 4l5 5" />
              </svg>
              <span id="compareBadgeCount" className="cart-counter" style={{ display: 'none' }}>
                ۰
              </span>
            </button>

            <button
              type="button"
              className="bar-icon-btn"
              onClick={() => window.Store?.openCart()}
              aria-label="سبد خرید"
              title="سبد خرید"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span id="cartBadgeCount" className="cart-counter" style={{ display: 'none' }}>
                ۰
              </span>
            </button>

            <a className="btn btn--primary btn--sm nav-cta-btn" href="#collection">
              <span>فروشگاه پرچمداران</span>
            </a>

            <button
              type="button"
              className="bar-icon-btn mobile-menu-btn"
              onClick={() => document.getElementById('mobileNav')?.classList.add('is-open')}
              aria-label="منوی موبایل"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Sound Toggle */}
      <button
        className="snd snd--off"
        id="snd"
        data-snd
        type="button"
        aria-pressed="false"
        aria-label="روشن/خاموش کردن صدا"
        onClick={() => window.Store?.toggleSound()}
      >
        <span className="snd__ring">
          <span className="snd__eq" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </span>
        </span>
        <i className="snd__div" aria-hidden="true"></i>
      </button>

      <div className="site" id="site">
        <main className="site__main" id="main">
          {/* SECTION 01: CINEMATIC 3D PERSPECTIVE HERO */}
          <section id="hero" tabIndex="-1" className="hero hero--cinema">
            <div className="hero__ambient-bg">
              <div className="hero__ambient-glow"></div>
              <div className="hero__tech-grid-pattern"></div>
              <div className="hero__hud-radar">
                <div className="radar-circle radar-circle--outer"></div>
                <div className="radar-circle radar-circle--inner"></div>
                <div className="radar-axis-x"></div>
                <div className="radar-axis-y"></div>
              </div>
            </div>

            <div className="hero__stage-wrap">
              {/* Giant Layered Neon Cyber Typography (Directly Behind Phone) */}
              <div className="hero__giant-text-bg" id="heroGiantText" aria-hidden="true">
                <div className="giant-row giant-row--top">
                  <span className="giant-letter">E</span>
                  <span className="giant-letter">X</span>
                  <span className="giant-letter">P</span>
                </div>
                <div className="giant-row giant-row--bot">
                  <span className="giant-letter">L</span>
                  <span className="giant-letter">O</span>
                  <span className="giant-letter">R</span>
                  <span className="giant-letter">E</span>
                </div>
              </div>

              {/* 3D Angled Phone Stage in Center */}
              <div className="hero__phone-stage" id="heroPhoneStage">
                <div className="hero__phone-3d-wrapper" id="heroPhone3d">
                  <img
                    src="/assets/images/hero/hero-phone-angle.png"
                    alt="Infinity Phone Flagship Perspective"
                    className="hero__phone-angle-img"
                    id="heroPhoneImg"
                    draggable="false"
                    decoding="async"
                  />
                  <div className="hero__touch-hint" id="heroTouchHint">
                    <span className="touch-arrow">&lt;</span>
                    <span className="touch-hand">✋</span>
                    <span className="touch-arrow">&gt;</span>
                  </div>
                </div>
              </div>

              {/* Foreground Sci-Fi HUD & Narrative Overlay */}
              <div className="hero__hud-overlay">
                <div className="hud-top-coords">
                  <span className="hud-dot"></span>
                  <span>SYS.ONLINE // ARCHITECTURE 3NM // TITANIUM CHASSIS // OLED 120HZ</span>
                </div>

                <div className="hud-timeline">
                  <div className="hud-start-node">
                    <span className="hud-start-label">START</span>
                    <div className="hud-diamond-icon">
                      <span className="diamond-inner"></span>
                    </div>
                  </div>
                  <div className="hud-dotted-line"></div>
                </div>

                <div className="hero__narrative-box">
                  <div className="hero__slogan-brand">
                    <span className="slogan-lead">INFINITY PHONE</span>
                    <span className="slogan-divider">—</span>
                    <span className="slogan-tag">تکنولوژی، فراتر از انتظار</span>
                  </div>
                  <p
                    className="hero__narrative-desc"
                    style={{
                      color: '#a0a0ab',
                      fontSize: '0.95rem',
                      maxWidth: '580px',
                      margin: '0 auto',
                      lineHeight: '1.6',
                    }}
                  >
                    جدیدترین نسل پرچمداران هوشمند ۲۰۲۶ با معماری ۳ نانومتری و هوش مصنوعی پیشرفته. انتخابی بی‌همتا برای
                    تجربه دنیای دیجیتال.
                  </p>
                  <div className="hero__cta-actions">
                    <a href="#collection" className="btn btn--primary btn--hero">
                      <span>کشف و سفارش پرچمداران</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </a>
                    <Link href="/product/apple-iphone-16-pro-max" className="hero__film-link">
                      <span>بررسی تخصصی آیفون ۱۶ پرو مکس</span>
                      <span className="play-triangle">▶</span>
                    </Link>
                  </div>
                </div>

                <div className="hud-bottom-widgets">
                  <div className="hud-status-badge">
                    <span className="pulse-led"></span>
                    <span>ضمانت ۱۸ ماهه اصالت کالا و رجیستری رسمی همتا</span>
                  </div>
                  <div
                    className="hud-brand-tag"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    MORE ⠇ ⤓
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 02: FEATURED SMARTPHONES TRACK */}
          <section id="featured" className="featured-section reveal-section">
            <div className="section-container">
              <div className="section-head">
                <div>
                  <span className="section-badge">پرچمداران منتخب سال ۲۰۲۶</span>
                  <h2 className="section-title">برترین‌های دنیای فناوری در دستان شما</h2>
                  <p className="section-desc">
                    مجموعه‌ای از قدرتمندترین و مدرن‌ترین گوشی‌های پرچمدار جهان، با طراحی فوق مهندسی و مشخصات انقلابی.
                  </p>
                </div>
                <a href="#collection" className="btn btn--secondary">
                  مشاهده کل مجموعه ←
                </a>
              </div>

              <div id="featuredPhonesTrack" className="featured-track">
                {featuredPhones.map((p, idx) => (
                  <div key={p.id} className="fcard js-tilt-card" data-brand={p.brand}>
                    <div className="fcard__header">
                      <span className="fcard__num">۰{idx + 1}</span>
                      <span className="fcard__badge">{p.badge || p.brandName}</span>
                    </div>
                    <div className="fcard__img-box">
                      <img src={p.images[0]} alt={p.name} className="fcard__img" loading="lazy" decoding="async" />
                    </div>
                    <div className="fcard__content">
                      <div className="fcard__brand-row">
                        <span className="fcard__brand">{p.brandName}</span>
                        <span className="fcard__name-en ltr-text">{p.nameEn}</span>
                      </div>
                      <h3 className="fcard__title">
                        <Link href={`/product/${p.slug}`}>{p.name}</Link>
                      </h3>
                      <p className="fcard__tagline">{p.tagline}</p>
                      <div className="fcard__footer">
                        <div className="fcard__price-box">
                          <span className="fcard__price-label">شروع قیمت از:</span>
                          <strong className="fcard__price">{formatToman(p.basePrice)}</strong>
                        </div>
                        <div className="fcard__actions">
                          <button
                            type="button"
                            className="btn btn--sm btn--secondary"
                            onClick={() => window.Store?.openQuickView(p.id)}
                            title="مشاهده سریع"
                          >
                            🔍
                          </button>
                          <button
                            type="button"
                            className="btn btn--sm btn--secondary"
                            onClick={() => window.Store?.addToCart(p.id)}
                          >
                            خرید
                          </button>
                          <Link href={`/product/${p.slug}`} className="btn btn--sm btn--primary">
                            جزئیات
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 03: BRAND UNIVERSE */}
          <section id="brands" className="brands-section reveal-section">
            <div className="section-container">
              <div className="section-head" style={{ marginBottom: '32px' }}>
                <div>
                  <span className="section-badge">جهان برندهای پیشگام</span>
                  <h2 className="section-title">انتخاب از بین معتبرترین سازندگان جهان</h2>
                </div>
              </div>

              <div className="brands-grid">
                <div className="bcard" onClick={() => handleBrandSelect('apple')}>
                  <div className="bcard__logo">
                    <img src="/assets/images/brands/apple.svg" alt="Apple" loading="lazy" decoding="async" />
                  </div>
                  <div className="bcard__name">اپل (Apple)</div>
                </div>
                <div className="bcard" onClick={() => handleBrandSelect('samsung')}>
                  <div className="bcard__logo">
                    <img src="/assets/images/brands/samsung.svg" alt="Samsung" loading="lazy" decoding="async" />
                  </div>
                  <div className="bcard__name">سامسونگ (Samsung)</div>
                </div>
                <div className="bcard" onClick={() => handleBrandSelect('xiaomi')}>
                  <div className="bcard__logo">
                    <img src="/assets/images/brands/xiaomi.svg" alt="Xiaomi" loading="lazy" decoding="async" />
                  </div>
                  <div className="bcard__name">شیائومی (Xiaomi)</div>
                </div>
                <div className="bcard" onClick={() => handleBrandSelect('google')}>
                  <div className="bcard__logo">
                    <img src="/assets/images/brands/google.svg" alt="Google" loading="lazy" decoding="async" />
                  </div>
                  <div className="bcard__name">گوگل (Pixel)</div>
                </div>
                <div className="bcard" onClick={() => handleBrandSelect('nothing')}>
                  <div className="bcard__logo">
                    <img src="/assets/images/brands/nothing.svg" alt="Nothing" loading="lazy" decoding="async" />
                  </div>
                  <div className="bcard__name">ناتینگ (Nothing)</div>
                </div>
                <div className="bcard" onClick={() => handleBrandSelect('oneplus')}>
                  <div className="bcard__logo">
                    <img src="/assets/images/brands/oneplus.svg" alt="OnePlus" loading="lazy" decoding="async" />
                  </div>
                  <div className="bcard__name">وان‌پلاس (OnePlus)</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 04: TECHNOLOGY & HARDWARE ARCHITECTURE */}
          <section className="tech-section reveal-section" id="tech">
            <div className="section-container">
              <div className="section-head">
                <div>
                  <span className="section-badge">فناوری و مهندسی قطعات</span>
                  <h2 className="section-title">چهار ستون نوآوری در گوشی‌های نسل جدید</h2>
                  <p className="section-desc">معماری سخت‌افزاری که مرز بین واقعیت و رویاهای دیجیتال را از میان برداشته است.</p>
                </div>
              </div>

              <div className="tech-grid">
                <div className="tcard">
                  <div className="tcard__img-box">
                    <img
                      src="/assets/images/features/feature-camera-lens.jpg"
                      alt="سیستم دوربین اپتیکال"
                      className="tcard__img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="tcard__body">
                    <div className="tcard__icon">📷</div>
                    <h3 className="tcard__title">سنسورهای ۱ اینچی و زوم پریسکوپی</h3>
                    <p className="tcard__desc">
                      ادغام لنزهای لایکا و هاسلبلاد با دیافراگم فیزیکی متغیر، دریافت نور را تا ۳۰۰٪ افزایش داده و عمق میدان
                      سینمایی خیره‌کننده‌ای بدون مصنوعات دیجیتال پدید می‌آورد.
                    </p>
                  </div>
                </div>

                <div className="tcard">
                  <div className="tcard__img-box">
                    <img
                      src="/assets/images/features/feature-oled-display.jpg"
                      alt="نمایشگرهای اولد ۱۲۰ هرتز"
                      className="tcard__img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="tcard__body">
                    <div className="tcard__icon">🖥️</div>
                    <h3 className="tcard__title">نمایشگرهای LTPO با نرخ نوسازی پویا</h3>
                    <p className="tcard__desc">
                      تغییر پیوسته رفرش‌ریت بین ۱ تا ۱۲۰ هرتز بر اساس محتوا، کاهش چشمگیر مصرف باتری و اوج روشنایی تا ۴۵۰۰ نیت
                      برای وضوح بی‌نقص زیر مستقیم‌ترین تابش آفتاب.
                    </p>
                  </div>
                </div>

                <div className="tcard">
                  <div className="tcard__img-box">
                    <img
                      src="/assets/images/features/feature-silicon-chip.jpg"
                      alt="سیلیکون ۳ نانومتری"
                      className="tcard__img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="tcard__body">
                    <div className="tcard__icon">⚡</div>
                    <h3 className="tcard__title">تراشه‌های ۳ نانومتری و هوش مصنوعی</h3>
                    <p className="tcard__desc">
                      تراشه‌های A18 Pro و Snapdragon 8 Elite با میلیاردها ترانزیستور، موتور عصبی اختصاصی (NPU) جهت پردازش
                      مولد هوش مصنوعی روی دستگاه و ری‌تریسینگ سخت‌افزاری در بازی‌ها.
                    </p>
                  </div>
                </div>

                <div className="tcard">
                  <div className="tcard__img-box">
                    <img
                      src="/assets/images/features/feature-battery-charge.jpg"
                      alt="فناوری باتری و شارژ فوق سریع"
                      className="tcard__img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="tcard__body">
                    <div className="tcard__icon">🔋</div>
                    <h3 className="tcard__title">باتری‌های سیلیکون-کربن و شارژ برق‌آسا</h3>
                    <p className="tcard__desc">
                      چگالی انرژی فوق‌العاده با فناوری آند سیلیکونی، همراه با سامانه‌های شارژ تا ۱۰۰ وات که باتری غول‌پیکر را
                      ظرف کمتر از نیم ساعت بدون حرارت اضافی شارژ کامل می‌نماید.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 05: PRODUCT COLLECTION & ADVANCED DISCOVERY */}
          <section id="collection" className="collection-section reveal-section">
            <div className="section-container">
              <div className="section-head">
                <div>
                  <span className="section-badge">فروشگاه جامع</span>
                  <h2 className="section-title">کاوش و سفارش آنلاین پرچمداران</h2>
                  <p className="section-desc">
                    گوشی مورد نظر خود را بر اساس برند، ظرفیت حافظه و قیمت فیلتر نموده و مشخصات دقیق آن را بررسی فرمایید.
                  </p>
                </div>
                <div>
                  تعداد محصولات موجود:{' '}
                  <strong id="collectionCount" className="accent-text">
                    {toPersianNumber(filteredProducts.length)}
                  </strong>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="filter-bar">
                <div className="filter-row">
                  {/* Brand Filter Tabs */}
                  <div className="brand-tabs-list">
                    <button
                      type="button"
                      className={`brand-tab ${activeBrand === 'all' ? 'is-active' : ''}`}
                      onClick={() => handleFilterChange('brand', 'all')}
                    >
                      همه برندها
                    </button>
                    <button
                      type="button"
                      className={`brand-tab ${activeBrand === 'apple' ? 'is-active' : ''}`}
                      onClick={() => handleFilterChange('brand', 'apple')}
                    >
                      اپل (Apple)
                    </button>
                    <button
                      type="button"
                      className={`brand-tab ${activeBrand === 'samsung' ? 'is-active' : ''}`}
                      onClick={() => handleFilterChange('brand', 'samsung')}
                    >
                      سامسونگ
                    </button>
                    <button
                      type="button"
                      className={`brand-tab ${activeBrand === 'xiaomi' ? 'is-active' : ''}`}
                      onClick={() => handleFilterChange('brand', 'xiaomi')}
                    >
                      شیائومی
                    </button>
                    <button
                      type="button"
                      className={`brand-tab ${activeBrand === 'google' ? 'is-active' : ''}`}
                      onClick={() => handleFilterChange('brand', 'google')}
                    >
                      گوگل پیکسل
                    </button>
                    <button
                      type="button"
                      className={`brand-tab ${activeBrand === 'nothing' ? 'is-active' : ''}`}
                      onClick={() => handleFilterChange('brand', 'nothing')}
                    >
                      ناتینگ
                    </button>
                    <button
                      type="button"
                      className={`brand-tab ${activeBrand === 'oneplus' ? 'is-active' : ''}`}
                      onClick={() => handleFilterChange('brand', 'oneplus')}
                    >
                      وان‌پلاس
                    </button>
                  </div>

                  {/* Search Input */}
                  <input
                    type="text"
                    id="collectionSearchInput"
                    className="search-box-input"
                    placeholder="جستجوی مدل (مثلاً آیفون ۱۶، اولترا...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filter-row" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  {/* Storage Filter */}
                  <div className="storage-filters-list">
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '8px' }}>ظرفیت:</span>
                    {['all', '128GB', '256GB', '512GB', '1TB'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`storage-filter-btn ${activeStorage === st ? 'is-active' : ''}`}
                        onClick={() => handleFilterChange('storage', st)}
                      >
                        {st === 'all' ? 'همه' : st}
                      </button>
                    ))}
                  </div>

                  {/* Sort Select */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>مرتب‌سازی:</span>
                    <select
                      className="sort-select"
                      value={activeSort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                    >
                      <option value="featured">پیشنهاد برگزیده</option>
                      <option value="newest">جدیدترین محصولات</option>
                      <option value="price-asc">ارزان‌ترین به گران‌ترین</option>
                      <option value="price-desc">گران‌ترین به ارزان‌ترین</option>
                      <option value="rating">بالاترین امتیاز رضایت</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div
                id="collectionGrid"
                className={`pcard-grid ${isFiltering ? 'is-filtering-fade' : 'is-filtering-active'}`}
              >
                {filteredProducts.length === 0 ? (
                  <div className="collection-empty">هیچ محصولی با معیارهای جستجوی شما یافت نشد.</div>
                ) : (
                  filteredProducts.map((p, idx) => {
                    const isWl = wishlistIds.includes(p.id);
                    const isCmp = compareIds.includes(p.id);

                    return (
                      <div
                        key={p.id}
                        className="pcard js-tilt-card pcard-enter-anim"
                        data-brand={p.brand}
                        style={{ animationDelay: `${Math.min(idx * 0.04, 0.32)}s` }}
                      >
                        <div className="pcard__thumb-box">
                          <Link href={`/product/${p.slug}`} className="pcard__thumb-link">
                            <img src={p.images[0]} alt={p.name} className="pcard__img" loading="lazy" decoding="async" />
                          </Link>
                          {p.badge && <span className="pcard__badge">{p.badge}</span>}
                          <div className="pcard__floating-actions">
                            <button
                              type="button"
                              className={`pcard__icon-btn ${isWl ? 'is-active' : ''}`}
                              onClick={() => handleToggleWishlist(p.id)}
                              title={isWl ? 'حذف از نشان‌شده‌ها' : 'نشان کردن'}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill={isWl ? '#ff4b4b' : 'none'}
                                stroke={isWl ? '#ff4b4b' : 'currentColor'}
                                strokeWidth="2"
                              >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className={`pcard__icon-btn ${isCmp ? 'is-active' : ''}`}
                              onClick={() => handleToggleCompare(p.id)}
                              title={isCmp ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={isCmp ? 'var(--accent)' : 'currentColor'}
                                strokeWidth="2"
                              >
                                <path d="M16 3h5v5" />
                                <path d="M4 20L21 3" />
                                <path d="M21 16v5h-5" />
                                <path d="M15 15l6 6" />
                                <path d="M4 4l5 5" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="pcard__icon-btn"
                              onClick={() => window.Store?.openQuickView(p.id)}
                              title="پیش‌نمایش سریع"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="pcard__body">
                          <div className="pcard__meta">
                            <span className="pcard__brand">{p.brandName}</span>
                            <span className="pcard__rating">★ {toPersianNumber(p.rating)}</span>
                          </div>

                          <h3 className="pcard__title">
                            <Link href={`/product/${p.slug}`}>{p.name}</Link>
                          </h3>
                          <div className="pcard__title-en ltr-text">{p.nameEn}</div>

                          <div className="pcard__specs-tags">
                            <span className="spec-tag">{p.specs.chipset.split('(')[0].trim()}</span>
                            <span className="spec-tag">{p.specs.camera.split('+')[0].trim()}</span>
                          </div>

                          <div className="pcard__price-row">
                            <div>
                              <div className="pcard__price">{formatToman(p.basePrice)}</div>
                              {p.previousPrice && (
                                <del className="pcard__prev-price">{formatToman(p.previousPrice)}</del>
                              )}
                            </div>
                            <button
                              type="button"
                              className="btn btn--primary btn--sm pcard__add-btn"
                              onClick={() => window.Store?.addToCart(p.id)}
                            >
                              <span>خرید</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* SECTION 06: EDITORIAL CAMPAIGN */}
          <section id="campaign" className="campaign-section reveal-section">
            <div className="section-container">
              <div className="campaign-grid">
                <div className="campaign-content">
                  <span className="campaign-badge">کمپین اختصاصی مهندسی تیتانیوم</span>
                  <h2 className="campaign-title">آلیاژ تیتانیوم گرید ۵؛ تلاقی استحکام و سبکی هوافضا</h2>
                  <p className="campaign-desc">
                    فلز تیتانیوم همان ماده‌ای است که در ساخت کاوشگرهای مریخ‌نورد به کار می‌رود. در پرچمداران نوین، پیوند
                    متالورژیکی تیتانیوم و آلومینیوم بازیافتی، انتقال حرارت را بهینه‌سازی کرده و وزنی سبک‌تر از همیشه به
                    بدنه بخشیده است.
                  </p>
                  <div className="campaign-features">
                    <div className="cfeature-item">
                      <span className="cfeature-dot"></span>
                      <span>مقاومت استثنایی در برابر ضربه و خراش</span>
                    </div>
                    <div className="cfeature-item">
                      <span className="cfeature-dot"></span>
                      <span>لبه‌های کانتورشده ارگونومیک</span>
                    </div>
                    <div className="cfeature-item">
                      <span className="cfeature-dot"></span>
                      <span>دفع حرارت بالا در پردازش سنگین</span>
                    </div>
                    <div className="cfeature-item">
                      <span className="cfeature-dot"></span>
                      <span>بافت مات ضد لک و اثر انگشت</span>
                    </div>
                  </div>
                  <div>
                    <Link href="/product/apple-iphone-16-pro-max" className="btn btn--primary">
                      بررسی گوشی تیتانیومی ←
                    </Link>
                  </div>
                </div>

                <div className="campaign-img-box">
                  <img
                    src="/assets/images/hero/campaign-titanium.jpg"
                    alt="تیتانیوم گرید ۵"
                    className="campaign-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 07: WHY SHOP WITH US? */}
          <section id="why-us" className="advantages-section reveal-section">
            <div className="section-container">
              <div
                className="section-head"
                style={{
                  textAlign: 'center',
                  margin: '0 auto 50px',
                  maxWidth: '650px',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <span className="section-badge">استاندارد طلایی اینفینیتی</span>
                  <h2 className="section-title">چرا خرید از اینفینیتی فون؟</h2>
                  <p className="section-desc">
                    تعهد ما ارائه بالاترین استانداردهای امنیت خرید، اصالت قطعات و آسودگی خاطر برای خریداران پرچمداران است.
                  </p>
                </div>
              </div>

              <div className="advantages-grid">
                <div className="adcard">
                  <div className="adcard__icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 className="adcard__title">ضمانت ۱۸ ماهه شرکتی</h3>
                  <p className="adcard__desc">
                    تمامی دستگاه‌ها با گارانتی ۱۸ ماهه معتبر شرکتی، پوشش کامل قطعات سخت‌افزاری و تعمیرات استاندارد تحویل
                    می‌گردند.
                  </p>
                </div>

                <div className="adcard">
                  <div className="adcard__icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 14 14" />
                    </svg>
                  </div>
                  <h3 className="adcard__title">رجیستری رسمی همتا</h3>
                  <p className="adcard__desc">
                    ثبت قانونی در سامانه گمرکی و سامانه همتا همراه با کد فعال‌سازی اختصاصی بدون کوچک‌ترین دغدغه قطعی آنتن.
                  </p>
                </div>

                <div className="adcard">
                  <div className="adcard__icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <h3 className="adcard__title">ارسال اکسپرس بیمه‌شده</h3>
                  <p className="adcard__desc">
                    بسته‌بندی ایمن و مقاوم در برابر ضربه با بیمه ۱۰۰٪ ارزش کالا و ارسال سریع به کلیه استان‌های کشور.
                  </p>
                </div>

                <div className="adcard">
                  <div className="adcard__icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  </div>
                  <h3 className="adcard__title">۷ روز مهلت تست و تعویض</h3>
                  <p className="adcard__desc">
                    امکان بررسی و ارزیابی کامل سلامت ظاهری و فنی دستگاه به مدت یک هفته پس از دریافت سفارش.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 08: FINAL COMPREHENSIVE FOOTER */}
          <footer id="footer" className="pfoot reveal-section">
            <div className="pfoot__container">
              <div className="pfoot__brand">
                <div className="pfoot__logo">
                  <span className="accent">∞</span> INFINITY <span className="accent">PHONE</span>
                </div>
                <p className="pfoot__desc">
                  مرجع تخصصی عرضه به‌روزترین و برترین گوشی‌های هوشمند پرچمدار در ایران. تجربه خریدی لوکس، مطمئن و با
                  اصالت در سطح استانداردهای جهانی.
                </p>
              </div>

              <div className="pfoot__links">
                <div className="pfoot__col">
                  <div className="pfoot__col-title">پرچمداران برتر</div>
                  <Link href="/product/apple-iphone-16-pro-max">آیفون ۱۶ پرو مکس اپل</Link>
                  <Link href="/product/samsung-galaxy-s25-ultra">گلکسی S25 اولترا سامسونگ</Link>
                  <Link href="/product/xiaomi-15-ultra">شیائومی ۱۵ اولترا لایکا</Link>
                  <Link href="/product/google-pixel-9-pro-xl">گوگل پیکسل ۹ پرو XL</Link>
                  <Link href="/product/nothing-phone-2">ناتینگ فون (۲) گلیف</Link>
                  <Link href="/product/oneplus-12">وان‌پلاس ۱۲ هاسلبلاد</Link>
                </div>

                <div className="pfoot__col">
                  <div className="pfoot__col-title">برندها</div>
                  <a href="#collection" onClick={() => handleBrandSelect('apple')}>
                    گوشی‌های اپل (Apple)
                  </a>
                  <a href="#collection" onClick={() => handleBrandSelect('samsung')}>
                    گوشی‌های سامسونگ
                  </a>
                  <a href="#collection" onClick={() => handleBrandSelect('xiaomi')}>
                    گوشی‌های شیائومی
                  </a>
                  <a href="#collection" onClick={() => handleBrandSelect('google')}>
                    گوشی‌های گوگل پیکسل
                  </a>
                  <a href="#collection" onClick={() => handleBrandSelect('nothing')}>
                    گوشی‌های ناتینگ
                  </a>
                </div>

                <div className="pfoot__col">
                  <div className="pfoot__col-title">راهنما و خدمات مشتریان</div>
                  <Link href="/faq">پرسش‌های متداول و راهنمای سفارش</Link>
                  <Link href="/terms">شرایط و قوانین گارانتی</Link>
                  <Link href="/privacy">حفظ حریم خصوصی کاربران</Link>
                  <Link href="/accessibility">استانداردهای دسترس‌پذیری</Link>
                  <Link href="/cookies">سیاست کوکی‌ها</Link>
                  <Link href="/legal-notice">اطلاعیه حقوقی</Link>
                </div>
              </div>
            </div>

            <div className="pfoot__bottom">
              <p>© ۲۰۲۶ اینفینیتی فون (Infinity Phone). تمامی حقوق برای این تجربه ممتاز دیجیتال محفوظ است.</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
