import './globals.css';
import Script from 'next/script';
import ClientInitializer from '../components/ClientInitializer';
import Modals from '../components/Modals';

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'اینفینیتی فون — فروشگاه تخصصی گوشی‌های هوشمند پرچمدار | Infinity Phone',
  description:
    'فروشگاه تخصصی اینفینیتی فون (Infinity Phone). جدیدترین گوشی‌های هوشمند پرچمدار اپل، سامسونگ، شیائومی، گوگل پیکسل و ناتینگ با ضمانت اصالت ۱۸ ماهه، رجیستری رسمی همتا و ارسال اکسپرس بیمه‌شده.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'http://localhost:3000/',
    siteName: 'اینفینیتی فون — Infinity Phone',
    title: 'اینفینیتی فون — فروشگاه تخصصی گوشی‌های هوشمند پرچمدار',
    description: 'جدیدترین پرچمداران دنیای فناوری با گارانتی ۱۸ ماهه و رجیستری رسمی همتا',
    images: ['/assets/images/hero/hero-phone-flagship.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="theme-color" content="#08080a" />
        <link rel="preload" href="/assets/fonts/Vazirmatn-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/fonts/GeistMono-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <Script src="/vendor/gsap.min.js" strategy="beforeInteractive" />
        <Script src="/vendor/ScrollTrigger.min.js" strategy="beforeInteractive" />
        <Script src="/vendor/lenis.min.js" strategy="beforeInteractive" />
        <Script src="/assets/data/products.js" strategy="beforeInteractive" />
        <Script src="/assets/js/store.js" strategy="beforeInteractive" />

        <ClientInitializer />
        {children}
        <Modals />
      </body>
    </html>
  );
}

