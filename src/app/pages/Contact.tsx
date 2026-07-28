import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Code2 } from "lucide-react";

export function Contact() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Contact <span className="text-gradient-blue">Developer</span>
          </h1>

          <p className="text-[#6b7db3]">
            Feel free to connect regarding CricEDGE, development, or collaboration.
          </p>
        </motion.div>

        <div className="glass rounded-3xl border border-white/[0.07] p-10 text-center">
          <div
            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-3xl font-bold text-white mb-5"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            AD
          </div>

          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Ayush Dixit
          </h2>

          <p className="text-blue-400 mt-2">Full Stack MERN Developer</p>

          <div className="space-y-4 mt-8">
            <a
              href="mailto:dixitayush450@gmail.com"
              className="flex justify-center items-center gap-3 text-[#6b7db3] hover:text-white transition-colors"
            >
              <Mail size={20} />
              dixitayush450@gmail.com
            </a>

            <a
              href="https://github.com/dixitayush450-alt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center gap-3 text-[#6b7db3] hover:text-white transition-colors"
            >
              <Github size={20} />
              GitHub Profile
            </a>

            <a
              href="https://www.linkedin.com/in/ayush-dixit-5b9b95367/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center gap-3 text-[#6b7db3] hover:text-white transition-colors"
            >
              <Linkedin size={20} />
              LinkedIn Profile
            </a>

            <a
              href="https://github.com/dixitayush450-alt/cricEdge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center gap-3 text-[#6b7db3] hover:text-white transition-colors"
            >
              <Code2 size={20} />
              CricEDGE Repository
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}