const mongoose = require('mongoose');

const sneakerSchema = new mongoose.Schema(
  {
    // ── PRODUCT LAYER (Immutable/Official Data) ──────────────────────────────
    primaryName: {
      type: String,
      required: [true, 'Primary name is required'],
      trim: true,
    },
    styleCode: {
      type: String,
      unique: true,
      required: [true, 'Style code is required'],
      trim: true,
      uppercase: true,
    },
    officialColorway: { type: String, trim: true },
    colorTag: {
      type: String,
      uppercase: true,
      maxlength: [6, 'Color tag must be 6 chars or less'],
    },
    modelYear: { type: Number },
    releaseYear: { type: Number },

    // ── CARD LAYER (Dynamic/Market Data) ─────────────────────────────────────
    commonName: {
      type: String,
      trim: true,
      index: true, // Indexed for fast search
    },
    category: {
      type: String,
      enum: ['Famous', 'Rare', 'Collaboration', 'Common'],
      default: 'Common',
    },
    rarity: {
      type: String,
      enum: ['C', 'U', 'R', 'SR', 'XR', '1/1'],
      default: 'C',
    },
    cardID: { type: String, unique: true, sparse: true },
    nameScore: { type: Number, default: 0, min: 0, max: 100 },
    currentPriceINR: { type: Number, default: 0 },

    // ── SCORE COMPONENTS ─────────────────────────────────────────────────────
    popularityScore: { type: Number, default: 0, min: 0, max: 100 },
    platformUsageScore: { type: Number, default: 0, min: 0, max: 100 },
    longevityScore: { type: Number, default: 0, min: 0, max: 20 },
    authorityScore: { type: Number, default: 0, min: 0, max: 15 },

    // ── METADATA ─────────────────────────────────────────────────────────────
    releaseType: {
      type: String,
      enum: ['GR', 'Collab', 'Limited', 'Retro', 'PE'],
      default: 'GR',
    },
    imageUrl: { type: String, default: '' },
    lastSynced: { type: Date, default: null },
    isSynced: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── VIRTUAL: Rarity Label ─────────────────────────────────────────────────────
sneakerSchema.virtual('rarityLabel').get(function () {
  const map = {
    C: 'Common',
    U: 'Uncommon',
    R: 'Rare',
    SR: 'Super Rare',
    XR: 'Extreme Rare',
    '1/1': 'One of One',
  };
  return map[this.rarity] || this.rarity;
});

// ── STATIC: Calculate Name Score ──────────────────────────────────────────────
sneakerSchema.statics.calcNameScore = function (components) {
  const { popularity = 0, platformUsage = 0, longevity = 0, authority = 0 } = components;
  return parseFloat(
    (0.4 * popularity + 0.25 * platformUsage + 0.2 * longevity + 0.15 * authority).toFixed(2)
  );
};

// ── STATIC: Auto-generate Card ID ─────────────────────────────────────────────
sneakerSchema.statics.generateCardID = function (sneaker, instance = 1) {
  const model = sneaker.primaryName.replace(/\s+/g, '').slice(0, 6).toUpperCase();
  const year = sneaker.releaseYear || sneaker.modelYear || new Date().getFullYear();
  const tag = sneaker.colorTag || 'GEN';
  return `NK-${model}-${year}-${tag}-${String(instance).padStart(3, '0')}`;
};

// ── TEXT INDEX for search ─────────────────────────────────────────────────────
sneakerSchema.index({ commonName: 'text', primaryName: 'text', styleCode: 'text' });

module.exports = mongoose.model('Sneaker', sneakerSchema);
