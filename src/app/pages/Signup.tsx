import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Github,
  Chrome,
  Check,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type AvatarType = "avatar1" | "avatar2" | "avatar3";

const avatars: Array<{
  id: AvatarType;
  emoji: string;
  label: string;
}> = [
  {
    id: "avatar1",
    emoji: "🏏",
    label: "Batsman",
  },
  {
    id: "avatar2",
    emoji: "⚡",
    label: "Power",
  },
  {
    id: "avatar3",
    emoji: "🏆",
    label: "Champion",
  },
];

function LogoInline() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="30" viewBox="0 0 30 32" fill="none">
        <defs>
          <linearGradient
            id="sG3"
            x1="0"
            y1="0"
            x2="30"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <radialGradient id="bG3" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#c0392b" />
            <stop offset="55%" stopColor="#7b241c" />
            <stop offset="100%" stopColor="#2c0f0a" />
          </radialGradient>
        </defs>

        <path
          d="M15 1 L28 6 L28 18 Q28 27 15 31 Q2 27 2 18 L2 6 Z"
          fill="url(#sG3)"
          opacity="0.15"
        />

        <path
          d="M15 1 L28 6 L28 18 Q28 27 15 31 Q2 27 2 18 L2 6 Z"
          fill="none"
          stroke="url(#sG3)"
          strokeWidth="1.2"
          opacity="0.7"
        />

        <circle cx="15" cy="16" r="8.5" fill="url(#bG3)" />

        <ellipse
          cx="12.5"
          cy="13"
          rx="3"
          ry="2"
          fill="rgba(255,180,160,0.35)"
          style={{ filter: "blur(1.5px)" }}
        />

        <path
          d="M7.5 16 C9 12.5, 12 19.5, 15 16 C18 12.5, 21 19.5, 22.5 16"
          fill="none"
          stroke="rgba(255,220,200,0.7)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        <path
          d="M7.5 16 C9 19.5, 12 12.5, 15 16 C18 19.5, 21 12.5, 22.5 16"
          fill="none"
          stroke="rgba(255,220,200,0.7)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>

      <svg width="102" height="22" viewBox="0 0 102 22" fill="none">
        <defs>
          <linearGradient
            id="eG3"
            x1="0"
            y1="0"
            x2="102"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        <text
          x="0"
          y="17"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="600"
          fontSize="18"
          fill="white"
          letterSpacing="0.5"
          opacity="0.92"
        >
          cric
        </text>

        <text
          x="37"
          y="17"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="700"
          fontSize="19"
          fill="url(#eG3)"
          letterSpacing="1.2"
        >
          EDGE
        </text>
      </svg>
    </div>
  );
}

const benefits = [
  "Statistical match predictions",
  "Advanced team & player analytics",
  "Historical data access (2020–2026)",
  "Weather-adjusted forecasts",
];

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState<AvatarType>("avatar1");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!agreed || loading) {
      return;
    }

    if (password !== confirmPassword) {
      window.alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup({
        name,
        email,
        password,
        avatar,
      });

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create account";

      window.alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (
    provider: "github" | "google"
  ) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          }}
        />

        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="hidden lg:block"
        >
          <div className="mb-8">
            <LogoInline />
          </div>

          <h2
            className="text-4xl font-bold text-white mb-4 leading-tight"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            Start predicting
            <br />

            <span className="text-gradient-blue">
              smarter today.
            </span>
          </h2>

          <p className="text-[#6b7db3] leading-relaxed mb-8">
            Join cricket enthusiasts using data-driven insights to
            predict IPL outcomes with advanced analytics.
          </p>

          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.1 + index * 0.07,
                }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-blue-400" />
                </div>

                <span className="text-sm text-[#6b7db3]">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 glass rounded-2xl border border-white/[0.07] p-5">
            <p className="text-sm text-[#6b7db3] italic leading-relaxed mb-3">
              "CricEDGE provides useful cricket analytics and
              data-driven match insights in one place."
            </p>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                CE
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  CricEDGE User
                </p>

                <p className="text-[10px] text-[#6b7db3]">
                  Cricket Enthusiast
                </p>
              </div>

              <div className="ml-auto flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="text-amber-400 text-xs"
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="text-center lg:text-left mb-6">
            <h1
              className="text-3xl font-bold text-white"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              Create account
            </h1>

            <p className="text-[#6b7db3] mt-1">
              Free forever. No credit card required.
            </p>
          </div>

          <div
            className="glass rounded-3xl border border-white/[0.07] p-7"
            style={{
              boxShadow:
                "0 0 80px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass border border-white/[0.08] text-sm text-[#6b7db3] hover:text-white hover:border-white/20 transition-all font-medium"
              >
                <Github size={15} />
                GitHub
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass border border-white/[0.08] text-sm text-[#6b7db3] hover:text-white hover:border-white/20 transition-all font-medium"
              >
                <Chrome size={15} />
                Google
              </button>
            </div>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>

              <div className="relative flex justify-center text-xs text-[#6b7db3]">
                <span className="px-3">
                  or sign up with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-3">
                  Choose Avatar
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {avatars.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAvatar(item.id)}
                      className={`relative h-20 rounded-xl border transition-all ${
                        avatar === item.id
                          ? "border-blue-500 bg-blue-500/15 scale-[1.03]"
                          : "border-white/[0.08] glass hover:border-white/20"
                      }`}
                    >
                      {avatar === item.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}

                      <div className="text-2xl">
                        {item.emoji}
                      </div>

                      <div className="text-[10px] text-[#6b7db3] mt-1">
                        {item.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Arjun Kumar"
                    className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
                  />

                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Min. 8 characters"
                    className="input-field w-full rounded-xl pl-10 pr-10 py-3 text-sm"
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPwd((current) => !current)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3] hover:text-white transition-colors"
                    aria-label={
                      showPwd ? "Hide password" : "Show password"
                    }
                  >
                    {showPwd ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
                  />

                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Repeat password"
                    className="input-field w-full rounded-xl pl-10 pr-10 py-3 text-sm"
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm((current) => !current)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3] hover:text-white transition-colors"
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirm ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setAgreed((current) => !current)
                  }
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    agreed
                      ? "bg-blue-500 border-blue-500"
                      : "border-white/20 hover:border-white/40"
                  }`}
                  aria-label="Accept terms and privacy policy"
                >
                  {agreed && (
                    <Check size={11} className="text-white" />
                  )}
                </button>

                <p className="text-sm text-[#6b7db3]">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Terms of Service
                  </a>
                  {" and "}
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full btn-primary py-3.5 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Create Free Account"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[#6b7db3] mt-5">
              Already have an account?{" "}

              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}