import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'پرسش‌های متداول و راهنمای خرید | اینفینیتی فون (Infinity Phone)',
  description: 'پاسخ به متداول‌ترین پرسش‌های خریداران درباره رجیستری همتا، شرایط گارانتی ۱۸ ماهه، اصالت کالا، ارسال اکسپرس و مهلت تست ۷ روزه در اینفینیتی فون.',
};

export default function FaqPage() {
  return (
    <div className="product-page">
      {/* Header */}
      <header className="pbar">
        <div className="pbar__container">
          <div className="pbar__right">
            <Link href="/" className="pbar__logo">
              <span className="pbar__logo-icon">∞</span>
              <span className="pbar__logo-text">INFINITY <span className="accent">PHONE</span></span>
            </Link>
            <nav className="pbar__nav">
              <Link href="/#collection" className="pbar__nav-link">مجموعه گوشی‌ها</Link>
              <Link href="/#brands" className="pbar__nav-link">برندها</Link>
              <Link href="/#tech" className="pbar__nav-link">فناوری</Link>
              <Link href="/faq" className="pbar__nav-link active">پرسش‌های متداول</Link>
            </nav>
          </div>

          <div className="pbar__left">
            <Link href="/" className="btn btn--secondary btn--sm">
              <span>بازگشت به فروشگاه اصلی</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="faq-container" style={{ maxWidth: '900px', margin: '60px auto 100px', padding: '0 24px' }}>
        <div className="faq-header" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="faq-badge" style={{ color: '#00f59b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'inline-block' }}>
            راهنمای شفاف و کامل
          </span>
          <h1 className="faq-title" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }}>
            پرسش‌های متداول خریداران
          </h1>
          <p className="faq-desc" style={{ color: '#8e8e99', fontSize: '1.05rem' }}>
            پاسخ شفاف به تمامی سوالات شما درباره فرآیند خرید، رجیستری و گارانتی پرچمداران.
          </p>
        </div>

        <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="faq-item" style={{ background: '#121217', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '28px' }}>
            <h3 className="faq-q" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00f59b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>Q.</span> آیا تمام گوشی‌های ارائه‌شده دارای رجیستری رسمی در سامانه همتا هستند؟
            </h3>
            <p className="faq-a" style={{ color: '#c4c4cc', fontSize: '0.98rem', lineHeight: 1.8 }}>
              بله، ۱۰۰٪ گوشی‌های عرضه‌شده در اینفینیتی فون به‌صورت کاملاً قانونی وارد کشور شده، حقوق و عوارض گمرکی آن‌ها پرداخت گردیده و همراه با کد فعال‌سازی رسمی همتا ارائه می‌شوند. پیامک فعال‌سازی بلافاصله پس از ثبت سفارش برای شماره همراه خریدار ارسال می‌گردد.
            </p>
          </div>

          <div className="faq-item" style={{ background: '#121217', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '28px' }}>
            <h3 className="faq-q" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00f59b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>Q.</span> شرایط و مدت زمان گارانتی دستگاه‌ها به چه صورت است؟
            </h3>
            <p className="faq-a" style={{ color: '#c4c4cc', fontSize: '0.98rem', lineHeight: 1.8 }}>
              تمامی پرچمداران دارای ۱۸ ماه گارانتی شرکتی جامع و معتبر هستند. این ضمانت‌نامه شامل خرابی‌های سخت‌افزاری پردازنده، مادربرد، نمایشگر، باتری و اتصالات فیزیکی دستگاه مطابق با استانداردهای رسمی تولیدکننده می‌باشد.
            </p>
          </div>

          <div className="faq-item" style={{ background: '#121217', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '28px' }}>
            <h3 className="faq-q" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00f59b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>Q.</span> مهلت تست ۷ روزه چیست و چه مواردی را پوشش می‌دهد؟
            </h3>
            <p className="faq-a" style={{ color: '#c4c4cc', fontSize: '0.98rem', lineHeight: 1.8 }}>
              خریدار محترم از لحظه تحویل بسته پستی، به مدت ۷ روز تمام تقویمی فرصت دارد تا کارکرد فنی، سلامت فیزیکی، پیکسل‌های نمایشگر و عدم وجود هرگونه نقص ساختاری را بررسی نماید. در صورت وجود هرگونه مشکل، تعویض فوری دستگاه انجام می‌پذیرد.
            </p>
          </div>

          <div className="faq-item" style={{ background: '#121217', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '28px' }}>
            <h3 className="faq-q" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00f59b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>Q.</span> نحوه ارسال سفارش‌ها و بیمه مرسولات چگونه است؟
            </h3>
            <p className="faq-a" style={{ color: '#c4c4cc', fontSize: '0.98rem', lineHeight: 1.8 }}>
              سفارش‌های تهران از طریق پیک ویژه اختصاصی و در کمتر از ۳ ساعت کاری تحویل می‌گردند. سفارش‌های سایر استان‌ها با پست پیشتاز یا تیپاکس هوایی و تحت پوشش بیمه ۱۰۰٪ ارزش ریالی کالا ارسال می‌شوند تا ریسک هرگونه آسیب احتمالی در حمل‌ونقل به صفر برسد.
            </p>
          </div>

          <div className="faq-item" style={{ background: '#121217', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '28px' }}>
            <h3 className="faq-q" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00f59b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>Q.</span> آیا امکان خرید حضوری یا پرداخت در محل وجود دارد؟
            </h3>
            <p className="faq-a" style={{ color: '#c4c4cc', fontSize: '0.98rem', lineHeight: 1.8 }}>
              برای خریداران ساکن در شهر تهران، امکان انتخاب گزینه «پرداخت در محل پس از بررسی و تست کد فعال‌سازی همتا» فراهم است تا با آرامش خاطر کامل کالای خود را دریافت نمایند.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pfoot">
        <div className="pfoot__container">
          <div className="pfoot__brand">
            <div className="pfoot__logo">INFINITY <span className="accent">PHONE</span></div>
            <p className="pfoot__desc">فروشگاه فوق مدرن تلفن‌های همراه هوشمند پرچمدار، ضمانت ۱۸ ماهه اصالت، کد رجیستری اختصاصی همتا و ارسال فوق سریع بیمه‌شده.</p>
          </div>
        </div>
        <div className="pfoot__bottom">
          <p>© ۲۰۲۶ اینفینیتی فون (Infinity Phone). تمامی حقوق برای این تجربه مدرن محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}

