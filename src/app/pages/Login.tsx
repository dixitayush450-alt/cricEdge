import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail, Lock, Github, Chrome } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function LogoInline() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="30" viewBox="0 0 30 32" fill="none">
        <defs>
          <linearGradient
            id="sG2"
            x1="0"
            y1="0"
            x2="30"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <radialGradient id="bG2" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#c0392b" />
            <stop offset="55%" stopColor="#7b241c" />
            <stop offset="100%" stopColor="#2c0f0a" />
          </radialGradient>
        </defs>

        <path
          d="M15 1 L28 6 L28 18 Q28 27 15 31 Q2 27 2 18 L2 6 Z"
          fill="url(#sG2)"
          opacity="0.15"
        />

        <path
          d="M15 1 L28 6 L28 18 Q28 27 15 31 Q2 27 2 18 L2 6 Z"
          fill="none"
          stroke="url(#sG2)"
          strokeWidth="1.2"
          opacity="0.7"
        />

        <circle cx="15" cy="16" r="8.5" fill="url(#bG2)" />

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
            id="eG2"
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
          fill="url(#eG2)"
          letterSpacing="1.2"
        >
          EDGE
        </text>
      </svg>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      await login({
        email,
        password,
        remember,
      });

      const redirectTo =
        (location.state as { from?: string } | null)?.from || "/";

      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in";

      window.alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: "github" | "google") => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 relative overflow-hidden">
      {/* BG orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          }}
        />

        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex mb-6 hover:opacity-90 transition-opacity"
          >
            <LogoInline />
          </Link>

          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Welcome back
          </h1>

          <p className="text-[#6b7db3] mt-2">
            Sign in to your cricEDGE account
          </p>
        </div>

        {/* Card */}
        <div
          className="glass rounded-3xl border border-white/[0.07] p-8"
          style={{
            boxShadow:
              "0 0 80px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Social login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              {
                icon: Github,
                label: "GitHub",
                provider: "github" as const,
              },
              {
                icon: Chrome,
                label: "Google",
                provider: "google" as const,
              },
            ].map(({ icon: Icon, label, provider }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleSocialLogin(provider)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass border border-white/[0.08] text-sm text-[#6b7db3] hover:text-white hover:border-white/20 transition-all font-medium"
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>

            <div className="relative flex justify-center text-xs text-[#6b7db3]">
              <span
                className="px-3 bg-transparent"
                style={{ background: "transparent" }}
              >
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs text-[#6b7db3] uppercase tracking-widest">
                  Password
                </label>

              <Link
                to="/forgot-password"
  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>  
              </div>

              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
                />

                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field w-full rounded-xl pl-10 pr-10 py-3 text-sm"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3] hover:text-white transition-colors"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500"
              />

              <label
                htmlFor="remember"
                className="text-sm text-[#6b7db3] cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#6b7db3] mt-5">
            {"Don't have an account? "}

            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}