import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'شرایط و قوانین گارانتی و خدمات | اینفینیتی فون',
};

export default function TermsPage() {
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00f59b', marginBottom: '24px' }}>شرایط و قوانین گارانتی و خدمات</h1>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            کلیه فعالیت‌های فروشگاه اینفینیتی فون منطبق بر قوانین تجارت الکترونیک و حمایت از حقوق مصرف‌کنندگان جمهوری اسلامی ایران است.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '28px 0 12px', color: '#fff' }}>۱. ثبت و استعلام در سامانه همتا</h2>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            هر دستگاه تلفن همراه دارای شناسه بین‌المللی یکتا (IMEI) بوده که پیش از تحویل در سامانه همتا استعلام قانونی شده و کد فعال‌سازی آن در جعبه پلمپ قرار دارد. خریدار موظف است در حضور پیک یا طی مهلت تست، انتقال مالکیت به شماره همراه خود را نهایی فرماید.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '28px 0 12px', color: '#fff' }}>۲. تعهدات گارانتی ۱۸ ماهه</h2>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            گارانتی شرکتی ارائه‌شده شامل کلیه خدمات پس از فروش استاندارد، تعمیر یا تعویض قطعات اصلی با گارانتی کارخانه سازنده می‌باشد. صدمات ناشی از ضربه شدید، نفوذ مایعات به دستگاه‌های فاقد استاندارد ضدآب، و دستکاری نرم‌افزاری غیرمجاز مشمول گارانتی نخواهد بود.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '28px 0 12px', color: '#fff' }}>۳. بازگشت کالا در مهلت تست ۷ روزه</h2>
          <p style={{ color: '#c4c4cc', marginBottom: '16px', fontSize: '0.98rem', lineHeight: 1.8 }}>
            در صورتی که دستگاه ارسالی دارای نقص فنی ذاتی باشد، خریدار می‌تواند ظرف مدت ۷ روز نسبت به عودت کالا اقدام نموده و کالای نو دریافت کند یا درخواست استرداد وجه نماید.
          </p>
        </div>
      </div>
    </div>
  );
}

