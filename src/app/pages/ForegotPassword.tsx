import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

type Step =
  | "email"
  | "otp"
  | "password";

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

  const [loading, setLoading] =
    useState(false);

  const submitEmail = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const message =
        await forgotPassword(email);

      window.alert(message);
      setStep("otp");
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (loading) return;

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
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to verify OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (loading) return;

    if (password !== confirmPassword) {
      window.alert(
        "Passwords do not match"
      );
      return;
    }

    setLoading(true);

    try {
      const message =
        await resetPassword(
          resetToken,
          password
        );

      window.alert(message);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 relative overflow-hidden">
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
        }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold text-white"
            style={{
              fontFamily:
                "'Rajdhani', sans-serif",
            }}
          >
            Reset password
          </h1>

          <p className="text-[#6b7db3] mt-2">
            {step === "email" &&
              "Enter your registered email"}

            {step === "otp" &&
              "Enter the OTP sent to your email"}

            {step === "password" &&
              "Create a new secure password"}
          </p>
        </div>

        <div className="glass rounded-3xl border border-white/[0.07] p-8">
          {step === "email" && (
            <form
              onSubmit={submitEmail}
              className="space-y-5"
            >
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
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-white font-semibold rounded-xl text-sm disabled:opacity-60"
              >
                {loading
                  ? "Sending OTP…"
                  : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={submitOtp}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                  Six-digit OTP
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
                    className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm tracking-[0.35em]"
                    placeholder="000000"
                    minLength={6}
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-white font-semibold rounded-xl text-sm disabled:opacity-60"
              >
                {loading
                  ? "Verifying…"
                  : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setStep("email")
                }
                className="w-full text-sm text-blue-400 hover:text-blue-300"
              >
                Change email
              </button>
            </form>
          )}

          {step === "password" && (
            <form
              onSubmit={submitPassword}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                  New password
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
                    className="input-field w-full rounded-xl pl-10 pr-10 py-3 text-sm"
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b7db3]"
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
                  Confirm password
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
                    value={
                      confirmPassword
                    }
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-white font-semibold rounded-xl text-sm disabled:opacity-60"
              >
                {loading
                  ? "Resetting…"
                  : "Reset Password"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#6b7db3] mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}