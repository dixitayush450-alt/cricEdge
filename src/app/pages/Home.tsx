import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Brain, BarChart2, Users, History, Cloud, Swords,
  ArrowRight, Zap, TrendingUp, Shield, Star, ChevronRight,
  Activity,
} from "lucide-react";

// ── Star field ──────────────────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    dur: `${Math.random() * 4 + 2}s`,
    delay: `${Math.random() * 4}s`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            "--dur": s.dur,
            "--delay": s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ── Cricket Ball Hero ────────────────────────────────────────────────────────
function CricketBallHero() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 420, height: 420 }}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full animate-pulse-glow"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />

      {/* Orbit rings */}
      <div
        className="absolute animate-orbit-ring-1"
        style={{
          width: 380, height: 380,
          borderRadius: "50%",
          border: "1px solid rgba(6,182,212,0.25)",
          boxShadow: "0 0 20px rgba(6,182,212,0.08)",
        }}
      />
      <div
        className="absolute animate-orbit-ring-2"
        style={{
          width: 320, height: 320,
          borderRadius: "50%",
          border: "1.5px solid rgba(59,130,246,0.3)",
          boxShadow: "0 0 24px rgba(59,130,246,0.1)",
        }}
      />
      <div
        className="absolute animate-orbit-ring-3"
        style={{
          width: 270, height: 270,
          borderRadius: "50%",
          border: "1px solid rgba(245,158,11,0.2)",
          boxShadow: "0 0 16px rgba(245,158,11,0.06)",
        }}
      />

      {/* Cricket ball */}
      <div className="relative animate-float-hero" style={{ zIndex: 10 }}>
        <svg
          width="180" height="180"
          viewBox="0 0 180 180"
          style={{
            filter: "drop-shadow(0 0 40px rgba(160,20,20,0.55)) drop-shadow(0 0 80px rgba(59,130,246,0.18)) drop-shadow(0 24px 32px rgba(0,0,0,0.7))",
            overflow: "visible",
          }}
        >
          <defs>
            {/* Main leather gradient — deep red with light source top-left */}
            <radialGradient id="ballMain" cx="38%" cy="32%" r="65%">
              <stop offset="0%"   stopColor="#C0392B" />
              <stop offset="18%"  stopColor="#A93226" />
              <stop offset="45%"  stopColor="#7B241C" />
              <stop offset="72%"  stopColor="#512015" />
              <stop offset="100%" stopColor="#2C0F0A" />
            </radialGradient>
            {/* Specular bloom — top-left */}
            <radialGradient id="specular1" cx="30%" cy="26%" r="30%">
              <stop offset="0%"  stopColor="rgba(255,200,180,0.38)" />
              <stop offset="60%" stopColor="rgba(255,150,130,0.10)" />
              <stop offset="100%" stopColor="rgba(255,0,0,0)" />
            </radialGradient>
            {/* Rim light — bottom-right edge */}
            <radialGradient id="rimLight" cx="72%" cy="76%" r="38%">
              <stop offset="0%"  stopColor="rgba(255,80,60,0.22)" />
              <stop offset="100%" stopColor="rgba(255,0,0,0)" />
            </radialGradient>
            {/* Leather texture noise — baked in SVG filter */}
            <filter id="leatherTex" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
              <feBlend in="SourceGraphic" in2="grey" mode="multiply" result="blend" />
              <feComposite in="blend" in2="SourceGraphic" operator="in" />
            </filter>
            {/* Seam stroke gradient */}
            <linearGradient id="seamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(255,230,210,0.05)" />
              <stop offset="20%"  stopColor="rgba(255,220,200,0.45)" />
              <stop offset="50%"  stopColor="rgba(255,235,215,0.60)" />
              <stop offset="80%"  stopColor="rgba(255,220,200,0.45)" />
              <stop offset="100%" stopColor="rgba(255,230,210,0.05)" />
            </linearGradient>
            {/* Clip to circle */}
            <clipPath id="ballClip">
              <circle cx="90" cy="90" r="88" />
            </clipPath>
          </defs>

          {/* ── Base sphere ── */}
          <circle cx="90" cy="90" r="88" fill="url(#ballMain)" />

          {/* ── Leather texture overlay ── */}
          <circle cx="90" cy="90" r="88" fill="url(#ballMain)" filter="url(#leatherTex)" opacity="0.18" clipPath="url(#ballClip)" />

          {/* ── Diffuse shading — dark bottom-right ── */}
          <circle cx="90" cy="90" r="88" fill="rgba(0,0,0,0)" clipPath="url(#ballClip)">
            <animate attributeName="fill" values="rgba(0,0,0,0)" dur="0s" />
          </circle>
          <ellipse cx="116" cy="112" rx="70" ry="66" fill="rgba(0,0,0,0.28)" clipPath="url(#ballClip)" />

          {/* ── Specular highlight — sharp top-left ── */}
          <ellipse cx="58" cy="50" rx="26" ry="18" fill="url(#specular1)" clipPath="url(#ballClip)" />
          {/* Tiny bright hotspot */}
          <ellipse cx="52" cy="44" rx="9" ry="6" fill="rgba(255,220,205,0.55)" clipPath="url(#ballClip)" style={{ filter: "blur(3px)" }} />

          {/* ── Rim light ── */}
          <circle cx="90" cy="90" r="88" fill="url(#rimLight)" clipPath="url(#ballClip)" />

          {/* ══ SEAMS ══
              Real cricket ball has two perpendicular seam circles.
              We render the one facing the viewer as two arcs (top+bottom half).
          */}
          <g clipPath="url(#ballClip)">
            {/* Primary seam — S-curve across the equator */}
            <path
              d="M 10 90 C 30 42, 60 138, 90 90 C 120 42, 150 138, 170 90"
              fill="none"
              stroke="url(#seamGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Mirror seam below equator */}
            <path
              d="M 10 90 C 30 138, 60 42, 90 90 C 120 138, 150 42, 170 90"
              fill="none"
              stroke="url(#seamGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* ── Seam stitches — top arc ── */}
            {(() => {
              const stitches: React.ReactNode[] = [];
              for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                const px = 10 + t * 160;
                const py = (1 - t) * (1 - t) * 90 + 2 * t * (1 - t) * (t < 0.5 ? 42 : 138) + t * t * 90;
                const angle = Math.atan2(
                  (t < 0.5 ? (42 - 90) * 2 * (1 - 2 * t) : (138 - 90) * 2 * (1 - 2 * t)),
                  160 / 20
                ) * (180 / Math.PI) + 90;
                stitches.push(
                  <line
                    key={`st-${i}`}
                    x1={px - 4 * Math.cos((angle + 90) * Math.PI / 180)}
                    y1={py - 4 * Math.sin((angle + 90) * Math.PI / 180)}
                    x2={px + 4 * Math.cos((angle + 90) * Math.PI / 180)}
                    y2={py + 4 * Math.sin((angle + 90) * Math.PI / 180)}
                    stroke="rgba(255,215,195,0.55)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                );
              }
              return stitches;
            })()}

            {/* ── Seam stitches — bottom arc ── */}
            {(() => {
              const stitches: React.ReactNode[] = [];
              for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                const px = 10 + t * 160;
                const py = (1 - t) * (1 - t) * 90 + 2 * t * (1 - t) * (t < 0.5 ? 138 : 42) + t * t * 90;
                const angle = Math.atan2(
                  (t < 0.5 ? (138 - 90) * 2 * (1 - 2 * t) : (42 - 90) * 2 * (1 - 2 * t)),
                  160 / 20
                ) * (180 / Math.PI) + 90;
                stitches.push(
                  <line
                    key={`sb-${i}`}
                    x1={px - 4 * Math.cos((angle + 90) * Math.PI / 180)}
                    y1={py - 4 * Math.sin((angle + 90) * Math.PI / 180)}
                    x2={px + 4 * Math.cos((angle + 90) * Math.PI / 180)}
                    y2={py + 4 * Math.sin((angle + 90) * Math.PI / 180)}
                    stroke="rgba(255,215,195,0.55)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                );
              }
              return stitches;
            })()}
          </g>

          {/* ── Edge highlight — thin bright ring ── */}
          <circle cx="90" cy="90" r="88" fill="none" stroke="rgba(255,100,80,0.18)" strokeWidth="1.5" />
          {/* Top-left arc highlight */}
          <path d="M 20 55 A 88 88 0 0 1 55 20" fill="none" stroke="rgba(255,180,160,0.35)" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Ball glow base — ground reflection */}
        <div style={{
          position: "absolute",
          bottom: -28, left: "50%",
          transform: "translateX(-50%)",
          width: 150, height: 36,
          background: "radial-gradient(ellipse, rgba(180,30,30,0.4) 0%, rgba(59,130,246,0.15) 50%, transparent 100%)",
          filter: "blur(14px)",
        }} />
      </div>

      {/* Floating stat badges */}
      <FloatingBadge style={{ top: "8%", right: "4%" }} delay="0.2s" icon="⚡">
        <span className="font-mono text-xs font-bold text-cyan-400">94.2%</span>
        <span className="text-[10px] text-[#6b7db3]">Accuracy</span>
      </FloatingBadge>
      <FloatingBadge style={{ bottom: "18%", left: "0%" }} delay="0.5s" icon="🏆">
        <span className="font-mono text-xs font-bold text-amber-400">IPL 2026</span>
        <span className="text-[10px] text-[#6b7db3]">Season</span>
      </FloatingBadge>
      <FloatingBadge style={{ top: "32%", left: "-4%" }} delay="0.8s" icon="📊">
        <span className="font-mono text-xs font-bold text-blue-400">100K+</span>
        <span className="text-[10px] text-[#6b7db3]">Data Points</span>
      </FloatingBadge>
    </div>
  );
}

function FloatingBadge({ children, style, delay, icon }: {
  children: React.ReactNode; style: React.CSSProperties; delay: string; icon: string;
}) {
  return (
    <div
      className="absolute glass rounded-2xl px-3 py-2 flex items-center gap-2 animate-float-hero"
      style={{ ...style, animationDelay: delay, animationDuration: `${5 + parseFloat(delay) * 2}s` }}
    >
      <span className="text-base">{icon}</span>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

// ── Feature cards ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "Match Prediction",
    desc: "Prediction models trained on 7 seasons of IPL data to estimate match outcomes with analytical confidence.",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.12)",
  },
  {
    icon: Swords,
    title: "Team Comparison",
    desc: "Side-by-side team strength analysis — batting, bowling, fielding, and current form index.",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.12)",
  },
  {
    icon: Users,
    title: "Player Analytics",
    desc: "Deep-dive into individual performance metrics, consistency scores, and match-up analysis.",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.12)",
  },
  {
    icon: History,
    title: "Historical Statistics",
    desc: "7 seasons of IPL records — head-to-head results, venue trends, and seasonal patterns.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.12)",
  },
  {
    icon: Cloud,
    title: "Weather Analysis",
    desc: "Real-time weather integration. See how temperature, humidity, and dew factor affect predictions.",
    color: "#10b981",
    glow: "rgba(16,185,129,0.12)",
  },
  {
    icon: BarChart2,
    title: "Head-to-Head Insights",
    desc: "Granular rivalry analysis with venue-specific win rates and key player match-up breakdowns.",
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.12)",
  },
];

// ── Stats row ────────────────────────────────────────────────────────────────
const stats = [
  { label: "Predictions Made", value: "5,000+", icon: Activity },
  { label: "Accuracy Rate", value: "94.2%", icon: TrendingUp },
  { label: "IPL Data", value: "7 Seasons", icon: History },
  { label: "Active Users", value: "500+", icon: Users },
];

// ── Home ─────────────────────────────────────────────────────────────────────
export function Home() {
  return (
    <div className="relative overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)" }} />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)" }} />
        </div>

        <StarField />

        {/* Horizontal glow line */}
        <div className="absolute top-1/2 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.15), transparent)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center py-16 lg:py-0">
            {/* Left: text */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 border border-blue-500/20"
              >
                <Zap size={12} className="text-blue-400" />
                <span className="text-xs font-medium text-blue-400 tracking-wider uppercase">Cricket Analytics · IPL 2026</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display font-bold leading-none mb-6"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "clamp(2.8rem, 6vw, 4.5rem)", lineHeight: 1.05 }}
              >
                <span className="text-white">Predict Smarter.</span>
                <br />
                <span className="text-gradient-blue">Analyze Deeper.</span>
                <br />
                <span className="text-white">Win with </span>
                <span className="text-gradient-gold">Data.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[#6b7db3] text-lg leading-relaxed mb-8 max-w-lg"
              >
                Data-driven cricket analytics platform that predicts IPL matches using historical performance, team strength, weather conditions, and advanced statistical models.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <Link to="/prediction" className="btn-primary flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl text-sm">
                  <Zap size={15} fill="currentColor" />
                  Start Prediction
                </Link>
                <Link to="/analytics" className="flex items-center gap-2 px-6 py-3 text-[#6b7db3] hover:text-white font-medium rounded-xl text-sm glass border border-white/10 hover:border-white/20 transition-all">
                  Explore Analytics
                  <ChevronRight size={15} />
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center gap-5 mt-10"
              >
                {[
                  { icon: Shield, text: "94.2% Accuracy" },
                  { icon: Star, text: "4.6 / 5 Rating" },
                  { icon: Zap, text: "CSV-backed Data" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs text-[#6b7db3]">
                    <Icon size={13} className="text-blue-400" />
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Cricket Ball */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <CricketBallHero />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-y border-white/[0.06]" style={{ background: "rgba(11,17,32,0.6)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl glass flex items-center justify-center">
                  <Icon size={18} className="text-blue-400" />
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{value}</p>
                <p className="text-xs text-[#6b7db3] uppercase tracking-widest">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-blue-500/50" />
              Platform Features
              <span className="w-8 h-px bg-blue-500/50" />
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Everything you need to{" "}
              <span className="text-gradient-blue">predict with confidence</span>
            </h2>
            <p className="text-[#6b7db3] text-lg max-w-2xl mx-auto">
              Six powerful analytical modules, all driven by machine learning and updated in real time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color, glow }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass card-hover rounded-2xl p-6 group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: glow }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-semibold text-white mb-2" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.1rem" }}>{title}</h3>
                <p className="text-sm text-[#6b7db3] leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>
                  Explore <ChevronRight size={13} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20" style={{ background: "rgba(11,17,32,0.5)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              How <span className="text-gradient-blue">cricEDGE</span> Works
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="absolute top-10 left-1/3 right-1/3 h-px hidden md:block"
              style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.3), rgba(6,182,212,0.3))" }} />
            {[
              { step: "01", title: "Select Teams", desc: "Choose two IPL teams, toss winner, venue, and match conditions.", icon: Users },
              { step: "02", title: "Statistical Analysis", desc: "Our models process 200+ variables — form, head-to-head, weather, player availability.", icon: Brain },
              { step: "03", title: "Get Predictions", desc: "Receive win probability, confidence score, and detailed analytical breakdown.", icon: TrendingUp },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl glass border border-blue-500/20 flex items-center justify-center relative">
                  <Icon size={24} className="text-blue-400" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-500 text-white text-[9px] font-mono font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{title}</h3>
                <p className="text-sm text-[#6b7db3] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)"
          }} />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="glass rounded-3xl p-10 md:p-14 border border-blue-500/15"
              style={{ boxShadow: "0 0 80px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
              <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 uppercase tracking-widest mb-4">
                <Zap size={11} fill="currentColor" />
                Free to start
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Ready to gain the <span className="text-gradient-blue">edge</span>?
              </h2>
              <p className="text-[#6b7db3] text-lg mb-8">
                Join 500+ cricket enthusiasts using data-driven insights to predict smarter.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup" className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl text-sm">
                  Create Free Account
                  <ArrowRight size={16} />
                </Link>
                <Link to="/prediction" className="flex items-center justify-center gap-2 px-8 py-3.5 text-[#6b7db3] hover:text-white font-medium rounded-xl text-sm glass border border-white/10 hover:border-white/20 transition-all">
                  Try a Prediction
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}