import { useEffect, useState } from 'react';
import { fetchStats, fetchSneakers } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import ProductRow from '../components/ProductRow';
import ProductCard from '../components/ProductCard';

const CATEGORY_CONFIG = [
  { key: 'Famous',        label: 'ISSUE 01 • HIGH VOLUME LEGENDS', title: 'ICON SERIES' },
  { key: 'Rare',          label: 'ISSUE 02 • HISTORICAL RARITIES', title: 'GRAIL SET' },
  { key: 'Collaboration', label: 'ISSUE 03 • PARTNER RELEASES',    title: 'COLLABORATIONS' },
];

export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [statsRes, ...sectionRes] = await Promise.all([
        fetchStats(),
        ...CATEGORY_CONFIG.map(c =>
          fetchSneakers({ category: c.key, limit: 3, sort: '-nameScore' })
        ),
      ]);
      setStats(statsRes.data.data);
      const map = {};
      CATEGORY_CONFIG.forEach((c, i) => { map[c.key] = sectionRes[i].data.data; });
      setSections(map);
      setLoading(false);
    };
    load().catch(console.error);
  }, []);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'var(--ff-body)' }}>Loading Oracle Data...</div>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <HeroBanner stats={stats} />
      
      <div id="collection">
        {CATEGORY_CONFIG.map(cat => (
          <ProductRow key={cat.key} label={cat.label} title={cat.title}>
            {(sections[cat.key] || []).map(item => (
              <div key={item._id} style={{ flex: 1, minWidth: 0 }}>
                <ProductCard 
                  id={item._id}
                  name={item.name}
                  model={item.model}
                  score={item.nameScore?.toFixed(2)}
                />
              </div>
            ))}
          </ProductRow>
        ))}
      </div>
    </div>
  );
}
