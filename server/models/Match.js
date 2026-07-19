const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  date: Date,
  season: Number,
  city: String,
  venue: String,

  team1: String,
  team2: String,

  tossWinner: String,
  tossDecision: String,

  team1Runs: Number,
  team1Wickets: Number,

  team2Runs: Number,
  team2Wickets: Number,

  winner: String,
  resultType: String,

  winByRuns: Number,
  winByWickets: Number,

  playerOfMatch: String,

  matchReferee: String,
  umpire1: String,
  umpire2: String,
  tvUmpire: String,
  reserveUmpire: String,

  oversLimit: Number,

  team1Players: [String],
  team2Players: [String]
});

module.exports = mongoose.model("Match", matchSchema);