const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  predictMatch,
  getPredictionHistory
} = require("../controllers/predictionController");

// Make prediction
router.post("/", protect, predictMatch);

// Get logged-in user's prediction history
router.get("/history", protect, getPredictionHistory);

module.exports = router;