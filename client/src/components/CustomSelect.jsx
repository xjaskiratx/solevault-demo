import { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

/**
 * In-house custom dropdown — no browser defaults.
 * Props: value, onChange, options [{ value, label }], placeholder
 */
export default function CustomSelect({ value, onChange, options, placeholder = 'Select…', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find(o => o.value === value);
  const displayLabel = selected ? selected.label : placeholder;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pick = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className={`${styles.wrap} ${open ? styles.open : ''} ${className}`}
    >
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.label}>{displayLabel}</span>
        <span className={`${styles.arrow} ${open ? styles.arrowUp : ''}`}>
          <svg width="10" height="6" viewBox="0 0 10 6">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="square"/>
          </svg>
        </span>
      </button>

      {open && (
        <ul className={styles.menu} role="listbox">
          {options.map(opt => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`${styles.option} ${opt.value === value ? styles.selected : ''}`}
              onClick={() => pick(opt.value)}
            >
              {opt.label}
              {opt.value === value && (
                <svg className={styles.check} width="12" height="9" viewBox="0 0 12 9">
                  <path d="M1 4l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="square"/>
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
