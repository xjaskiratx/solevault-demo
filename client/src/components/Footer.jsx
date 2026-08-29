import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <footer style={{ background: 'var(--black)', display: 'grid', gridTemplateColumns: '1fr 1.6fr 1.4fr 1fr', gap: 'clamp(24px, 3vw, 52px)', padding: 'clamp(36px, 5vw, 60px) clamp(28px, 3vw, 40px) clamp(28px, 4vw, 48px)', marginTop: 'clamp(28px, 4vw, 52px)' }}>
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--ff-logo)', color: 'var(--teal)', lineHeight: 1, userSelect: 'none' }}>
            <span style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}>S</span>
            <span style={{ fontSize: 'clamp(22px, 3.2vw, 44px)' }}>ole</span>
            <span style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}>V</span>
            <span style={{ fontSize: 'clamp(22px, 3.2vw, 44px)' }}>ault</span>
          </span>
          <p style={{ fontFamily: 'var(--ff-body)', fontSize: 'clamp(9px, .9vw, 13px)', fontWeight: 500, color: 'var(--white)', letterSpacing: 'clamp(6px, 1.2vw, 15px)', lineHeight: 2, marginTop: '14px', textTransform: 'uppercase', margin: 0 }}>
            AUTHENTIC NIKE<br />TRADING CARDS
          </p>
        </div>

        {/* Story */}
        <div>
          <p style={{ fontFamily: 'var(--ff-body)', fontSize: 'clamp(12px, 1.2vw, 18px)', fontWeight: 700, color: 'var(--white)', marginBottom: '10px' }}>OUR STORY</p>
          <p style={{ fontFamily: 'var(--ff-body)', fontSize: 'clamp(10px, .95vw, 14px)', color: 'var(--white)', lineHeight: 1.8, opacity: 0.88, margin: 0 }}>
            SoleVault began as a personal archive —<br />
            a way to document the culture weight each<br />
            sneaker carries.<br /><br />
            Every card is ranked, indexed and verified<br />
            by our very own RAW engine. This is the<br />
            next wave of collectibles.
          </p>
        </div>

        {/* Nav */}
        <div>
          <p style={{ fontFamily: 'var(--ff-body)', fontSize: 'clamp(12px, 1.2vw, 18px)', fontWeight: 700, color: 'var(--white)', marginBottom: '10px' }}>Navigation</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/collection" style={{ color: 'var(--white)', textDecoration: 'none', opacity: 0.85, fontSize: 'clamp(10px, .95vw, 14px)' }}>Collection</Link>
            <Link to="/" style={{ color: 'var(--white)', textDecoration: 'none', opacity: 0.85, fontSize: 'clamp(10px, .95vw, 14px)' }}>Dashboard</Link>
            <Link to="/add" style={{ color: 'var(--white)', textDecoration: 'none', opacity: 0.85, fontSize: 'clamp(10px, .95vw, 14px)' }}>Submit a card</Link>
          </div>
        </div>

        {/* Legal */}
        <div>
          <p style={{ fontFamily: 'var(--ff-body)', fontSize: 'clamp(12px, 1.2vw, 18px)', fontWeight: 700, color: 'var(--white)', marginBottom: '10px' }}>Legal</p>
          <p style={{ fontFamily: 'var(--ff-body)', fontSize: 'clamp(9px, .85vw, 13px)', color: 'var(--white)', opacity: 0.65, lineHeight: 1.95, margin: 0 }}>
            Privacy Policy<br />
            Terms of Use<br />
            Accessibility
          </p>
          <p style={{ fontFamily: 'var(--ff-body)', fontSize: 'clamp(9px, .85vw, 13px)', color: 'var(--white)', opacity: 0.65, marginTop: '26px', margin: 0 }}>
            Developed & Managed<br />
            by <strong>JSX Studios</strong>
          </p>
        </div>
      </footer>

      {/* Bottom Strip */}
      <div style={{ background: 'var(--black)', borderTop: '1px solid rgba(255,255,255,.1)', padding: '13px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--ff-body)', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '2.5px', textTransform: 'uppercase' }}>&copy; 2026 SoleVault &mdash; Oracle Edition</span>
        <span style={{ fontFamily: 'var(--ff-body)', fontSize: '10px', color: 'rgba(255,255,255,.35)', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Vol 1 &bull; All Rights Reserved</span>
      </div>
    </>
  );
}
