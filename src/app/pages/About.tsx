import { motion } from "motion/react";
import {
  BarChart2,
  Shield,
  Zap,
  Github,
  Linkedin,
  Code2,
  Database,
  Cloud,
  Server,
  Braces,
  LockKeyhole,
  Trophy,
  MapPin,
  History,
  Users,
} from "lucide-react";

const timeline = [
  {
    year: "2025",
    title: "Project Planning",
    desc: "CricEDGE was conceptualized as a modern IPL analytics platform focused on match insights, historical data, and prediction features.",
  },
  {
    year: "2026",
    title: "Full-Stack Development",
    desc: "The frontend was developed using React and TypeScript, while Node.js and Express.js were used to build the backend APIs.",
  },
  {
    year: "2026",
    title: "IPL Data Integration",
    desc: "Historical IPL match data was cleaned, structured, imported into MongoDB, and connected with the analytics dashboard.",
  },
  {
    year: "2026",
    title: "Prediction Engine",
    desc: "A data-driven match prediction system was created using recent form, head-to-head records, venue performance, toss, and weather conditions.",
  },
  {
    year: "2026",
    title: "Authentication & Profiles",
    desc: "Secure JWT authentication, Google OAuth, user profiles, favourite teams, and prediction history were added to the platform.",
  },
  {
    year: "2026",
    title: "CricEDGE Launch",
    desc: "The complete platform was deployed using Vercel, Render, and MongoDB Atlas for public access.",
  },
];

const techStack = [
  {
    name: "React",
    icon: Code2,
    color: "#61dafb",
    desc: "Frontend UI",
  },
  {
    name: "TypeScript",
    icon: Braces,
    color: "#3178c6",
    desc: "Type Safety",
  },
  {
    name: "Node.js",
    icon: Server,
    color: "#68a063",
    desc: "Backend Runtime",
  },
  {
    name: "Express.js",
    icon: Zap,
    color: "#ffffff",
    desc: "REST APIs",
  },
  {
    name: "MongoDB",
    icon: Database,
    color: "#47a248",
    desc: "Database",
  },
  {
    name: "Open-Meteo",
    icon: Cloud,
    color: "#06b6d4",
    desc: "Live Weather",
  },
];

const features = [
  {
    icon: Trophy,
    title: "Match Prediction",
    desc: "Data-driven IPL match predictions using team form, venue records, toss, weather, and head-to-head statistics.",
  },
  {
    icon: BarChart2,
    title: "Team Analytics",
    desc: "Explore team performance, win percentages, recent form, season trends, and historical IPL records.",
  },
  {
    icon: MapPin,
    title: "Venue Insights",
    desc: "Analyze venue-specific performance, match history, scoring patterns, and conditions affecting match outcomes.",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    desc: "JWT authentication, protected routes, Google OAuth login, secure profiles, and private prediction history.",
  },
];

const platformStats = [
  {
    value: "7",
    label: "IPL Seasons",
    icon: History,
  },
  {
    value: "400+",
    label: "Matches",
    icon: Trophy,
  },
  {
    value: "11",
    label: "Teams",
    icon: Users,
  },
  {
    value: "20+",
    label: "Venues",
    icon: MapPin,
  },
];

export function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 uppercase tracking-widest mb-4">
            <Zap size={11} fill="currentColor" />
            Our Story
          </span>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-5"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            About <span className="text-gradient-blue">CricEDGE</span>
          </h1>

          <p className="text-[#6b7db3] text-lg max-w-3xl mx-auto leading-relaxed">
            CricEDGE is a full-stack IPL analytics and match prediction
            platform built to transform historical cricket data into useful,
            accessible, and interactive insights. It combines team statistics,
            recent form, venue records, head-to-head analysis, live weather,
            and secure user features in one modern dashboard.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Our Mission",
              text: "To make IPL analytics simple, interactive, and accessible by converting historical match data into meaningful insights for cricket fans, students, and data enthusiasts.",
              color: "#3b82f6",
            },
            {
              label: "Our Vision",
              text: "To build a trusted cricket intelligence platform where users can explore teams, compare performances, study venues, and make informed match predictions through data.",
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
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}15` }}
              >
                <Zap size={18} style={{ color }} fill="currentColor" />
              </div>

              <h3
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                {label}
              </h3>

              <p className="text-[#6b7db3] leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* Platform Stats */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-10"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Platform <span className="text-gradient-blue">Coverage</span>
          </motion.h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {platformStats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl border border-white/[0.07] p-6 text-center card-hover"
              >
                <div className="w-11 h-11 mx-auto rounded-xl flex items-center justify-center mb-3 bg-blue-500/10">
                  <Icon size={20} className="text-blue-400" />
                </div>

                <p
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {value}
                </p>

                <p className="text-sm text-[#6b7db3] mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Our <span className="text-gradient-blue">Journey</span>
          </motion.h2>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent hidden md:block" />

            <div className="space-y-8">
              {timeline.map(({ year, title, desc }, i) => (
                <motion.div
                  key={`${year}-${title}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-4 ${
                    i % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-1 ${
                      i % 2 === 0 ? "md:text-right" : ""
                    }`}
                  >
                    <div className="glass rounded-2xl border border-white/[0.07] p-5 inline-block w-full md:max-w-sm">
                      <p className="text-xs font-mono text-blue-400 mb-1 uppercase tracking-widest">
                        {year}
                      </p>

                      <h4
                        className="font-bold text-white mb-1.5"
                        style={{
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: "1.05rem",
                        }}
                      >
                        {title}
                      </h4>

                      <p className="text-sm text-[#6b7db3] leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>

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
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-10"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
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
                <div
                  className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>

                <p
                  className="text-sm font-semibold text-white"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {name}
                </p>

                <p className="text-[10px] text-[#6b7db3] mt-0.5">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-10"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Core <span className="text-gradient-blue">Capabilities</span>
          </motion.h2>

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

                <h4
                  className="font-bold text-white mb-1.5"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {title}
                </h4>

                <p className="text-sm text-[#6b7db3] leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl border border-white/[0.07] p-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: BarChart2,
                title: "Head-to-Head",
                text: "Compare historical records between any two IPL teams.",
              },
              {
                icon: Zap,
                title: "Live Weather",
                text: "Use current weather conditions during match analysis.",
              },
              {
                icon: History,
                title: "Prediction History",
                text: "Review previously generated match predictions securely.",
              },
              {
                icon: LockKeyhole,
                title: "User Authentication",
                text: "Login using email credentials or Google OAuth.",
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-3"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Icon size={18} className="text-blue-400" />
                </div>

                <div>
                  <h4
                    className="font-bold text-white mb-1"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    {title}
                  </h4>

                  <p className="text-sm text-[#6b7db3] leading-relaxed">
                    {text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Developer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl border border-white/[0.07] p-10 text-center"
          style={{ boxShadow: "0 0 80px rgba(59,130,246,0.05)" }}
        >
          <div
            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            AD
          </div>

          <h3
            className="text-2xl font-bold text-white mb-1"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Ayush Dixit
          </h3>

          <p className="text-blue-400 text-sm font-medium mb-2">
            Full-Stack MERN Developer
          </p>

          <p className="text-[#6b7db3] text-sm max-w-xl mx-auto mb-6 leading-relaxed">
            Developer of CricEDGE, a full-stack IPL analytics and prediction
            platform built using React, TypeScript, Node.js, Express.js, and
            MongoDB. The project demonstrates frontend development, REST API
            integration, authentication, database management, deployment, and
            sports data analytics.
          </p>

          <div className="flex items-center justify-center gap-3">
            <a
              href="https://github.com/dixitayush450-alt"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#6b7db3] hover:text-white hover:border-blue-500/30 transition-all"
            >
              <Github size={16} />
            </a>

            <a
              href="#"
              aria-label="LinkedIn Profile"
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#6b7db3] hover:text-white hover:border-blue-500/30 transition-all"
            >
              <Linkedin size={16} />
            </a>

            <a
              href="https://github.com/dixitayush450-alt/cricEdge"
              target="_blank"
              rel="noreferrer"
              aria-label="CricEDGE Source Code"
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#6b7db3] hover:text-white hover:border-blue-500/30 transition-all"
            >
              <Code2 size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}