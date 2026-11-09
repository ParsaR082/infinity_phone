'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS_DATA, formatToman, toPersianNumber } from '../lib/products';

export default function ProductDetailClient({ product }) {
  const [selectedImg, setSelectedImg] = useState(product?.images[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(product?.storageVariants[0]);
  const [currentQty, setCurrentQty] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSelectedImg(product.images[0]);
    setSelectedColor(product.colors[0]);
    setSelectedStorage(product.storageVariants[0]);
    setCurrentQty(1);

    if (window.Store) {
      setIsWishlist(window.Store.isInWishlist(product.id));
    }

    const onWishlistUpdate = () => {
      if (window.Store) {
        setIsWishlist(window.Store.isInWishlist(product.id));
      }
    };
    window.addEventListener('store:wishlist-updated', onWishlistUpdate);

    return () => {
      window.removeEventListener('store:wishlist-updated', onWishlistUpdate);
    };
  }, [product]);

  if (!product) return null;

  const currentPrice = product.basePrice + (selectedStorage ? selectedStorage.priceDiff : 0);
  const prevPrice = product.previousPrice ? (product.previousPrice + (selectedStorage ? selectedStorage.priceDiff : 0)) : null;

  const handleToggleWl = () => {
    if (window.Store) {
      window.Store.toggleWishlist(product.id);
      setIsWishlist(window.Store.isInWishlist(product.id));
    }
  };

  const handleAddToCart = () => {
    if (window.Store) {
      window.Store.addToCart(product.id, selectedColor?.id, selectedStorage?.size, currentQty);
    }
  };

  const handleInstantBuy = () => {
    if (window.Store) {
      window.Store.addToCart(product.id, selectedColor?.id, selectedStorage?.size, currentQty);
      window.Store.openCheckout();
    }
  };

  const specsList = [
    { label: 'صفحه‌نمایش', val: product.specs.screen, icon: '🖥️' },
    { label: 'تراشه و پردازنده', val: product.specs.chipset, icon: '⚡' },
    { label: 'سیستم دوربین اصلی', val: product.specs.camera, icon: '📷' },
    { label: 'دوربین سلفی', val: product.specs.frontCamera, icon: '🤳' },
    { label: 'باتری و سرعت شارژ', val: product.specs.battery, icon: '🔋' },
    { label: 'سیستم‌عامل و هوش مصنوعی', val: product.specs.os, icon: '🧠' },
    { label: 'جنس بدنه و شیلد', val: product.specs.material, icon: '🛡️' },
    { label: 'وزن و ارگونومی', val: product.specs.weight, icon: '⚖️' },
    { label: 'اتصالات و شبکه', val: product.specs.connectivity, icon: '🌐' },
  ];

  const relatedProducts = PRODUCTS_DATA.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="product-page page-smooth-enter">
      {/* Top Navigation Bar */}
      <header className="pbar">
        <div className="pbar__container">
          <div className="pbar__right">
            <Link href="/" className="pbar__logo">
              <span className="pbar__logo-icon">∞</span>
              <span className="pbar__logo-text">
                INFINITY <span className="accent">PHONE</span>
              </span>
            </Link>
            <nav className="pbar__nav">
              <Link href="/#collection" className="pbar__nav-link">
                مجموعه گوشی‌ها
              </Link>
              <Link href="/#brands" className="pbar__nav-link">
                برندها
              </Link>
              <Link href="/#tech" className="pbar__nav-link">
                فناوری و نوآوری
              </Link>
              <Link href="/faq" className="pbar__nav-link">
                راهنمای خرید
              </Link>
            </nav>
          </div>

          <div className="pbar__left">
            <button
              type="button"
              className="pbar__action-btn"
              onClick={() => window.Store?.openSearch()}
              aria-label="جستجو"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              type="button"
              className="pbar__action-btn pbar__cart-btn"
              onClick={() => window.Store?.openCart()}
              aria-label="سبد خرید"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span id="cartBadgeCount" className="cart-badge">
                ۰
              </span>
            </button>

            <Link href="/" className="btn btn--secondary btn--sm">
              <span>بازگشت به فروشگاه</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pmain">
        <div className="pmain__container">
          {/* Breadcrumb */}
          <nav className="pcrumb" aria-label="مسیر راهنما">
            <Link href="/">خانه</Link>
            <span>/</span>
            <Link href="/#collection">گوشی‌های هوشمند</Link>
            <span>/</span>
            <span>{product.brandName}</span>
            <span>/</span>
            <span className="active">{product.name}</span>
          </nav>

          {/* Product Detail Main Card */}
          <div className="pdetail">
            <div className="pdetail__grid">
              {/* Gallery Column */}
              <div className="pdetail__gallery">
                <div className="pdetail__main-img-box">
                  <img src={selectedImg} alt={product.name} className="pdetail__main-img" decoding="async" />
                  {product.badge && <span className="pdetail__badge">{product.badge}</span>}
                  <button
                    type="button"
                    className={`pdetail__wl-btn ${isWishlist ? 'is-active' : ''}`}
                    onClick={handleToggleWl}
                    aria-label="علاقه‌مندی"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill={isWishlist ? '#ff4b4b' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="pdetail__thumb-strip">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`pdetail__thumb-btn ${selectedImg === img ? 'is-active' : ''}`}
                      onClick={() => setSelectedImg(img)}
                    >
                      <img src={img} alt={`${product.name} - زاویه ${idx + 1}`} loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info Column */}
              <div className="pdetail__content">
                <div className="pdetail__brand-tag">
                  <img
                    src={`/assets/images/brands/${product.brand}.svg`}
                    alt={product.brandName}
                    className="pdetail__brand-logo"
                  />
                  <span>{product.brandName}</span>
                </div>

                <h1 className="pdetail__title">{product.name}</h1>
                <div className="pdetail__name-en ltr-text">{product.nameEn}</div>
                <p className="pdetail__tagline">{product.tagline}</p>

                <div className="pdetail__rating-row">
                  <span className="stars">★★★★★</span>
                  <span className="rating-num">{toPersianNumber(product.rating)}</span>
                  <span className="reviews-count">({toPersianNumber(product.reviewsCount)} دیدگاه خریداران)</span>
                </div>

                {/* Price Display */}
                <div className="pdetail__price-box">
                  <span className="price-label">قیمت نهایی با احتساب گارانتی و رجیستری:</span>
                  <div className="price-row">
                    <div className="price-current">{formatToman(currentPrice)}</div>
                    {prevPrice && <del>{formatToman(prevPrice)}</del>}
                    {product.discountPercent && (
                      <span className="discount-pill">{toPersianNumber(product.discountPercent)}٪ تخفیف</span>
                    )}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="pdetail__option-group">
                  <label className="pdetail__option-label">
                    رنگ انتخابی: <strong className="selected-val">{selectedColor?.name}</strong>
                  </label>
                  <div className="pdetail__colors">
                    {product.colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`color-btn ${selectedColor?.id === c.id ? 'is-active' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() => setSelectedColor(c)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Storage Selector */}
                <div className="pdetail__option-group">
                  <label className="pdetail__option-label">
                    ظرفیت حافظه داخلی: <strong className="selected-val">{selectedStorage?.size}</strong>
                  </label>
                  <div className="pdetail__storages">
                    {product.storageVariants.map((s) => (
                      <button
                        key={s.size}
                        type="button"
                        className={`storage-btn ${selectedStorage?.size === s.size ? 'is-active' : ''}`}
                        onClick={() => setSelectedStorage(s)}
                      >
                        <span className="storage-name">{s.size}</span>
                        {s.priceDiff > 0 && (
                          <span className="storage-diff">
                            +{toPersianNumber(Math.round(s.priceDiff / 1000000))} م.ت
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & CTA */}
                <div className="pdetail__cta-row">
                  <div className="pdetail__qty">
                    <button type="button" className="qty-btn" onClick={() => setCurrentQty(Math.max(1, currentQty - 1))}>
                      −
                    </button>
                    <span className="qty-val">{toPersianNumber(currentQty)}</span>
                    <button type="button" className="qty-btn" onClick={() => setCurrentQty(currentQty + 1)}>
                      +
                    </button>
                  </div>

                  <button type="button" className="btn btn--primary btn--lg" onClick={handleAddToCart}>
                    افزودن به سبد خرید
                  </button>

                  <button type="button" className="btn btn--secondary btn--lg" onClick={handleInstantBuy}>
                    خرید فوری
                  </button>
                </div>

                {/* Guarantees */}
                <div className="pdetail__guarantees">
                  <div className="guarantee-item">
                    <span>🛡️</span>
                    <span>۱۸ ماه ضمانت شرکتی با پوشش تعویض</span>
                  </div>
                  <div className="guarantee-item">
                    <span>📱</span>
                    <span>کد فعال‌سازی رسمی در سامانه همتا</span>
                  </div>
                  <div className="guarantee-item">
                    <span>📦</span>
                    <span>جعبه پلمپ کارخانه‌ای با تضمین اصالت</span>
                  </div>
                  <div className="guarantee-item">
                    <span>🚀</span>
                    <span>ارسال اکسپرس و بیمه‌شده کشوری</span>
                  </div>
                </div>

                <div className="pdetail__desc-box">
                  <h3>معرفی و بررسی اجمالی</h3>
                  <p>{product.fullDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Specifications Section */}
          <section className="pspecs">
            <div className="pspecs__header">
              <span className="pspecs__badge">معماری و سخت‌افزار</span>
              <h2 className="pspecs__title">مشخصات فنی تفصیلی و مهندسی</h2>
              <p className="pspecs__subtitle">
                تمام اجزای این پرچمدار با دقیق‌ترین استانداردهای بین‌المللی تحلیل و مستندسازی شده است.
              </p>
            </div>
            <div className="pspecs__grid">
              {specsList.map((s, idx) => (
                <div key={idx} className="pspecs__card">
                  <div className="pspecs__card-header">
                    <span className="pspecs__icon">{s.icon}</span>
                    <span className="pspecs__card-title">{s.label}</span>
                  </div>
                  <div className="pspecs__card-val">{s.val}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Products */}
          <section className="prelated">
            <div className="prelated__header">
              <h3 className="prelated__title">سایر پرچمداران پیشنهادی</h3>
              <Link href="/#collection" className="prelated__all">
                مشاهده همه پرچمداران ←
              </Link>
            </div>
            <div className="prelated__grid">
              {relatedProducts.map((p) => (
                <div key={p.id} className="product-card">
                  <Link href={`/product/${p.slug}`} className="product-card__thumb-link">
                    <img src={p.images[0]} alt={p.name} className="product-card__img" loading="lazy" decoding="async" />
                    {p.badge && <span className="product-card__badge">{p.badge}</span>}
                  </Link>
                  <div className="product-card__body">
                    <div className="product-card__brand">{p.brandName}</div>
                    <h4 className="product-card__title">
                      <Link href={`/product/${p.slug}`}>{p.name}</Link>
                    </h4>
                    <div className="product-card__price">{formatToman(p.basePrice)}</div>
                    <Link href={`/product/${p.slug}`} className="btn btn--secondary btn--block btn--sm">
                      مشاهده و خرید
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="pfoot">
        <div className="pfoot__container">
          <div className="pfoot__brand">
            <div className="pfoot__logo">
              INFINITY <span className="accent">PHONE</span>
            </div>
            <p className="pfoot__desc">
              فروشگاه فوق مدرن تلفن‌های همراه هوشمند پرچمدار، ضمانت ۱۸ ماهه اصالت، کد رجیستری اختصاصی همتا و ارسال فوق
              سریع بیمه‌شده.
            </p>
          </div>
          <div className="pfoot__links">
            <div className="pfoot__col">
              <div className="pfoot__col-title">پرچمداران</div>
              <Link href="/product/apple-iphone-16-pro-max">آیفون ۱۶ پرو مکس</Link>
              <Link href="/product/samsung-galaxy-s25-ultra">گلکسی S25 اولترا</Link>
              <Link href="/product/xiaomi-15-ultra">شیائومی ۱۵ اولترا</Link>
              <Link href="/product/google-pixel-9-pro-xl">پیکسل ۹ پرو XL</Link>
            </div>
            <div className="pfoot__col">
              <div className="pfoot__col-title">خدمات و پشتیبانی</div>
              <Link href="/faq">پرسش‌های متداول</Link>
              <Link href="/terms">شرایط و قوانین ضمانت</Link>
              <Link href="/privacy">حفظ حریم خصوصی</Link>
              <Link href="/accessibility">دسترس‌پذیری</Link>
            </div>
          </div>
        </div>
        <div className="pfoot__bottom">
          <p>© ۲۰۲۶ اینفینیتی فون (Infinity Phone). تمامی حقوق برای این تجربه مدرن محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}
