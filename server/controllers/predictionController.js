const mongoose = require("mongoose");

const Match = require("../models/Match");
const User = require("../models/User");

const calculatePrediction = require(
  "../services/predictionService"
);

const toFiniteNumber = (
  value,
  fallback = 0
) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : fallback;
};

const normalizeTeamName = (
  teamName
) => {
  if (typeof teamName !== "string") {
    return "";
  }

  const trimmedName =
    teamName.trim();

  if (
    trimmedName ===
    "Royal Challengers Bangalore"
  ) {
    return "Royal Challengers Bengaluru";
  }

  return trimmedName;
};

const getTeamVariants = (
  teamName
) => {
  const normalizedTeam =
    normalizeTeamName(teamName);

  if (
    normalizedTeam ===
    "Royal Challengers Bengaluru"
  ) {
    return [
      "Royal Challengers Bengaluru",
      "Royal Challengers Bangalore",
    ];
  }

  return normalizedTeam
    ? [normalizedTeam]
    : [];
};

const normalizeVenueName = (
  venueName
) => {
  if (
    typeof venueName !== "string"
  ) {
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

const normalizeWeather = (
  weather
) => {
  if (
    !weather ||
    typeof weather !== "object"
  ) {
    return null;
  }

  return {
    venue:
      typeof weather.venue ===
      "string"
        ? weather.venue.trim()
        : "",

    city:
      typeof weather.city ===
      "string"
        ? weather.city.trim()
        : "",

    latitude: toFiniteNumber(
      weather.latitude,
      0
    ),

    longitude: toFiniteNumber(
      weather.longitude,
      0
    ),

    temperature: toFiniteNumber(
      weather.temperature,
      28
    ),

    humidity: Math.min(
      100,
      Math.max(
        0,
        toFiniteNumber(
          weather.humidity,
          60
        )
      )
    ),

    windSpeed: Math.max(
      0,
      toFiniteNumber(
        weather.windSpeed,
        0
      )
    ),

    rainProbability: Math.min(
      100,
      Math.max(
        0,
        toFiniteNumber(
          weather.rainProbability,
          0
        )
      )
    ),

    precipitation: Math.max(
      0,
      toFiniteNumber(
        weather.precipitation,
        0
      )
    ),

    rain: Math.max(
      0,
      toFiniteNumber(
        weather.rain,
        0
      )
    ),

    weatherCode: toFiniteNumber(
      weather.weatherCode,
      0
    ),

    condition:
      typeof weather.condition ===
      "string"
        ? weather.condition.trim()
        : "Unknown",

    observedAt:
      typeof weather.observedAt ===
      "string"
        ? weather.observedAt
        : "",
  };
};

const isCompletedMatch = (
  match
) => {
  return Boolean(
    normalizeTeamName(
      match.winner
    )
  );
};

const getRecentTeamForm = async (
  teamVariants,
  normalizedTeam
) => {
  const fetchedMatches =
    await Match.find({
      $or: [
        {
          team1: {
            $in: teamVariants,
          },
        },
        {
          team2: {
            $in: teamVariants,
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
        _id: -1,
      })
      .limit(30)
      .lean();

  const uniqueMatches = [];
  const seenMatches =
    new Set();

  for (
    const match of fetchedMatches
  ) {
    const matchTeam1 =
      normalizeTeamName(
        match.team1
      );

    const matchTeam2 =
      normalizeTeamName(
        match.team2
      );

    const matchWinner =
      normalizeTeamName(
        match.winner
      );

    if (
      !matchTeam1 ||
      !matchTeam2 ||
      !matchWinner
    ) {
      continue;
    }

    let matchDate = "";

    if (match.date) {
      const parsedDate =
        new Date(match.date);

      if (
        !Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        matchDate = parsedDate
          .toISOString()
          .slice(0, 10);
      }
    }

    if (!matchDate) {
      matchDate =
        String(match._id);
    }

    const uniqueKey = [
      matchDate,
      [
        matchTeam1,
        matchTeam2,
      ]
        .sort()
        .join("-"),
      matchWinner,
      normalizeVenueName(
        match.venue
      ),
    ].join("|");

    if (
      seenMatches.has(
        uniqueKey
      )
    ) {
      continue;
    }

    seenMatches.add(
      uniqueKey
    );

    uniqueMatches.push(
      match
    );

    if (
      uniqueMatches.length === 5
    ) {
      break;
    }
  }

  const wins =
    uniqueMatches.filter(
      (match) =>
        normalizeTeamName(
          match.winner
        ) === normalizedTeam
    ).length;

  const totalMatches =
    uniqueMatches.length;

  const winPercentage =
    totalMatches > 0
      ? Number(
          (
            (wins /
              totalMatches) *
            100
          ).toFixed(1)
        )
      : 50;

  return {
    wins,
    matches: totalMatches,
    winPercentage,

    form: uniqueMatches.map(
      (match) =>
        normalizeTeamName(
          match.winner
        ) === normalizedTeam
          ? "W"
          : "L"
    ),
  };
};

const getVenueTeamStats = (
  venueMatches,
  teamVariants,
  normalizedTeam
) => {
  const teamMatches =
    venueMatches.filter(
      (match) =>
        teamVariants.includes(
          match.team1
        ) ||
        teamVariants.includes(
          match.team2
        )
    );

  const completedMatches =
    teamMatches.filter(
      isCompletedMatch
    );

  const wins =
    completedMatches.filter(
      (match) =>
        normalizeTeamName(
          match.winner
        ) === normalizedTeam
    ).length;

  return {
    matches:
      completedMatches.length,
    wins,
  };
};

const predictMatch = async (
  req,
  res
) => {
  try {
    const {
      team1,
      team2,
      venue,
      tossWinner,
      matchId = null,
      weather = null,
    } = req.body;

    const normalizedTeam1 =
      normalizeTeamName(
        team1
      );

    const normalizedTeam2 =
      normalizeTeamName(
        team2
      );

    const normalizedTossWinner =
      normalizeTeamName(
        tossWinner
      );

    const normalizedVenue =
      typeof venue === "string"
        ? venue.trim()
        : "";

    const normalizedWeather =
      normalizeWeather(
        weather
      );

    if (
      !normalizedTeam1 ||
      !normalizedTeam2 ||
      !normalizedVenue ||
      !normalizedTossWinner
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "All prediction fields are required",
        });
    }

    if (
      normalizedTeam1 ===
      normalizedTeam2
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Please select two different teams",
        });
    }

    if (
      normalizedTossWinner !==
        normalizedTeam1 &&
      normalizedTossWinner !==
        normalizedTeam2
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Toss winner must be one of the selected teams",
        });
    }

    const userId =
      req.user?.userId ||
      req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "User not authenticated",
        });
    }

    let linkedMatch = null;

    if (matchId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          matchId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid match ID",
          });
      }

      linkedMatch =
        await Match.findById(
          matchId
        ).lean();

      if (!linkedMatch) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Match not found",
          });
      }

      const linkedTeam1 =
        normalizeTeamName(
          linkedMatch.team1
        );

      const linkedTeam2 =
        normalizeTeamName(
          linkedMatch.team2
        );

      const selectedTeamsMatch =
        (linkedTeam1 ===
          normalizedTeam1 &&
          linkedTeam2 ===
            normalizedTeam2) ||
        (linkedTeam1 ===
          normalizedTeam2 &&
          linkedTeam2 ===
            normalizedTeam1);

      if (
        !selectedTeamsMatch
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Selected teams do not match the linked match",
          });
      }
    }

    const team1Variants =
      getTeamVariants(
        normalizedTeam1
      );

    const team2Variants =
      getTeamVariants(
        normalizedTeam2
      );

    const [
      h2hMatches,
      recentTeam1,
      recentTeam2,
      allVenueMatches,
    ] = await Promise.all([
      Match.find({
        $or: [
          {
            team1: {
              $in: team1Variants,
            },
            team2: {
              $in: team2Variants,
            },
          },
          {
            team1: {
              $in: team2Variants,
            },
            team2: {
              $in: team1Variants,
            },
          },
        ],
      })
        .sort({
          date: -1,
        })
        .lean(),

      getRecentTeamForm(
        team1Variants,
        normalizedTeam1
      ),

      getRecentTeamForm(
        team2Variants,
        normalizedTeam2
      ),

      Match.find({
        venue: {
          $exists: true,
          $nin: ["", null],
        },
      }).lean(),
    ]);

    const completedH2HMatches =
      h2hMatches.filter(
        isCompletedMatch
      );

    const headToHead = {
      team1Wins:
        completedH2HMatches.filter(
          (match) =>
            normalizeTeamName(
              match.winner
            ) ===
            normalizedTeam1
        ).length,

      team2Wins:
        completedH2HMatches.filter(
          (match) =>
            normalizeTeamName(
              match.winner
            ) ===
            normalizedTeam2
        ).length,

      totalMatches:
        completedH2HMatches.length,
    };

    const recentForm = {
      team1:
        recentTeam1.winPercentage,

      team2:
        recentTeam2.winPercentage,

      team1Wins:
        recentTeam1.wins,

      team2Wins:
        recentTeam2.wins,

      team1Matches:
        recentTeam1.matches,

      team2Matches:
        recentTeam2.matches,

      team1Form:
        recentTeam1.form,

      team2Form:
        recentTeam2.form,
    };

    const comparableVenue =
      normalizeVenueName(
        normalizedVenue
      );

    const venueMatches =
      allVenueMatches.filter(
        (match) => {
          const matchVenue =
            normalizeVenueName(
              match.venue
            );

          if (
            !matchVenue ||
            !comparableVenue
          ) {
            return false;
          }

          return (
            matchVenue.includes(
              comparableVenue
            ) ||
            comparableVenue.includes(
              matchVenue
            )
          );
        }
      );

    const team1VenueStats =
      getVenueTeamStats(
        venueMatches,
        team1Variants,
        normalizedTeam1
      );

    const team2VenueStats =
      getVenueTeamStats(
        venueMatches,
        team2Variants,
        normalizedTeam2
      );

    const venueRecord = {
      team1Stats: {
        wins:
          team1VenueStats.wins,

        matches:
          team1VenueStats.matches,
      },

      team2Stats: {
        wins:
          team2VenueStats.wins,

        matches:
          team2VenueStats.matches,
      },
    };

    const result =
      calculatePrediction({
        headToHead,
        recentForm,
        venueRecord,

        tossWinner:
          normalizedTossWinner,

        team1:
          normalizedTeam1,

        team2:
          normalizedTeam2,

        weather:
          normalizedWeather,
      });

    if (
      !result ||
      !result.predictedWinner
    ) {
      return res
        .status(500)
        .json({
          success: false,
          message:
            "Prediction service returned an invalid result",
        });
    }

    const team1Probability =
      toFiniteNumber(
        result.team1Probability,
        NaN
      );

    const team2Probability =
      toFiniteNumber(
        result.team2Probability,
        NaN
      );

    if (
      !Number.isFinite(
        team1Probability
      ) ||
      !Number.isFinite(
        team2Probability
      )
    ) {
      return res
        .status(500)
        .json({
          success: false,
          message:
            "Prediction probabilities are invalid",
        });
    }

    const user =
      await User.findById(
        userId
      );

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "User not found",
        });
    }

    const actualWinner =
      linkedMatch
        ? normalizeTeamName(
            linkedMatch.winner
          )
        : "";

    const resultStatus =
      actualWinner
        ? "completed"
        : "pending";

    const predictedWinner =
      normalizeTeamName(
        result.predictedWinner
      );

    const isCorrect =
      actualWinner
        ? predictedWinner ===
          actualWinner
        : null;

    user.predictions.push({
      matchId: linkedMatch
        ? linkedMatch._id
        : null,

      team1:
        normalizedTeam1,

      team2:
        normalizedTeam2,

      venue:
        normalizedVenue,

      tossWinner:
        normalizedTossWinner,

      predictedWinner,

      team1Probability,
      team2Probability,

      actualWinner,
      resultStatus,
      isCorrect,

      predictedAt:
        new Date(),
    });

    await user.save({
      validateBeforeSave:
        false,
    });

    return res
      .status(200)
      .json({
        success: true,

        ...result,

        predictedWinner,

        team1Probability,
        team2Probability,

        prob1:
          team1Probability,

        prob2:
          team2Probability,

        weather:
          normalizedWeather,

        recentFormData: {
          team1: {
            team:
              normalizedTeam1,

            wins:
              recentTeam1.wins,

            matches:
              recentTeam1.matches,

            percentage:
              recentTeam1.winPercentage,

            form:
              recentTeam1.form,
          },

          team2: {
            team:
              normalizedTeam2,

            wins:
              recentTeam2.wins,

            matches:
              recentTeam2.matches,

            percentage:
              recentTeam2.winPercentage,

            form:
              recentTeam2.form,
          },
        },

        predictionResult: {
          resultStatus,
          actualWinner,
          isCorrect,
        },
      });
  } catch (error) {
    console.error(
      "Prediction Error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          error.message ||
          "Prediction Failed",
      });
  }
};

const getPredictionHistory =
  async (req, res) => {
    try {
      const userId =
        req.user?.userId ||
        req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "User not authenticated",
          });
      }

      const user =
        await User.findById(
          userId
        ).select(
          "predictions"
        );

      if (!user) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "User not found",
          });
      }

      const history = [
        ...(user.predictions ||
          []),
      ].sort(
        (
          firstPrediction,
          secondPrediction
        ) =>
          new Date(
            secondPrediction.predictedAt
          ).getTime() -
          new Date(
            firstPrediction.predictedAt
          ).getTime()
      );

      const completedPredictions =
        history.filter(
          (prediction) =>
            prediction.resultStatus ===
            "completed"
        );

      const correctPredictions =
        completedPredictions.filter(
          (prediction) =>
            prediction.isCorrect ===
            true
        );

      const accuracy =
        completedPredictions.length >
        0
          ? Number(
              (
                (correctPredictions.length /
                  completedPredictions.length) *
                100
              ).toFixed(2)
            )
          : 0;

      return res
        .status(200)
        .json({
          success: true,

          count:
            history.length,

          history,

          stats: {
            totalPredictions:
              history.length,

            completedPredictions:
              completedPredictions.length,

            pendingPredictions:
              history.length -
              completedPredictions.length,

            correctPredictions:
              correctPredictions.length,

            accuracy,
          },
        });
    } catch (error) {
      console.error(
        "History Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            error.message ||
            "Failed to fetch prediction history",
        });
    }
  };

module.exports = {
  predictMatch,
  getPredictionHistory,
};