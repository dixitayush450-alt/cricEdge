import { motion } from "motion/react";
import {
  FileText,
  Shield,
  Scale,
  AlertTriangle,
  Trophy,
  Gavel,
} from "lucide-react";

const terms = [
  {
    icon: Trophy,
    title: "Educational Purpose",
    text: "CricEDGE is developed as an educational and portfolio project for IPL analytics and match prediction.",
  },
  {
    icon: AlertTriangle,
    title: "Prediction Disclaimer",
    text: "Match predictions are generated using historical statistics, team form, venue records, toss and weather data. Predictions are not guaranteed.",
  },
  {
    icon: Shield,
    title: "User Responsibilities",
    text: "Users are responsible for maintaining the security of their accounts and using the platform responsibly.",
  },
  {
    icon: Scale,
    title: "Fair Usage",
    text: "Users must not misuse, copy, attack, or attempt unauthorized access to CricEDGE or its APIs.",
  },
  {
    icon: Gavel,
    title: "Intellectual Property",
    text: "The CricEDGE source code, UI design, branding, and original implementation belong to the project developer unless otherwise stated.",
  },
];

export function Terms() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <FileText size={26} className="text-blue-400" />
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Terms of <span className="text-gradient-blue">Service</span>
          </h1>

          <p className="text-[#6b7db3] max-w-2xl mx-auto">
            By using CricEDGE, you agree to the following terms and conditions.
          </p>
        </motion.div>

        <div className="space-y-5">
          {terms.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="glass rounded-2xl border border-white/[0.07] p-6"
            >
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Icon size={20} className="text-blue-400" />
                </div>

                <div>
                  <h2
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    {title}
                  </h2>

                  <p className="text-[#6b7db3] text-sm leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}