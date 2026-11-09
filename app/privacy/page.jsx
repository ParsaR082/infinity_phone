import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'حفظ حریم خصوصی و امنیت داده‌ها | اینفینیتی فون',
};

export default function PrivacyPage() {
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00f59b', marginBottom: '24px' }}>حفظ حریم خصوصی و امنیت کاربران</h1>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            فروشگاه اینفینیتی فون به حریم خصوصی کلیه مشتریان گرامی احترام گذاشته و متعهد به حفظ بالاترین استانداردهای رمزنگاری اطلاعات است.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '28px 0 12px', color: '#fff' }}>۱. اطلاعات گردآوری‌شده</h2>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            اطلاعات ثبت‌شده در فرآیند سفارش شامل نام، نشانی پستی و شماره تماس صرفاً برای ارسال مرسوله، اطلاع‌رسانی پیامکی کد رجیستری و خدمات پشتیبانی استفاده می‌شود و تحت هیچ شرایطی در اختیار اشخاص ثالث قرار نمی‌گیرد.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '28px 0 12px', color: '#fff' }}>۲. امنیت تراکنش‌های بانکی</h2>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            کلیه درگاه‌های پرداخت متصل به شبکه الکترونیکی پرداخت کارت (شاپرک) بوده و اطلاعات محرمانه بانکی توسط پروتکل‌های رمزنگاری پیشرفته TLS محافظت می‌گردند.
          </p>
        </div>
      </div>
    </div>
  );
}

