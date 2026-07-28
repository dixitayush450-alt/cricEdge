import { motion } from "motion/react";
import {
  ShieldCheck,
  Database,
  LockKeyhole,
  UserCheck,
  Cloud,
  Mail,
} from "lucide-react";

const privacySections = [
  {
    icon: Database,
    title: "Information We Collect",
    text: "CricEDGE may collect basic account information such as your name, email address, favourite team, profile image, and prediction history when you use the platform.",
  },
  {
    icon: LockKeyhole,
    title: "Authentication Data",
    text: "Passwords are stored securely using encryption. Google OAuth information is used only to authenticate users and provide account access.",
  },
  {
    icon: UserCheck,
    title: "How We Use Your Data",
    text: "Your information is used to manage your account, personalize your profile, save prediction history, and improve the overall platform experience.",
  },
  {
    icon: ShieldCheck,
    title: "Data Protection",
    text: "Protected routes, JWT authentication, secure API handling, and database-level controls are used to protect user information from unauthorized access.",
  },
  {
    icon: Cloud,
    title: "Third-Party Services",
    text: "CricEDGE uses services such as Google OAuth, MongoDB Atlas, Vercel, Render, and Open-Meteo. These services may process limited data required for their functionality.",
  },
  {
    icon: Mail,
    title: "Contact",
    text: "For any privacy-related question or account concern, users can contact the developer through the Contact page or GitHub profile.",
  },
];

export function Privacy() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <ShieldCheck size={26} className="text-blue-400" />
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Privacy <span className="text-gradient-blue">Policy</span>
          </h1>

          <p className="text-[#6b7db3] max-w-2xl mx-auto leading-relaxed">
            This Privacy Policy explains how CricEDGE collects, uses, and
            protects information when users access the platform.
          </p>

          <p className="text-sm text-blue-400 mt-3">
            Last updated: July 2026
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {privacySections.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="glass rounded-2xl border border-white/[0.07] p-6 card-hover"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-blue-400" />
              </div>

              <h2
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                {title}
              </h2>

              <p className="text-sm text-[#6b7db3] leading-relaxed">
                {text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl border border-white/[0.07] p-7 mt-6"
        >
          <h2
            className="text-xl font-bold text-white mb-3"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Important Notice
          </h2>

          <p className="text-sm text-[#6b7db3] leading-relaxed">
            CricEDGE does not sell personal information. The platform is
            developed for educational, analytical, and portfolio purposes.
            Users should avoid sharing sensitive personal information through
            the application.
          </p>
        </motion.div>
      </div>
    </div>
  );
}