const cron = require('node-cron');
const axios = require('axios');
const Sneaker = require('../models/Sneaker');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY_HERE';
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'sneaker-database-stockx.p.rapidapi.com';

const calcNameScore = ({ popularity = 0, platformUsage = 0, longevity = 0, authority = 0 }) =>
  parseFloat((0.4 * popularity + 0.25 * platformUsage + 0.2 * longevity + 0.15 * authority).toFixed(2));

const calcLongevity = (modelYear) => {
  if (!modelYear) return 0;
  const years = new Date().getFullYear() - modelYear;
  return Math.min(20, Math.floor(years * 1.5));
};

const fetchSneakerData = async (styleCode) => {
  if (RAPIDAPI_KEY === 'YOUR_RAPIDAPI_KEY_HERE') return null;
  try {
    const { data } = await axios.get(`https://${RAPIDAPI_HOST}/products`, {
      params: { styleId: styleCode },
      headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': RAPIDAPI_HOST },
      timeout: 8000,
    });
    return data?.results?.[0] || null;
  } catch (err) {
    console.error(`Oracle fetch error for ${styleCode}:`, err.message);
    return null;
  }
};

const runOracleSync = async (mockStore = null) => {
  console.log('Oracle Sync started at', new Date().toISOString());
  let updated = 0, skipped = 0;
  const sneakers = mockStore || await Sneaker.find({});

  for (const sneaker of sneakers) {
    const apiData = await fetchSneakerData(sneaker.styleCode);
    const longevity = calcLongevity(sneaker.modelYear);
    const popularity = Math.min(100, apiData?.search_index ? apiData.search_index / 10 : sneaker.popularityScore || 50);
    const platformUsage = Math.min(100, apiData?.volume_score || sneaker.platformUsageScore || 30);
    const authority = sneaker.authorityScore || longevity * 0.75;
    const newScore = calcNameScore({ popularity, platformUsage, longevity, authority });

    if (newScore - (sneaker.nameScore || 0) < 5 && (sneaker.nameScore || 0) > 0) {
      skipped++;
      continue;
    }

    const priceINR = apiData?.resale_price ? Math.round(apiData.resale_price * 84.5) : sneaker.currentPriceINR;

    if (mockStore) {
      const idx = mockStore.findIndex(s => s.styleCode === sneaker.styleCode);
      if (idx !== -1) Object.assign(mockStore[idx], { nameScore: newScore, popularityScore: popularity, longevityScore: longevity, currentPriceINR: priceINR, lastSynced: new Date() });
    } else {
      await Sneaker.findByIdAndUpdate(sneaker._id, { nameScore: newScore, popularityScore: popularity, longevityScore: longevity, currentPriceINR: priceINR, lastSynced: new Date() });
    }
    updated++;
    if (!mockStore && apiData) await new Promise(r => setTimeout(r, 200));
  }

  console.log(`Oracle Sync: ${updated} updated, ${skipped} skipped`);
  return { updated, skipped };
};

const startOracleScheduler = () => {
  if (process.env.ORACLE_ENABLED === 'false') return console.log('Oracle disabled');
  const schedule = process.env.ORACLE_CRON_SCHEDULE || '0 23 * * 0';
  cron.schedule(schedule, () => runOracleSync().catch(console.error), { timezone: 'Asia/Kolkata' });
  console.log(`Oracle Scheduler active: "${schedule}" IST`);
};

module.exports = { startOracleScheduler, runOracleSync };
