import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Star, Filter } from "lucide-react";

const ROLES = ["All", "BAT", "BOWL", "FIELD"];

type PlayerStat = {
  name: string;
  team: string;
  teamColor: string;
  teamBg: string;
  role: "BAT" | "BOWL" | "FIELD";
  score: number;
  metricLabel: string;
  metricValue: number;
  stats: Array<[string, string | number]>;
  details: string;
  timelineLabel: string;
  form: Array<{ m: string; v: number }>;
};

const PLAYERS: PlayerStat[] = [
  {
    "name": "Vaibhav Sooryavanshi",
    "team": "RR",
    "teamColor": "#FF4FA3",
    "teamBg": "rgba(255,79,163,0.1)",
    "role": "BAT",
    "score": 99,
    "metricLabel": "Runs",
    "metricValue": 357,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        357
      ],
      [
        "Average",
        44.62
      ],
      [
        "Strike Rate",
        234.86
      ]
    ],
    "details": "31 fours · 32 sixes · HS 103",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 46.0
      },
      {
        "m": "M2",
        "v": 93.0
      },
      {
        "m": "M3",
        "v": 4.0
      },
      {
        "m": "M4",
        "v": 97.0
      },
      {
        "m": "M5",
        "v": 96.0
      }
    ]
  },
  {
    "name": "Abhishek Sharma",
    "team": "SRH",
    "teamColor": "#F7A721",
    "teamBg": "rgba(247,167,33,0.1)",
    "role": "BAT",
    "score": 94,
    "metricLabel": "Runs",
    "metricValue": 380,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        380
      ],
      [
        "Average",
        54.28
      ],
      [
        "Strike Rate",
        212.29
      ]
    ],
    "details": "36 fours · 28 sixes · HS 135",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 35.0
      },
      {
        "m": "M2",
        "v": 6.0
      },
      {
        "m": "M3",
        "v": 26.0
      },
      {
        "m": "M4",
        "v": 56.0
      },
      {
        "m": "M5",
        "v": 0.0
      }
    ]
  },
  {
    "name": "Ishan Kishan",
    "team": "SRH",
    "teamColor": "#F7A721",
    "teamBg": "rgba(247,167,33,0.1)",
    "role": "BAT",
    "score": 92,
    "metricLabel": "Runs",
    "metricValue": 312,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        312
      ],
      [
        "Average",
        39.0
      ],
      [
        "Strike Rate",
        198.72
      ]
    ],
    "details": "35 fours · 16 sixes · HS 91",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 55.0
      },
      {
        "m": "M2",
        "v": 11.0
      },
      {
        "m": "M3",
        "v": 71.0
      },
      {
        "m": "M4",
        "v": 79.0
      },
      {
        "m": "M5",
        "v": 33.0
      }
    ]
  },
  {
    "name": "Sanju Samson",
    "team": "CSK",
    "teamColor": "#F9C000",
    "teamBg": "rgba(249,192,0,0.1)",
    "role": "BAT",
    "score": 90,
    "metricLabel": "Runs",
    "metricValue": 304,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        304
      ],
      [
        "Average",
        50.66
      ],
      [
        "Strike Rate",
        169.83
      ]
    ],
    "details": "33 fours · 15 sixes · HS 115",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 85.0
      },
      {
        "m": "M2",
        "v": 28.0
      },
      {
        "m": "M3",
        "v": 20.0
      },
      {
        "m": "M4",
        "v": 27.0
      },
      {
        "m": "M5",
        "v": 0.0
      }
    ]
  },
  {
    "name": "Priyansh Arya",
    "team": "PBKS",
    "teamColor": "#ED1B24",
    "teamBg": "rgba(237,27,36,0.1)",
    "role": "BAT",
    "score": 89,
    "metricLabel": "Runs",
    "metricValue": 254,
    "stats": [
      [
        "Matches",
        6
      ],
      [
        "Runs",
        254
      ],
      [
        "Average",
        42.33
      ],
      [
        "Strike Rate",
        249.01
      ]
    ],
    "details": "16 fours · 25 sixes · HS 93",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 1.0
      },
      {
        "m": "M2",
        "v": 56.0
      },
      {
        "m": "M3",
        "v": 22.0
      },
      {
        "m": "M4",
        "v": 0.0
      },
      {
        "m": "M5",
        "v": 0.0
      }
    ]
  },
  {
    "name": "KL Rahul",
    "team": "DC",
    "teamColor": "#0078BC",
    "teamBg": "rgba(0,120,188,0.1)",
    "role": "BAT",
    "score": 82,
    "metricLabel": "Runs",
    "metricValue": 358,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        358
      ],
      [
        "Average",
        51.14
      ],
      [
        "Strike Rate",
        185.49
      ]
    ],
    "details": "36 fours · 19 sixes · HS 152",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 0.0
      },
      {
        "m": "M2",
        "v": 0.0
      },
      {
        "m": "M3",
        "v": 0.0
      },
      {
        "m": "M4",
        "v": 0.0
      },
      {
        "m": "M5",
        "v": 0.0
      }
    ]
  },
  {
    "name": "Prabhsimran Singh",
    "team": "PBKS",
    "teamColor": "#ED1B24",
    "teamBg": "rgba(237,27,36,0.1)",
    "role": "BAT",
    "score": 82,
    "metricLabel": "Runs",
    "metricValue": 287,
    "stats": [
      [
        "Matches",
        7
      ],
      [
        "Runs",
        287
      ],
      [
        "Average",
        57.4
      ],
      [
        "Strike Rate",
        192.61
      ]
    ],
    "details": "31 fours · 16 sixes · HS 80",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 3.0
      },
      {
        "m": "M2",
        "v": 18.0
      },
      {
        "m": "M3",
        "v": 57.0
      },
      {
        "m": "M4",
        "v": 2.0
      },
      {
        "m": "M5",
        "v": 69.0
      }
    ]
  },
  {
    "name": "Shubman Gill",
    "team": "GT",
    "teamColor": "#1BA3E4",
    "teamBg": "rgba(27,163,228,0.1)",
    "role": "BAT",
    "score": 77,
    "metricLabel": "Runs",
    "metricValue": 330,
    "stats": [
      [
        "Matches",
        7
      ],
      [
        "Runs",
        330
      ],
      [
        "Average",
        47.14
      ],
      [
        "Strike Rate",
        148.64
      ]
    ],
    "details": "30 fours · 14 sixes · HS 86",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 85.0
      },
      {
        "m": "M2",
        "v": 64.0
      },
      {
        "m": "M3",
        "v": 2.0
      },
      {
        "m": "M4",
        "v": 104.0
      },
      {
        "m": "M5",
        "v": 10.0
      }
    ]
  },
  {
    "name": "Virat Kohli",
    "team": "RCB",
    "teamColor": "#EC1C24",
    "teamBg": "rgba(236,28,36,0.1)",
    "role": "BAT",
    "score": 77,
    "metricLabel": "Runs",
    "metricValue": 351,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        351
      ],
      [
        "Average",
        58.5
      ],
      [
        "Strike Rate",
        162.5
      ]
    ],
    "details": "37 fours · 14 sixes · HS 81",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 105.0
      },
      {
        "m": "M2",
        "v": 58.0
      },
      {
        "m": "M3",
        "v": 15.0
      },
      {
        "m": "M4",
        "v": 43.0
      },
      {
        "m": "M5",
        "v": 75.0
      }
    ]
  },
  {
    "name": "Sai Sudarshan",
    "team": "GT",
    "teamColor": "#1BA3E4",
    "teamBg": "rgba(27,163,228,0.1)",
    "role": "BAT",
    "score": 76,
    "metricLabel": "Runs",
    "metricValue": 322,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        322
      ],
      [
        "Average",
        40.25
      ],
      [
        "Strike Rate",
        163.45
      ]
    ],
    "details": "32 fours · 17 sixes · HS 100",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 0.0
      },
      {
        "m": "M2",
        "v": 0.0
      },
      {
        "m": "M3",
        "v": 0.0
      },
      {
        "m": "M4",
        "v": 0.0
      },
      {
        "m": "M5",
        "v": 0.0
      }
    ]
  },
  {
    "name": "Heinrich Klaasen",
    "team": "SRH",
    "teamColor": "#F7A721",
    "teamBg": "rgba(247,167,33,0.1)",
    "role": "BAT",
    "score": 74,
    "metricLabel": "Runs",
    "metricValue": 349,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        349
      ],
      [
        "Average",
        49.85
      ],
      [
        "Strike Rate",
        149.78
      ]
    ],
    "details": "25 fours · 14 sixes · HS 62",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 69.0
      },
      {
        "m": "M2",
        "v": 14.0
      },
      {
        "m": "M3",
        "v": 47.0
      },
      {
        "m": "M4",
        "v": 51.0
      },
      {
        "m": "M5",
        "v": 18.0
      }
    ]
  },
  {
    "name": "Devdutt Padikkal",
    "team": "RCB",
    "teamColor": "#EC1C24",
    "teamBg": "rgba(236,28,36,0.1)",
    "role": "BAT",
    "score": 72,
    "metricLabel": "Runs",
    "metricValue": 242,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        242
      ],
      [
        "Average",
        40.33
      ],
      [
        "Strike Rate",
        192.06
      ]
    ],
    "details": "22 fours · 16 sixes · HS 61",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 39.0
      },
      {
        "m": "M2",
        "v": 45.0
      },
      {
        "m": "M3",
        "v": 21.0
      },
      {
        "m": "M4",
        "v": 30.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Shreyas Iyer",
    "team": "PBKS",
    "teamColor": "#ED1B24",
    "teamBg": "rgba(237,27,36,0.1)",
    "role": "BAT",
    "score": 71,
    "metricLabel": "Runs",
    "metricValue": 279,
    "stats": [
      [
        "Matches",
        7
      ],
      [
        "Runs",
        279
      ],
      [
        "Average",
        69.75
      ],
      [
        "Strike Rate",
        186.0
      ]
    ],
    "details": "17 fours · 21 sixes · HS 71",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 5.0
      },
      {
        "m": "M2",
        "v": 59.0
      },
      {
        "m": "M3",
        "v": 4.0
      },
      {
        "m": "M4",
        "v": 1.0
      },
      {
        "m": "M5",
        "v": 101.0
      }
    ]
  },
  {
    "name": "Jos Buttler",
    "team": "GT",
    "teamColor": "#1BA3E4",
    "teamBg": "rgba(27,163,228,0.1)",
    "role": "BAT",
    "score": 70,
    "metricLabel": "Runs",
    "metricValue": 270,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        270
      ],
      [
        "Average",
        38.57
      ],
      [
        "Strike Rate",
        151.68
      ]
    ],
    "details": "31 fours · 11 sixes · HS 60",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 57.0
      },
      {
        "m": "M2",
        "v": 57.0
      },
      {
        "m": "M3",
        "v": 29.0
      },
      {
        "m": "M4",
        "v": 9.0
      },
      {
        "m": "M5",
        "v": 19.0
      }
    ]
  },
  {
    "name": "Yashasvi Jaiswal",
    "team": "RR",
    "teamColor": "#FF4FA3",
    "teamBg": "rgba(255,79,163,0.1)",
    "role": "BAT",
    "score": 70,
    "metricLabel": "Runs",
    "metricValue": 255,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Runs",
        255
      ],
      [
        "Average",
        42.5
      ],
      [
        "Strike Rate",
        153.61
      ]
    ],
    "details": "29 fours · 12 sixes · HS 77",
    "timelineLabel": "Runs",
    "form": [
      {
        "m": "M1",
        "v": 12.0
      },
      {
        "m": "M2",
        "v": 43.0
      },
      {
        "m": "M3",
        "v": 27.0
      },
      {
        "m": "M4",
        "v": 29.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Bhuvneshwar Kumar",
    "team": "RCB",
    "teamColor": "#EC1C24",
    "teamBg": "rgba(236,28,36,0.1)",
    "role": "BOWL",
    "score": 99,
    "metricLabel": "Wickets",
    "metricValue": 28,
    "stats": [
      [
        "Matches",
        16
      ],
      [
        "Wickets",
        28
      ],
      [
        "Economy",
        7.94
      ],
      [
        "Average",
        17.24
      ]
    ],
    "details": "378 legal balls · 500 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 2.0
      },
      {
        "m": "M2",
        "v": 2.0
      },
      {
        "m": "M3",
        "v": 0.0
      },
      {
        "m": "M4",
        "v": 2.0
      },
      {
        "m": "M5",
        "v": 2.0
      }
    ]
  },
  {
    "name": "Jofra Archer",
    "team": "RR",
    "teamColor": "#FF4FA3",
    "teamBg": "rgba(255,79,163,0.1)",
    "role": "BOWL",
    "score": 99,
    "metricLabel": "Wickets",
    "metricValue": 25,
    "stats": [
      [
        "Matches",
        16
      ],
      [
        "Wickets",
        25
      ],
      [
        "Economy",
        9.1
      ],
      [
        "Average",
        18.83
      ]
    ],
    "details": "360 legal balls · 546 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 2.0
      },
      {
        "m": "M2",
        "v": 3.0
      },
      {
        "m": "M3",
        "v": 3.0
      },
      {
        "m": "M4",
        "v": 3.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Kagiso Rabada",
    "team": "GT",
    "teamColor": "#1BA3E4",
    "teamBg": "rgba(27,163,228,0.1)",
    "role": "BOWL",
    "score": 99,
    "metricLabel": "Wickets",
    "metricValue": 29,
    "stats": [
      [
        "Matches",
        17
      ],
      [
        "Wickets",
        29
      ],
      [
        "Economy",
        9.66
      ],
      [
        "Average",
        21.55
      ]
    ],
    "details": "388 legal balls · 625 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 0.0
      },
      {
        "m": "M2",
        "v": 3.0
      },
      {
        "m": "M3",
        "v": 2.0
      },
      {
        "m": "M4",
        "v": 2.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Anshul Kamboj",
    "team": "CSK",
    "teamColor": "#F9C000",
    "teamBg": "rgba(249,192,0,0.1)",
    "role": "BOWL",
    "score": 87,
    "metricLabel": "Wickets",
    "metricValue": 24,
    "stats": [
      [
        "Matches",
        14
      ],
      [
        "Wickets",
        24
      ],
      [
        "Economy",
        10.47
      ],
      [
        "Average",
        21.96
      ]
    ],
    "details": "302 legal balls · 527 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 1.0
      },
      {
        "m": "M2",
        "v": 3.0
      },
      {
        "m": "M3",
        "v": 0.0
      },
      {
        "m": "M4",
        "v": 1.0
      },
      {
        "m": "M5",
        "v": 2.0
      }
    ]
  },
  {
    "name": "Eshan Malinga",
    "team": "SRH",
    "teamColor": "#F7A721",
    "teamBg": "rgba(247,167,33,0.1)",
    "role": "BOWL",
    "score": 80,
    "metricLabel": "Wickets",
    "metricValue": 21,
    "stats": [
      [
        "Matches",
        15
      ],
      [
        "Wickets",
        21
      ],
      [
        "Economy",
        9.29
      ],
      [
        "Average",
        24.05
      ]
    ],
    "details": "326 legal balls · 505 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 1.0
      },
      {
        "m": "M2",
        "v": 0.0
      },
      {
        "m": "M3",
        "v": 1.0
      },
      {
        "m": "M4",
        "v": 2.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Rashid Khan",
    "team": "GT",
    "teamColor": "#1BA3E4",
    "teamBg": "rgba(27,163,228,0.1)",
    "role": "BOWL",
    "score": 80,
    "metricLabel": "Wickets",
    "metricValue": 21,
    "stats": [
      [
        "Matches",
        17
      ],
      [
        "Wickets",
        21
      ],
      [
        "Economy",
        8.94
      ],
      [
        "Average",
        24.19
      ]
    ],
    "details": "341 legal balls · 508 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 0.0
      },
      {
        "m": "M2",
        "v": 3.0
      },
      {
        "m": "M3",
        "v": 0.0
      },
      {
        "m": "M4",
        "v": 0.0
      },
      {
        "m": "M5",
        "v": 2.0
      }
    ]
  },
  {
    "name": "Mohammed Siraj",
    "team": "GT",
    "teamColor": "#1BA3E4",
    "teamBg": "rgba(27,163,228,0.1)",
    "role": "BOWL",
    "score": 77,
    "metricLabel": "Wickets",
    "metricValue": 20,
    "stats": [
      [
        "Matches",
        17
      ],
      [
        "Wickets",
        20
      ],
      [
        "Economy",
        8.97
      ],
      [
        "Average",
        27.8
      ]
    ],
    "details": "372 legal balls · 556 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 1.0
      },
      {
        "m": "M2",
        "v": 3.0
      },
      {
        "m": "M3",
        "v": 0.0
      },
      {
        "m": "M4",
        "v": 1.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Kartik Tyagi",
    "team": "KKR",
    "teamColor": "#8B5CF6",
    "teamBg": "rgba(139,92,246,0.1)",
    "role": "BOWL",
    "score": 75,
    "metricLabel": "Wickets",
    "metricValue": 19,
    "stats": [
      [
        "Matches",
        13
      ],
      [
        "Wickets",
        19
      ],
      [
        "Economy",
        9.76
      ],
      [
        "Average",
        26.21
      ]
    ],
    "details": "306 legal balls · 498 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 3.0
      },
      {
        "m": "M2",
        "v": 3.0
      },
      {
        "m": "M3",
        "v": 0.0
      },
      {
        "m": "M4",
        "v": 2.0
      },
      {
        "m": "M5",
        "v": 0.0
      }
    ]
  },
  {
    "name": "Prince Yadav",
    "team": "LSG",
    "teamColor": "#00B2E3",
    "teamBg": "rgba(0,178,227,0.1)",
    "role": "BOWL",
    "score": 75,
    "metricLabel": "Wickets",
    "metricValue": 19,
    "stats": [
      [
        "Matches",
        14
      ],
      [
        "Wickets",
        19
      ],
      [
        "Economy",
        8.87
      ],
      [
        "Average",
        24.26
      ]
    ],
    "details": "312 legal balls · 461 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 3.0
      },
      {
        "m": "M2",
        "v": 0.0
      },
      {
        "m": "M3",
        "v": 0.0
      },
      {
        "m": "M4",
        "v": 1.0
      },
      {
        "m": "M5",
        "v": 0.0
      }
    ]
  },
  {
    "name": "Rasikh Salam Dar",
    "team": "RCB",
    "teamColor": "#EC1C24",
    "teamBg": "rgba(236,28,36,0.1)",
    "role": "BOWL",
    "score": 75,
    "metricLabel": "Wickets",
    "metricValue": 19,
    "stats": [
      [
        "Matches",
        12
      ],
      [
        "Wickets",
        19
      ],
      [
        "Economy",
        9.43
      ],
      [
        "Average",
        21.26
      ]
    ],
    "details": "257 legal balls · 404 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 1.0
      },
      {
        "m": "M2",
        "v": 3.0
      },
      {
        "m": "M3",
        "v": 2.0
      },
      {
        "m": "M4",
        "v": 2.0
      },
      {
        "m": "M5",
        "v": 3.0
      }
    ]
  },
  {
    "name": "Prasidh Krishna",
    "team": "GT",
    "teamColor": "#1BA3E4",
    "teamBg": "rgba(27,163,228,0.1)",
    "role": "BOWL",
    "score": 72,
    "metricLabel": "Wickets",
    "metricValue": 18,
    "stats": [
      [
        "Matches",
        12
      ],
      [
        "Wickets",
        18
      ],
      [
        "Economy",
        10.44
      ],
      [
        "Average",
        22.61
      ]
    ],
    "details": "234 legal balls · 407 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 2.0
      },
      {
        "m": "M2",
        "v": 0.0
      },
      {
        "m": "M3",
        "v": 1.0
      },
      {
        "m": "M4",
        "v": 1.0
      },
      {
        "m": "M5",
        "v": 0.0
      }
    ]
  },
  {
    "name": "Sunil Narine",
    "team": "KKR",
    "teamColor": "#8B5CF6",
    "teamBg": "rgba(139,92,246,0.1)",
    "role": "BOWL",
    "score": 70,
    "metricLabel": "Wickets",
    "metricValue": 17,
    "stats": [
      [
        "Matches",
        13
      ],
      [
        "Wickets",
        17
      ],
      [
        "Economy",
        6.6
      ],
      [
        "Average",
        20.0
      ]
    ],
    "details": "309 legal balls · 340 runs conceded",
    "timelineLabel": "Wickets",
    "form": [
      {
        "m": "M1",
        "v": 1.0
      },
      {
        "m": "M2",
        "v": 1.0
      },
      {
        "m": "M3",
        "v": 2.0
      },
      {
        "m": "M4",
        "v": 1.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Devdutt Padikkal",
    "team": "RCB",
    "teamColor": "#EC1C24",
    "teamBg": "rgba(236,28,36,0.1)",
    "role": "FIELD",
    "score": 99,
    "metricLabel": "Catches",
    "metricValue": 9,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Catches",
        9
      ],
      [
        "Catches/Match",
        1.125
      ],
      [
        "Rank",
        2
      ]
    ],
    "details": "2026 fielding performance from the supplied fielding dataset",
    "timelineLabel": "Catches",
    "form": [
      {
        "m": "M1",
        "v": 1.0
      },
      {
        "m": "M2",
        "v": 2.0
      },
      {
        "m": "M3",
        "v": 1.0
      },
      {
        "m": "M4",
        "v": 1.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Rinku Singh",
    "team": "KKR",
    "teamColor": "#8B5CF6",
    "teamBg": "rgba(139,92,246,0.1)",
    "role": "FIELD",
    "score": 99,
    "metricLabel": "Catches",
    "metricValue": 9,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Catches",
        9
      ],
      [
        "Catches/Match",
        1.285
      ],
      [
        "Rank",
        1
      ]
    ],
    "details": "2026 fielding performance from the supplied fielding dataset",
    "timelineLabel": "Catches",
    "form": [
      {
        "m": "M1",
        "v": 1.0
      },
      {
        "m": "M2",
        "v": 2.0
      },
      {
        "m": "M3",
        "v": 1.0
      },
      {
        "m": "M4",
        "v": 1.0
      },
      {
        "m": "M5",
        "v": 5.0
      }
    ]
  },
  {
    "name": "Dewald Brevis",
    "team": "CSK",
    "teamColor": "#F9C000",
    "teamBg": "rgba(249,192,0,0.1)",
    "role": "FIELD",
    "score": 89,
    "metricLabel": "Catches",
    "metricValue": 8,
    "stats": [
      [
        "Matches",
        5
      ],
      [
        "Catches",
        8
      ],
      [
        "Catches/Match",
        1.6
      ],
      [
        "Rank",
        3
      ]
    ],
    "details": "2026 fielding performance from the supplied fielding dataset",
    "timelineLabel": "Catches",
    "form": [
      {
        "m": "M1",
        "v": 2.0
      },
      {
        "m": "M2",
        "v": 1.0
      },
      {
        "m": "M3",
        "v": 1.0
      },
      {
        "m": "M4",
        "v": 2.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Glenn Phillips",
    "team": "GT",
    "teamColor": "#1BA3E4",
    "teamBg": "rgba(27,163,228,0.1)",
    "role": "FIELD",
    "score": 89,
    "metricLabel": "Catches",
    "metricValue": 8,
    "stats": [
      [
        "Matches",
        6
      ],
      [
        "Catches",
        8
      ],
      [
        "Catches/Match",
        1.333
      ],
      [
        "Rank",
        4
      ]
    ],
    "details": "2026 fielding performance from the supplied fielding dataset",
    "timelineLabel": "Catches",
    "form": [
      {
        "m": "M1",
        "v": 2.0
      },
      {
        "m": "M2",
        "v": 1.0
      },
      {
        "m": "M3",
        "v": 2.0
      },
      {
        "m": "M4",
        "v": 2.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Heinrich Klaasen",
    "team": "SRH",
    "teamColor": "#F7A721",
    "teamBg": "rgba(247,167,33,0.1)",
    "role": "FIELD",
    "score": 80,
    "metricLabel": "Catches",
    "metricValue": 7,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Catches",
        7
      ],
      [
        "Catches/Match",
        0.875
      ],
      [
        "Rank",
        7
      ]
    ],
    "details": "2026 fielding performance from the supplied fielding dataset",
    "timelineLabel": "Catches",
    "form": [
      {
        "m": "M1",
        "v": 2.0
      },
      {
        "m": "M2",
        "v": 2.0
      },
      {
        "m": "M3",
        "v": 1.0
      },
      {
        "m": "M4",
        "v": 2.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Nitish Kumar Reddy",
    "team": "SRH",
    "teamColor": "#F7A721",
    "teamBg": "rgba(247,167,33,0.1)",
    "role": "FIELD",
    "score": 80,
    "metricLabel": "Catches",
    "metricValue": 7,
    "stats": [
      [
        "Matches",
        8
      ],
      [
        "Catches",
        7
      ],
      [
        "Catches/Match",
        0.875
      ],
      [
        "Rank",
        8
      ]
    ],
    "details": "2026 fielding performance from the supplied fielding dataset",
    "timelineLabel": "Catches",
    "form": [
      {
        "m": "M1",
        "v": 0.0
      },
      {
        "m": "M2",
        "v": 0.0
      },
      {
        "m": "M3",
        "v": 0.0
      },
      {
        "m": "M4",
        "v": 0.0
      },
      {
        "m": "M5",
        "v": 0.0
      }
    ]
  },
  {
    "name": "Tilak Varma",
    "team": "MI",
    "teamColor": "#4B9CD3",
    "teamBg": "rgba(75,156,211,0.1)",
    "role": "FIELD",
    "score": 80,
    "metricLabel": "Catches",
    "metricValue": 7,
    "stats": [
      [
        "Matches",
        7
      ],
      [
        "Catches",
        7
      ],
      [
        "Catches/Match",
        1.0
      ],
      [
        "Rank",
        6
      ]
    ],
    "details": "2026 fielding performance from the supplied fielding dataset",
    "timelineLabel": "Catches",
    "form": [
      {
        "m": "M1",
        "v": 2.0
      },
      {
        "m": "M2",
        "v": 1.0
      },
      {
        "m": "M3",
        "v": 1.0
      },
      {
        "m": "M4",
        "v": 3.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Xavier Bartlett",
    "team": "PBKS",
    "teamColor": "#ED1B24",
    "teamBg": "rgba(237,27,36,0.1)",
    "role": "FIELD",
    "score": 80,
    "metricLabel": "Catches",
    "metricValue": 7,
    "stats": [
      [
        "Matches",
        7
      ],
      [
        "Catches",
        7
      ],
      [
        "Catches/Match",
        1.0
      ],
      [
        "Rank",
        5
      ]
    ],
    "details": "2026 fielding performance from the supplied fielding dataset",
    "timelineLabel": "Catches",
    "form": [
      {
        "m": "M1",
        "v": 1.0
      },
      {
        "m": "M2",
        "v": 2.0
      },
      {
        "m": "M3",
        "v": 2.0
      },
      {
        "m": "M4",
        "v": 2.0
      },
      {
        "m": "M5",
        "v": 2.0
      }
    ]
  },
  {
    "name": "Phil Salt",
    "team": "RCB",
    "teamColor": "#EC1C24",
    "teamBg": "rgba(236,28,36,0.1)",
    "role": "FIELD",
    "score": 70,
    "metricLabel": "Catches",
    "metricValue": 6,
    "stats": [
      [
        "Matches",
        6
      ],
      [
        "Catches",
        6
      ],
      [
        "Catches/Match",
        1.0
      ],
      [
        "Rank",
        9
      ]
    ],
    "details": "2026 fielding performance from the supplied fielding dataset",
    "timelineLabel": "Catches",
    "form": [
      {
        "m": "M1",
        "v": 0.0
      },
      {
        "m": "M2",
        "v": 3.0
      },
      {
        "m": "M3",
        "v": 1.0
      },
      {
        "m": "M4",
        "v": 1.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  },
  {
    "name": "Shubman Gill",
    "team": "GT",
    "teamColor": "#1BA3E4",
    "teamBg": "rgba(27,163,228,0.1)",
    "role": "FIELD",
    "score": 70,
    "metricLabel": "Catches",
    "metricValue": 6,
    "stats": [
      [
        "Matches",
        7
      ],
      [
        "Catches",
        6
      ],
      [
        "Catches/Match",
        0.857
      ],
      [
        "Rank",
        10
      ]
    ],
    "details": "2026 fielding performance from the supplied fielding dataset",
    "timelineLabel": "Catches",
    "form": [
      {
        "m": "M1",
        "v": 1.0
      },
      {
        "m": "M2",
        "v": 1.0
      },
      {
        "m": "M3",
        "v": 1.0
      },
      {
        "m": "M4",
        "v": 1.0
      },
      {
        "m": "M5",
        "v": 1.0
      }
    ]
  }
];

const roleColor = (role: string) => {
  const colors: Record<string, string> = {
    BAT: "#3b82f6",
    BOWL: "#10b981",
    FIELD: "#8b5cf6",
  };

  return colors[role] ?? "#6b7db3";
};

export function Players() {
  const [roleFilter, setRoleFilter] = useState("All");
  const filtered = useMemo(
    () => roleFilter === "All" ? PLAYERS : PLAYERS.filter((player) => player.role === roleFilter),
    [roleFilter],
  );
  const [selected, setSelected] = useState(PLAYERS[0].name);

  useEffect(() => {
    if (!filtered.some((player) => player.name === selected)) {
      setSelected(filtered[0]?.name ?? PLAYERS[0].name);
    }
  }, [filtered, selected]);

  const player = PLAYERS.find((item) => item.name === selected) ?? filtered[0] ?? PLAYERS[0];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Player <span className="text-gradient-blue">Analytics</span>
          </h1>
          <p className="text-[#6b7db3] mt-3">2026 player statistics calculated from the supplied batting, delivery, and fielding CSV datasets.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              <Filter size={13} className="text-[#6b7db3]" />
              {ROLES.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    roleFilter === role
                      ? "text-white"
                      : "glass border border-white/[0.07] text-[#6b7db3] hover:text-white"
                  }`}
                  style={roleFilter === role ? {
                    background: `${roleColor(role)}22`,
                    color: roleColor(role),
                    border: `1px solid ${roleColor(role)}40`,
                  } : {}}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[650px] overflow-y-auto scrollbar-hide pr-1">
              {filtered.map((item) => (
                <motion.button
                  type="button"
                  key={`${item.role}-${item.name}`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(item.name)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    selected === item.name
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "glass border-white/[0.06] hover:border-white/[0.12]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0" style={{
                    background: item.teamBg,
                    color: item.teamColor,
                    fontFamily: "'Rajdhani', sans-serif",
                  }}>
                    {item.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: item.teamBg, color: item.teamColor }}>{item.team}</span>
                      <span className="text-[10px] font-semibold" style={{ color: roleColor(item.role) }}>{item.role}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-blue-400 font-mono">{item.metricValue}</p>
                    <span className="text-[9px] text-[#6b7db3]">{item.metricLabel}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            key={`${player.role}-${player.name}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass rounded-2xl border border-white/[0.07] p-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0" style={{
                  background: player.teamBg,
                  color: player.teamColor,
                  fontFamily: "'Rajdhani', sans-serif",
                  boxShadow: `0 0 30px ${player.teamColor}22`,
                }}>
                  {player.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{player.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-xs font-mono px-2 py-1 rounded-lg" style={{ background: player.teamBg, color: player.teamColor }}>{player.team}</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: `${roleColor(player.role)}18`, color: roleColor(player.role) }}>{player.role}</span>
                    <span className="text-xs text-[#6b7db3] font-mono">IPL 2026</span>
                  </div>
                  <p className="text-xs text-[#6b7db3] mt-2 font-mono">{player.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-bold text-blue-400 font-mono">{player.score}</p>
                  <p className="text-[10px] text-[#6b7db3] uppercase tracking-wider mt-0.5">Dataset Score</p>
                </div>
              </div>

              <div className="mt-5 relative">
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${player.score}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${player.teamColor}66, ${player.teamColor})` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {player.stats.map(([label, value]) => (
                <div key={label} className="glass rounded-xl p-4 text-center border border-white/[0.06]">
                  <p className="text-xl font-bold text-white font-mono" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    {typeof value === "number" && value > 999 ? value.toLocaleString() : value}
                  </p>
                  <p className="text-[9px] text-[#6b7db3] uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl border border-white/[0.07] p-6">
              <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.05rem" }}>
                Recent Five Matches · {player.timelineLabel}
              </p>
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={player.form} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                  <defs>
                    <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={player.teamColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={player.teamColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="m" tick={{ fill: "#6b7db3", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} domain={[0, "auto"]} tick={{ fill: "#6b7db3", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0b1120", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontFamily: "JetBrains Mono", fontSize: 11 }} />
                  <Area type="monotone" dataKey="v" name={player.timelineLabel} stroke={player.teamColor} fill="url(#pfGrad)" strokeWidth={2} dot={{ fill: player.teamColor, r: 3, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}