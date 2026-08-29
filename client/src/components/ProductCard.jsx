import { Link } from 'react-router-dom';

const ASSETS = {
  bg:   'https://www.figma.com/api/mcp/asset/bce8108a-d694-47c3-8dd9-9f28acb4a795',
  shoe: 'https://www.figma.com/api/mcp/asset/8570a912-f6fd-49c6-a1e4-236ea73a1b83',
  mask: 'https://www.figma.com/api/mcp/asset/bda152db-74f8-4ac2-a04e-5285aa07e669',
  atm:  'https://www.figma.com/api/mcp/asset/f74f599d-b432-49ab-959b-e11f1f97b063',
};

export default function ProductCard({ id, name, model, score }) {
  return (
    <Link to={`/card/${id}`} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '484/277', borderRadius: '14px', overflow: 'hidden', background: '#fff', boxShadow: '2px 2px 8px rgba(0,0,0,.22)', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
        <img src="/Frame75.png" alt={name || "Sneaker Card"} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      <div style={{ marginTop: '10px', fontFamily: 'var(--ff-body)', color: 'var(--black)' }}>
        <p style={{ fontSize: 'clamp(10px, 1.2vw, 16px)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{name}</p>
        <p style={{ fontSize: 'clamp(9px, .9vw, 13px)', margin: 0 }}>ORACLE SCORE: <strong>{score || '0.00'}</strong></p>
      </div>
    </Link>
  );
}
