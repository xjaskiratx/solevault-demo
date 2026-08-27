const express = require('express');
const router = express.Router();
const {
  getAllSneakers,
  getSneaker,
  createSneaker,
  updateSneaker,
  deleteSneaker,
  getStats,
} = require('../controllers/sneakerController');

// Stats
router.get('/stats', getStats);

// CRUD
router.route('/').get(getAllSneakers).post(createSneaker);
router.route('/:id').get(getSneaker).put(updateSneaker).delete(deleteSneaker);

module.exports = router;
