require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./src/config/db');
const sneakerRoutes = require('./src/routes/sneakers');
const { startOracleScheduler, runOracleSync } = require('./src/services/oracleService');
const { setMockMode, initMockStore, getMockMode, getMockStore } = require('./src/controllers/sneakerController');
const BASE_CARDS = require('./src/services/seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: process.env.MONGODB_URI?.includes('YOUR') ? 'mock' : 'mongo' }));

// ── Oracle Manual Trigger ─────────────────────────────────────────────────────
app.post('/api/oracle/sync', async (req, res) => {
  try {
    const mockStore = getMockMode() ? getMockStore() : null;
    const result = await runOracleSync(mockStore);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/sneakers', sneakerRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const start = async () => {
  const uri = process.env.MONGODB_URI || '';
  const hasMongo = uri && !uri.includes('<USERNAME>') && !uri.includes('YOUR');

  if (hasMongo) {
    await connectDB();
    const Sneaker = require('./src/models/Sneaker');
    const count = await Sneaker.countDocuments().catch(() => 0);
    if (count === 0) {
      console.log('Seeding 80 base cards to MongoDB...');
      for (const card of BASE_CARDS) {
        try {
          const c = await Sneaker.create(card);
          const idx = BASE_CARDS.indexOf(card);
          c.cardID = Sneaker.generateCardID(c, idx + 1);
          await c.save();
        } catch (e) { /* skip dupes */ }
      }
      console.log('Seed complete');
    }
  } else {
    console.log('MongoDB not configured — running in MOCK MODE with 80 seed cards');
    setMockMode(true);
    const seeded = BASE_CARDS.map((c, i) => ({
      ...c,
      _id: String(i + 1),
      cardID: `NK-${c.primaryName.replace(/\s+/g,'').slice(0,6).toUpperCase()}-${c.releaseYear || 2020}-${c.colorTag}-${String(i+1).padStart(3,'0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    initMockStore(seeded);
  }

  startOracleScheduler();
  app.listen(PORT, () => console.log(`SoleVault API running on http://localhost:${PORT}`));
};

start().catch(console.error);

// Keep process alive
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
process.on('uncaughtException', (err) => console.error('Uncaught:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled rejection:', err));

// Prevent event loop from draining
if (process.stdin.isTTY === false) {
  process.stdin.resume();
}
