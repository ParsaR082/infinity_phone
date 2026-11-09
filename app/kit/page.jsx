import React from 'react';
import Script from 'next/script';
import Link from 'next/link';

export const metadata = {
  title: 'Infinity — Team Kit Room',
  description: "Configure your team's Infinity socks — every player's initials embroidered at the ankle.",
};

export default function KitPage() {
  return (
    <div className="kit-body">
      <header className="kit-bar">
        <Link className="kit-bar__logo" href="/" aria-label="Infinity — back to the site">
          <svg viewBox="0 0 97.96 38.16" fill="currentColor" role="img" aria-label="Infinity" style={{ width: '3.25em' }}>
            <path d="M22.96,38.16h-4.83c-8.58-.84-15.82-6.67-18.13-14.97v-7.18C1.53,9.19,6.12,3.51,13.39,1.71c15.09-3.74,24.42,3.36,35.52,12.71,4.54-3.82,8.8-7.53,13.75-10.56,7.12-4.36,18.28-5.34,25.92-1.32s10.95,13.09,8.61,21.29-9.7,13.03-18.46,13.48c-11.84.61-20.27-6.88-29.73-13.93-8.71,6.95-15.47,12.89-26.04,14.79ZM81.46,29.81c5.58-1.59,8.87-6.28,8.77-11.72s-4.17-9.61-9.73-10.71c-10.76-1.58-18.28,4.47-26.7,11.74,8.85,6.07,17.16,12.96,27.66,10.68ZM44.16,19.22c-4.08-3.25-7.19-5.58-10.86-8.1-4.8-2.55-9.9-3.93-15.32-3.13s-9.77,4.93-10.22,10.15,2.69,10.48,8.08,12.14c10.07,3.1,19.95-4.89,28.32-11.07Z" />
          </svg>
        </Link>
        <span className="kit-bar__label">Team Kit Room</span>
        <Link className="kit-bar__back" href="/">Back to store &rarr;</Link>
      </header>

      <main className="kit" id="kit-main" tabIndex="-1">
        <section className="kit__stage" aria-label="Live preview">
          <div className="kit__frame" data-kit-stage>
            <div className="kit__photo" data-kit-photo>
              <img
                className="kit__plate"
                src="/assets/teamknit/photo-hf-flat-2048-logo.webp"
                alt="Infinity performance socks on court"
                data-kit-img-bg
              />
              <canvas className="kit__cnv" data-kit-canvas hidden aria-label="Live preview of your initials embroidered on the sock"></canvas>
            </div>
            <span className="grain" aria-hidden="true"></span>
            <div className="kit__vignette" aria-hidden="true"></div>
          </div>
        </section>

        <aside className="kit__panel">
          <div className="kit__panel-scroll">
            <header className="kit__head">
              <h1 className="kit__h1">Get your custom offer.</h1>
              <p className="kit__from">from <strong>&euro;7.90 / pair</strong> &middot; minimum run 100 pairs</p>
            </header>

            <section className="kit__step" data-kit-step="colorway">
              <h2 className="kit__step-title">
                <button className="kit__step-head" type="button" data-kit-fold aria-expanded="true">
                  <span className="kit__step-name">Colorway</span>
                  <span className="kit__step-pick" data-kit-out="colorway">White</span>
                  <span className="kit__step-toggle" aria-hidden="true"></span>
                </button>
              </h2>
              <div className="kit__step-body">
                <div className="kit__opts kit__opts--swatch">
                  <label className="kit__opt is-selected" data-kit-opt="colorway:wht">
                    <input type="radio" name="colorway" value="wht" defaultChecked />
                    <span className="kit__opt-title">Home Court White</span>
                    <span className="kit__opt-sub">Classic White</span>
                  </label>
                  <label className="kit__opt" data-kit-opt="colorway:blk">
                    <input type="radio" name="colorway" value="blk" />
                    <span className="kit__opt-title">Away Court Black</span>
                    <span className="kit__opt-sub">Stealth Black</span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </main>

      <Script src="/bundle/kit-BkhWld4W.js" strategy="lazyOnload" type="module" />
    </div>
  );
}

