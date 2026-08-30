import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchSneakers } from '../services/api';
import SneakerCard from '../components/SneakerCard';
import CustomSelect from '../components/CustomSelect';

const T = {
  black:      "#000000",
  white:      "#ffffff",
  fontMono:   "'DM Mono', monospace",
  fontBody:   "'DM Sans', sans-serif",
};

const RARITY_OPTS = [
  { value: '', label: 'All Rarities' },
  { value: 'C',    label: 'Common' },
  { value: 'U',    label: 'Uncommon' },
  { value: 'R',    label: 'Rare' },
  { value: 'SR',   label: 'Super Rare' },
  { value: 'XR',   label: 'X-Rare' },
  { value: '1/1',  label: 'One / One' },
];

const CATEGORY_OPTS = [
  { value: '', label: 'All Categories' },
  { value: 'Famous',        label: 'Icon Series' },
  { value: 'Rare',          label: 'Grail Set' },
  { value: 'Collaboration', label: 'Collaborations' },
  { value: 'Common',        label: 'Base Set' },
];

const RELEASE_OPTS = [
  { value: '', label: 'All Types' },
  { value: 'GR',      label: 'General Release' },
  { value: 'Collab',  label: 'Collab' },
  { value: 'Limited', label: 'Limited' },
  { value: 'Retro',   label: 'Retro' },
  { value: 'PE',      label: 'Player Exclusive' },
];

const SORT_OPTS = [
  { value: '-nameScore',      label: 'Score — High' },
  { value: 'nameScore',       label: 'Score — Low' },
  { value: '-currentPriceINR',label: 'Price — High' },
  { value: 'currentPriceINR', label: 'Price — Low' },
  { value: 'primaryName',     label: 'Name A → Z' },
];

export default function CollectionPage() {
  const [params, setParams] = useSearchParams();
  const [sneakers, setSneakers] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const searchRef               = useRef(null);

  const search      = params.get('search')      || '';
  const category    = params.get('category')    || '';
  const rarity      = params.get('rarity')      || '';
  const releaseType = params.get('releaseType')  || '';
  const sort        = params.get('sort')         || '-nameScore';

  const updateParam = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    next.delete('page');
    setParams(next);
    setPage(1);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchSneakers({
        search, category, rarity, releaseType, sort, page, limit: 12,
      });
      setSneakers(data.data);
      setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, category, rarity, releaseType, sort, page]);

  useEffect(() => { load(); }, [load]);

  const hasFilters = search || category || rarity || releaseType;
  const clearAll   = () => { setParams({}); setPage(1); };

  return (
    <div style={{ background: T.white, minHeight: '100vh', padding: '40px 24px' }}>
      
      {/* Magazine Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, borderBottom: `3px solid ${T.black}`, paddingBottom: 12 }}>
        <div>
          <p style={{ margin: 0, fontFamily: T.fontMono, fontSize: 13, letterSpacing: 2 }}>THE ARCHIVE</p>
          <h1 style={{ margin: '4px 0 0', fontFamily: T.fontMono, fontSize: 'clamp(24px, 4vw, 48px)', fontWeight: 500, letterSpacing: 1 }}>COLLECTION</h1>
        </div>
        <p style={{ margin: 0, fontFamily: T.fontBody, fontSize: 14, letterSpacing: 1 }}>
          <span style={{ fontWeight: 800, fontSize: 24 }}>{loading ? '—' : total}</span> CARDS INDEXED
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
            <input 
                value={search}
                onChange={e => updateParam('search', e.target.value)}
                placeholder="SEARCH ARCHIVE..."
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontFamily: T.fontBody,
                    fontSize: 14,
                    border: `1.5px solid ${T.black}`,
                    borderRadius: 0,
                    outline: 'none',
                    letterSpacing: 1
                }}
            />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <CustomSelect value={category} onChange={v => updateParam('category', v)} options={CATEGORY_OPTS} placeholder="CATEGORY" />
            <CustomSelect value={rarity} onChange={v => updateParam('rarity', v)} options={RARITY_OPTS} placeholder="RARITY" />
            <CustomSelect value={releaseType} onChange={v => updateParam('releaseType', v)} options={RELEASE_OPTS} placeholder="TYPE" />
            <CustomSelect value={sort} onChange={v => updateParam('sort', v)} options={SORT_OPTS} placeholder="SORT BY" />
            {hasFilters && <button onClick={clearAll} style={{ background: 'none', border: 'none', fontFamily: T.fontBody, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>CLEAR ALL</button>}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 40 }}>
        {loading ? (
            Array(6).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 14 }} />)
        ) : sneakers.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontFamily: T.fontBody, fontSize: 18, color: T.black }}>NO CARDS MATCH YOUR CRITERIA.</p>
                <button onClick={clearAll} style={{ marginTop: 12, padding: '10px 24px', border: `2px solid ${T.black}`, background: 'none', cursor: 'pointer' }}>RESET FILTERS</button>
            </div>
        ) : (
            sneakers.map(s => <SneakerCard key={s._id} sneaker={s} />)
        )}
      </div>

      {/* Pagination */}
      {total > 12 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, marginTop: 64, borderTop: `1px solid #eee`, paddingTop: 32 }}>
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                style={{ padding: '8px 24px', border: `1.5px solid ${T.black}`, background: 'none', cursor: 'pointer', fontFamily: T.fontBody, opacity: page === 1 ? 0.3 : 1 }}
              >PREV</button>
              <span style={{ fontFamily: T.fontMono, fontSize: 14 }}>PAGE {page} OF {Math.ceil(total / 12)}</span>
              <button 
                disabled={page * 12 >= total}
                onClick={() => setPage(p => p + 1)}
                style={{ padding: '8px 24px', border: `1.5px solid ${T.black}`, background: 'none', cursor: 'pointer', fontFamily: T.fontBody, opacity: page * 12 >= total ? 0.3 : 1 }}
              >NEXT</button>
          </div>
      )}
    </div>
  );
}
