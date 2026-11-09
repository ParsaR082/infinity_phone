import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'اطلاعیه حقوقی | اینفینیتی فون',
};

export default function LegalNoticePage() {
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00f59b', marginBottom: '24px' }}>اطلاعیه حقوقی و مالکیت برند</h1>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            کلیه نشان‌های تجاری، نام‌های تجاری و علائم شرکت‌های اپل، سامسونگ، شیائومی، گوگل، ناتینگ و وان‌پلاس متعلق به مالکان قانونی آن‌ها بوده و استفاده از آن‌ها در این وب‌سایت صرفاً جهت معرفی و شناسایی محصولات تجاری است.
          </p>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            فروشگاه اینفینیتی فون ارائه‌دهنده مستقل گوشی‌های هوشمند قانونی و ریجیسترشده در بازار فناوری است.
          </p>
        </div>
      </div>
    </div>
  );
}

