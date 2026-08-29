import { useState } from 'react';
import styles from './HeroBanner.module.css';

const ASSETS = {
  bg:   'https://www.figma.com/api/mcp/asset/bce8108a-d694-47c3-8dd9-9f28acb4a795',
  shoe: 'https://www.figma.com/api/mcp/asset/8570a912-f6fd-49c6-a1e4-236ea73a1b83',
  mask: 'https://www.figma.com/api/mcp/asset/bda152db-74f8-4ac2-a04e-5285aa07e669',
  atm:  'https://www.figma.com/api/mcp/asset/f74f599d-b432-49ab-959b-e11f1f97b063',
};

function SneakerCard({ transform, boxShadow }) {
  return (
    <div className={styles.sneakerCard} style={{ transform, boxShadow, overflow: 'hidden', borderRadius: '14px' }}>
      <img src="/Frame75.png" alt="Sneaker Card" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

export default function HeroBanner({ stats }) {
  const [hovered, setHovered] = useState(false);
  const cardTransforms = hovered
    ? [
        { transform: "rotate(-3.5deg) translateY(-10px) translateX(-5px)", boxShadow: "-3px -3px 10px 2px rgba(0,0,0,.38)" },
        { transform: "rotate(-2deg) translateY(-6px)",                  boxShadow: "3px 3px 8px rgba(0,0,0,.28)" },
        { transform: "rotate(-0.5deg) translateY(-2px)",                 boxShadow: "3px 3px 8px rgba(0,0,0,.28)" },
        { transform: "rotate(1.2deg) translateY(3px)",                  boxShadow: "3px 3px 8px rgba(0,0,0,.28)" },
      ]
    : [
        { transform: "rotate(-2.5deg) translateY(-6px)", boxShadow: "-3px -3px 10px 2px rgba(0,0,0,.38)" },
        { transform: "rotate(-1.4deg) translateY(-3px)", boxShadow: "3px 3px 8px rgba(0,0,0,.28)" },
        { transform: "rotate(-0.4deg)",                  boxShadow: "3px 3px 8px rgba(0,0,0,.28)" },
        { transform: "rotate(0.6deg) translateY(2px)",   boxShadow: "3px 3px 8px rgba(0,0,0,.28)" },
      ];

  return (
    <section className={styles.hero}>
      <p className={styles.tagline}>
        AUTHENTIC NIKE<br />TRADING CARDS
      </p>
      
      <div className={styles.rule} />

      <div className={styles.body}>
        <div 
          className={styles.cardStack}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {cardTransforms.map((config, i) => (
            <SneakerCard key={i} {...config} />
          ))}
        </div>

        <div className={styles.statsPanel}>
          <p className={styles.statsDesc}>
            {stats?.total || 80}&nbsp; CARDS RANKED, INDEXED AND<br />
            VERIFIED BY OUR VERY OWN RAW ENGINE.<br />
            THIS, IS THE NEXT WAVE OF COLLECTIBLES.
          </p>
          <div className={styles.statsRow}>
            {[
              { label: "Volume", value: "01" },
              { label: "Current Edition", value: "ORACLE" },
              { label: "Cards", value: stats?.total || "80" },
            ].map(({ label, value }) => (
              <div key={label} className={styles.statItem}>
                <span className={styles.statLabel}>{label}</span>
                <span className={styles.statValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.strip}>
        UPDATES <span className={styles.accent}>EVERY</span> WEEK &nbsp;|&nbsp;
        <span className={styles.accent}>6</span> RARITY TIERS &nbsp;|&nbsp;
        <span className={styles.accent}>4</span> SERIES STRUCTURE &nbsp;|&nbsp;
        <span className={styles.accent}>SERIALIZED</span> CARDS
      </p>

      <div 
        className={styles.swipeCta} 
        onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span>SWIPE UP TO EXPLORE</span>
        <div className={styles.swipeArrow} />
      </div>
    </section>
  );
}
