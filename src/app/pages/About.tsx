import { motion } from "motion/react";
import { Brain, BarChart2, Shield, Zap, Github, Linkedin, Code2, Database, Cloud, Cpu } from "lucide-react";

const timeline = [
  { year: "2020", title: "Project Started", desc: "Initial concept born out of a passion for cricket data science and machine learning." },
  { year: "2021", title: "Beta Launch", desc: "First prediction model trained on 5 years of IPL data. 78% accuracy achieved." },
  { year: "2022", title: "ML v2 Engine", desc: "Rebuilt from scratch with ensemble models, increasing accuracy to 89%." },
  { year: "2023", title: "Weather Integration", desc: "Added real-time weather API integration for dew and pitch condition analysis." },
  { year: "2024", title: "Deep Learning", desc: "Neural network approach deployed. Accuracy surpassed 92%. 10,000+ users." },
  { year: "2025", title: "cricEDGE v3", desc: "Full platform launch with team analytics, player profiles, and live prediction engine." },
];

const techStack = [
  { name: "React 18", icon: Code2, color: "#61dafb", desc: "Frontend UI" },
  { name: "Python / FastAPI", icon: Cpu, color: "#3b82f6", desc: "ML Backend" },
  { name: "TensorFlow", icon: Brain, color: "#ff6f00", desc: "Deep Learning" },
  { name: "PostgreSQL", icon: Database, color: "#336791", desc: "Match Data" },
  { name: "OpenWeather API", icon: Cloud, color: "#06b6d4", desc: "Weather Data" },
  { name: "Vercel", icon: Zap, color: "#ffffff", desc: "Deployment" },
];

const features = [
  { icon: Brain, title: "Neural Prediction", desc: "Ensemble ML models combining gradient boosting and LSTM networks." },
  { icon: BarChart2, title: "200+ Variables", desc: "Form, head-to-head, venue, toss, weather, player availability and more." },
  { icon: Shield, title: "94.2% Accuracy", desc: "Validated on 3 complete IPL seasons of out-of-sample data." },
  { icon: Zap, title: "Real-time Updates", desc: "Squad changes, weather updates, and toss results all factored in live." },
];

export function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 uppercase tracking-widest mb-4">
            <Zap size={11} fill="currentColor" /> Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            About <span className="text-gradient-blue">cricEDGE</span>
          </h1>
          <p className="text-[#6b7db3] text-lg max-w-2xl mx-auto leading-relaxed">
            cricEDGE is a data-driven cricket analytics platform built to bring statistical insights to every IPL fan. We combine historical statistics, real-time conditions, and machine learning to deliver the most accurate match predictions available.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Our Mission",
              text: "To democratize cricket analytics by making data-driven insights accessible to every fan, analyst, and enthusiast — turning raw data into actionable predictions.",
              color: "#3b82f6",
            },
            {
              label: "Our Vision",
              text: "To become the world's most trusted cricket analytics platform, setting the benchmark for accuracy, transparency, and depth of statistical analysis in sports.",
              color: "#06b6d4",
            },
          ].map(({ label, text, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl border border-white/[0.07] p-8"
              style={{ boxShadow: `0 0 40px ${color}08` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                <Zap size={18} style={{ color }} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{label}</h3>
              <p className="text-[#6b7db3] leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12" style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Our <span className="text-gradient-blue">Journey</span>
          </motion.h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent hidden md:block" />
            <div className="space-y-8">
              {timeline.map(({ year, title, desc }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-4 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                    <div className="glass rounded-2xl border border-white/[0.07] p-5 inline-block w-full md:max-w-sm">
                      <p className="text-xs font-mono text-blue-400 mb-1 uppercase tracking-widest">{year}</p>
                      <h4 className="font-bold text-white mb-1.5" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.05rem" }}>{title}</h4>
                      <p className="text-sm text-[#6b7db3] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                  {/* Center dot */}
                  <div className="hidden md:flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-[#050816] ring-2 ring-blue-500/30" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-10" style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Technology <span className="text-gradient-blue">Stack</span>
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map(({ name, icon: Icon, color, desc }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl border border-white/[0.07] p-4 text-center card-hover"
              >
                <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{name}</p>
                <p className="text-[10px] text-[#6b7db3] mt-0.5">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl border border-white/[0.07] p-5 card-hover"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-blue-500/10">
                <Icon size={18} className="text-blue-400" />
              </div>
              <h4 className="font-bold text-white mb-1.5" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{title}</h4>
              <p className="text-sm text-[#6b7db3] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Developer section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass rounded-3xl border border-white/[0.07] p-10 text-center"
          style={{ boxShadow: "0 0 80px rgba(59,130,246,0.05)" }}
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}>AK</div>
          <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Arjun Kumar</h3>
          <p className="text-blue-400 text-sm font-medium mb-2">Full-Stack Developer & ML Engineer</p>
          <p className="text-[#6b7db3] text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Passionate about cricket and data science. Built cricEDGE as a final-year engineering project to demonstrate statistical modelling applications in sports analytics.
          </p>
          <div className="flex items-center justify-center gap-3">
            {[Github, Linkedin, Code2].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#6b7db3] hover:text-white hover:border-blue-500/30 transition-all">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
