const express = require("express");

const {
  getAllMatches,
  getAllTeams,
  getTeamStats,
  getHeadToHead,
  getRecentForm,
  getVenueAnalysis,
  getLiveMatchInsights,
} = require("../controllers/matchController");

const router = express.Router();

router.get("/", getAllMatches);

router.get("/teams", getAllTeams);

router.get("/headtohead", getHeadToHead);

router.get("/venue-analysis", getVenueAnalysis);

router.get(
  "/live-insights",
  getLiveMatchInsights
);

router.get(
  "/recentform/:name",
  getRecentForm
);

router.get(
  "/team/:name",
  getTeamStats
);

module.exports = router;