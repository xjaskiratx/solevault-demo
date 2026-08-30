import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSneaker } from '../services/api';
import CustomSelect from '../components/CustomSelect';
import styles from './AddCard.module.css';

const FIELD_DEFS = [
  { key: 'primaryName',      label: 'Primary / Official Name', required: true,  type: 'text',   placeholder: 'Air Jordan 1 Retro High OG' },
  { key: 'commonName',       label: 'Common Name (Nickname)',  required: false, type: 'text',   placeholder: 'Chicago' },
  { key: 'styleCode',        label: 'Style Code',              required: true,  type: 'text',   placeholder: 'DC0097-100' },
  { key: 'officialColorway', label: 'Official Colorway',       required: false, type: 'text',   placeholder: 'White / Gym Red / Black' },
  { key: 'colorTag',         label: 'Color Tag (3–6 chars)',   required: false, type: 'text',   placeholder: 'CHI' },
  { key: 'imageUrl',         label: 'Image URL',               required: false, type: 'url',    placeholder: 'https://…' },
];

const NUMBER_FIELDS = [
  { key: 'modelYear',       label: 'Model Year',           type: 'number' },
  { key: 'releaseYear',     label: 'Release Year',         type: 'number' },
  { key: 'currentPriceINR', label: 'Market Price (₹ INR)', type: 'number' },
];

const SELECTS = [
  { key: 'category',    label: 'Category',     options: [
    { value: 'Famous', label: 'Icon Series' },
    { value: 'Rare', label: 'Grail Set' },
    { value: 'Collaboration', label: 'Collaborations' },
    { value: 'Common', label: 'Base Set' }
  ]},
  { key: 'rarity',      label: 'Rarity',       options: [
    { value: 'C', label: 'Common' },
    { value: 'U', label: 'Uncommon' },
    { value: 'R', label: 'Rare' },
    { value: 'SR', label: 'Super Rare' },
    { value: 'XR', label: 'X-Rare' },
    { value: '1/1', label: 'One / One' }
  ]},
  { key: 'releaseType', label: 'Release Type', options: [
    { value: 'GR', label: 'General Release' },
    { value: 'Collab', label: 'Collab' },
    { value: 'Limited', label: 'Limited' },
    { value: 'Retro', label: 'Retro' },
    { value: 'PE', label: 'Player Exclusive' }
  ]},
];

const DEFAULTS = { category: 'Common', rarity: 'C', releaseType: 'GR' };

export default function AddCard() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form };
      ['modelYear', 'releaseYear', 'currentPriceINR'].forEach(k => {
        if (payload[k]) payload[k] = Number(payload[k]);
      });
      await createSneaker(payload);
      navigate('/collection');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create card.');
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>New Entry</p>
          <h1 className={styles.title}>Add a Card</h1>
          <p className={styles.sub}>Manually register a sneaker into the SoleVault archive</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Identity fields */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Card Identity</div>
            <div className={styles.grid}>
              {FIELD_DEFS.map(f => (
                <div key={f.key} className={styles.field}>
                  <label className={styles.label}>
                    {f.label}{f.required && <span className={styles.req}>*</span>}
                  </label>
                  <input
                    className={styles.input}
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder || ''}
                    value={form[f.key] || ''}
                    onChange={e => set(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Numerical fields */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Dates & Pricing</div>
            <div className={styles.grid}>
              {NUMBER_FIELDS.map(f => (
                <div key={f.key} className={styles.field}>
                  <label className={styles.label}>{f.label}</label>
                  <input
                    className={styles.input}
                    type={f.type}
                    placeholder="—"
                    value={form[f.key] || ''}
                    onChange={e => set(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Classification */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Classification</div>
            <div className={styles.selectGrid}>
              {SELECTS.map(s => (
                <div key={s.key} className={styles.field}>
                  <label className={styles.label}>{s.label}</label>
                  <CustomSelect 
                    value={form[s.key] || ''} 
                    onChange={v => set(s.key, v)}
                    options={s.options}
                    placeholder={`Select ${s.label}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={saving}>
              {saving ? 'Creating…' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
