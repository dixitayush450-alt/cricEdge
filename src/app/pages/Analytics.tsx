import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Database, Activity, Users, CalendarDays } from "lucide-react";

const seasonData = [
  {
    "season": "2020",
    "csk": 42.9,
    "mi": 68.8,
    "rcb": 46.7,
    "kkr": 50.0,
    "srh": 50.0,
    "dc": 52.9,
    "pbks": 42.9,
    "rr": 42.9,
    "gt": null,
    "lsg": null
  },
  {
    "season": "2021",
    "csk": 68.8,
    "mi": 50.0,
    "rcb": 60.0,
    "kkr": 52.9,
    "srh": 21.4,
    "dc": 56.2,
    "pbks": 42.9,
    "rr": 35.7,
    "gt": null,
    "lsg": null
  },
  {
    "season": "2022",
    "csk": 28.6,
    "mi": 28.6,
    "rcb": 56.2,
    "kkr": 42.9,
    "srh": 42.9,
    "dc": 50.0,
    "pbks": 50.0,
    "rr": 58.8,
    "gt": 75.0,
    "lsg": 60.0
  },
  {
    "season": "2023",
    "csk": 62.5,
    "mi": 56.2,
    "rcb": 50.0,
    "kkr": 42.9,
    "srh": 28.6,
    "dc": 35.7,
    "pbks": 42.9,
    "rr": 50.0,
    "gt": 64.7,
    "lsg": 53.3
  },
  {
    "season": "2024",
    "csk": 50.0,
    "mi": 28.6,
    "rcb": 46.7,
    "kkr": 78.6,
    "srh": 56.2,
    "dc": 50.0,
    "pbks": 35.7,
    "rr": 60.0,
    "gt": 41.7,
    "lsg": 50.0
  },
  {
    "season": "2025",
    "csk": 28.6,
    "mi": 56.2,
    "rcb": 73.3,
    "kkr": 38.5,
    "srh": 42.9,
    "dc": 40.0,
    "pbks": 55.6,
    "rr": 28.6,
    "gt": 60.0,
    "lsg": 42.9
  },
  {
    "season": "2026",
    "csk": 42.9,
    "mi": 28.6,
    "rcb": 68.8,
    "kkr": 35.7,
    "srh": 60.0,
    "dc": 50.0,
    "pbks": 50.0,
    "rr": 56.2,
    "gt": 58.8,
    "lsg": 28.6
  }
];

const winRateData = [
  {
    "name": "RCB",
    "value": 12.7,
    "wins": 61,
    "color": "#EC1C24"
  },
  {
    "name": "DC",
    "value": 10.4,
    "wins": 50,
    "color": "#0078BC"
  },
  {
    "name": "RR",
    "value": 10.4,
    "wins": 50,
    "color": "#FF4FA3"
  },
  {
    "name": "KKR",
    "value": 10.2,
    "wins": 49,
    "color": "#8B5CF6"
  },
  {
    "name": "CSK",
    "value": 10.0,
    "wins": 48,
    "color": "#F9C000"
  },
  {
    "name": "MI",
    "value": 10.0,
    "wins": 48,
    "color": "#4B9CD3"
  },
  {
    "name": "PBKS",
    "value": 9.8,
    "wins": 47,
    "color": "#ED1B24"
  },
  {
    "name": "GT",
    "value": 9.8,
    "wins": 47,
    "color": "#1BA3E4"
  },
  {
    "name": "SRH",
    "value": 9.4,
    "wins": 45,
    "color": "#F7A721"
  },
  {
    "name": "LSG",
    "value": 7.1,
    "wins": 34,
    "color": "#00B2E3"
  }
];

const matchesBySeason = [
  {
    "season": "2020",
    "matches": 60
  },
  {
    "season": "2021",
    "matches": 60
  },
  {
    "season": "2022",
    "matches": 74
  },
  {
    "season": "2023",
    "matches": 74
  },
  {
    "season": "2024",
    "matches": 71
  },
  {
    "season": "2025",
    "matches": 74
  },
  {
    "season": "2026",
    "matches": 74
  }
];

const topPerformers = [
  {
    "name": "Abhishek Sharma",
    "team": "SRH",
    "metric": "Runs",
    "value": 380,
    "color": "#F7A721"
  },
  {
    "name": "Vaibhav Sooryavanshi",
    "team": "RR",
    "metric": "Impact",
    "value": 433.2,
    "color": "#FF4FA3"
  },
  {
    "name": "Kagiso Rabada",
    "team": "GT",
    "metric": "Wickets",
    "value": 29,
    "color": "#1BA3E4",
  },
  {
    "name": "Rinku Singh",
    "team": "KKR",
    "metric": "Catches",
    "value": 9,
    "color": "#8B5CF6"
  },
  {
    "name": "Priyansh Arya",
    "team": "PBKS",
    "metric": "Strike Rate",
    "value": 249.01,
    "color": "#ED1B24"
  }
];

const trendCards = [
  { label: "Matches Analysed", value: "487", delta: "2020–2026", icon: Database, color: "#3b82f6" },
  { label: "Ball Events", value: "100,567", delta: "CSV records", icon: Activity, color: "#06b6d4" },
  { label: "Players Tracked", value: "230", delta: "2026 data", icon: Users, color: "#8b5cf6" },
  { label: "Seasons Covered", value: "7", delta: "2020–2026", icon: CalendarDays, color: "#f59e0b" },
];

const tooltipStyle = {
  background: "#0b1120",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  fontFamily: "JetBrains Mono",
  fontSize: 11,
};

export function Analytics() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Analytics <span className="text-gradient-blue">Dashboard</span>
          </h1>
          <p className="text-[#6b7db3] mt-3">IPL analytics calculated from the supplied match, delivery, batting, bowling, and fielding CSV datasets.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trendCards.map(({ label, value, delta, icon: Icon, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="glass rounded-2xl border border-white/[0.07] p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  {delta}
                </span>
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{value}</p>
              <p className="text-[10px] text-[#6b7db3] uppercase tracking-widest mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass rounded-2xl border border-white/[0.07] p-6">
            <p className="text-sm font-semibold text-white mb-5" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.05rem" }}>
              Team Win Rate by Season (2020–2026)
            </p>
            <ResponsiveContainer width="100%" height={310}>
              <LineChart data={seasonData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="season" tick={{ fill: "#6b7db3", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fill: "#6b7db3", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, "Win rate"]} />
                <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 9, color: "#6b7db3", paddingTop: 8 }} />
                <Line type="monotone" connectNulls dataKey="csk" name="CSK" stroke="#F9C000" strokeWidth={1.8} dot={{ r: 2.5, fill: "#F9C000", strokeWidth: 0 }} />
                <Line type="monotone" connectNulls dataKey="mi" name="MI" stroke="#4B9CD3" strokeWidth={1.8} dot={{ r: 2.5, fill: "#4B9CD3", strokeWidth: 0 }} />
                <Line type="monotone" connectNulls dataKey="rcb" name="RCB" stroke="#EC1C24" strokeWidth={1.8} dot={{ r: 2.5, fill: "#EC1C24", strokeWidth: 0 }} />
                <Line type="monotone" connectNulls dataKey="kkr" name="KKR" stroke="#8B5CF6" strokeWidth={1.8} dot={{ r: 2.5, fill: "#8B5CF6", strokeWidth: 0 }} />
                <Line type="monotone" connectNulls dataKey="srh" name="SRH" stroke="#F7A721" strokeWidth={1.8} dot={{ r: 2.5, fill: "#F7A721", strokeWidth: 0 }} />
                <Line type="monotone" connectNulls dataKey="dc" name="DC" stroke="#0078BC" strokeWidth={1.8} dot={{ r: 2.5, fill: "#0078BC", strokeWidth: 0 }} />
                <Line type="monotone" connectNulls dataKey="pbks" name="PBKS" stroke="#ED1B24" strokeWidth={1.8} strokeDasharray="5 3" dot={{ r: 2.5, fill: "#ED1B24", strokeWidth: 0 }} />
                <Line type="monotone" connectNulls dataKey="rr" name="RR" stroke="#FF4FA3" strokeWidth={1.8} dot={{ r: 2.5, fill: "#FF4FA3", strokeWidth: 0 }} />
                <Line type="monotone" connectNulls dataKey="gt" name="GT" stroke="#1BA3E4" strokeWidth={1.8} strokeDasharray="4 2" dot={{ r: 2.5, fill: "#1BA3E4", strokeWidth: 0 }} />
                <Line type="monotone" connectNulls dataKey="lsg" name="LSG" stroke="#00B2E3" strokeWidth={1.8} strokeDasharray="2 2" dot={{ r: 2.5, fill: "#00B2E3", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl border border-white/[0.07] p-6">
            <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.05rem" }}>
              Overall Win Share (2020–2026)
            </p>
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={winRateData} cx="50%" cy="50%" innerRadius={52} outerRadius={88} paddingAngle={2} dataKey="value">
                  {winRateData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={entry.color} opacity={0.88} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value, _name, item) => [`${value}% (${item.payload.wins} wins)`, item.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
              {winRateData.map(({ name, value, wins, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                    <span className="font-mono text-[#6b7db3]">{name}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color }}>{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/[0.07] p-6">
          <p className="text-sm font-semibold text-white mb-5" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.05rem" }}>
            Matches Analysed by Season
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={matchesBySeason} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="season" tick={{ fill: "#6b7db3", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "#6b7db3", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="matches" name="Matches" stroke="#3b82f6" fill="url(#matchGrad)" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl border border-white/[0.07] p-6">
          <p className="text-sm font-semibold text-white mb-5" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.05rem" }}>
            2026 Top Performers
          </p>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <motion.div
                key={`${performer.name}-${performer.metric}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]"
              >
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono shrink-0" style={{ background: `${performer.color}20`, color: performer.color }}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{performer.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono" style={{ color: performer.color }}>{performer.team}</span>
                    <span className="text-[10px] text-[#6b7db3]">· {performer.metric}</span>
                  </div>
                </div>
                <span className="text-sm font-bold font-mono shrink-0" style={{ color: performer.color }}>
                  {typeof performer.value === "number" && performer.value > 999 ? performer.value.toLocaleString() : performer.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}