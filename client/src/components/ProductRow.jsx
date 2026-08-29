export default function ProductRow({ label, title, children }) {
  return (
    <section style={{ padding: '32px 28px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '2px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'var(--ff-mono)', fontSize: 'clamp(9px, .95vw, 13px)', fontWeight: 400, letterSpacing: '2px', color: 'var(--black)', margin: 0 }}>{label}</p>
          <p style={{ fontFamily: 'var(--ff-mono)', fontSize: 'clamp(18px, 2.5vw, 34px)', fontWeight: 500, color: 'var(--black)', marginTop: '2px', letterSpacing: '1px', margin: 0 }}>{title}</p>
        </div>
        <button style={{ border: '3px solid var(--black)', background: 'transparent', color: 'var(--black)', fontFamily: 'var(--ff-body)', fontSize: 'clamp(9px, .95vw, 13px)', fontWeight: 400, letterSpacing: '-0.5px', padding: '10px 24px', cursor: 'pointer', whiteSpace: 'nowrap', marginTop: '4px' }}>
          BROWSE ALL
        </button>
      </div>
      
      <div style={{ height: '2px', background: 'var(--black)', marginTop: '8px' }} />
      
      <div style={{ display: 'flex', gap: '24px', marginTop: '18px', alignItems: 'flex-start' }}>
        {children}
      </div>
    </section>
  );
}
