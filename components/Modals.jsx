'use client';

import React, { useEffect } from 'react';

export default function Modals() {
  useEffect(() => {
    // Expose handleGlobalSearch on window
    window.handleGlobalSearch = function (query) {
      const resultsContainer = document.getElementById('searchResults');
      if (!resultsContainer) return;
      if (!query || !query.trim()) {
        resultsContainer.innerHTML = '<div class="search-empty">نام مدل یا برند مورد نظر را تایپ فرمایید.</div>';
        return;
      }
      const q = query.toLowerCase().trim();
      const products = window.Store ? window.Store.getProducts() : (window.PRODUCTS_DATA || []);
      const matches = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        resultsContainer.innerHTML = '<div class="search-empty">هیچ گوشی هوشمندی مطابق با عبارت وارد شده پیدا نشد.</div>';
        return;
      }

      resultsContainer.innerHTML = matches.map(p => `
        <a href="/product/${p.slug}" class="search-result-item" onclick="if(window.Store) window.Store.closeSearch()">
          <img src="${p.images[0]}" alt="${p.name}" class="search-thumb" />
          <div class="search-info">
            <div class="search-title">${p.name} <span class="search-title-en ltr-text">(${p.nameEn})</span></div>
            <div class="search-price">${window.formatToman ? window.formatToman(p.basePrice) : p.basePrice}</div>
          </div>
        </a>
      `).join('');
    };
  }, []);

  const closeCart = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.drawer__close')) {
      if (window.Store) window.Store.closeCart();
    }
  };

  const closeWishlist = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.drawer__close')) {
      if (window.Store) window.Store.closeWishlist();
    }
  };

  const closeSearch = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.modal__close')) {
      if (window.Store) window.Store.closeSearch();
    }
  };

  const closeCheckout = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.modal__close')) {
      if (window.Store) window.Store.closeCheckout();
    }
  };

  const closeQuickView = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.modal__close')) {
      if (window.Store) window.Store.closeQuickView();
    }
  };

  const closeCompare = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.modal__close')) {
      if (window.Store) window.Store.closeCompare();
    }
  };

  const closeMobileNav = () => {
    const el = document.getElementById('mobileNav');
    if (el) el.classList.remove('is-open');
  };

  const handleCheckoutSubmit = (e) => {
    if (window.Store && window.Store.processDemoCheckout) {
      window.Store.processDemoCheckout(e);
    } else {
      e.preventDefault();
    }
  };

  return (
    <>
      {/* Cart Drawer */}
      <div id="cartDrawer" className="drawer-overlay" onClick={closeCart}>
        <div className="drawer">
          <div className="drawer__header">
            <div className="drawer__title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              سبد خرید پرچمداران شما
            </div>
            <button type="button" className="drawer__close" onClick={() => window.Store?.closeCart()}>✕</button>
          </div>
          <div id="cartDrawerItems" className="drawer__body"></div>
          <div className="drawer__footer">
            <div className="drawer__total-row">
              <span>مبلغ کل فاکتور:</span>
              <strong id="cartDrawerTotal" className="drawer__total-price">۰ تومان</strong>
            </div>
            <button type="button" className="btn btn--primary btn--block" onClick={() => window.Store?.openCheckout()}>
              ادامه جهت ثبت نهایی سفارش (Demo)
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <div id="searchModal" className="modal-overlay" onClick={closeSearch}>
        <div className="modal modal--search">
          <div className="modal__header">
            <input
              type="text"
              id="searchInput"
              className="search-input"
              placeholder="جستجوی نام مدل، برند (آیفون، سامسونگ، شیائومی، پیکسل...)"
              onInput={(e) => window.handleGlobalSearch?.(e.target.value)}
            />
            <button type="button" className="modal__close" onClick={() => window.Store?.closeSearch()}>✕</button>
          </div>
          <div id="searchResults" className="search-results"></div>
        </div>
      </div>

      {/* Checkout Modal (Demo) */}
      <div id="checkoutModal" className="modal-overlay" onClick={closeCheckout}>
        <div className="modal modal--checkout">
          <div className="modal__header">
            <h3 className="modal__title">تکمیل و ثبت نهایی سفارش (نمایشی)</h3>
            <button type="button" className="modal__close" onClick={() => window.Store?.closeCheckout()}>✕</button>
          </div>
          <div id="checkoutModalBody" className="modal__body">
            <form id="checkoutForm" onSubmit={handleCheckoutSubmit}>
              <div className="checkout-form-grid">
                <div className="form-group">
                  <label>نام و نام خانوادگی خریدار</label>
                  <input type="text" required placeholder="مثال: پارسا راد" className="form-input" />
                </div>
                <div className="form-group">
                  <label>شماره تماس همراه (جهت هماهنگی و پیامک کد رجیستری)</label>
                  <input type="tel" required placeholder="۰۹۱۲۳۴۵۶۷۸۹" className="form-input ltr-text" />
                </div>
                <div className="form-group full-width">
                  <label>آدرس تحویل سفارش</label>
                  <input type="text" required placeholder="استان، شهر، خیابان، پلاک، واحد..." className="form-input" />
                </div>
                <div className="form-group">
                  <label>روش ارسال و بیمه باربری</label>
                  <select className="form-select">
                    <option>ارسال اکسپرس هوایی (بیمه ۱۰۰٪ ارزش کالا) - رایگان</option>
                    <option>پیک ویژه تحویل فوری در شهر تهران (کمتر از ۳ ساعت)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>شیوه تسویه حساب</label>
                  <select className="form-select">
                    <option>درگاه پرداخت شبیه‌سازی‌شده (Demo Checkout)</option>
                    <option>پرداخت پس از بررسی و تست کد همتا در محل</option>
                  </select>
                </div>
              </div>

              <div className="checkout-summary-box">
                <div className="checkout-summary-title">اقلام سبد خرید:</div>
                <div id="checkoutItemsList"></div>
                <div className="checkout-summary-total">
                  <span>مبلغ قابل پرداخت نهایی:</span>
                  <strong id="checkoutTotalAmount" className="accent-text">۰ تومان</strong>
                </div>
              </div>

              <button type="submit" className="btn btn--primary btn--block btn--lg">
                تایید و صدور پیش‌فاکتور رسمی (دمو بدون کسر وجه)
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Wishlist Drawer */}
      <div id="wishlistDrawer" className="drawer-overlay" onClick={closeWishlist}>
        <div className="drawer">
          <div className="drawer__header">
            <div className="drawer__title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              لیست پرچمداران نشان‌شده (علاقه‌مندی‌ها)
            </div>
            <button type="button" className="drawer__close" onClick={() => window.Store?.closeWishlist()}>✕</button>
          </div>
          <div id="wishlistItems" className="drawer__body"></div>
        </div>
      </div>

      {/* Quick View Modal */}
      <div id="quickViewModal" className="modal-overlay" onClick={closeQuickView}>
        <div className="modal modal--quick-view">
          <div className="modal__header">
            <h3 className="modal__title">پیش‌نمایش سریع پرچمدار</h3>
            <button type="button" className="modal__close" onClick={() => window.Store?.closeQuickView()}>✕</button>
          </div>
          <div id="quickViewBody" className="modal__body"></div>
        </div>
      </div>

      {/* Compare Modal */}
      <div id="compareModal" className="modal-overlay" onClick={closeCompare}>
        <div className="modal modal--compare">
          <div className="modal__header">
            <h3 className="modal__title">مقایسه تخصصی مشخصات فنی پرچمداران</h3>
            <button type="button" className="modal__close" onClick={() => window.Store?.closeCompare()}>✕</button>
          </div>
          <div id="compareModalBody" className="modal__body"></div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div id="mobileNav" className="mobile-nav-drawer">
        <div className="mobile-nav-header">
          <span className="brand-logo-text"><span className="brand-logo-icon">∞</span> INFINITY <span className="accent">PHONE</span></span>
          <button type="button" className="modal__close" onClick={closeMobileNav}>✕</button>
        </div>
        <nav className="mobile-nav-links">
          <a href="/#hero" onClick={closeMobileNav}>صفحه اصلی و پرچمدار</a>
          <a href="/#featured" onClick={closeMobileNav}>پرچمداران برگزیده</a>
          <a href="/#brands" onClick={closeMobileNav}>دنیای برندها</a>
          <a href="/#tech" onClick={closeMobileNav}>معماری سخت‌افزار</a>
          <a href="/#collection" onClick={closeMobileNav}>فروشگاه پرچمداران</a>
          <a href="/#campaign" onClick={closeMobileNav}>کمپین تیتانیوم</a>
          <a href="/#why-us" onClick={closeMobileNav}>مزایای خرید</a>
          <a href="/faq" onClick={closeMobileNav}>سوالات متداول</a>
        </nav>
      </div>
    </>
  );
}

