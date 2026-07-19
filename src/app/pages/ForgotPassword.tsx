import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import { motion } from "motion/react";

import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

type Step =
  | "email"
  | "otp"
  | "password"
  | "success";

function LogoInline() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="28"
        height="30"
        viewBox="0 0 30 32"
        fill="none"
      >
        <defs>
          <linearGradient
            id="forgotShieldGradient"
            x1="0"
            y1="0"
            x2="30"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor="#3b82f6"
            />

            <stop
              offset="100%"
              stopColor="#06b6d4"
            />
          </linearGradient>

          <radialGradient
            id="forgotBallGradient"
            cx="40%"
            cy="35%"
            r="60%"
          >
            <stop
              offset="0%"
              stopColor="#c0392b"
            />

            <stop
              offset="55%"
              stopColor="#7b241c"
            />

            <stop
              offset="100%"
              stopColor="#2c0f0a"
            />
          </radialGradient>
        </defs>

        <path
          d="M15 1 L28 6 L28 18 Q28 27 15 31 Q2 27 2 18 L2 6 Z"
          fill="url(#forgotShieldGradient)"
          opacity="0.15"
        />

        <path
          d="M15 1 L28 6 L28 18 Q28 27 15 31 Q2 27 2 18 L2 6 Z"
          fill="none"
          stroke="url(#forgotShieldGradient)"
          strokeWidth="1.2"
          opacity="0.7"
        />

        <circle
          cx="15"
          cy="16"
          r="8.5"
          fill="url(#forgotBallGradient)"
        />

        <ellipse
          cx="12.5"
          cy="13"
          rx="3"
          ry="2"
          fill="rgba(255,180,160,0.35)"
          style={{
            filter: "blur(1.5px)",
          }}
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

      <svg
        width="102"
        height="22"
        viewBox="0 0 102 22"
        fill="none"
      >
        <defs>
          <linearGradient
            id="forgotEdgeGradient"
            x1="0"
            y1="0"
            x2="102"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor="#60a5fa"
            />

            <stop
              offset="100%"
              stopColor="#22d3ee"
            />
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
          fill="url(#forgotEdgeGradient)"
          letterSpacing="1.2"
        >
          EDGE
        </text>
      </svg>
    </div>
  );
}

export function ForgotPassword() {
  const navigate = useNavigate();

  const {
    forgotPassword,
    verifyResetOtp,
    resetPassword,
  } = useAuth();

  const [step, setStep] =
    useState<Step>("email");

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [resetToken, setResetToken] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    resendLoading,
    setResendLoading,
  ] = useState(false);

  const handleSendOtp = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const message =
        await forgotPassword(email);

      window.alert(message);

      setStep("otp");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send OTP";

      window.alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (otp.length !== 6) {
      window.alert(
        "Please enter the complete 6-digit OTP"
      );

      return;
    }

    setLoading(true);

    try {
      const token =
        await verifyResetOtp(
          email,
          otp
        );

      setResetToken(token);
      setStep("password");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to verify OTP";

      window.alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (password !== confirmPassword) {
      window.alert(
        "Passwords do not match"
      );

      return;
    }

    if (password.length < 8) {
      window.alert(
        "Password must be at least 8 characters"
      );

      return;
    }

    const hasUppercase =
      /[A-Z]/.test(password);

    const hasLowercase =
      /[a-z]/.test(password);

    const hasNumber =
      /[0-9]/.test(password);

    if (
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber
    ) {
      window.alert(
        "Password must contain uppercase, lowercase and a number"
      );

      return;
    }

    setLoading(true);

    try {
      await resetPassword(
        resetToken,
        password
      );

      setStep("success");

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1800);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to reset password";

      window.alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendLoading) {
      return;
    }

    setResendLoading(true);

    try {
      const message =
        await forgotPassword(email);

      window.alert(message);
      setOtp("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to resend OTP";

      window.alert(message);
    } finally {
      setResendLoading(false);
    }
  };

  const getHeading = () => {
    if (step === "email") {
      return "Forgot password?";
    }

    if (step === "otp") {
      return "Verify your email";
    }

    if (step === "password") {
      return "Create new password";
    }

    return "Password updated";
  };

  const getDescription = () => {
    if (step === "email") {
      return "Enter your registered email and we will send you a secure OTP.";
    }

    if (step === "otp") {
      return `Enter the 6-digit OTP sent to ${email}.`;
    }

    if (step === "password") {
      return "Choose a strong password for your CricEDGE account.";
    }

    return "Your password has been changed successfully.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 py-12 relative overflow-hidden">
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
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex mb-6 hover:opacity-90 transition-opacity"
          >
            <LogoInline />
          </Link>

          <h1
            className="text-3xl font-bold text-white"
            style={{
              fontFamily:
                "'Rajdhani', sans-serif",
            }}
          >
            {getHeading()}
          </h1>

          <p className="text-[#6b7db3] mt-2 leading-relaxed">
            {getDescription()}
          </p>
        </div>

        <div
          className="glass rounded-3xl border border-white/[0.07] p-8"
          style={{
            boxShadow:
              "0 0 80px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center gap-2 mb-7">
            {[
              "email",
              "otp",
              "password",
            ].map((item, index) => {
              const stepOrder = [
                "email",
                "otp",
                "password",
              ];

              const currentIndex =
                step === "success"
                  ? 3
                  : stepOrder.indexOf(step);

              const active =
                index <= currentIndex;

              return (
                <div
                  key={item}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold transition-all ${
                      active
                        ? "bg-blue-500/20 border-blue-500 text-blue-300"
                        : "border-white/[0.08] text-[#6b7db3]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {index < 2 && (
                    <div
                      className={`h-px flex-1 mx-2 transition-all ${
                        index < currentIndex
                          ? "bg-blue-500"
                          : "bg-white/[0.08]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {step === "email" && (
            <form
              onSubmit={handleSendOtp}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                  Registered Email
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="you@example.com"
                    className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Sending OTP…
                  </>
                ) : (
                  "Send Reset OTP"
                )}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                  Six-Digit OTP
                </label>

                <div className="relative">
                  <KeyRound
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm tracking-[0.35em]"
                    minLength={6}
                    maxLength={6}
                    autoComplete="one-time-code"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  otp.length !== 6
                }
                className="w-full btn-primary py-3.5 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Verifying OTP…
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setOtp("");
                    setStep("email");
                  }}
                  className="text-[#6b7db3] hover:text-white transition-colors"
                >
                  Change email
                </button>

                <button
                  type="button"
                  onClick={
                    handleResendOtp
                  }
                  disabled={
                    resendLoading
                  }
                  className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-60"
                >
                  {resendLoading
                    ? "Sending…"
                    : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {step === "password" && (
            <form
              onSubmit={
                handleResetPassword
              }
              className="space-y-4"
            >
              <div>
                <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                  New Password
                </label>

                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Min. 8 characters"
                    className="input-field w-full rounded-xl pl-10 pr-10 py-3 text-sm"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3] hover:text-white transition-colors"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
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
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Repeat new password"
                    className="input-field w-full rounded-xl pl-10 pr-10 py-3 text-sm"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3] hover:text-white transition-colors"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <p className="text-xs text-[#6b7db3] leading-relaxed">
                  Password must contain at least
                  8 characters, one uppercase
                  letter, one lowercase letter
                  and one number.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Updating password…
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2
                  size={30}
                  className="text-emerald-400"
                />
              </div>

              <h2 className="text-xl font-semibold text-white">
                Password reset successful
              </h2>

              <p className="text-sm text-[#6b7db3] mt-2">
                Redirecting you to the
                sign-in page…
              </p>
            </div>
          )}

          {step !== "success" && (
            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-[#6b7db3] hover:text-white transition-colors"
              >
                <ArrowLeft size={14} />

                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}