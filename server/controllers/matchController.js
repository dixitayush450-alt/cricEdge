const Match = require("../models/Match");

const normalizeTeamName = (teamName) => {
  if (typeof teamName !== "string") {
    return "";
  }

  const trimmedName = teamName.trim();

  if (trimmedName === "Royal Challengers Bangalore") {
    return "Royal Challengers Bengaluru";
  }

  return trimmedName;
};

const normalizeVenueName = (venueName) => {
  if (typeof venueName !== "string") {
    return "";
  }

  return venueName
    .trim()
    .toLowerCase()
    .replace(/stadium/g, "")
    .replace(/international/g, "")
    .replace(/cricket/g, "")
    .replace(/\s+/g, " ");
};

const getTeamAliases = (teamName) => {
  const normalizedTeam = normalizeTeamName(teamName);

  if (normalizedTeam === "Royal Challengers Bengaluru") {
    return [
      "Royal Challengers Bengaluru",
      "Royal Challengers Bangalore",
    ];
  }

  return normalizedTeam ? [normalizedTeam] : [];
};

const isTeamWinner = (match, aliases) => {
  return aliases.includes(match.winner);
};

const getOpponent = (match, aliases) => {
  if (aliases.includes(match.team1)) {
    return normalizeTeamName(match.team2);
  }

  if (aliases.includes(match.team2)) {
    return normalizeTeamName(match.team1);
  }

  return "";
};

const getTeamRuns = (match, aliases) => {
  if (aliases.includes(match.team1)) {
    return Number(match.team1Runs);
  }

  if (aliases.includes(match.team2)) {
    return Number(match.team2Runs);
  }

  return null;
};

const getOpponentRuns = (match, aliases) => {
  if (aliases.includes(match.team1)) {
    return Number(match.team2Runs);
  }

  if (aliases.includes(match.team2)) {
    return Number(match.team1Runs);
  }

  return null;
};

const getMatchResult = (match, aliases) => {
  if (!match.winner) {
    return "N";
  }

  return isTeamWinner(match, aliases) ? "W" : "L";
};

const getPercentage = (value, total) => {
  if (!total) {
    return 0;
  }

  return Number(((value / total) * 100).toFixed(1));
};

const getAverage = (values) => {
  const validValues = values.filter(
    (value) => Number.isFinite(value)
  );

  if (validValues.length === 0) {
    return 0;
  }

  const total = validValues.reduce(
    (sum, value) => sum + value,
    0
  );

  return Number((total / validValues.length).toFixed(1));
};

const getAllMatches = async (req, res) => {
  try {
    const {
      resultType,
      team,
      venue,
      season,
      limit,
    } = req.query;

    const query = {};

    if (resultType) {
      const normalizedResultType = String(
        resultType
      )
        .trim()
        .toLowerCase();

      if (
        normalizedResultType === "complete" ||
        normalizedResultType === "completed"
      ) {
        query.$or = [
          {
            resultType: {
              $in: [
                "complete",
                "completed",
                "Complete",
                "Completed",
              ],
            },
          },
          {
            winner: {
              $exists: true,
              $nin: ["", null],
            },
          },
        ];
      } else {
        query.resultType = resultType;
      }
    }

    if (team) {
      const aliases = getTeamAliases(team);

      query.$and = query.$and || [];

      query.$and.push({
        $or: [
          {
            team1: {
              $in: aliases,
            },
          },
          {
            team2: {
              $in: aliases,
            },
          },
        ],
      });
    }

    if (venue) {
      query.venue = {
        $regex: String(venue).trim(),
        $options: "i",
      };
    }

    if (season) {
      const numericSeason = Number(season);

      if (Number.isFinite(numericSeason)) {
        query.season = numericSeason;
      }
    }

    const parsedLimit = Math.min(
      Math.max(Number(limit) || 1000, 1),
      5000
    );

    const matches = await Match.find(query)
      .sort({
        date: -1,
        _id: -1,
      })
      .limit(parsedLimit)
      .lean();

    return res.status(200).json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Get all matches error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch matches",
      matches: [],
    });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const [team1Names, team2Names] =
      await Promise.all([
        Match.distinct("team1"),
        Match.distinct("team2"),
      ]);

    const teams = [
      ...new Set([
        ...team1Names.map(normalizeTeamName),
        ...team2Names.map(normalizeTeamName),
      ]),
    ]
      .filter(Boolean)
      .sort((firstTeam, secondTeam) =>
        firstTeam.localeCompare(secondTeam)
      );

    return res.status(200).json({
      success: true,
      totalTeams: teams.length,
      teams,
    });
  } catch (error) {
    console.error("Get teams error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch teams",
      totalTeams: 0,
      teams: [],
    });
  }
};

const getTeamStats = async (req, res) => {
  try {
    const team = normalizeTeamName(
      req.params.name
    );

    if (!team) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    const aliases = getTeamAliases(team);

    const matches = await Match.find({
      $or: [
        {
          team1: {
            $in: aliases,
          },
        },
        {
          team2: {
            $in: aliases,
          },
        },
      ],
    })
      .sort({
        date: -1,
      })
      .lean();

    const completedMatches = matches.filter(
      (match) => Boolean(match.winner)
    );

    const wins = completedMatches.filter(
      (match) => isTeamWinner(match, aliases)
    ).length;

    const losses =
      completedMatches.length - wins;

    const noResults =
      matches.length -
      completedMatches.length;

    const scores = matches
      .map((match) =>
        getTeamRuns(match, aliases)
      )
      .filter(Number.isFinite);

    const opponentScores = matches
      .map((match) =>
        getOpponentRuns(match, aliases)
      )
      .filter(Number.isFinite);

    return res.status(200).json({
      success: true,
      team,
      matchesPlayed: matches.length,
      completedMatches:
        completedMatches.length,
      wins,
      losses,
      noResults,
      winPercentage: getPercentage(
        wins,
        completedMatches.length
      ),
      highestScore:
        scores.length > 0
          ? Math.max(...scores)
          : 0,
      lowestScore:
        scores.length > 0
          ? Math.min(...scores)
          : 0,
      averageScore: getAverage(scores),
      averageOpponentScore:
        getAverage(opponentScores),
    });
  } catch (error) {
    console.error(
      "Get team stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch team statistics",
    });
  }
};

const getHeadToHead = async (req, res) => {
  try {
    const team1 = normalizeTeamName(
      req.query.team1
    );

    const team2 = normalizeTeamName(
      req.query.team2
    );

    if (!team1 || !team2) {
      return res.status(400).json({
        success: false,
        message:
          "Both team1 and team2 are required",
      });
    }

    if (team1 === team2) {
      return res.status(400).json({
        success: false,
        message:
          "Please select two different teams",
      });
    }

    const team1Aliases =
      getTeamAliases(team1);

    const team2Aliases =
      getTeamAliases(team2);

    const matches = await Match.find({
      $or: [
        {
          team1: {
            $in: team1Aliases,
          },
          team2: {
            $in: team2Aliases,
          },
        },
        {
          team1: {
            $in: team2Aliases,
          },
          team2: {
            $in: team1Aliases,
          },
        },
      ],
    })
      .sort({
        date: -1,
      })
      .lean();

    const completedMatches = matches.filter(
      (match) => Boolean(match.winner)
    );

    const team1Wins =
      completedMatches.filter((match) =>
        team1Aliases.includes(match.winner)
      ).length;

    const team2Wins =
      completedMatches.filter((match) =>
        team2Aliases.includes(match.winner)
      ).length;

    const noResults =
      matches.length -
      team1Wins -
      team2Wins;

    const recentMeetings = matches
      .slice(0, 5)
      .map((match) => ({
        id: match._id,
        date: match.date || null,
        season: match.season || null,
        venue:
          match.venue || "Unknown venue",
        team1: normalizeTeamName(
          match.team1
        ),
        team2: normalizeTeamName(
          match.team2
        ),
        team1Runs:
          Number(match.team1Runs) || 0,
        team2Runs:
          Number(match.team2Runs) || 0,
        winner:
          normalizeTeamName(
            match.winner
          ) || "No result",
        winByRuns:
          Number(match.winByRuns) || 0,
        winByWickets:
          Number(match.winByWickets) || 0,
      }));

    const recentTeam1Wins =
      recentMeetings.filter(
        (match) => match.winner === team1
      ).length;

    const recentTeam2Wins =
      recentMeetings.filter(
        (match) => match.winner === team2
      ).length;

    return res.status(200).json({
      success: true,
      team1,
      team2,
      totalMatches: matches.length,
      completedMatches:
        completedMatches.length,
      team1Wins,
      team2Wins,
      noResults,
      team1WinPercentage: getPercentage(
        team1Wins,
        completedMatches.length
      ),
      team2WinPercentage: getPercentage(
        team2Wins,
        completedMatches.length
      ),
      recentEdge:
        recentTeam1Wins === recentTeam2Wins
          ? "Even"
          : recentTeam1Wins >
              recentTeam2Wins
            ? team1
            : team2,
      lastFiveMeetings: recentMeetings,
    });
  } catch (error) {
    console.error(
      "Get head-to-head error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch head-to-head statistics",
    });
  }
};

const getRecentForm = async (req, res) => {
  try {
    const team = normalizeTeamName(
      req.params.name
    );

    const requestedLimit = Math.min(
      Math.max(
        Number(req.query.limit) || 5,
        1
      ),
      10
    );

    if (!team) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    const aliases = getTeamAliases(team);

    const matches = await Match.find({
      $or: [
        {
          team1: {
            $in: aliases,
          },
        },
        {
          team2: {
            $in: aliases,
          },
        },
      ],
      winner: {
        $exists: true,
        $nin: ["", null],
      },
    })
      .sort({
        date: -1,
      })
      .limit(requestedLimit)
      .lean();

    const recentMatches = matches.map(
      (match) => {
        const result = getMatchResult(
          match,
          aliases
        );

        const teamRuns = getTeamRuns(
          match,
          aliases
        );

        const opponentRuns =
          getOpponentRuns(match, aliases);

        return {
          id: match._id,
          date: match.date || null,
          season: match.season || null,
          venue:
            match.venue || "Unknown venue",
          opponent: getOpponent(
            match,
            aliases
          ),
          result,
          winner:
            normalizeTeamName(
              match.winner
            ) || "No result",
          teamRuns:
            Number.isFinite(teamRuns)
              ? teamRuns
              : 0,
          opponentRuns:
            Number.isFinite(opponentRuns)
              ? opponentRuns
              : 0,
          winByRuns:
            Number(match.winByRuns) || 0,
          winByWickets:
            Number(match.winByWickets) ||
            0,
        };
      }
    );

    const form = recentMatches.map(
      (match) => match.result
    );

    const wins = form.filter(
      (result) => result === "W"
    ).length;

    const losses = form.filter(
      (result) => result === "L"
    ).length;

    const noResults = form.filter(
      (result) => result === "N"
    ).length;

    const weightedPoints =
      form.reduce(
        (score, result, index) => {
          const weight =
            form.length - index;

          if (result === "W") {
            return score + weight;
          }

          if (result === "N") {
            return score + weight * 0.5;
          }

          return score;
        },
        0
      );

    const maximumWeightedPoints =
      form.reduce(
        (total, _, index) =>
          total + form.length - index,
        0
      );

    const formScore =
      maximumWeightedPoints > 0
        ? Number(
            (
              (weightedPoints /
                maximumWeightedPoints) *
              100
            ).toFixed(1)
          )
        : 0;

    return res.status(200).json({
      success: true,
      team,
      matchesConsidered:
        recentMatches.length,
      form,
      last5: form,
      wins,
      losses,
      noResults,
      winPercentage: getPercentage(
        wins,
        wins + losses
      ),
      formScore,
      averageRuns: getAverage(
        recentMatches.map(
          (match) => match.teamRuns
        )
      ),
      averageRunsConceded: getAverage(
        recentMatches.map(
          (match) =>
            match.opponentRuns
        )
      ),
      recentMatches,
    });
  } catch (error) {
    console.error(
      "Get recent form error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch recent form",
    });
  }
};

const getVenueAnalysis = async (
  req,
  res
) => {
  try {
    const venue =
      typeof req.query.venue === "string"
        ? req.query.venue.trim()
        : "";

    const team1 = normalizeTeamName(
      req.query.team1
    );

    const team2 = normalizeTeamName(
      req.query.team2
    );

    if (!venue) {
      return res.status(400).json({
        success: false,
        message: "Venue is required",
      });
    }

    const allMatches = await Match.find({
      venue: {
        $exists: true,
        $nin: ["", null],
      },
    })
      .sort({
        date: -1,
      })
      .lean();

    const normalizedVenue =
      normalizeVenueName(venue);

    const venueMatches =
      allMatches.filter(
        (match) => {
          const currentVenue =
            normalizeVenueName(
              match.venue
            );

          return (
            currentVenue.includes(
              normalizedVenue
            ) ||
            normalizedVenue.includes(
              currentVenue
            )
          );
        }
      );

    const completedMatches =
      venueMatches.filter(
        (match) => Boolean(match.winner)
      );

    const firstInningsScores =
      venueMatches
        .map((match) =>
          Number(match.team1Runs)
        )
        .filter(Number.isFinite);

    const secondInningsScores =
      venueMatches
        .map((match) =>
          Number(match.team2Runs)
        )
        .filter(Number.isFinite);

    const battingFirstWins =
      completedMatches.filter(
        (match) =>
          Number(match.winByRuns) > 0
      ).length;

    const chasingWins =
      completedMatches.filter(
        (match) =>
          Number(match.winByWickets) > 0
      ).length;

    const teamVenueStats = (
      teamName
    ) => {
      if (!teamName) {
        return null;
      }

      const aliases =
        getTeamAliases(teamName);

      const teamMatches =
        venueMatches.filter(
          (match) =>
            aliases.includes(
              match.team1
            ) ||
            aliases.includes(
              match.team2
            )
        );

      const completedTeamMatches =
        teamMatches.filter(
          (match) =>
            Boolean(match.winner)
        );

      const wins =
        completedTeamMatches.filter(
          (match) =>
            aliases.includes(
              match.winner
            )
        ).length;

      const scores = teamMatches
        .map((match) =>
          getTeamRuns(match, aliases)
        )
        .filter(Number.isFinite);

      return {
        team: teamName,
        matches: teamMatches.length,
        wins,
        losses:
          completedTeamMatches.length -
          wins,
        winPercentage: getPercentage(
          wins,
          completedTeamMatches.length
        ),
        averageScore:
          getAverage(scores),
        highestScore:
          scores.length > 0
            ? Math.max(...scores)
            : 0,
      };
    };

    const team1Stats =
      teamVenueStats(team1);

    const team2Stats =
      teamVenueStats(team2);

    let venueAdvantage = "Even";

    if (
      team1Stats &&
      team2Stats &&
      team1Stats.matches > 0 &&
      team2Stats.matches > 0
    ) {
      if (
        team1Stats.winPercentage >
        team2Stats.winPercentage
      ) {
        venueAdvantage = team1;
      } else if (
        team2Stats.winPercentage >
        team1Stats.winPercentage
      ) {
        venueAdvantage = team2;
      }
    }

    return res.status(200).json({
      success: true,
      venue,
      totalMatches: venueMatches.length,
      completedMatches:
        completedMatches.length,
      averageFirstInningsScore:
        getAverage(firstInningsScores),
      averageSecondInningsScore:
        getAverage(secondInningsScores),
      highestFirstInningsScore:
        firstInningsScores.length > 0
          ? Math.max(
              ...firstInningsScores
            )
          : 0,
      lowestFirstInningsScore:
        firstInningsScores.length > 0
          ? Math.min(
              ...firstInningsScores
            )
          : 0,
      battingFirstWins,
      chasingWins,
      battingFirstWinPercentage:
        getPercentage(
          battingFirstWins,
          completedMatches.length
        ),
      chasingWinPercentage:
        getPercentage(
          chasingWins,
          completedMatches.length
        ),
      preferredApproach:
        chasingWins > battingFirstWins
          ? "Chasing"
          : battingFirstWins >
              chasingWins
            ? "Batting first"
            : "Balanced",
      venueAdvantage,
      team1Stats,
      team2Stats,
      recentMatches: venueMatches
        .slice(0, 5)
        .map((match) => ({
          id: match._id,
          date: match.date || null,
          team1: normalizeTeamName(
            match.team1
          ),
          team2: normalizeTeamName(
            match.team2
          ),
          winner:
            normalizeTeamName(
              match.winner
            ) || "No result",
          team1Runs:
            Number(match.team1Runs) ||
            0,
          team2Runs:
            Number(match.team2Runs) ||
            0,
        })),
    });
  } catch (error) {
    console.error(
      "Venue analysis error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch venue analysis",
    });
  }
};

const getLiveMatchInsights = async (
  req,
  res
) => {
  try {
    const team1 = normalizeTeamName(
      req.query.team1
    );

    const team2 = normalizeTeamName(
      req.query.team2
    );

    const venue =
      typeof req.query.venue === "string"
        ? req.query.venue.trim()
        : "";

    if (!team1 || !team2 || !venue) {
      return res.status(400).json({
        success: false,
        message:
          "team1, team2 and venue are required",
      });
    }

    if (team1 === team2) {
      return res.status(400).json({
        success: false,
        message:
          "Please select two different teams",
      });
    }

    const team1Aliases =
      getTeamAliases(team1);

    const team2Aliases =
      getTeamAliases(team2);

    const [
      headToHeadMatches,
      recentTeam1Matches,
      recentTeam2Matches,
      allVenueMatches,
    ] = await Promise.all([
      Match.find({
        $or: [
          {
            team1: {
              $in: team1Aliases,
            },
            team2: {
              $in: team2Aliases,
            },
          },
          {
            team1: {
              $in: team2Aliases,
            },
            team2: {
              $in: team1Aliases,
            },
          },
        ],
      })
        .sort({
          date: -1,
        })
        .lean(),

      Match.find({
        $or: [
          {
            team1: {
              $in: team1Aliases,
            },
          },
          {
            team2: {
              $in: team1Aliases,
            },
          },
        ],
        winner: {
          $exists: true,
          $nin: ["", null],
        },
      })
        .sort({
          date: -1,
        })
        .limit(5)
        .lean(),

      Match.find({
        $or: [
          {
            team1: {
              $in: team2Aliases,
            },
          },
          {
            team2: {
              $in: team2Aliases,
            },
          },
        ],
        winner: {
          $exists: true,
          $nin: ["", null],
        },
      })
        .sort({
          date: -1,
        })
        .limit(5)
        .lean(),

      Match.find({
        venue: {
          $exists: true,
          $nin: ["", null],
        },
      }).lean(),
    ]);

    const normalizedVenue =
      normalizeVenueName(venue);

    const venueMatches =
      allVenueMatches.filter(
        (match) => {
          const matchVenue =
            normalizeVenueName(
              match.venue
            );

          return (
            matchVenue.includes(
              normalizedVenue
            ) ||
            normalizedVenue.includes(
              matchVenue
            )
          );
        }
      );

    const team1H2HWins =
      headToHeadMatches.filter(
        (match) =>
          team1Aliases.includes(
            match.winner
          )
      ).length;

    const team2H2HWins =
      headToHeadMatches.filter(
        (match) =>
          team2Aliases.includes(
            match.winner
          )
      ).length;

    const team1RecentWins =
      recentTeam1Matches.filter(
        (match) =>
          team1Aliases.includes(
            match.winner
          )
      ).length;

    const team2RecentWins =
      recentTeam2Matches.filter(
        (match) =>
          team2Aliases.includes(
            match.winner
          )
      ).length;

    const getVenueWins = (
      aliases
    ) =>
      venueMatches.filter(
        (match) =>
          aliases.includes(
            match.winner
          )
      ).length;

    const team1VenueMatches =
      venueMatches.filter(
        (match) =>
          team1Aliases.includes(
            match.team1
          ) ||
          team1Aliases.includes(
            match.team2
          )
      );

    const team2VenueMatches =
      venueMatches.filter(
        (match) =>
          team2Aliases.includes(
            match.team1
          ) ||
          team2Aliases.includes(
            match.team2
          )
      );

    const team1VenueWins =
      getVenueWins(team1Aliases);

    const team2VenueWins =
      getVenueWins(team2Aliases);

    const averageFirstInningsScore =
      getAverage(
        venueMatches.map(
          (match) =>
            Number(match.team1Runs)
        )
      );

    const chasingWins =
      venueMatches.filter(
        (match) =>
          Number(match.winByWickets) > 0
      ).length;

    const battingFirstWins =
      venueMatches.filter(
        (match) =>
          Number(match.winByRuns) > 0
      ).length;

    const insights = [];

    if (
      team1H2HWins !== team2H2HWins
    ) {
      const strongerTeam =
        team1H2HWins >
        team2H2HWins
          ? team1
          : team2;

      insights.push(
        `${strongerTeam} has the stronger historical head-to-head record.`
      );
    } else {
      insights.push(
        "Both teams are evenly matched in their historical meetings."
      );
    }

    if (
      team1RecentWins !==
      team2RecentWins
    ) {
      const formTeam =
        team1RecentWins >
        team2RecentWins
          ? team1
          : team2;

      insights.push(
        `${formTeam} enters this match with better recent winning form.`
      );
    } else {
      insights.push(
        "Both teams have similar recent form."
      );
    }

    const team1VenueRate =
      getPercentage(
        team1VenueWins,
        team1VenueMatches.length
      );

    const team2VenueRate =
      getPercentage(
        team2VenueWins,
        team2VenueMatches.length
      );

    if (
      team1VenueRate !== team2VenueRate
    ) {
      const venueTeam =
        team1VenueRate >
        team2VenueRate
          ? team1
          : team2;

      insights.push(
        `${venueTeam} has performed better at this venue.`
      );
    }

    if (
      chasingWins > battingFirstWins
    ) {
      insights.push(
        `Teams chasing at this venue have won more often; the toss may favour bowling first.`
      );
    } else if (
      battingFirstWins > chasingWins
    ) {
      insights.push(
        `Batting first has historically produced more wins at this venue.`
      );
    }

    if (averageFirstInningsScore > 0) {
      insights.push(
        `The historical average first-innings score here is ${averageFirstInningsScore}.`
      );
    }

    return res.status(200).json({
      success: true,
      team1,
      team2,
      venue,
      headToHead: {
        totalMatches:
          headToHeadMatches.length,
        team1Wins: team1H2HWins,
        team2Wins: team2H2HWins,
      },
      recentForm: {
        team1: {
          wins: team1RecentWins,
          matches:
            recentTeam1Matches.length,
          form: recentTeam1Matches.map(
            (match) =>
              getMatchResult(
                match,
                team1Aliases
              )
          ),
        },
        team2: {
          wins: team2RecentWins,
          matches:
            recentTeam2Matches.length,
          form: recentTeam2Matches.map(
            (match) =>
              getMatchResult(
                match,
                team2Aliases
              )
          ),
        },
      },
      venueAnalysis: {
        averageFirstInningsScore,
        battingFirstWins,
        chasingWins,
        team1WinPercentage:
          team1VenueRate,
        team2WinPercentage:
          team2VenueRate,
      },
      insights,
    });
  } catch (error) {
    console.error(
      "Live match insights error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate live match insights",
    });
  }
};

module.exports = {
  getAllMatches,
  getAllTeams,
  getTeamStats,
  getHeadToHead,
  getRecentForm,
  getVenueAnalysis,
  getLiveMatchInsights,
};