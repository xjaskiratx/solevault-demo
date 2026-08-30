import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchSneaker, deleteSneaker } from '../services/api';
import styles from './CardDetail.module.css';

const RARITY_CONFIG = {
  '1of1': { color: '#B8860B', label: 'ONE / ONE', bg: 'var(--pale-amber)' },
  'XR':   { color: '#5D3FD3', label: 'X-RARE',   bg: 'var(--pale-violet)' },
  'R':    { color: '#2C3E50', label: 'RARE',     bg: 'var(--pale-sky)'    },
  'U':    { color: '#1a6e8e', label: 'UNCOMMON', bg: 'var(--pale-sage)'   },
  'C':    { color: '#7C7C7C', label: 'COMMON',   bg: 'var(--pale-rose)'   },
};

function ScoreBar({ label, value, max = 100, color = 'var(--accent)' }) {
  return (
    <div className={styles.scoreBar}>
      <div className={styles.scoreBarHeader}>
        <span>{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className={styles.scoreBarTrack}>
        <div className={styles.scoreBarFill} style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  );
}

export default function CardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sneaker, setSneaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [side, setSide] = useState('front'); // 'front' or 'back'
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    fetchSneaker(id)
      .then(r => setSneaker(r.data.data))
      .catch(() => navigate('/collection'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!confirm('Remove this card from the vault?')) return;
    setDeleting(true);
    try { await deleteSneaker(id); navigate('/collection'); }
    catch { setDeleting(false); }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className="skeleton" style={{ width: 48, height: 48 }} />
    </div>
  );
  if (!sneaker) return null;

  const rarityInfo = RARITY_CONFIG[sneaker.rarity] || RARITY_CONFIG.C;
  const shortId = (sneaker._id || '0000').slice(-4).toUpperCase();
  const cardId = `SV-${(sneaker.category || 'XX').slice(0,2).toUpperCase()}-${shortId}`;

  return (
    <div className={styles.page} style={{ backgroundColor: rarityInfo.bg }}>
      <div className={styles.container}>
        <Link to="/collection" className={styles.back}>← Back to Collection</Link>

        {/* Feature Header */}
        <div className={styles.articleHeader}>
          <div>
            <div className={styles.catTag}>{sneaker.category} · {sneaker.releaseType}</div>
            <h1 className={styles.commonName}>{sneaker.commonName || sneaker.primaryName}</h1>
            <p className={styles.colorway}>{sneaker.officialColorway || 'Original'}</p>
          </div>
          <div className={styles.priceBlock}>
            <span className={styles.priceLbl}>Authenticated Value</span>
            <span className={styles.priceVal}>
              ${(sneaker.currentPriceINR / 83).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Article Body */}
        <div className={styles.layout}>
          {/* Left: Interactive Card */}
          <div className={styles.left}>
            <div 
              ref={cardRef}
              className={styles.cardContainer} 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={handleMouseMove}
            >
              <div className={`${styles.cardFace} ${side === 'front' ? styles.visible : styles.hidden}`}>
                <img src="/Frame75.png" alt="Card Front" className={styles.cardImg} />
                <div className={styles.overlay}>
                  <div className={styles.cardName}>{sneaker.primaryName}</div>
                  <div className={styles.scoreBox}>
                    <span className={styles.scoreNum}>{Math.round(sneaker.nameScore)}</span>
                    <span className={styles.scoreTag}>Name Score</span>
                  </div>
                </div>
              </div>
              
              <div className={`${styles.cardFace} ${side === 'back' ? styles.visible : styles.hidden}`}>
                <img src="/Frame76.png" alt="Card Back" className={styles.cardImg} />
                <div className={styles.overlay}>
                  <div className={styles.cardId}>{cardId}</div>
                  <div className={styles.stats}>
                    <div className={styles.price}>
                      <span className={styles.priceLabel}>Market Value</span>
                      <span>${(sneaker.currentPriceINR / 83).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className={styles.rarity} style={{ color: rarityInfo.color }}>
                      {rarityInfo.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Selection */}
            <div className={styles.sideControls}>
              <button 
                className={`${styles.sideBtn} ${side === 'front' ? styles.sideActive : ''}`}
                onClick={() => setSide('front')}
              >
                FRONT VIEW
              </button>
              <button 
                className={`${styles.sideBtn} ${side === 'back' ? styles.sideActive : ''}`}
                onClick={() => setSide('back')}
              >
                BACK VIEW
              </button>
            </div>

            {/* Oracle Scoring */}
            <div className={styles.breakdown}>
              <div className={styles.breakdownTitle}>Oracle Scoring Breakdown</div>
              <ScoreBar label="Popularity ×0.40"       value={sneaker.popularityScore || 0}    color="#000000" />
              <ScoreBar label="Platform Usage ×0.25"   value={sneaker.platformUsageScore || 0} color="#555555" />
              <ScoreBar label="Longevity ×0.20"        value={sneaker.longevityScore || 0}     max={20} color="#888888" />
              <ScoreBar label="Authority ×0.15"        value={sneaker.authorityScore || 0}     max={15} color="#AAAAAA" />
            </div>
          </div>

          {/* Right: Technical details or Zoom Preview */}
          <div className={styles.right}>
            {isHovered ? (
              <div className={styles.zoomWrapper}>
                <div 
                  className={styles.zoomPreview}
                  style={{ 
                    backgroundImage: `url(${side === 'front' ? '/Frame75.png' : '/Frame76.png'})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`
                  }}
                />
                <p className={styles.zoomHint}>ENHANCED INSPECTION MODE</p>
              </div>
            ) : (
              <div className={styles.details}>
                <div className={styles.detailsHeader}>DOCUMENTED SPECIFICATIONS</div>
                {[
                  ['Style ID',      sneaker.styleCode,  true],
                  ['Collection',    sneaker.category,   false],
                  ['Primary Color', sneaker.colorTag,   false],
                  ['Release Year',  sneaker.releaseYear || sneaker.modelYear, false],
                  ['Card ID',       cardId,             true],
                  ['Dimensions',    '1050 × 600 PX',    true],
                  ['Last Verified', sneaker.lastSynced
                    ? new Date(sneaker.lastSynced).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Active', false],
                ].map(([label, val, mono]) => (
                  <div key={label} className={styles.detailRow}>
                    <span className={styles.detailLabel}>{label}</span>
                    <span className={`${styles.detailVal} ${mono ? styles.mono : ''}`}>{val || '—'}</span>
                  </div>
                ))}

                <div className={styles.actions}>
                  <Link to={`/add?edit=${id}`} className={styles.editBtn}>Modify Entry</Link>
                  <button className={styles.deleteBtn} onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
