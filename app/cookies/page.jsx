import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'سیاست کوکی‌ها | اینفینیتی فون',
};

export default function CookiesPage() {
  return (
    <div className="product-page">
      <header className="pbar">
        <div className="pbar__container">
          <Link href="/" className="pbar__logo">
            <span className="pbar__logo-icon">∞</span>
            <span className="pbar__logo-text">INFINITY <span className="accent">PHONE</span></span>
          </Link>
          <Link href="/" className="btn btn--secondary btn--sm">بازگشت به فروشگاه</Link>
        </div>
      </header>
      <div className="legal-box" style={{ maxWidth: '860px', margin: '60px auto 100px', padding: '0 24px' }}>
        <div className="legal-card" style={{ background: '#121217', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '36px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00f59b', marginBottom: '24px' }}>سیاست استفاده از کوکی‌ها</h1>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            وب‌سایت اینفینیتی فون از کوکی‌های ضروری صرفاً جهت ذخیره‌سازی اقلام سبد خرید، لیست علاقه‌مندی‌ها و تنظیمات نمایشی زبان و تم در حافظه محلی مرورگر (Local Storage) استفاده می‌نماید.
          </p>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            این کوکی‌ها حاوی هیچ‌گونه اطلاعات شخصی یا حساس نبوده و تجربه خریدی سریع و بدون نیاز به ورود مجدد را برای شما فراهم می‌آورند.
          </p>
        </div>
      </div>
    </div>
  );
}

