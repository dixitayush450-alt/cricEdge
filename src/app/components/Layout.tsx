import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, NavLink, Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Github,
  Linkedin,
  Twitter,
  LogOut,
  User,
  History,
} from "lucide-react";

// ── Premium wordmark ────────────────────────────────────────────────────────
function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const scales = { sm: 0.75, md: 1, lg: 1.35 };
  const s = scales[size];

  return (
    <div
      className="flex items-center gap-2"
      style={{
        transform: `scale(${s})`,
        transformOrigin: "left center",
      }}
    >
      {/* Icon mark: cricket ball inside a shield/hex */}
      <svg
        width="30"
        height="32"
        viewBox="0 0 30 32"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient
            id="shieldGrad"
            x1="0"
            y1="0"
            x2="30"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <radialGradient id="ballG" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#c0392b" />
            <stop offset="55%" stopColor="#7b241c" />
            <stop offset="100%" stopColor="#2c0f0a" />
          </radialGradient>
        </defs>

        <path
          d="M15 1 L28 6 L28 18 Q28 27 15 31 Q2 27 2 18 L2 6 Z"
          fill="url(#shieldGrad)"
          opacity="0.15"
        />
        <path
          d="M15 1 L28 6 L28 18 Q28 27 15 31 Q2 27 2 18 L2 6 Z"
          fill="none"
          stroke="url(#shieldGrad)"
          strokeWidth="1.2"
          opacity="0.7"
        />
        <circle cx="15" cy="16" r="8.5" fill="url(#ballG)" />
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

      {/* Wordmark */}
      <svg
        width="102"
        height="22"
        viewBox="0 0 102 22"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient
            id="edgeGrad"
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
          fill="url(#edgeGrad)"
          letterSpacing="1.2"
        >
          EDGE
        </text>
      </svg>
    </div>
  );
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/prediction", label: "Prediction" },
  { to: "/teams", label: "Teams" },
  { to: "/players", label: "Players" },
  { to: "/analytics", label: "Analytics" },
  { to: "/about", label: "About" },
];

export function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#050816",
      }}
    >
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 hover:opacity-90 transition-opacity"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-[#6b7db3] hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/history"
                  className="px-3 py-2 text-sm font-medium text-[#6b7db3] hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <History size={15} />
                  History
                </Link>

                <Link
                  to="/profile"
                  className="px-3 py-2 text-sm font-medium text-[#6b7db3] hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <User size={15} />
                  Profile
                </Link>

                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm font-medium text-[#6b7db3] hover:text-white rounded-lg transition-colors"
                >
                  Hi, <span className="text-white">{user.name.split(" ")[0]}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-primary px-4 py-2 text-sm font-semibold text-white rounded-xl flex items-center gap-2"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#6b7db3] hover:text-white rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary px-4 py-2 text-sm font-semibold text-white rounded-xl"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl text-[#6b7db3] hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-nav border-t border-white/[0.06]"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "text-blue-400 bg-blue-500/10"
                          : "text-[#6b7db3] hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}

                {user ? (
                  <>
                    <NavLink
                      to="/history"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "text-blue-400 bg-blue-500/10"
                            : "text-[#6b7db3] hover:text-white hover:bg-white/5"
                        }`
                      }
                    >
                      <History size={16} />
                      History
                    </NavLink>

                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "text-blue-400 bg-blue-500/10"
                            : "text-[#6b7db3] hover:text-white hover:bg-white/5"
                        }`
                      }
                    >
                      <User size={16} />
                      Profile
                    </NavLink>

                    <div className="flex gap-2 pt-2">
                      <Link
                        to="/profile"
                        className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white rounded-xl bg-white/5"
                      >
                        Hi, {user.name.split(" ")[0]}
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex-1 text-center btn-primary px-4 py-2.5 text-sm font-semibold text-white rounded-xl"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <Link
                      to="/login"
                      className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-[#6b7db3] hover:text-white rounded-xl bg-white/5 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="flex-1 text-center btn-primary px-4 py-2.5 text-sm font-semibold text-white rounded-xl"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-[#6b7db3] text-sm">
                IPL Cricket Analytics
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-[#6b7db3]">
              <Link
                to="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center gap-3">
              {[Github, Linkedin, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[#6b7db3] hover:text-white hover:border-blue-500/30 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center text-xs text-[#6b7db3]">
            © 2025 cricEDGE. Data-driven cricket analytics for enthusiasts.
          </div>
        </div>
      </footer>
    </div>
  );
}