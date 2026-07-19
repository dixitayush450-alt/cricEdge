const clamp = (
  value,
  minimum,
  maximum
) =>
  Math.min(
    maximum,
    Math.max(minimum, value)
  );

const getNumber = (
  value,
  fallback = 0
) => {
  const parsedValue =
    Number(value);

  return Number.isFinite(
    parsedValue
  )
    ? parsedValue
    : fallback;
};

const getPercentage = (
  value,
  total
) => {
  if (!total) {
    return 0;
  }

  return Number(
    (
      (value / total) *
      100
    ).toFixed(1)
  );
};

const normalizePair = (
  firstValue,
  secondValue,
  fallback = 50
) => {
  const first = clamp(
    getNumber(
      firstValue,
      fallback
    ),
    0,
    100
  );

  const second = clamp(
    getNumber(
      secondValue,
      fallback
    ),
    0,
    100
  );

  const total =
    first + second;

  if (total <= 0) {
    return [50, 50];
  }

  const normalizedFirst =
    Number(
      (
        (first / total) *
        100
      ).toFixed(1)
    );

  return [
    normalizedFirst,
    Number(
      (
        100 -
        normalizedFirst
      ).toFixed(1)
    ),
  ];
};

const getHeadToHeadScores = (
  headToHead = {}
) => {
  const team1Wins =
    Math.max(
      0,
      getNumber(
        headToHead.team1Wins,
        0
      )
    );

  const team2Wins =
    Math.max(
      0,
      getNumber(
        headToHead.team2Wins,
        0
      )
    );

  const totalMatches =
    Math.max(
      0,
      getNumber(
        headToHead.totalMatches,
        team1Wins +
          team2Wins
      )
    );

  if (totalMatches <= 0) {
    return {
      team1Score: 50,
      team2Score: 50,
      team1Wins: 0,
      team2Wins: 0,
      totalMatches: 0,
    };
  }

  const [
    team1Score,
    team2Score,
  ] = normalizePair(
    team1Wins,
    team2Wins
  );

  return {
    team1Score,
    team2Score,
    team1Wins,
    team2Wins,
    totalMatches,
  };
};

const getRecentFormScores = (
  recentForm = {}
) => {
  const directTeam1 =
    getNumber(
      recentForm.team1,
      NaN
    );

  const directTeam2 =
    getNumber(
      recentForm.team2,
      NaN
    );

  if (
    Number.isFinite(
      directTeam1
    ) &&
    Number.isFinite(
      directTeam2
    )
  ) {
    const [
      team1Score,
      team2Score,
    ] = normalizePair(
      directTeam1,
      directTeam2
    );

    return {
      team1Score,
      team2Score,
    };
  }

  const team1Wins =
    Math.max(
      0,
      getNumber(
        recentForm.team1Wins,
        getNumber(
          recentForm.team1?.wins,
          0
        )
      )
    );

  const team2Wins =
    Math.max(
      0,
      getNumber(
        recentForm.team2Wins,
        getNumber(
          recentForm.team2?.wins,
          0
        )
      )
    );

  const team1Matches =
    Math.max(
      1,
      getNumber(
        recentForm.team1Matches,
        getNumber(
          recentForm.team1
            ?.matches,
          5
        )
      )
    );

  const team2Matches =
    Math.max(
      1,
      getNumber(
        recentForm.team2Matches,
        getNumber(
          recentForm.team2
            ?.matches,
          5
        )
      )
    );

  const team1Rate =
    getPercentage(
      team1Wins,
      team1Matches
    );

  const team2Rate =
    getPercentage(
      team2Wins,
      team2Matches
    );

  const [
    team1Score,
    team2Score,
  ] = normalizePair(
    team1Rate,
    team2Rate
  );

  return {
    team1Score,
    team2Score,
  };
};

const getVenueScores = (
  venueRecord = {}
) => {
  const directTeam1 =
    getNumber(
      venueRecord.team1,
      NaN
    );

  const directTeam2 =
    getNumber(
      venueRecord.team2,
      NaN
    );

  if (
    Number.isFinite(
      directTeam1
    ) &&
    Number.isFinite(
      directTeam2
    )
  ) {
    const [
      team1Score,
      team2Score,
    ] = normalizePair(
      directTeam1,
      directTeam2
    );

    return {
      team1Score,
      team2Score,
    };
  }

  const team1Wins =
    Math.max(
      0,
      getNumber(
        venueRecord.team1Wins,
        getNumber(
          venueRecord.team1Stats
            ?.wins,
          0
        )
      )
    );

  const team2Wins =
    Math.max(
      0,
      getNumber(
        venueRecord.team2Wins,
        getNumber(
          venueRecord.team2Stats
            ?.wins,
          0
        )
      )
    );

  const team1Matches =
    Math.max(
      1,
      getNumber(
        venueRecord.team1Matches,
        getNumber(
          venueRecord.team1Stats
            ?.matches,
          1
        )
      )
    );

  const team2Matches =
    Math.max(
      1,
      getNumber(
        venueRecord.team2Matches,
        getNumber(
          venueRecord.team2Stats
            ?.matches,
          1
        )
      )
    );

  const [
    team1Score,
    team2Score,
  ] = normalizePair(
    getPercentage(
      team1Wins,
      team1Matches
    ),
    getPercentage(
      team2Wins,
      team2Matches
    )
  );

  return {
    team1Score,
    team2Score,
  };
};

const calculateWeatherImpact = ({
  weather,
  tossWinner,
  team1,
  team2,
}) => {
  if (
    !weather ||
    typeof weather !== "object"
  ) {
    return {
      team1Impact: 50,
      team2Impact: 50,
      team1ScoreBonus: 0,
      team2ScoreBonus: 0,
      summary:
        "Weather data is unavailable, so conditions have no additional prediction impact.",
    };
  }

  const temperature =
    getNumber(
      weather.temperature,
      28
    );

  const humidity = clamp(
    getNumber(
      weather.humidity,
      60
    ),
    0,
    100
  );

  const windSpeed =
    Math.max(
      0,
      getNumber(
        weather.windSpeed,
        0
      )
    );

  const rainProbability =
    clamp(
      getNumber(
        weather.rainProbability,
        0
      ),
      0,
      100
    );

  const precipitation =
    Math.max(
      0,
      getNumber(
        weather.precipitation,
        getNumber(
          weather.rain,
          0
        )
      )
    );

  const dewFactor =
    clamp(
      (humidity - 60) /
        8,
      0,
      5
    );

  const rainFactor =
    clamp(
      rainProbability /
        20,
      0,
      5
    );

  const wetConditionFactor =
    clamp(
      precipitation *
        0.8,
      0,
      3
    );

  const windPenalty =
    clamp(
      (windSpeed - 10) /
        8,
      0,
      3
    );

  const heatPenalty =
    temperature >= 38
      ? 3
      : temperature >= 35
        ? 1.5
        : temperature <= 16
          ? 1
          : 0;

  const tossWeatherAdvantage =
    clamp(
      dewFactor +
        rainFactor +
        wetConditionFactor,
      0,
      8
    );

  let team1Impact =
    68 -
    heatPenalty -
    windPenalty;

  let team2Impact =
    68 -
    heatPenalty -
    windPenalty;

  let team1ScoreBonus = 0;
  let team2ScoreBonus = 0;

  if (
    tossWinner === team1
  ) {
    team1Impact +=
      tossWeatherAdvantage;

    team2Impact -=
      tossWeatherAdvantage /
      2;

    team1ScoreBonus +=
      tossWeatherAdvantage *
      0.7;
  } else if (
    tossWinner === team2
  ) {
    team2Impact +=
      tossWeatherAdvantage;

    team1Impact -=
      tossWeatherAdvantage /
      2;

    team2ScoreBonus +=
      tossWeatherAdvantage *
      0.7;
  }

  let summary =
    "Conditions look balanced with limited weather influence.";

  if (
    rainProbability >= 50 ||
    precipitation > 0
  ) {
    summary =
      "Rain or wet conditions can increase toss importance and favour the team controlling the chase.";
  } else if (
    humidity >= 75
  ) {
    summary =
      "High humidity may produce dew later and increase the chasing advantage.";
  } else if (
    windSpeed >= 20
  ) {
    summary =
      "Strong wind may affect aerial shots, swing movement and boundary hitting.";
  } else if (
    temperature >= 35
  ) {
    summary =
      "Hot conditions may increase player fatigue during the match.";
  }

  return {
    team1Impact:
      Math.round(
        clamp(
          team1Impact,
          35,
          95
        )
      ),

    team2Impact:
      Math.round(
        clamp(
          team2Impact,
          35,
          95
        )
      ),

    team1ScoreBonus,
    team2ScoreBonus,
    summary,
  };
};
const getTossScores = ({
  tossWinner,
  team1,
  team2,
}) => {
  if (tossWinner === team1) {
    return {
      team1Score: 65,
      team2Score: 35,
      team1Bonus: 6,
      team2Bonus: 0,
    };
  }

  if (tossWinner === team2) {
    return {
      team1Score: 35,
      team2Score: 65,
      team1Bonus: 0,
      team2Bonus: 6,
    };
  }

  return {
    team1Score: 50,
    team2Score: 50,
    team1Bonus: 0,
    team2Bonus: 0,
  };
};

const buildWinningReasons = ({
  predictedWinner,
  team1,
  team2,
  headToHeadScores,
  recentFormScores,
  venueScores,
  tossScores,
  weatherImpact,
}) => {
  const winnerIsTeam1 =
    predictedWinner === team1;

  const winnerHeadToHead =
    winnerIsTeam1
      ? headToHeadScores.team1Score
      : headToHeadScores.team2Score;

  const loserHeadToHead =
    winnerIsTeam1
      ? headToHeadScores.team2Score
      : headToHeadScores.team1Score;

  const winnerForm =
    winnerIsTeam1
      ? recentFormScores.team1Score
      : recentFormScores.team2Score;

  const loserForm =
    winnerIsTeam1
      ? recentFormScores.team2Score
      : recentFormScores.team1Score;

  const winnerVenue =
    winnerIsTeam1
      ? venueScores.team1Score
      : venueScores.team2Score;

  const loserVenue =
    winnerIsTeam1
      ? venueScores.team2Score
      : venueScores.team1Score;

  const winnerToss =
    winnerIsTeam1
      ? tossScores.team1Score
      : tossScores.team2Score;

  const loserToss =
    winnerIsTeam1
      ? tossScores.team2Score
      : tossScores.team1Score;

  const winnerWeather =
    winnerIsTeam1
      ? weatherImpact.team1Impact
      : weatherImpact.team2Impact;

  const loserWeather =
    winnerIsTeam1
      ? weatherImpact.team2Impact
      : weatherImpact.team1Impact;

  const reasons = [];

  if (
    winnerHeadToHead >
    loserHeadToHead
  ) {
    reasons.push(
      `${predictedWinner} has the stronger head-to-head record.`
    );
  }

  if (winnerForm > loserForm) {
    reasons.push(
      `${predictedWinner} is carrying better recent form.`
    );
  }

  if (winnerVenue > loserVenue) {
    reasons.push(
      `${predictedWinner} has performed better at this venue.`
    );
  }

  if (winnerToss > loserToss) {
    reasons.push(
      `${predictedWinner} receives an advantage after winning the toss.`
    );
  }

  if (
    winnerWeather >
    loserWeather
  ) {
    reasons.push(
      `Current weather conditions slightly favour ${predictedWinner}.`
    );
  }

  if (reasons.length === 0) {
    reasons.push(
      `${predictedWinner} has a small overall statistical advantage.`
    );
  }

  return reasons.slice(0, 4);
};

const buildLiveInsights = ({
  team1,
  team2,
  predictedWinner,
  team1Probability,
  team2Probability,
  headToHeadScores,
  recentFormScores,
  venueScores,
  tossWinner,
  weatherImpact,
}) => {
  const insights = [];

  const probabilityGap =
    Math.abs(
      team1Probability -
        team2Probability
    );

  if (probabilityGap >= 15) {
    insights.push(
      `${predictedWinner} holds a strong prediction advantage of ${probabilityGap.toFixed(
        1
      )}%.`
    );
  } else if (
    probabilityGap >= 7
  ) {
    insights.push(
      `${predictedWinner} has a moderate statistical edge.`
    );
  } else {
    insights.push(
      "The match is expected to be closely contested."
    );
  }

  if (
    headToHeadScores.team1Score >
    headToHeadScores.team2Score
  ) {
    insights.push(
      `${team1} leads the historical head-to-head comparison.`
    );
  } else if (
    headToHeadScores.team2Score >
    headToHeadScores.team1Score
  ) {
    insights.push(
      `${team2} leads the historical head-to-head comparison.`
    );
  } else {
    insights.push(
      "The head-to-head record is evenly balanced."
    );
  }

  if (
    recentFormScores.team1Score >
    recentFormScores.team2Score
  ) {
    insights.push(
      `${team1} enters with stronger recent form.`
    );
  } else if (
    recentFormScores.team2Score >
    recentFormScores.team1Score
  ) {
    insights.push(
      `${team2} enters with stronger recent form.`
    );
  } else {
    insights.push(
      "Both teams have similar recent form."
    );
  }

  if (
    venueScores.team1Score >
    venueScores.team2Score
  ) {
    insights.push(
      `${team1} has the better venue record.`
    );
  } else if (
    venueScores.team2Score >
    venueScores.team1Score
  ) {
    insights.push(
      `${team2} has the better venue record.`
    );
  }

  if (
    tossWinner === team1 ||
    tossWinner === team2
  ) {
    insights.push(
      `${tossWinner} may gain a tactical advantage from the toss.`
    );
  }

  if (
    weatherImpact.summary
  ) {
    insights.push(
      weatherImpact.summary
    );
  }

  return insights.slice(0, 6);
};

const calculatePrediction = ({
  headToHead = {},
  recentForm = {},
  venueRecord = {},
  tossWinner = "",
  team1 = "",
  team2 = "",
  weather = null,
}) => {
  const headToHeadScores =
    getHeadToHeadScores(
      headToHead
    );

  const recentFormScores =
    getRecentFormScores(
      recentForm
    );

  const venueScores =
    getVenueScores(
      venueRecord
    );

  const tossScores =
    getTossScores({
      tossWinner,
      team1,
      team2,
    });

  const weatherImpact =
    calculateWeatherImpact({
      weather,
      tossWinner,
      team1,
      team2,
    });

  let team1RawScore = 50;
  let team2RawScore = 50;

  const headToHeadWeight = 0.3;
  const recentFormWeight = 0.25;
  const venueWeight = 0.15;
  const tossWeight = 0.1;
  const weatherWeight = 0.08;

  team1RawScore +=
    (headToHeadScores.team1Score -
      50) *
    headToHeadWeight;

  team2RawScore +=
    (headToHeadScores.team2Score -
      50) *
    headToHeadWeight;

  team1RawScore +=
    (recentFormScores.team1Score -
      50) *
    recentFormWeight;

  team2RawScore +=
    (recentFormScores.team2Score -
      50) *
    recentFormWeight;

  team1RawScore +=
    (venueScores.team1Score -
      50) *
    venueWeight;

  team2RawScore +=
    (venueScores.team2Score -
      50) *
    venueWeight;

  team1RawScore +=
    (tossScores.team1Score -
      50) *
    tossWeight;

  team2RawScore +=
    (tossScores.team2Score -
      50) *
    tossWeight;

  team1RawScore +=
    (weatherImpact.team1Impact -
      50) *
    weatherWeight;

  team2RawScore +=
    (weatherImpact.team2Impact -
      50) *
    weatherWeight;

  team1RawScore +=
    tossScores.team1Bonus;

  team2RawScore +=
    tossScores.team2Bonus;

  team1RawScore +=
    weatherImpact.team1ScoreBonus;

  team2RawScore +=
    weatherImpact.team2ScoreBonus;

  team1RawScore = Math.max(
    1,
    team1RawScore
  );

  team2RawScore = Math.max(
    1,
    team2RawScore
  );

  const totalScore =
    team1RawScore +
    team2RawScore;

  let team1Probability =
    Number(
      (
        (team1RawScore /
          totalScore) *
        100
      ).toFixed(1)
    );

  team1Probability = clamp(
    team1Probability,
    20,
    80
  );

  const team2Probability =
    Number(
      (
        100 -
        team1Probability
      ).toFixed(1)
    );

  const predictedWinner =
    team1Probability >=
    team2Probability
      ? team1
      : team2;

  const confidence =
    Number(
      Math.max(
        team1Probability,
        team2Probability
      ).toFixed(1)
    );

  const form = [
    Math.round(
      recentFormScores.team1Score
    ),
    Math.round(
      recentFormScores.team2Score
    ),
  ];

  const homeAdv = [
    Math.round(
      venueScores.team1Score
    ),
    Math.round(
      venueScores.team2Score
    ),
  ];

  const tossAdv = [
    Math.round(
      tossScores.team1Score
    ),
    Math.round(
      tossScores.team2Score
    ),
  ];

  const weatherImpactArray = [
    Math.round(
      weatherImpact.team1Impact
    ),
    Math.round(
      weatherImpact.team2Impact
    ),
  ];

  const batting = [
    Math.round(
      clamp(
        58 +
          recentFormScores.team1Score *
            0.22 +
          venueScores.team1Score *
            0.12,
        45,
        95
      )
    ),

    Math.round(
      clamp(
        58 +
          recentFormScores.team2Score *
            0.22 +
          venueScores.team2Score *
            0.12,
        45,
        95
      )
    ),
  ];

  const bowling = [
    Math.round(
      clamp(
        55 +
          headToHeadScores.team1Score *
            0.18 +
          recentFormScores.team1Score *
            0.1,
        45,
        95
      )
    ),

    Math.round(
      clamp(
        55 +
          headToHeadScores.team2Score *
            0.18 +
          recentFormScores.team2Score *
            0.1,
        45,
        95
      )
    ),
  ];

  const fielding = [
    Math.round(
      clamp(
        58 +
          recentFormScores.team1Score *
            0.15,
        45,
        92
      )
    ),

    Math.round(
      clamp(
        58 +
          recentFormScores.team2Score *
            0.15,
        45,
        92
      )
    ),
  ];

  const swing = [
    {
      over: "0",
      t1: 50,
      t2: 50,
    },
    {
      over: "5",
      t1: Number(
        (
          50 +
          (team1Probability - 50) *
            0.25
        ).toFixed(1)
      ),
      t2: Number(
        (
          50 +
          (team2Probability - 50) *
            0.25
        ).toFixed(1)
      ),
    },
    {
      over: "10",
      t1: Number(
        (
          50 +
          (team1Probability - 50) *
            0.5
        ).toFixed(1)
      ),
      t2: Number(
        (
          50 +
          (team2Probability - 50) *
            0.5
        ).toFixed(1)
      ),
    },
    {
      over: "15",
      t1: Number(
        (
          50 +
          (team1Probability - 50) *
            0.75
        ).toFixed(1)
      ),
      t2: Number(
        (
          50 +
          (team2Probability - 50) *
            0.75
        ).toFixed(1)
      ),
    },
    {
      over: "20",
      t1: team1Probability,
      t2: team2Probability,
    },
  ];

  const whyThisTeamWillWin =
    buildWinningReasons({
      predictedWinner,
      team1,
      team2,
      headToHeadScores,
      recentFormScores,
      venueScores,
      tossScores,
      weatherImpact,
    });

  const liveInsights =
    buildLiveInsights({
      team1,
      team2,
      predictedWinner,
      team1Probability,
      team2Probability,
      headToHeadScores,
      recentFormScores,
      venueScores,
      tossWinner,
      weatherImpact,
    });

  return {
    predictedWinner,
    team1Probability,
    team2Probability,
    prob1: team1Probability,
    prob2: team2Probability,
    confidence,

    batting,
    bowling,
    fielding,
    form,
    homeAdv,
    tossAdv,
    weatherImpact:
      weatherImpactArray,

    weatherSummary:
      weatherImpact.summary,

    swing,

    headToHeadAnalysis: {
      team1Wins:
        headToHeadScores.team1Wins,
      team2Wins:
        headToHeadScores.team2Wins,
      totalMatches:
        headToHeadScores.totalMatches,
      team1Score:
        headToHeadScores.team1Score,
      team2Score:
        headToHeadScores.team2Score,
    },

    recentFormAnalysis: {
      team1Score:
        recentFormScores.team1Score,
      team2Score:
        recentFormScores.team2Score,
    },

    venueAnalysis: {
      team1Score:
        venueScores.team1Score,
      team2Score:
        venueScores.team2Score,
    },

    whyThisTeamWillWin,
    liveInsights,
  };
};

module.exports =
  calculatePrediction;