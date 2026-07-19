import {
  useEffect,
  useState,
  type ElementType,
} from "react";

import {
  motion,
  AnimatePresence,
} from "motion/react";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Zap,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  ChevronDown,
  RotateCcw,
  TrendingUp,
  Trophy,
  Activity,
  MapPin,
  Target,
  Sparkles,
} from "lucide-react";

import {
  getTeams,
  predictMatch,
} from "../../services/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

interface Team {
  id: string;
  name: string;
  color: string;
  bg: string;
}

interface SwingPoint {
  over: string;
  t1: number;
  t2: number;
}

interface HeadToHeadAnalysis {
  team1Wins: number;
  team2Wins: number;
  totalMatches: number;
  team1Score: number;
  team2Score: number;
}

interface RecentFormAnalysis {
  team1Score: number;
  team2Score: number;
}

interface VenueAnalysis {
  team1Score: number;
  team2Score: number;
}

interface PredictionResult {
  predictedWinner: string;

  prob1: number;
  prob2: number;
  confidence: number;

  batting: [number, number];
  bowling: [number, number];
  fielding: [number, number];
  form: [number, number];
  homeAdv: [number, number];
  tossAdv: [number, number];
  weatherImpact: [number, number];

  swing: SwingPoint[];

  weatherSummary: string;

  headToHeadAnalysis: HeadToHeadAnalysis;

  recentFormAnalysis: RecentFormAnalysis;

  venueAnalysis: VenueAnalysis;

  whyThisTeamWillWin: string[];

  liveInsights: string[];
}

interface TeamsApiResponse {
  success?: boolean;
  totalTeams?: number;
  teams?: string[];
  data?: string[];
}

interface MatchOption {
  _id?: string;
  id?: string;

  team1?: string;
  team2?: string;

  venue?: string;
  winner?: string;
  tossWinner?: string;

  date?: string;

  resultType?: string;
  status?: string;
}

interface WeatherData {
  venue: string;
  city: string;

  latitude: number;
  longitude: number;

  temperature: number;
  humidity: number;
  windSpeed: number;

  rainProbability: number;
  precipitation: number;
  rain: number;

  weatherCode: number;
  condition: string;
  observedAt: string;
}

interface WeatherApiResponse {
  success?: boolean;
  message?: string;
  weather?: WeatherData;
}

interface PredictionApiResponse {
  success?: boolean;

  predictedWinner?: string;

  team1Probability?:
    | number
    | string;

  team2Probability?:
    | number
    | string;

  prob1?: number | string;
  prob2?: number | string;

  confidence?: number | string;

  batting?: [number, number];
  bowling?: [number, number];
  fielding?: [number, number];

  form?: [number, number];
  homeAdv?: [number, number];
  tossAdv?: [number, number];

  weatherImpact?: [
    number,
    number,
  ];

  weatherSummary?: string;

  swing?: SwingPoint[];

  weather?: WeatherData | null;

  headToHeadAnalysis?: {
    team1Wins?: number | string;
    team2Wins?: number | string;
    totalMatches?: number | string;
    team1Score?: number | string;
    team2Score?: number | string;
  };

  recentFormAnalysis?: {
    team1Score?: number | string;
    team2Score?: number | string;
  };

  venueAnalysis?: {
    team1Score?: number | string;
    team2Score?: number | string;
  };

  whyThisTeamWillWin?: string[];

  liveInsights?: string[];

  predictionResult?: {
    resultStatus?:
      | "pending"
      | "completed";

    actualWinner?: string;

    isCorrect?:
      | boolean
      | null;
  };
}

const TEAM_STYLE_MAP: Record<
  string,
  {
    id: string;
    color: string;
    bg: string;
  }
> = {
  "Chennai Super Kings": {
    id: "CSK",
    color: "#F9C000",
    bg: "rgba(249,192,0,0.12)",
  },

  "Mumbai Indians": {
    id: "MI",
    color: "#004C97",
    bg: "rgba(0,76,151,0.18)",
  },

  "Royal Challengers Bangalore": {
    id: "RCB",
    color: "#EC1C24",
    bg: "rgba(236,28,36,0.15)",
  },

  "Royal Challengers Bengaluru": {
    id: "RCB",
    color: "#EC1C24",
    bg: "rgba(236,28,36,0.15)",
  },

  "Kolkata Knight Riders": {
    id: "KKR",
    color: "#3A225D",
    bg: "rgba(139,92,246,0.18)",
  },

  "Sunrisers Hyderabad": {
    id: "SRH",
    color: "#F7A721",
    bg: "rgba(247,167,33,0.15)",
  },

  "Delhi Capitals": {
    id: "DC",
    color: "#0078BC",
    bg: "rgba(0,120,188,0.15)",
  },

  "Punjab Kings": {
    id: "PBKS",
    color: "#ED1B24",
    bg: "rgba(237,27,36,0.15)",
  },

  "Rajasthan Royals": {
    id: "RR",
    color: "#254AA5",
    bg: "rgba(37,74,165,0.18)",
  },

  "Gujarat Titans": {
    id: "GT",
    color: "#1BA3E4",
    bg: "rgba(27,163,228,0.15)",
  },

  "Lucknow Super Giants": {
    id: "LSG",
    color: "#00B2E3",
    bg: "rgba(0,178,227,0.15)",
  },
};

const VENUES = [
  "Chepauk, Chennai",
  "Wankhede, Mumbai",
  "Chinnaswamy, Bengaluru",
  "Eden Gardens, Kolkata",
  "Rajiv Gandhi, Hyderabad",
  "Arun Jaitley, Delhi",
  "Punjab CA, Mohali",
  "Sawai Mansingh, Jaipur",
  "Narendra Modi, Ahmedabad",
  "BRSABV Ekana, Lucknow",
];

const DEFAULT_RESULT: PredictionResult = {
  predictedWinner: "",

  prob1: 0,
  prob2: 0,
  confidence: 0,

  batting: [0, 0],
  bowling: [0, 0],
  fielding: [0, 0],

  form: [0, 0],
  homeAdv: [0, 0],
  tossAdv: [0, 0],

  weatherImpact: [0, 0],

  weatherSummary: "",

  swing: [],

  headToHeadAnalysis: {
    team1Wins: 0,
    team2Wins: 0,
    totalMatches: 0,
    team1Score: 50,
    team2Score: 50,
  },

  recentFormAnalysis: {
    team1Score: 50,
    team2Score: 50,
  },

  venueAnalysis: {
    team1Score: 50,
    team2Score: 50,
  },

  whyThisTeamWillWin: [],

  liveInsights: [],
};

function normalizeTeamName(
  teamName: string,
): string {
  const trimmedTeamName =
    teamName.trim();

  if (
    trimmedTeamName ===
    "Royal Challengers Bangalore"
  ) {
    return "Royal Challengers Bengaluru";
  }

  return trimmedTeamName;
}

function getValidNumber(
  value: unknown,
  fallback = 0,
): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string"
  ) {
    const parsedValue =
      Number.parseFloat(value);

    if (
      Number.isFinite(parsedValue)
    ) {
      return parsedValue;
    }
  }

  return fallback;
}

function clampNumber(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}

function getValidPair(
  value: unknown,
  fallback: [number, number] = [
    0,
    0,
  ],
): [number, number] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return [
    getValidNumber(
      value[0],
      fallback[0],
    ),

    getValidNumber(
      value[1],
      fallback[1],
    ),
  ];
}

function getValidStringArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ): item is string =>
        typeof item ===
          "string" &&
        item.trim().length > 0,
    )
    .map((item) =>
      item.trim(),
    );
}

function normalizePrediction(
  prediction:
    | PredictionApiResponse
    | null
    | undefined,
): PredictionResult {
  const prob1 = clampNumber(
    getValidNumber(
      prediction?.prob1 ??
        prediction?.team1Probability,
      50,
    ),
    0,
    100,
  );

  const prob2 = clampNumber(
    getValidNumber(
      prediction?.prob2 ??
        prediction?.team2Probability,
      100 - prob1,
    ),
    0,
    100,
  );

  const confidence =
    clampNumber(
      getValidNumber(
        prediction?.confidence,
        Math.max(
          prob1,
          prob2,
        ),
      ),
      0,
      100,
    );

  const battingFallback: [
    number,
    number,
  ] = [
    Math.round(
      55 + prob1 * 0.35,
    ),

    Math.round(
      55 + prob2 * 0.35,
    ),
  ];

  const bowlingFallback: [
    number,
    number,
  ] = [
    Math.round(
      52 + prob1 * 0.38,
    ),

    Math.round(
      52 + prob2 * 0.38,
    ),
  ];

  const fieldingFallback: [
    number,
    number,
  ] = [
    Math.round(
      58 + prob1 * 0.25,
    ),

    Math.round(
      58 + prob2 * 0.25,
    ),
  ];

  const formFallback: [
    number,
    number,
  ] = [
    Math.round(
      45 + prob1 * 0.5,
    ),

    Math.round(
      45 + prob2 * 0.5,
    ),
  ];

  const homeAdvFallback: [
    number,
    number,
  ] = [
    Math.round(
      50 + prob1 * 0.35,
    ),

    Math.round(
      50 + prob2 * 0.35,
    ),
  ];

  const tossAdvFallback: [
    number,
    number,
  ] = [
    Math.round(
      48 + prob1 * 0.28,
    ),

    Math.round(
      48 + prob2 * 0.28,
    ),
  ];

  const weatherImpactFallback: [
    number,
    number,
  ] = [
    Math.round(
      50 + prob1 * 0.3,
    ),

    Math.round(
      50 + prob2 * 0.3,
    ),
  ];

  const swing: SwingPoint[] =
    Array.isArray(
      prediction?.swing,
    ) &&
    prediction.swing.length > 0
      ? prediction.swing.map(
          (point) => ({
            over:
              typeof point.over ===
              "string"
                ? point.over
                : "",

            t1: getValidNumber(
              point.t1,
              50,
            ),

            t2: getValidNumber(
              point.t2,
              50,
            ),
          }),
        )
      : [
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
                (prob1 - 50) *
                  0.25
              ).toFixed(1),
            ),
            t2: Number(
              (
                50 +
                (prob2 - 50) *
                  0.25
              ).toFixed(1),
            ),
          },

          {
            over: "10",
            t1: Number(
              (
                50 +
                (prob1 - 50) *
                  0.5
              ).toFixed(1),
            ),
            t2: Number(
              (
                50 +
                (prob2 - 50) *
                  0.5
              ).toFixed(1),
            ),
          },

          {
            over: "15",
            t1: Number(
              (
                50 +
                (prob1 - 50) *
                  0.75
              ).toFixed(1),
            ),
            t2: Number(
              (
                50 +
                (prob2 - 50) *
                  0.75
              ).toFixed(1),
            ),
          },

          {
            over: "20",
            t1: prob1,
            t2: prob2,
          },
        ];

  return {
    predictedWinner:
      typeof prediction
        ?.predictedWinner ===
        "string"
        ? normalizeTeamName(
            prediction
              .predictedWinner,
          )
        : "",

    prob1: Number(
      prob1.toFixed(1),
    ),

    prob2: Number(
      prob2.toFixed(1),
    ),

    confidence: Number(
      confidence.toFixed(1),
    ),

    batting: getValidPair(
      prediction?.batting,
      battingFallback,
    ),

    bowling: getValidPair(
      prediction?.bowling,
      bowlingFallback,
    ),

    fielding: getValidPair(
      prediction?.fielding,
      fieldingFallback,
    ),

    form: getValidPair(
      prediction?.form,
      formFallback,
    ),

    homeAdv: getValidPair(
      prediction?.homeAdv,
      homeAdvFallback,
    ),

    tossAdv: getValidPair(
      prediction?.tossAdv,
      tossAdvFallback,
    ),

    weatherImpact:
      getValidPair(
        prediction?.weatherImpact,
        weatherImpactFallback,
      ),

    weatherSummary:
      typeof prediction
        ?.weatherSummary ===
        "string"
        ? prediction
            .weatherSummary
            .trim()
        : "",

    swing,

    headToHeadAnalysis: {
      team1Wins:
        getValidNumber(
          prediction
            ?.headToHeadAnalysis
            ?.team1Wins,
          0,
        ),

      team2Wins:
        getValidNumber(
          prediction
            ?.headToHeadAnalysis
            ?.team2Wins,
          0,
        ),

      totalMatches:
        getValidNumber(
          prediction
            ?.headToHeadAnalysis
            ?.totalMatches,
          0,
        ),

      team1Score:
        getValidNumber(
          prediction
            ?.headToHeadAnalysis
            ?.team1Score,
          50,
        ),

      team2Score:
        getValidNumber(
          prediction
            ?.headToHeadAnalysis
            ?.team2Score,
          50,
        ),
    },

    recentFormAnalysis: {
      team1Score:
        getValidNumber(
          prediction
            ?.recentFormAnalysis
            ?.team1Score,
          50,
        ),

      team2Score:
        getValidNumber(
          prediction
            ?.recentFormAnalysis
            ?.team2Score,
          50,
        ),
    },

    venueAnalysis: {
      team1Score:
        getValidNumber(
          prediction
            ?.venueAnalysis
            ?.team1Score,
          50,
        ),

      team2Score:
        getValidNumber(
          prediction
            ?.venueAnalysis
            ?.team2Score,
          50,
        ),
    },

    whyThisTeamWillWin:
      getValidStringArray(
        prediction
          ?.whyThisTeamWillWin,
      ),

    liveInsights:
      getValidStringArray(
        prediction
          ?.liveInsights,
      ),
  };
}

function extractMatches(
  value: unknown,
): MatchOption[] {
  if (Array.isArray(value)) {
    return value.filter(
      (
        item,
      ): item is MatchOption =>
        Boolean(item) &&
        typeof item ===
          "object",
    );
  }

  if (
    !value ||
    typeof value !== "object"
  ) {
    return [];
  }

  const objectValue =
    value as Record<
      string,
      unknown
    >;

  const possibleKeys = [
    "matches",
    "data",
    "results",
  ];

  for (
    const key of possibleKeys
  ) {
    const extractedMatches =
      extractMatches(
        objectValue[key],
      );

    if (
      extractedMatches.length > 0
    ) {
      return extractedMatches;
    }
  }

  return [];
}
function TeamDropdown({
  label,
  value,
  onChange,
  exclude,
  teams,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  exclude: string;
  teams: Team[];
}) {
  const [open, setOpen] =
    useState(false);

  const selected = teams.find(
    (team) =>
      team.name === value,
  );

  return (
    <div className="relative">
      <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
        {label}
      </label>

      <button
        type="button"
        onClick={() => {
          if (teams.length > 0) {
            setOpen(
              (currentOpen) =>
                !currentOpen,
            );
          }
        }}
        disabled={
          teams.length === 0
        }
        className="w-full flex items-center justify-between gap-3 glass rounded-xl px-4 py-3.5 border border-white/[0.08] hover:border-blue-500/30 transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          {selected ? (
            <>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                style={{
                  background:
                    selected.bg,
                  color:
                    selected.color,
                }}
              >
                {selected.id.slice(
                  0,
                  2,
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {selected.id}
                </p>

                <p className="text-[10px] text-[#6b7db3]">
                  {selected.name}
                </p>
              </div>
            </>
          ) : (
            <span className="text-sm text-[#6b7db3]">
              {teams.length === 0
                ? "Loading teams..."
                : "Select team..."}
            </span>
          )}
        </div>

        <ChevronDown
          size={16}
          className={`text-[#6b7db3] transition-transform ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 6,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 6,
              scale: 0.98,
            }}
            className="absolute z-[100] left-0 right-0 top-full mt-1 rounded-xl border border-white/[0.08] overflow-hidden max-h-72 overflow-y-auto"
            style={{
              background:
                "#0b1120",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            {teams
              .filter(
                (team) =>
                  team.name !==
                  exclude,
              )
              .map((team) => (
                <button
                  type="button"
                  key={team.name}
                  onClick={() => {
                    onChange(
                      team.name,
                    );

                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors text-left"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                    style={{
                      background:
                        team.bg,
                      color:
                        team.color,
                    }}
                  >
                    {team.id.slice(
                      0,
                      2,
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {team.id}
                    </p>

                    <p className="text-[10px] text-[#6b7db3]">
                      {team.name}
                    </p>
                  </div>
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WeatherCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-3 flex flex-col items-center gap-1.5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{
          background: `${color}18`,
        }}
      >
        <Icon
          size={16}
          style={{
            color,
          }}
        />
      </div>

      <p className="text-sm font-mono font-bold text-white">
        {value}
      </p>

      <p className="text-[9px] text-[#6b7db3] uppercase tracking-wider text-center">
        {label}
      </p>
    </div>
  );
}

export function Prediction() {
  const [teams, setTeams] =
    useState<Team[]>([]);

  const [
    completedMatches,
    setCompletedMatches,
  ] = useState<MatchOption[]>(
    [],
  );

  const [
    selectedMatchId,
    setSelectedMatchId,
  ] = useState("");

  const [team1, setTeam1] =
    useState("");

  const [team2, setTeam2] =
    useState("");

  const [toss, setToss] =
    useState("");

  const [venue, setVenue] =
    useState(VENUES[0]);

  const [
    predicted,
    setPredicted,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<PredictionResult>(
      DEFAULT_RESULT,
    );

  const [
    predictionAccuracy,
    setPredictionAccuracy,
  ] = useState<{
    resultStatus:
      | "pending"
      | "completed";
    actualWinner: string;
    isCorrect:
      | boolean
      | null;
  } | null>(null);

  const [weather, setWeather] =
    useState<WeatherData | null>(
      null,
    );

  const [
    weatherLoading,
    setWeatherLoading,
  ] = useState(false);

  const [
    weatherError,
    setWeatherError,
  ] = useState("");

  useEffect(() => {
    let active = true;

    const loadTeams =
      async () => {
        try {
          const fetchedTeams =
            await getTeams();

          if (!active) {
            return;
          }

          const response =
            fetchedTeams as unknown as
              | TeamsApiResponse
              | string[];

          const teamNames =
            Array.isArray(response)
              ? response
              : Array.isArray(
                    response?.teams,
                  )
                ? response.teams
                : Array.isArray(
                      response?.data,
                    )
                  ? response.data
                  : [];

          const validTeams: Team[] =
            teamNames
              .filter(
                (
                  teamName,
                ): teamName is string =>
                  typeof teamName ===
                    "string" &&
                  teamName.trim()
                    .length > 0,
              )
              .map((teamName) => {
                const canonicalName =
                  normalizeTeamName(
                    teamName,
                  );

                const style =
                  TEAM_STYLE_MAP[
                    canonicalName
                  ];

                const generatedId =
                  canonicalName
                    .split(" ")
                    .filter(Boolean)
                    .map(
                      (word) =>
                        word[0],
                    )
                    .join("")
                    .toUpperCase();

                return {
                  id:
                    style?.id ??
                    generatedId,

                  name:
                    canonicalName,

                  color:
                    style?.color ??
                    "#3b82f6",

                  bg:
                    style?.bg ??
                    "rgba(59,130,246,0.15)",
                };
              })
              .filter(
                (
                  team,
                  index,
                  allTeams,
                ) =>
                  allTeams.findIndex(
                    (
                      currentTeam,
                    ) =>
                      currentTeam.name ===
                      team.name,
                  ) === index,
              );

          setTeams(validTeams);

          if (
            validTeams.length > 0
          ) {
            setTeam1(
              (currentTeam1) => {
                if (
                  currentTeam1 &&
                  validTeams.some(
                    (team) =>
                      team.name ===
                      currentTeam1,
                  )
                ) {
                  return currentTeam1;
                }

                return validTeams[0]
                  .name;
              },
            );
          }

          if (
            validTeams.length > 1
          ) {
            setTeam2(
              (currentTeam2) => {
                if (
                  currentTeam2 &&
                  validTeams.some(
                    (team) =>
                      team.name ===
                      currentTeam2,
                  )
                ) {
                  return currentTeam2;
                }

                return validTeams[1]
                  .name;
              },
            );
          } else {
            setTeam2("");
          }
        } catch (error) {
          console.error(
            "Failed to load teams:",
            error,
          );

          if (active) {
            setTeams([]);
            setTeam1("");
            setTeam2("");
          }
        }
      };

    const loadCompletedMatches =
      async () => {
        try {
          const response =
            await fetch(
              `${API_BASE_URL}/matches?resultType=complete&limit=1000`,
              {
                headers: {
                  Accept:
                    "application/json",
                },
              },
            );

          const responseData =
            (await response.json()) as unknown;

          if (
            !response.ok ||
            !active
          ) {
            return;
          }

          const matches =
            extractMatches(
              responseData,
            );

          const validCompletedMatches =
            matches
              .filter((match) => {
                const matchId =
                  String(
                    match._id ||
                      match.id ||
                      "",
                  ).trim();

                const winner =
                  typeof match.winner ===
                  "string"
                    ? match.winner.trim()
                    : "";

                return Boolean(
                  matchId &&
                    match.team1 &&
                    match.team2 &&
                    winner,
                );
              })
              .sort((a, b) => {
                const firstDate =
                  a.date
                    ? new Date(
                        a.date,
                      ).getTime()
                    : 0;

                const secondDate =
                  b.date
                    ? new Date(
                        b.date,
                      ).getTime()
                    : 0;

                return (
                  secondDate -
                  firstDate
                );
              });

          setCompletedMatches(
            validCompletedMatches,
          );
        } catch (error) {
          console.error(
            "Failed to load completed matches:",
            error,
          );

          if (active) {
            setCompletedMatches(
              [],
            );
          }
        }
      };

    void loadTeams();
    void loadCompletedMatches();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (
      team1 &&
      team1 === team2
    ) {
      const replacementTeam =
        teams.find(
          (team) =>
            team.name !== team1,
        );

      setTeam2(
        replacementTeam?.name ??
          "",
      );
    }
  }, [
    team1,
    team2,
    teams,
  ]);

  useEffect(() => {
    if (
      toss &&
      toss !== team1 &&
      toss !== team2
    ) {
      setToss("");
    }
  }, [
    team1,
    team2,
    toss,
  ]);

  useEffect(() => {
    setPredicted(false);
    setPredictionAccuracy(null);
  }, [
    team1,
    team2,
    toss,
    venue,
    selectedMatchId,
  ]);

  useEffect(() => {
    let active = true;

    const loadWeather =
      async () => {
        if (!venue) {
          setWeather(null);
          setWeatherError("");
          return;
        }

        setWeatherLoading(true);
        setWeatherError("");

        try {
          const response =
            await fetch(
              `${API_BASE_URL}/weather?venue=${encodeURIComponent(
                venue,
              )}`,
              {
                headers: {
                  Accept:
                    "application/json",
                },
              },
            );

          const responseData =
            (await response.json()) as WeatherApiResponse;

          if (!active) {
            return;
          }

          if (
            !response.ok ||
            !responseData.success ||
            !responseData.weather
          ) {
            throw new Error(
              responseData.message ||
                "Weather data could not be loaded",
            );
          }

          setWeather(
            responseData.weather,
          );
        } catch (error) {
          console.error(
            "Failed to load weather:",
            error,
          );

          if (active) {
            setWeather(null);

            setWeatherError(
              error instanceof Error
                ? error.message
                : "Weather data could not be loaded",
            );
          }
        } finally {
          if (active) {
            setWeatherLoading(
              false,
            );
          }
        }
      };

    void loadWeather();

    return () => {
      active = false;
    };
  }, [venue]);

  const handleMatchSelection = (
    matchId: string,
  ) => {
    setSelectedMatchId(
      matchId,
    );

    if (!matchId) {
      return;
    }

    const selectedMatch =
      completedMatches.find(
        (match) =>
          String(
            match._id ||
              match.id ||
              "",
          ) === matchId,
      );

    if (
      !selectedMatch?.team1 ||
      !selectedMatch?.team2
    ) {
      return;
    }

    const selectedTeam1 =
      normalizeTeamName(
        selectedMatch.team1,
      );

    const selectedTeam2 =
      normalizeTeamName(
        selectedMatch.team2,
      );

    setTeam1(selectedTeam1);
    setTeam2(selectedTeam2);

    if (selectedMatch.venue) {
      setVenue(
        selectedMatch.venue,
      );
    }

    if (
      selectedMatch.tossWinner ===
        selectedMatch.team1 ||
      selectedMatch.tossWinner ===
        selectedMatch.team2
    ) {
      setToss(
        normalizeTeamName(
          selectedMatch.tossWinner,
        ),
      );
    } else {
      setToss("");
    }

    setPredicted(false);
  };

  const t1 = teams.find(
    (team) =>
      team.name === team1,
  );

  const t2 = teams.find(
    (team) =>
      team.name === team2,
  );

  const venueOptions =
    Array.from(
      new Set([
        venue,
        ...VENUES,
      ]),
    ).filter(Boolean);

  const handlePredict =
    async () => {
      if (
        !team1 ||
        !team2 ||
        team1 === team2 ||
        loading
      ) {
        return;
      }

      setLoading(true);
      setPredicted(false);

      try {
        if (!t1 || !t2) {
          return;
        }

        const tossWinner =
          toss || team1;

        const predictionPayload = {
          team1,
          team2,
          tossWinner,
          venue,

          ...(selectedMatchId
            ? {
                matchId:
                  selectedMatchId,
              }
            : {}),

          weather: weather
            ? {
                venue:
                  weather.venue,

                city:
                  weather.city,

                latitude:
                  weather.latitude,

                longitude:
                  weather.longitude,

                temperature:
                  weather.temperature,

                humidity:
                  weather.humidity,

                windSpeed:
                  weather.windSpeed,

                rainProbability:
                  weather.rainProbability,

                precipitation:
                  weather.precipitation,

                rain:
                  weather.rain,

                weatherCode:
                  weather.weatherCode,

                condition:
                  weather.condition,

                observedAt:
                  weather.observedAt,
              }
            : null,
        };

        const prediction =
          await predictMatch(
            predictionPayload,
          );

        const predictionResponse =
          prediction as unknown as PredictionApiResponse;

        setResult(
          normalizePrediction(
            predictionResponse,
          ),
        );

        setPredictionAccuracy({
          resultStatus:
            predictionResponse
              .predictionResult
              ?.resultStatus ===
            "completed"
              ? "completed"
              : "pending",

          actualWinner:
            predictionResponse
              .predictionResult
              ?.actualWinner ?? "",

          isCorrect:
            predictionResponse
              .predictionResult
              ?.isCorrect ?? null,
        });

        setPredicted(true);
      } catch (error) {
        console.error(
          "Failed to generate prediction:",
          error,
        );

        setResult(
          DEFAULT_RESULT,
        );

        setPredictionAccuracy(
          null,
        );

        setPredicted(false);
      } finally {
        setLoading(false);
      }
    };

  const radarData = [
    {
      stat: "Batting",
      t1: result.batting[0],
      t2: result.batting[1],
    },

    {
      stat: "Bowling",
      t1: result.bowling[0],
      t2: result.bowling[1],
    },

    {
      stat: "Fielding",
      t1: result.fielding[0],
      t2: result.fielding[1],
    },

    {
      stat: "Form",
      t1: result.form[0],
      t2: result.form[1],
    },

    {
      stat: "Home Adv",
      t1: result.homeAdv[0],
      t2: result.homeAdv[1],
    },

    {
      stat: "Toss Adv",
      t1: result.tossAdv[0],
      t2: result.tossAdv[1],
    },
  ];

  const strengthItems = [
    {
      label:
        "Batting Strength",
      t1: result.batting[0],
      t2: result.batting[1],
    },

    {
      label:
        "Bowling Strength",
      t1: result.bowling[0],
      t2: result.bowling[1],
    },

    {
      label:
        "Recent Form",
      t1: result.form[0],
      t2: result.form[1],
    },

    {
      label:
        "Home Advantage",
      t1: result.homeAdv[0],
      t2: result.homeAdv[1],
    },

    {
      label:
        "Toss Advantage",
      t1: result.tossAdv[0],
      t2: result.tossAdv[1],
    },

    {
      label:
        "Weather Impact",
      t1:
        result.weatherImpact[0],
      t2:
        result.weatherImpact[1],
    },
  ];

  const winningTeam =
    teams.find(
      (team) =>
        team.name ===
        result.predictedWinner,
    ) ??
    (result.prob1 >=
    result.prob2
      ? t1
      : t2);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 uppercase tracking-widest mb-3">
            <Zap
              size={11}
              fill="currentColor"
            />

            Match Prediction Engine
          </span>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{
              fontFamily:
                "'Rajdhani', sans-serif",
            }}
          >
            Match{" "}

            <span className="text-gradient-blue">
              Prediction
            </span>
          </h1>

          <p className="text-[#6b7db3] mt-3 max-w-xl mx-auto">
            Select two teams and
            configure match
            conditions to generate a
            data-based IPL prediction.
          </p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="glass rounded-3xl border border-white/[0.07] p-6 sm:p-8 mb-6"
          style={{
            boxShadow:
              "0 0 80px rgba(59,130,246,0.05)",
          }}
        >
          <div className="mb-6">
            <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
              Completed Match for
              Accuracy
            </label>

            <div className="relative">
              <select
                value={
                  selectedMatchId
                }
                onChange={(event) =>
                  handleMatchSelection(
                    event.target
                      .value,
                  )
                }
                className="w-full input-field rounded-xl px-4 py-3 text-sm appearance-none pr-8"
              >
                <option
                  value=""
                  style={{
                    background:
                      "#0b1120",
                  }}
                >
                  Custom prediction —
                  result will remain
                  pending
                </option>

                {completedMatches.length ===
                  0 && (
                  <option
                    value=""
                    disabled
                    style={{
                      background:
                        "#0b1120",
                    }}
                  >
                    No completed
                    results found
                  </option>
                )}

                {completedMatches.map(
                  (match) => {
                    const matchId =
                      match._id ||
                      match.id ||
                      "";

                    const matchDate =
                      match.date
                        ? new Date(
                            match.date,
                          ).toLocaleDateString(
                            "en-IN",
                          )
                        : "Completed";

                    return (
                      <option
                        key={
                          matchId
                        }
                        value={
                          matchId
                        }
                        style={{
                          background:
                            "#0b1120",
                        }}
                      >
                        {match.team1} vs{" "}
                        {match.team2} —{" "}
                        {matchDate}
                      </option>
                    );
                  },
                )}
              </select>

              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7db3] pointer-events-none"
              />
            </div>
          </div>

          <div className="relative z-20 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end mb-6">
            <TeamDropdown
              label="Team 1"
              value={team1}
              onChange={(value) => {
                setSelectedMatchId(
                  "",
                );

                setTeam1(value);
              }}
              exclude={team2}
              teams={teams}
            />

            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center">
                <span
                  className="text-sm font-bold text-[#6b7db3]"
                  style={{
                    fontFamily:
                      "'Rajdhani', sans-serif",
                  }}
                >
                  VS
                </span>
              </div>
            </div>

            <TeamDropdown
              label="Team 2"
              value={team2}
              onChange={(value) => {
                setSelectedMatchId(
                  "",
                );

                setTeam2(value);
              }}
              exclude={team1}
              teams={teams}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                Toss Winner
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  "",
                  team1,
                  team2,
                ].map(
                  (
                    value,
                    index,
                  ) => {
                    const tossTeam =
                      teams.find(
                        (team) =>
                          team.name ===
                          value,
                      );

                    return (
                      <button
                        type="button"
                        key={`${value}-${index}`}
                        onClick={() => {
                          setSelectedMatchId(
                            "",
                          );

                          setToss(
                            value,
                          );
                        }}
                        disabled={
                          index > 0 &&
                          !tossTeam
                        }
                        className={`py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          toss ===
                          value
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                            : "glass text-[#9aa8d0] hover:text-white"
                        }`}
                      >
                        {index === 0
                          ? "No Toss"
                          : tossTeam
                              ?.id ??
                            "Select"}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                Venue
              </label>

              <div className="relative">
                <select
                  value={venue}
                  onChange={(event) => {
                    setSelectedMatchId(
                      "",
                    );

                    setVenue(
                      event.target
                        .value,
                    );
                  }}
                  className="w-full input-field rounded-xl px-4 py-3 text-sm appearance-none pr-8"
                >
                  {venueOptions.map(
                    (
                      currentVenue,
                    ) => (
                      <option
                        key={
                          currentVenue
                        }
                        value={
                          currentVenue
                        }
                        style={{
                          background:
                            "#0b1120",
                        }}
                      >
                        {
                          currentVenue
                        }
                      </option>
                    ),
                  )}
                </select>

                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7db3] pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-xs text-[#6b7db3] uppercase tracking-widest">
                Match Day Conditions
              </p>

              <p className="text-[10px] text-[#6b7db3] text-right">
                {weatherLoading
                  ? "Loading live weather..."
                  : weather
                    ? `${weather.condition} in ${weather.city}`
                    : weatherError ||
                      "Weather unavailable"}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <WeatherCard
                icon={
                  Thermometer
                }
                label="Temp"
                value={
                  weatherLoading
                    ? "..."
                    : weather
                      ? `${Math.round(
                          weather.temperature,
                        )}°C`
                      : "N/A"
                }
                color="#f59e0b"
              />

              <WeatherCard
                icon={Droplets}
                label="Humidity"
                value={
                  weatherLoading
                    ? "..."
                    : weather
                      ? `${Math.round(
                          weather.humidity,
                        )}%`
                      : "N/A"
                }
                color="#3b82f6"
              />

              <WeatherCard
                icon={Wind}
                label="Wind"
                value={
                  weatherLoading
                    ? "..."
                    : weather
                      ? `${weather.windSpeed.toFixed(
                          1,
                        )} km/h`
                      : "N/A"
                }
                color="#8b5cf6"
              />

              <WeatherCard
                icon={
                  CloudRain
                }
                label="Rain"
                value={
                  weatherLoading
                    ? "..."
                    : weather
                      ? `${Math.round(
                          weather.rainProbability,
                        )}%`
                      : "N/A"
                }
                color="#06b6d4"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              void handlePredict()
            }
            disabled={
              loading ||
              !team1 ||
              !team2 ||
              team1 === team2
            }
            className="w-full btn-primary rounded-xl py-4 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RotateCcw
                  size={17}
                  className="animate-spin"
                />

                Analysing Match...
              </>
            ) : (
              <>
                <Zap
                  size={17}
                  fill="currentColor"
                />

                Generate Prediction
              </>
            )}
          </button>
        </motion.div>
                <AnimatePresence mode="wait">
          {predicted &&
            t1 &&
            t2 && (
              <motion.div
                key={`${team1}-${team2}-${venue}`}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 16,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="space-y-6"
              >
                {/* Winner result */}
                <div
                  className="glass rounded-3xl border border-white/[0.07] p-6 sm:p-8 overflow-hidden relative"
                  style={{
                    boxShadow:
                      "0 0 80px rgba(59,130,246,0.08)",
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[110px] opacity-20"
                      style={{
                        background:
                          winningTeam?.color ??
                          "#3b82f6",
                      }}
                    />
                  </div>

                  <div className="relative">
                    <div className="flex flex-col items-center text-center mb-8">
                      <motion.div
                        initial={{
                          scale: 0.7,
                          opacity: 0,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                        }}
                        transition={{
                          delay: 0.15,
                          type: "spring",
                        }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{
                          background:
                            winningTeam?.bg ??
                            "rgba(59,130,246,0.15)",
                          color:
                            winningTeam?.color ??
                            "#3b82f6",
                        }}
                      >
                        <Trophy
                          size={30}
                          strokeWidth={1.8}
                        />
                      </motion.div>

                      <p className="text-[10px] text-blue-400 uppercase tracking-[0.22em] mb-2">
                        Predicted Winner
                      </p>

                      <h2
                        className="text-3xl sm:text-4xl font-bold text-white"
                        style={{
                          fontFamily:
                            "'Rajdhani', sans-serif",
                        }}
                      >
                        {winningTeam?.name ??
                          result.predictedWinner}
                      </h2>

                      <p className="text-sm text-[#6b7db3] mt-2">
                        Prediction confidence{" "}
                        <span className="text-white font-mono font-semibold">
                          {result.confidence.toFixed(
                            1,
                          )}
                          %
                        </span>
                      </p>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                      <div className="text-center">
                        <div
                          className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center font-mono font-bold mb-3"
                          style={{
                            background:
                              t1.bg,
                            color:
                              t1.color,
                          }}
                        >
                          {t1.id}
                        </div>

                        <p className="text-xs text-[#9aa8d0] mb-2">
                          {t1.name}
                        </p>

                        <motion.p
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          className="text-3xl sm:text-4xl font-bold font-mono"
                          style={{
                            color:
                              t1.color,
                          }}
                        >
                          {result.prob1.toFixed(
                            1,
                          )}
                          %
                        </motion.p>
                      </div>

                      <div className="h-24 w-px bg-white/[0.08]" />

                      <div className="text-center">
                        <div
                          className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center font-mono font-bold mb-3"
                          style={{
                            background:
                              t2.bg,
                            color:
                              t2.color,
                          }}
                        >
                          {t2.id}
                        </div>

                        <p className="text-xs text-[#9aa8d0] mb-2">
                          {t2.name}
                        </p>

                        <motion.p
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          className="text-3xl sm:text-4xl font-bold font-mono"
                          style={{
                            color:
                              t2.color,
                          }}
                        >
                          {result.prob2.toFixed(
                            1,
                          )}
                          %
                        </motion.p>
                      </div>
                    </div>

                    <div className="mt-6 h-3 rounded-full bg-white/[0.05] overflow-hidden flex">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${result.prob1}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2,
                        }}
                        style={{
                          background:
                            t1.color,
                        }}
                      />

                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${result.prob2}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2,
                        }}
                        style={{
                          background:
                            t2.color,
                        }}
                      />
                    </div>

                    {predictionAccuracy && (
                      <div
                        className={`mt-6 rounded-2xl border p-4 ${
                          predictionAccuracy.resultStatus ===
                          "completed"
                            ? predictionAccuracy.isCorrect
                              ? "border-emerald-500/20 bg-emerald-500/[0.06]"
                              : "border-red-500/20 bg-red-500/[0.06]"
                            : "border-amber-500/20 bg-amber-500/[0.06]"
                        }`}
                      >
                        <p className="text-xs uppercase tracking-widest text-[#6b7db3] mb-1">
                          Prediction Result
                        </p>

                        {predictionAccuracy.resultStatus ===
                        "completed" ? (
                          <>
                            <p
                              className={`text-sm font-semibold ${
                                predictionAccuracy.isCorrect
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {predictionAccuracy.isCorrect
                                ? "Correct Prediction"
                                : "Incorrect Prediction"}
                            </p>

                            <p className="text-xs text-[#9aa8d0] mt-1">
                              Actual winner:{" "}
                              <span className="text-white">
                                {
                                  predictionAccuracy.actualWinner
                                }
                              </span>
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-amber-400">
                              Result Pending
                            </p>

                            <p className="text-xs text-[#9aa8d0] mt-1">
                              This custom
                              prediction will
                              remain pending
                              until a completed
                              match is linked.
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Head-to-head and recent form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass rounded-3xl border border-white/[0.07] p-6">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">
                          Historical Record
                        </p>

                        <h3
                          className="text-xl font-bold text-white"
                          style={{
                            fontFamily:
                              "'Rajdhani', sans-serif",
                          }}
                        >
                          Head-to-Head
                        </h3>
                      </div>

                      <Trophy
                        size={21}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3 items-center text-center">
                      <div>
                        <p
                          className="text-3xl font-bold font-mono"
                          style={{
                            color:
                              t1.color,
                          }}
                        >
                          {
                            result
                              .headToHeadAnalysis
                              .team1Wins
                          }
                        </p>

                        <p className="text-[10px] text-[#6b7db3] uppercase tracking-wider mt-1">
                          {t1.id} Wins
                        </p>
                      </div>

                      <div>
                        <p className="text-2xl font-bold font-mono text-white">
                          {
                            result
                              .headToHeadAnalysis
                              .totalMatches
                          }
                        </p>

                        <p className="text-[10px] text-[#6b7db3] uppercase tracking-wider mt-1">
                          Matches
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-3xl font-bold font-mono"
                          style={{
                            color:
                              t2.color,
                          }}
                        >
                          {
                            result
                              .headToHeadAnalysis
                              .team2Wins
                          }
                        </p>

                        <p className="text-[10px] text-[#6b7db3] uppercase tracking-wider mt-1">
                          {t2.id} Wins
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <div className="flex justify-between text-[11px] mb-2">
                          <span className="text-[#9aa8d0]">
                            {t1.id} H2H
                            strength
                          </span>

                          <span
                            className="font-mono"
                            style={{
                              color:
                                t1.color,
                            }}
                          >
                            {result.headToHeadAnalysis.team1Score.toFixed(
                              1,
                            )}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${result.headToHeadAnalysis.team1Score}%`,
                            }}
                            className="h-full rounded-full"
                            style={{
                              background:
                                t1.color,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-2">
                          <span className="text-[#9aa8d0]">
                            {t2.id} H2H
                            strength
                          </span>

                          <span
                            className="font-mono"
                            style={{
                              color:
                                t2.color,
                            }}
                          >
                            {result.headToHeadAnalysis.team2Score.toFixed(
                              1,
                            )}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${result.headToHeadAnalysis.team2Score}%`,
                            }}
                            className="h-full rounded-full"
                            style={{
                              background:
                                t2.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-3xl border border-white/[0.07] p-6">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">
                          Last Five Matches
                        </p>

                        <h3
                          className="text-xl font-bold text-white"
                          style={{
                            fontFamily:
                              "'Rajdhani', sans-serif",
                          }}
                        >
                          Recent Form
                        </h3>
                      </div>

                      <TrendingUp
                        size={21}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                              style={{
                                background:
                                  t1.bg,
                                color:
                                  t1.color,
                              }}
                            >
                              {t1.id}
                            </div>

                            <span className="text-xs text-[#9aa8d0]">
                              {t1.name}
                            </span>
                          </div>

                          <span
                            className="font-mono text-sm font-semibold"
                            style={{
                              color:
                                t1.color,
                            }}
                          >
                            {result.recentFormAnalysis.team1Score.toFixed(
                              1,
                            )}
                          </span>
                        </div>

                        <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${result.recentFormAnalysis.team1Score}%`,
                            }}
                            className="h-full rounded-full"
                            style={{
                              background:
                                t1.color,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                              style={{
                                background:
                                  t2.bg,
                                color:
                                  t2.color,
                              }}
                            >
                              {t2.id}
                            </div>

                            <span className="text-xs text-[#9aa8d0]">
                              {t2.name}
                            </span>
                          </div>

                          <span
                            className="font-mono text-sm font-semibold"
                            style={{
                              color:
                                t2.color,
                            }}
                          >
                            {result.recentFormAnalysis.team2Score.toFixed(
                              1,
                            )}
                          </span>
                        </div>

                        <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${result.recentFormAnalysis.team2Score}%`,
                            }}
                            className="h-full rounded-full"
                            style={{
                              background:
                                t2.color,
                            }}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                        <p className="text-xs text-[#6b7db3] leading-relaxed">
                          The recent-form score is calculated from each team's latest five completed matches available in the 2026 IPL dataset.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Venue analysis and winning reasons */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass rounded-3xl border border-white/[0.07] p-6">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">
                          Ground Performance
                        </p>

                        <h3
                          className="text-xl font-bold text-white"
                          style={{
                            fontFamily:
                              "'Rajdhani', sans-serif",
                          }}
                        >
                          Venue Analysis
                        </h3>
                      </div>

                      <MapPin
                        size={21}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 mb-5">
                      <p className="text-xs text-[#6b7db3] uppercase tracking-wider mb-1">
                        Selected Venue
                      </p>

                      <p className="text-sm font-semibold text-white">
                        {venue}
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-[#9aa8d0]">
                            {t1.id} venue
                            record
                          </span>

                          <span
                            className="font-mono font-semibold"
                            style={{
                              color:
                                t1.color,
                            }}
                          >
                            {result.venueAnalysis.team1Score.toFixed(
                              1,
                            )}
                          </span>
                        </div>

                        <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${result.venueAnalysis.team1Score}%`,
                            }}
                            className="h-full rounded-full"
                            style={{
                              background:
                                t1.color,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-[#9aa8d0]">
                            {t2.id} venue
                            record
                          </span>

                          <span
                            className="font-mono font-semibold"
                            style={{
                              color:
                                t2.color,
                            }}
                          >
                            {result.venueAnalysis.team2Score.toFixed(
                              1,
                            )}
                          </span>
                        </div>

                        <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${result.venueAnalysis.team2Score}%`,
                            }}
                            className="h-full rounded-full"
                            style={{
                              background:
                                t2.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-3xl border border-white/[0.07] p-6">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">
                          Prediction Reasoning
                        </p>

                        <h3
                          className="text-xl font-bold text-white"
                          style={{
                            fontFamily:
                              "'Rajdhani', sans-serif",
                          }}
                        >
                          Why This Team Will
                          Win
                        </h3>
                      </div>

                      <Target
                        size={21}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="space-y-3">
                      {result.whyThisTeamWillWin.length >
                      0 ? (
                        result.whyThisTeamWillWin.map(
                          (
                            reason,
                            index,
                          ) => (
                            <motion.div
                              key={`${reason}-${index}`}
                              initial={{
                                opacity: 0,
                                x: -8,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                              }}
                              transition={{
                                delay:
                                  index *
                                  0.08,
                              }}
                              className="flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                            >
                              <div className="w-7 h-7 shrink-0 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                <Zap
                                  size={13}
                                  fill="currentColor"
                                />
                              </div>

                              <p className="text-xs sm:text-sm text-[#9aa8d0] leading-relaxed">
                                {reason}
                              </p>
                            </motion.div>
                          ),
                        )
                      ) : (
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                          <p className="text-sm text-[#9aa8d0]">
                            {
                              result.predictedWinner
                            }{" "}
                            has a small overall
                            statistical
                            advantage.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live insights */}
                <div className="glass rounded-3xl border border-white/[0.07] p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">
                        Match Intelligence
                      </p>

                      <h3
                        className="text-xl font-bold text-white"
                        style={{
                          fontFamily:
                            "'Rajdhani', sans-serif",
                        }}
                      >
                        Live Match Insights
                      </h3>
                    </div>

                    <Sparkles
                      size={22}
                      className="text-blue-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.liveInsights.length >
                    0 ? (
                      result.liveInsights.map(
                        (
                          insight,
                          index,
                        ) => (
                          <motion.div
                            key={`${insight}-${index}`}
                            initial={{
                              opacity: 0,
                              y: 10,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              delay:
                                index *
                                0.07,
                            }}
                            className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 flex gap-3"
                          >
                            <div className="w-8 h-8 shrink-0 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                              <Activity
                                size={15}
                              />
                            </div>

                            <p className="text-xs sm:text-sm text-[#9aa8d0] leading-relaxed">
                              {insight}
                            </p>
                          </motion.div>
                        ),
                      )
                    ) : (
                      <div className="sm:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                        <p className="text-sm text-[#9aa8d0]">
                          Match insights are
                          currently unavailable.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass rounded-3xl border border-white/[0.07] p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">
                          Statistical Profile
                        </p>

                        <h3
                          className="text-xl font-bold text-white"
                          style={{
                            fontFamily:
                              "'Rajdhani', sans-serif",
                          }}
                        >
                          Team Comparison
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="flex items-center gap-1.5 text-[#6b7db3]">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              background:
                                t1.color,
                            }}
                          />
                          {t1.id}
                        </span>

                        <span className="flex items-center gap-1.5 text-[#6b7db3]">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              background:
                                t2.color,
                            }}
                          />
                          {t2.id}
                        </span>
                      </div>
                    </div>

                    <div className="h-[330px]">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <RadarChart
                          data={radarData}
                          outerRadius="70%"
                        >
                          <PolarGrid
                            stroke="rgba(255,255,255,0.08)"
                          />

                          <PolarAngleAxis
                            dataKey="stat"
                            tick={{
                              fill: "#6b7db3",
                              fontSize: 10,
                            }}
                          />

                          <Radar
                            name={t1.id}
                            dataKey="t1"
                            stroke={
                              t1.color
                            }
                            fill={
                              t1.color
                            }
                            fillOpacity={
                              0.2
                            }
                            strokeWidth={2}
                          />

                          <Radar
                            name={t2.id}
                            dataKey="t2"
                            stroke={
                              t2.color
                            }
                            fill={
                              t2.color
                            }
                            fillOpacity={
                              0.16
                            }
                            strokeWidth={2}
                          />

                          <Tooltip
                            contentStyle={{
                              background:
                                "#0b1120",
                              border:
                                "1px solid rgba(255,255,255,0.08)",
                              borderRadius:
                                "12px",
                              color:
                                "#ffffff",
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass rounded-3xl border border-white/[0.07] p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div>
                        <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">
                          Key Factors
                        </p>

                        <h3
                          className="text-xl font-bold text-white"
                          style={{
                            fontFamily:
                              "'Rajdhani', sans-serif",
                          }}
                        >
                          Strength Breakdown
                        </h3>
                      </div>

                      <TrendingUp
                        size={21}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="space-y-5">
                      {strengthItems.map(
                        (item) => (
                          <div
                            key={
                              item.label
                            }
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-[#9aa8d0]">
                                {
                                  item.label
                                }
                              </p>

                              <div className="flex items-center gap-3 text-[11px] font-mono">
                                <span
                                  style={{
                                    color:
                                      t1.color,
                                  }}
                                >
                                  {
                                    item.t1
                                  }
                                </span>

                                <span className="text-[#334162]">
                                  /
                                </span>

                                <span
                                  style={{
                                    color:
                                      t2.color,
                                  }}
                                >
                                  {
                                    item.t2
                                  }
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1">
                              <div className="h-2 rounded-l-full bg-white/[0.05] overflow-hidden flex justify-end">
                                <motion.div
                                  initial={{
                                    width: 0,
                                  }}
                                  animate={{
                                    width: `${item.t1}%`,
                                  }}
                                  className="h-full rounded-l-full"
                                  style={{
                                    background:
                                      t1.color,
                                  }}
                                />
                              </div>

                              <div className="h-2 rounded-r-full bg-white/[0.05] overflow-hidden">
                                <motion.div
                                  initial={{
                                    width: 0,
                                  }}
                                  animate={{
                                    width: `${item.t2}%`,
                                  }}
                                  className="h-full rounded-r-full"
                                  style={{
                                    background:
                                      t2.color,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Probability swing */}
                <div className="glass rounded-3xl border border-white/[0.07] p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">
                        Match Projection
                      </p>

                      <h3
                        className="text-xl font-bold text-white"
                        style={{
                          fontFamily:
                            "'Rajdhani', sans-serif",
                        }}
                      >
                        Win Probability Swing
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            background:
                              t1.color,
                          }}
                        />

                        <span className="text-xs text-[#6b7db3]">
                          {t1.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            background:
                              t2.color,
                          }}
                        />

                        <span className="text-xs text-[#6b7db3]">
                          {t2.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[300px]">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <AreaChart
                        data={
                          result.swing
                        }
                        margin={{
                          top: 10,
                          right: 10,
                          left: -20,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="team1Gradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={
                                t1.color
                              }
                              stopOpacity={
                                0.3
                              }
                            />

                            <stop
                              offset="95%"
                              stopColor={
                                t1.color
                              }
                              stopOpacity={
                                0
                              }
                            />
                          </linearGradient>

                          <linearGradient
                            id="team2Gradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={
                                t2.color
                              }
                              stopOpacity={
                                0.3
                              }
                            />

                            <stop
                              offset="95%"
                              stopColor={
                                t2.color
                              }
                              stopOpacity={
                                0
                              }
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="4 4"
                          stroke="rgba(255,255,255,0.05)"
                        />

                        <XAxis
                          dataKey="over"
                          tick={{
                            fill: "#6b7db3",
                            fontSize: 11,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          domain={[
                            0,
                            100,
                          ]}
                          tick={{
                            fill: "#6b7db3",
                            fontSize: 11,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          contentStyle={{
                            background:
                              "#0b1120",
                            border:
                              "1px solid rgba(255,255,255,0.08)",
                            borderRadius:
                              "12px",
                            color:
                              "#ffffff",
                          }}
                          labelStyle={{
                            color:
                              "#9aa8d0",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="t1"
                          name={t1.id}
                          stroke={
                            t1.color
                          }
                          fill="url(#team1Gradient)"
                          strokeWidth={2}
                        />

                        <Area
                          type="monotone"
                          dataKey="t2"
                          name={t2.id}
                          stroke={
                            t2.color
                          }
                          fill="url(#team2Gradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Weather analysis */}
                <div className="glass rounded-3xl border border-white/[0.07] p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1">
                        Live Conditions
                      </p>

                      <h3
                        className="text-xl font-bold text-white"
                        style={{
                          fontFamily:
                            "'Rajdhani', sans-serif",
                        }}
                      >
                        Weather Impact
                      </h3>
                    </div>

                    <CloudRain
                      size={22}
                      className="text-blue-400"
                    />
                  </div>

                  {weather ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <WeatherCard
                          icon={
                            Thermometer
                          }
                          label="Temperature"
                          value={`${Math.round(
                            weather.temperature,
                          )}°C`}
                          color="#f59e0b"
                        />

                        <WeatherCard
                          icon={
                            Droplets
                          }
                          label="Humidity"
                          value={`${Math.round(
                            weather.humidity,
                          )}%`}
                          color="#3b82f6"
                        />

                        <WeatherCard
                          icon={Wind}
                          label="Wind Speed"
                          value={`${weather.windSpeed.toFixed(
                            1,
                          )} km/h`}
                          color="#8b5cf6"
                        />

                        <WeatherCard
                          icon={
                            CloudRain
                          }
                          label="Rain Chance"
                          value={`${Math.round(
                            weather.rainProbability,
                          )}%`}
                          color="#06b6d4"
                        />
                      </div>

                      <div className="rounded-2xl bg-white/[0.025] border border-white/[0.06] p-4 mb-5">
                        <p className="text-sm font-semibold text-white">
                          {
                            weather.condition
                          }
                        </p>

                        <p className="text-xs text-[#6b7db3] mt-1 leading-relaxed">
                          {result.weatherSummary ||
                            `Live weather from ${
                              weather.city ||
                              venue
                            } has been included in the final prediction.`}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-2">
                            <span className="text-[#9aa8d0]">
                              {t1.id} Impact
                            </span>

                            <span
                              className="font-mono"
                              style={{
                                color:
                                  t1.color,
                              }}
                            >
                              {
                                result
                                  .weatherImpact[0]
                              }
                            </span>
                          </div>

                          <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                            <motion.div
                              initial={{
                                width: 0,
                              }}
                              animate={{
                                width: `${result.weatherImpact[0]}%`,
                              }}
                              className="h-full rounded-full"
                              style={{
                                background:
                                  t1.color,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-2">
                            <span className="text-[#9aa8d0]">
                              {t2.id} Impact
                            </span>

                            <span
                              className="font-mono"
                              style={{
                                color:
                                  t2.color,
                              }}
                            >
                              {
                                result
                                  .weatherImpact[1]
                              }
                            </span>
                          </div>

                          <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                            <motion.div
                              initial={{
                                width: 0,
                              }}
                              animate={{
                                width: `${result.weatherImpact[1]}%`,
                              }}
                              className="h-full rounded-full"
                              style={{
                                background:
                                  t2.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl bg-white/[0.025] border border-white/[0.06] p-5 text-center">
                      <CloudRain
                        size={24}
                        className="text-[#6b7db3] mx-auto mb-2"
                      />

                      <p className="text-sm text-white">
                        Weather data
                        unavailable
                      </p>

                      <p className="text-xs text-[#6b7db3] mt-1">
                        Prediction was
                        generated without
                        live weather data.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPredicted(
                      false,
                    );

                    setResult(
                      DEFAULT_RESULT,
                    );

                    setPredictionAccuracy(
                      null,
                    );

                    window.scrollTo({
                      top: 0,
                      behavior:
                        "smooth",
                    });
                  }}
                  className="w-full glass rounded-xl py-3.5 border border-white/[0.07] text-sm font-medium text-[#9aa8d0] hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw
                    size={15}
                  />

                  Make Another
                  Prediction
                </button>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Prediction;