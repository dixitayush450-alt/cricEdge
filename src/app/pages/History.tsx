import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  Clock3,
  History as HistoryIcon,
  MapPin,
  RefreshCw,
  Sparkles,
  Trophy,
} from "lucide-react";

import { getPredictionHistory } from "../../services/api";

interface PredictionHistoryItem {
  _id?: string;
  team1: string;
  team2: string;
  venue: string;
  tossWinner: string;
  predictedWinner: string;
  team1Probability: number;
  team2Probability: number;
  createdAt: string;
}

interface PredictionHistoryResponse {
  success?: boolean;
  count?: number;
  history?: PredictionHistoryItem[];
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
    color: "#8B5CF6",
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

function getTeamStyle(teamName: string) {
  const savedStyle = TEAM_STYLE_MAP[teamName];

  if (savedStyle) {
    return savedStyle;
  }

  const generatedId = teamName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);

  return {
    id: generatedId || "TEAM",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.15)",
  };
}

function getValidProbability(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(100, Math.max(0, value));
  }

  if (typeof value === "string") {
    const parsedValue = Number.parseFloat(value);

    if (Number.isFinite(parsedValue)) {
      return Math.min(100, Math.max(0, parsedValue));
    }
  }

  return 0;
}

function formatPredictionDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "Date unavailable",
      time: "",
    };
  }

  return {
    date: new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date),

    time: new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
  };
}

export function History() {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        (await getPredictionHistory()) as PredictionHistoryResponse;

      const predictionHistory = Array.isArray(response?.history)
        ? response.history
        : [];

      setHistory(predictionHistory);
    } catch (historyError) {
      console.error(
        "Failed to fetch prediction history:",
        historyError,
      );

      setHistory([]);

      setError(
        historyError instanceof Error
          ? historyError.message
          : "Failed to load prediction history",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 uppercase tracking-widest mb-3">
            <HistoryIcon size={11} />
            Your Prediction Records
          </span>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            Prediction{" "}
            <span className="text-gradient-blue">History</span>
          </h1>

          <p className="text-[#6b7db3] mt-3 max-w-xl mx-auto">
            Review your previous match predictions, winning probabilities,
            selected venues and predicted winners.
          </p>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl border border-white/[0.07] p-5 sm:p-6 mb-6"
          style={{
            boxShadow: "0 0 80px rgba(59,130,246,0.05)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Sparkles size={19} className="text-blue-400" />
              </div>

              <div>
                <p
                  className="text-lg font-semibold text-white"
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  Saved Predictions
                </p>

                <p className="text-xs text-[#6b7db3]">
                  {loading
                    ? "Loading prediction records..."
                    : `${history.length} prediction${
                        history.length === 1 ? "" : "s"
                      } stored`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                void loadHistory(true);
              }}
              disabled={loading || refreshing}
              className="glass border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-[#6b7db3] hover:text-white hover:border-white/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-3xl border border-white/[0.07] p-10"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-400 rounded-full animate-spin mb-4" />

              <p
                className="text-lg font-semibold text-white"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                Loading Prediction History
              </p>

              <p className="text-sm text-[#6b7db3] mt-1">
                Fetching your saved match predictions...
              </p>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl border border-red-500/20 p-8 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <HistoryIcon size={21} className="text-red-400" />
            </div>

            <p
              className="text-xl font-semibold text-white"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              History Could Not Be Loaded
            </p>

            <p className="text-sm text-[#6b7db3] mt-2">{error}</p>

            <button
              type="button"
              onClick={() => {
                void loadHistory();
              }}
              className="btn-primary inline-flex items-center gap-2 py-3 px-5 text-white font-semibold rounded-xl text-sm mt-5"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && history.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl border border-white/[0.07] p-10 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <HistoryIcon size={24} className="text-blue-400" />
            </div>

            <p
              className="text-xl font-semibold text-white"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              No Predictions Yet
            </p>

            <p className="text-sm text-[#6b7db3] mt-2 max-w-md mx-auto">
              Generate your first match prediction and it will automatically
              appear here.
            </p>
          </motion.div>
        )}

        {/* History cards */}
        {!loading && !error && history.length > 0 && (
          <div className="space-y-5">
            {history.map((prediction, index) => {
              const team1Style = getTeamStyle(prediction.team1);
              const team2Style = getTeamStyle(prediction.team2);

              const team1Probability = getValidProbability(
                prediction.team1Probability,
              );

              const team2Probability = getValidProbability(
                prediction.team2Probability,
              );

              const formattedDate = formatPredictionDate(
                prediction.createdAt,
              );

              const team1Won =
                prediction.predictedWinner === prediction.team1;

              const team2Won =
                prediction.predictedWinner === prediction.team2;

              return (
                <motion.div
                  key={
                    prediction._id ??
                    `${prediction.team1}-${prediction.team2}-${prediction.createdAt}-${index}`
                  }
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(index * 0.06, 0.3),
                  }}
                  className="glass rounded-3xl border border-white/[0.07] p-6 sm:p-8"
                  style={{
                    boxShadow:
                      "0 0 80px rgba(59,130,246,0.04)",
                  }}
                >
                  {/* Card top */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2 text-xs text-[#6b7db3]">
                      <CalendarDays size={13} className="text-blue-400" />
                      <span>{formattedDate.date}</span>

                      {formattedDate.time && (
                        <>
                          <span className="text-white/20">•</span>
                          <Clock3 size={13} className="text-blue-400" />
                          <span>{formattedDate.time}</span>
                        </>
                      )}
                    </div>

                    <div className="inline-flex self-start sm:self-auto items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold px-3 py-1.5 rounded-full">
                      <Trophy size={11} />
                      {prediction.predictedWinner}
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6 mb-6">
                    {/* Team 1 */}
                    <div className="text-center">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex items-center justify-center text-lg font-bold mb-2 ${
                          team1Won
                            ? "ring-1 ring-emerald-400/40"
                            : ""
                        }`}
                        style={{
                          background: team1Style.bg,
                          color: team1Style.color,
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        {team1Style.id.slice(0, 3)}
                      </div>

                      <p
                        className="font-bold text-white text-base sm:text-lg"
                        style={{
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        {team1Style.id}
                      </p>

                      <p className="text-[10px] text-[#6b7db3] mt-0.5 line-clamp-2">
                        {prediction.team1}
                      </p>

                      <p
                        className="text-2xl sm:text-3xl font-bold mt-2"
                        style={{
                          color: team1Style.color,
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        {team1Probability.toFixed(1)}%
                      </p>
                    </div>

                    <div
                      className="text-xl sm:text-2xl font-bold text-[#6b7db3]"
                      style={{
                        fontFamily: "'Rajdhani', sans-serif",
                      }}
                    >
                      VS
                    </div>

                    {/* Team 2 */}
                    <div className="text-center">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex items-center justify-center text-lg font-bold mb-2 ${
                          team2Won
                            ? "ring-1 ring-emerald-400/40"
                            : ""
                        }`}
                        style={{
                          background: team2Style.bg,
                          color: team2Style.color,
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        {team2Style.id.slice(0, 3)}
                      </div>

                      <p
                        className="font-bold text-white text-base sm:text-lg"
                        style={{
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        {team2Style.id}
                      </p>

                      <p className="text-[10px] text-[#6b7db3] mt-0.5 line-clamp-2">
                        {prediction.team2}
                      </p>

                      <p
                        className="text-2xl sm:text-3xl font-bold mt-2"
                        style={{
                          color: team2Style.color,
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        {team2Probability.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Probability bar */}
                  <div className="relative h-2 rounded-full overflow-hidden bg-white/5 mb-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${team1Probability}%`,
                      }}
                      transition={{
                        duration: 1,
                        delay: 0.15,
                      }}
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${team1Style.color}99, ${team1Style.color})`,
                      }}
                    />

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${team2Probability}%`,
                      }}
                      transition={{
                        duration: 1,
                        delay: 0.15,
                      }}
                      className="absolute right-0 top-0 h-full rounded-full"
                      style={{
                        background: `linear-gradient(270deg, ${team2Style.color}99, ${team2Style.color})`,
                      }}
                    />
                  </div>

                  {/* Match details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="glass rounded-xl border border-white/[0.06] p-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-blue-400" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] text-[#6b7db3] uppercase tracking-wider">
                          Venue
                        </p>

                        <p className="text-xs text-white mt-1 truncate">
                          {prediction.venue || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="glass rounded-xl border border-white/[0.06] p-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-violet-400" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] text-[#6b7db3] uppercase tracking-wider">
                          Toss Winner
                        </p>

                        <p className="text-xs text-white mt-1 truncate">
                          {prediction.tossWinner || "No toss selected"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}