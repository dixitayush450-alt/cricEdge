import { useState } from "react";
import { motion } from "motion/react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Trophy, Users, MapPin, User, TrendingUp } from "lucide-react";

const TEAMS = [
  {
    id: "CSK", name: "Chennai Super Kings", captain: "MS Dhoni", coach: "Stephen Fleming",
    stadium: "MA Chidambaram Stadium, Chennai", titles: 5, color: "#F9C000", bg: "rgba(249,192,0,0.08)",
    border: "rgba(249,192,0,0.2)",
    batting: 88, bowling: 74, fielding: 79, nrr: 83, form: 90, experience: 95,
    form5: [
      { m: "M1", r: 80 }, { m: "M2", r: 65 }, { m: "M3", r: 92 }, { m: "M4", r: 71 }, { m: "M5", r: 88 },
    ],
    players: 22, played: 88, wins: 42, losses: 45,
  },
  {
    id: "MI", name: "Mumbai Indians", captain: "Hardik Pandya", coach: "Mark Boucher",
    stadium: "Wankhede Stadium, Mumbai", titles: 5, color: "#4B9CD3", bg: "rgba(75,156,211,0.08)",
    border: "rgba(75,156,211,0.2)",
    batting: 82, bowling: 91, fielding: 85, nrr: 71, form: 68, experience: 92,
    form5: [
      { m: "M1", r: 70 }, { m: "M2", r: 85 }, { m: "M3", r: 60 }, { m: "M4", r: 78 }, { m: "M5", r: 65 },
    ],
    players: 22, played: 88, wins: 37, losses: 51,
  },
  {
    id: "RCB", name: "Royal Challengers Bengaluru", captain: "Rajat Patidar", coach: "Andy Flower",
    stadium: "M. Chinnaswamy Stadium, Bengaluru", titles: 2, color: "#EC1C24", bg: "rgba(236,28,36,0.08)",
    border: "rgba(236,28,36,0.2)",
    batting: 94, bowling: 65, fielding: 72, nrr: 54, form: 82, experience: 85,
    form5: [
      { m: "M1", r: 88 }, { m: "M2", r: 75 }, { m: "M3", r: 92 }, { m: "M4", r: 68 }, { m: "M5", r: 85 },
    ],
    players: 22, played: 91, wins: 54, losses: 37,
  },
  {
    id: "KKR", name: "Kolkata Knight Riders", captain: "Shreyas Iyer", coach: "Chandrakant Pandit",
    stadium: "Eden Gardens, Kolkata", titles: 3, color: "#8B5CF6", bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
    batting: 78, bowling: 82, fielding: 80, nrr: 75, form: 74, experience: 88,
    form5: [
      { m: "M1", r: 65 }, { m: "M2", r: 78 }, { m: "M3", r: 85 }, { m: "M4", r: 70 }, { m: "M5", r: 80 },
    ],
    players: 22, played: 86, wins: 42, losses: 41,
  },
  {
    id: "SRH", name: "Sunrisers Hyderabad", captain: "Pat Cummins", coach: "Daniel Vettori",
    stadium: "Rajiv Gandhi Intl. Cricket Stadium", titles: 1, color: "#F7A721", bg: "rgba(247,167,33,0.08)",
    border: "rgba(247,167,33,0.2)",
    batting: 86, bowling: 78, fielding: 76, nrr: 62, form: 71, experience: 80,
    form5: [
      { m: "M1", r: 72 }, { m: "M2", r: 88 }, { m: "M3", r: 65 }, { m: "M4", r: 80 }, { m: "M5", r: 75 },
    ],
    players: 22, played: 87, wins: 37, losses: 48,
  },
  {
    id: "GT", name: "Gujarat Titans", captain: "Shubman Gill", coach: "Vikram Solanki",
    stadium: "Narendra Modi Stadium, Ahmedabad", titles: 1, color: "#1BA3E4", bg: "rgba(27,163,228,0.08)",
    border: "rgba(27,163,228,0.2)",
    batting: 80, bowling: 76, fielding: 82, nrr: 70, form: 68, experience: 75,
    form5: [
      { m: "M1", r: 60 }, { m: "M2", r: 72 }, { m: "M3", r: 78 }, { m: "M4", r: 65 }, { m: "M5", r: 70 },
    ],
    players: 22, played: 77, wins: 47, losses: 30,
  },
  {
    id: "DC", name: "Delhi Capitals", captain: "Axar Patel", coach: "Hemang Badani",
    stadium: "Arun Jaitley Stadium, Delhi", titles: 0, color: "#0078BC", bg: "rgba(0,120,188,0.08)",
    border: "rgba(0,120,188,0.2)",
    batting: 78, bowling: 79, fielding: 77, nrr: 68, form: 72, experience: 79,
    form5: [
      { m: "M1", r: 68 }, { m: "M2", r: 76 }, { m: "M3", r: 72 }, { m: "M4", r: 70 }, { m: "M5", r: 74 },
    ],
    players: 22, played: 87, wins: 41, losses: 42,
  },
  {
    id: "PBKS", name: "Punjab Kings", captain: "Shreyas Iyer", coach: "Ricky Ponting",
    stadium: "Maharaja Yadavindra Singh Stadium, Mullanpur", titles: 0, color: "#ED1B24", bg: "rgba(237,27,36,0.08)",
    border: "rgba(237,27,36,0.2)",
    batting: 81, bowling: 77, fielding: 78, nrr: 72, form: 76, experience: 74,
    form5: [
      { m: "M1", r: 74 }, { m: "M2", r: 80 }, { m: "M3", r: 69 }, { m: "M4", r: 82 }, { m: "M5", r: 75 },
    ],
    players: 22, played: 88, wins: 41, losses: 44,
  },
  {
    id: "RR", name: "Rajasthan Royals", captain: "Sanju Samson", coach: "Rahul Dravid",
    stadium: "Sawai Mansingh Stadium, Jaipur", titles: 1, color: "#254AA5", bg: "rgba(37,74,165,0.08)",
    border: "rgba(37,74,165,0.2)",
    batting: 83, bowling: 80, fielding: 81, nrr: 69, form: 73, experience: 82,
    form5: [
      { m: "M1", r: 76 }, { m: "M2", r: 71 }, { m: "M3", r: 84 }, { m: "M4", r: 67 }, { m: "M5", r: 78 },
    ],
    players: 22, played: 90, wins: 44, losses: 45,
  },
  {
    id: "LSG", name: "Lucknow Super Giants", captain: "Rishabh Pant", coach: "Justin Langer",
    stadium: "BRSABV Ekana Cricket Stadium, Lucknow", titles: 0, color: "#00B2E3", bg: "rgba(0,178,227,0.08)",
    border: "rgba(0,178,227,0.2)",
    batting: 79, bowling: 75, fielding: 78, nrr: 66, form: 70, experience: 70,
    form5: [
      { m: "M1", r: 70 }, { m: "M2", r: 73 }, { m: "M3", r: 66 }, { m: "M4", r: 78 }, { m: "M5", r: 69 },
    ],
    players: 22, played: 72, wins: 34, losses: 36,
  },
];

export function Teams() {
  const [selected, setSelected] = useState(TEAMS[0].id);
  const team = TEAMS.find(t => t.id === selected)!;

  const radarData = [
    { stat: "Batting", v: team.batting },
    { stat: "Bowling", v: team.bowling },
    { stat: "Fielding", v: team.fielding },
    { stat: "NRR", v: team.nrr },
    { stat: "Form", v: team.form },
    { stat: "Exp", v: team.experience },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            IPL <span className="text-gradient-blue">Teams</span>
          </h1>
          <p className="text-[#6b7db3] mt-3">Explore team analytics, strengths, and performance trends.</p>
        </motion.div>

        {/* Team selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {TEAMS.map(t => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                selected === t.id
                  ? "text-white"
                  : "glass border-white/[0.07] text-[#6b7db3] hover:text-white"
              }`}
              style={selected === t.id ? { background: t.bg, borderColor: t.border, color: t.color } : {}}
            >
              {t.id}
            </button>
          ))}
        </div>

        {/* Team detail */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {/* Team profile card */}
          <div className="glass rounded-2xl border p-6" style={{ borderColor: team.border }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4"
              style={{ background: team.bg, color: team.color, fontFamily: "'Rajdhani', sans-serif" }}>
              {team.id.slice(0, 2)}
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{team.name}</h2>
            <div className="flex items-center justify-center gap-1.5 mb-5">
              {Array.from({ length: team.titles }).map((_, i) => (
                <Trophy key={i} size={12} style={{ color: team.color }} />
              ))}
              <span className="text-xs font-mono text-[#6b7db3] ml-1">{team.titles} titles</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: User, label: "Captain", val: team.captain },
                { icon: Users, label: "Coach", val: team.coach },
                { icon: MapPin, label: "Stadium", val: team.stadium },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <Icon size={14} className="mt-0.5 shrink-0" style={{ color: team.color }} />
                  <div>
                    <p className="text-[10px] text-[#6b7db3] uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-white font-medium">{val}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Radar */}
          <div className="glass rounded-2xl border border-white/[0.07] p-6">
            <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.05rem" }}>
              Strength Index
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "#6b7db3", fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <Radar name={team.id} dataKey="v" stroke={team.color} fill={team.color} fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ background: "#0b1120", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontFamily: "JetBrains Mono", fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-2">
              {[
                { label: "Batting Index", val: team.batting },
                { label: "Bowling Index", val: team.bowling },
                { label: "Fielding Rating", val: team.fielding },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6b7db3]">{label}</span>
                    <span className="font-mono font-bold" style={{ color: team.color }}>{val}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1 }}
                      className="h-full rounded-full" style={{ background: team.color, opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form chart */}
          <div className="glass rounded-2xl border border-white/[0.07] p-6">
            <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.05rem" }}>
              Recent Form
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={team.form5} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                <defs>
                  <linearGradient id="formGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={team.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={team.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="m" tick={{ fill: "#6b7db3", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7db3", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: "#0b1120", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontFamily: "JetBrains Mono", fontSize: 11 }} />
                <Area type="monotone" dataKey="r" name="Form Index" stroke={team.color} fill="url(#formGrad)" strokeWidth={2} dot={{ fill: team.color, r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { label: "Avg Form Score", val: `${Math.round(team.form5.reduce((a, b) => a + b.r, 0) / 5)}` },
                { label: "Win Rate", val: `${Math.round(team.wins / (team.wins + team.losses) * 100)}%` },
              ].map(({ label, val }) => (
                <div key={label} className="glass rounded-xl p-3 text-center">
                  <p className="text-xl font-bold" style={{ color: team.color, fontFamily: "'Rajdhani', sans-serif" }}>{val}</p>
                  <p className="text-[9px] text-[#6b7db3] uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} style={{ color: team.color }} />
                <p className="text-xs text-white font-medium">Season Outlook</p>
              </div>
              <p className="text-xs text-[#6b7db3] mt-1 leading-relaxed">
                {team.form > 80 ? "Excellent form. Strong contender for playoffs." : team.form > 65 ? "Decent performances. Needs consistency to qualify." : "Inconsistent run. Major improvements needed."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}