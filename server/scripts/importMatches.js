const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const Match = require("../models/Match");

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const matches = [];

    fs.createReadStream(
      path.join(__dirname, "../data/ipl_matches_merged_2021_2026.csv")
    )
      .pipe(csv())
      .on("data", (row) => {
        matches.push({
          date: row.date,
          season: Number(row.season),
          city: row.city,
          venue: row.venue,

          team1: row.team1,
          team2: row.team2,

          tossWinner: row.toss_winner,
          tossDecision: row.toss_decision,

          team1Runs: Number(row.team1_runs),
          team1Wickets: Number(row.team1_wickets),

          team2Runs: Number(row.team2_runs),
          team2Wickets: Number(row.team2_wickets),

          winner: row.winner,
          resultType: row.result_type,

          winByRuns: Number(row.win_by_runs),
          winByWickets: Number(row.win_by_wickets),

          playerOfMatch: row.player_of_match,

          matchReferee: row.match_referee,
          umpire1: row.umpire1,
          umpire2: row.umpire2,
          tvUmpire: row.tv_umpire,
          reserveUmpire: row.reserve_umpire,

          oversLimit: Number(row.overs_limit),

          team1Players: row.team1_players
            ? row.team1_players.split(",")
            : [],

          team2Players: row.team2_players
            ? row.team2_players.split(",")
            : [],
        });
      })
      .on("end", async () => {
        await Match.deleteMany({});
        await Match.insertMany(matches);

        console.log(`✅ ${matches.length} matches imported successfully`);

        mongoose.connection.close();
      });
  } catch (err) {
    console.error(err);
  }
}

importData();