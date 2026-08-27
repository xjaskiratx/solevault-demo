const Sneaker = require('../models/Sneaker');

// In-memory mock store for when MongoDB is not connected
let mockStore = [];
let mockIdCounter = 1;
let isMockMode = false;

const setMockMode = (val) => { isMockMode = val; };
const getMockMode = () => isMockMode;

// ── GET ALL SNEAKERS ──────────────────────────────────────────────────────────
const getAllSneakers = async (req, res) => {
  try {
    const {
      search = '',
      rarity,
      category,
      releaseType,
      sort = '-nameScore',
      page = 1,
      limit = 40,
    } = req.query;

    if (isMockMode) {
      let data = [...mockStore];
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(s =>
          (s.commonName || '').toLowerCase().includes(q) ||
          (s.primaryName || '').toLowerCase().includes(q) ||
          (s.styleCode || '').toLowerCase().includes(q)
        );
      }
      if (rarity) data = data.filter(s => s.rarity === rarity);
      if (category) data = data.filter(s => s.category === category);
      if (releaseType) data = data.filter(s => s.releaseType === releaseType);
      const total = data.length;
      const skip = (page - 1) * limit;
      data = data.slice(skip, skip + Number(limit));
      return res.json({ success: true, data, total, page: Number(page), limit: Number(limit) });
    }

    const query = {};
    if (search) {
      query.$or = [
        { commonName: { $regex: search, $options: 'i' } },
        { primaryName: { $regex: search, $options: 'i' } },
        { styleCode: { $regex: search, $options: 'i' } },
      ];
    }
    if (rarity) query.rarity = rarity;
    if (category) query.category = category;
    if (releaseType) query.releaseType = releaseType;

    const total = await Sneaker.countDocuments(query);
    const sneakers = await Sneaker.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({ success: true, data: sneakers, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET SINGLE SNEAKER ────────────────────────────────────────────────────────
const getSneaker = async (req, res) => {
  try {
    if (isMockMode) {
      const item = mockStore.find(s => s._id === req.params.id || s.styleCode === req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Card not found' });
      return res.json({ success: true, data: item });
    }
    const sneaker = await Sneaker.findById(req.params.id);
    if (!sneaker) return res.status(404).json({ success: false, message: 'Card not found' });
    res.json({ success: true, data: sneaker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── CREATE SNEAKER ────────────────────────────────────────────────────────────
const createSneaker = async (req, res) => {
  try {
    if (isMockMode) {
      const id = String(mockIdCounter++);
      const card = { ...req.body, _id: id, createdAt: new Date(), updatedAt: new Date() };
      if (!card.cardID) {
        card.cardID = Sneaker.generateCardID ? `NK-MOCK-${id}` : `NK-MOCK-${id}`;
      }
      mockStore.push(card);
      return res.status(201).json({ success: true, data: card });
    }
    const sneaker = await Sneaker.create(req.body);
    if (!sneaker.cardID) {
      const count = await Sneaker.countDocuments({ primaryName: sneaker.primaryName });
      sneaker.cardID = Sneaker.generateCardID(sneaker, count);
      await sneaker.save();
    }
    res.status(201).json({ success: true, data: sneaker });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Style code already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── UPDATE SNEAKER ────────────────────────────────────────────────────────────
const updateSneaker = async (req, res) => {
  try {
    if (isMockMode) {
      const idx = mockStore.findIndex(s => s._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Card not found' });
      mockStore[idx] = { ...mockStore[idx], ...req.body, updatedAt: new Date() };
      return res.json({ success: true, data: mockStore[idx] });
    }
    const sneaker = await Sneaker.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!sneaker) return res.status(404).json({ success: false, message: 'Card not found' });
    res.json({ success: true, data: sneaker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE SNEAKER ────────────────────────────────────────────────────────────
const deleteSneaker = async (req, res) => {
  try {
    if (isMockMode) {
      mockStore = mockStore.filter(s => s._id !== req.params.id);
      return res.json({ success: true, message: 'Card deleted' });
    }
    await Sneaker.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── STATS ─────────────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    if (isMockMode) {
      const stats = {
        total: mockStore.length,
        byCategory: {},
        byRarity: {},
        avgNameScore: 0,
      };
      mockStore.forEach(s => {
        stats.byCategory[s.category] = (stats.byCategory[s.category] || 0) + 1;
        stats.byRarity[s.rarity] = (stats.byRarity[s.rarity] || 0) + 1;
        stats.avgNameScore += s.nameScore || 0;
      });
      if (mockStore.length) stats.avgNameScore = +(stats.avgNameScore / mockStore.length).toFixed(2);
      return res.json({ success: true, data: stats });
    }
    const [total, byCat, byRarity, avgScore] = await Promise.all([
      Sneaker.countDocuments(),
      Sneaker.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Sneaker.aggregate([{ $group: { _id: '$rarity', count: { $sum: 1 } } }]),
      Sneaker.aggregate([{ $group: { _id: null, avg: { $avg: '$nameScore' } } }]),
    ]);
    res.json({
      success: true,
      data: {
        total,
        byCategory: Object.fromEntries(byCat.map(b => [b._id, b.count])),
        byRarity: Object.fromEntries(byRarity.map(b => [b._id, b.count])),
        avgNameScore: avgScore[0]?.avg?.toFixed(2) || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── SEED MOCK DATA ────────────────────────────────────────────────────────────
const initMockStore = (data) => { mockStore = data; mockIdCounter = data.length + 1; };
const getMockStore = () => mockStore;

module.exports = { getAllSneakers, getSneaker, createSneaker, updateSneaker, deleteSneaker, getStats, setMockMode, getMockMode, initMockStore, getMockStore };
