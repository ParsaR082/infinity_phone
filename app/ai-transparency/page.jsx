import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'AI transparency statement — Infinity Phone',
  description: 'Where artificial intelligence was used in making infinityphone.ir, what is real, and what AI is not used for.',
};

export default function AiTransparencyPage() {
  return (
    <div style={{ backgroundColor: '#EDE4D2', color: '#211A12', minHeight: '100vh', direction: 'ltr', textAlign: 'left', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '24px 36px', borderBottom: '1px solid rgba(33, 26, 18, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', textDecoration: 'none', color: '#211A12' }}>
          ∞ INFINITY PHONE
        </Link>
        <Link href="/" style={{ textDecoration: 'none', color: '#C96F4A', fontWeight: 600 }}>
          Back to store &rarr;
        </Link>
      </header>

      <main style={{ maxWidth: '820px', margin: '48px auto 96px', padding: '0 24px', lineHeight: 1.7 }}>
        <p style={{ fontSize: '0.85rem', color: '#706A5E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Last updated: 5 October 2026</p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '16px 0 24px' }}>AI transparency statement</h1>
        <p style={{ fontSize: '1.15rem', color: '#5E594E', marginBottom: '40px' }}>
          Some of the imagery and animations on this site were designed with generative AI tools. This page says exactly which, what is real, and what we do not use AI for.
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>What is real</h2>
          <ul style={{ paddingLeft: '24px' }}>
            <li style={{ marginBottom: '10px' }}><strong>The product.</strong> All flagship smartphones presented are genuine physical retail products with real manufacturer specifications and official IMEI registry in Iran.</li>
            <li style={{ marginBottom: '10px' }}><strong>The guarantees.</strong> Official 18-month corporate warranty, 7-day technical testing policy, and insured postal dispatch.</li>
            <li style={{ marginBottom: '10px' }}><strong>The claims.</strong> Product specifications and engineering analyses on this site are verified against official manufacturer documentation.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Where AI was used</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', background: '#F6F0E2', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(33, 26, 18, 0.15)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>Content</th>
                <th style={{ padding: '12px 16px' }}>AI involvement</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(33, 26, 18, 0.08)' }}>
                <td style={{ padding: '12px 16px' }}>3D concept imagery & cyberpunk background glow</td>
                <td style={{ padding: '12px 16px' }}>Generated with generative visual tools, retouched and graded by designers</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(33, 26, 18, 0.08)' }}>
                <td style={{ padding: '12px 16px' }}>Hardware architecture illustration backgrounds</td>
                <td style={{ padding: '12px 16px' }}>Generated with AI image tools to illustrate internal nano-architecture</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px' }}>Website code and localization assistance</td>
                <td style={{ padding: '12px 16px' }}>Written with the assistance of advanced AI coding assistants, reviewed before deployment</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>What we do not use AI for</h2>
          <ul style={{ paddingLeft: '24px' }}>
            <li style={{ marginBottom: '10px' }}>We do not publish AI-generated fake customer reviews or simulated testimonials.</li>
            <li style={{ marginBottom: '10px' }}>No automated credit decisions or intrusive user profiling takes place.</li>
            <li style={{ marginBottom: '10px' }}>Real human customer service representatives handle customer inquiries and warranty requests.</li>
          </ul>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid rgba(33, 26, 18, 0.1)', padding: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#706A5E' }}>
        <p>© 2026 Infinity Phone. Designed for luxury tech enthusiasts.</p>
      </footer>
    </div>
  );
}

