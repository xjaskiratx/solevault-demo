import { Link, useLocation } from 'react-router-dom';
import { triggerOracleSync } from '../services/api';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { pathname } = useLocation();
  const [syncing, setSyncing] = useState(false);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    }));
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await triggerOracleSync();
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <span>{dateStr}</span>
        <span>VOL 1 • ORACLE EDITION</span>
      </div>

      {/* Main Nav */}
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
          <Link
            to="/"
            className={styles.navLink}
            style={{ opacity: pathname === '/' ? 1 : 0.65 }}
          >
            DASHBOARD | COLLECTION
          </Link>
        </div>

        <Link to="/" className={styles.logo}>
          <div className={styles.logoInner}>
            <span className={styles.xl}>S</span>
            <span className={styles.sm}>ole</span>
            <span className={styles.xl}>V</span>
            <span className={styles.sm}>ault</span>
          </div>
        </Link>

        <div className={styles.actions}>
          <Link to="/add" className={styles.navLink} style={{ letterSpacing: '-0.6px' }}>
            + NEW CARD
          </Link>
          <span className={styles.divider}>|</span>
          <button
            onClick={handleSync}
            disabled={syncing}
            className={styles.btn}
          >
            {syncing ? 'SYNCING...' : 'ORACLE SYNC'}
          </button>
        </div>
      </nav>
    </header>
  );
}
