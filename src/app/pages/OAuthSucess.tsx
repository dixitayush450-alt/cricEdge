import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider?:
    | "local"
    | "google"
    | "github";
  favouriteTeam?: string;
  role?: "user" | "admin";
  createdAt?: string;
};

type CurrentUserResponse = {
  success: boolean;
  message?: string;
  user?: AuthUser;
};

export function OAuthSuccess() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const [message, setMessage] =
    useState(
      "Completing secure login..."
    );

  useEffect(() => {
    const finishOAuthLogin =
      async () => {
        const token =
          searchParams.get("token");

        if (!token) {
          navigate(
            "/login?error=oauth_token_missing",
            {
              replace: true,
            }
          );

          return;
        }

        try {
          const response = await fetch(
            `${API_BASE_URL}/auth/me`,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          const data =
            (await response.json()) as CurrentUserResponse;

          if (
            !response.ok ||
            !data.success ||
            !data.user
          ) {
            throw new Error(
              data.message ||
                "Unable to complete login"
            );
          }

          localStorage.setItem(
            "cricedge_token",
            token
          );

          localStorage.setItem(
            "cricedge_user",
            JSON.stringify(data.user)
          );

          sessionStorage.removeItem(
            "cricedge_token"
          );

          sessionStorage.removeItem(
            "cricedge_user"
          );

          window.dispatchEvent(
            new Event(
              "cricedge-auth-change"
            )
          );

          setMessage(
            "Login successful. Redirecting..."
          );

          window.location.replace("/");
        } catch (error) {
          console.error(
            "OAuth login error:",
            error
          );

          localStorage.removeItem(
            "cricedge_token"
          );

          localStorage.removeItem(
            "cricedge_user"
          );

          navigate(
            "/login?error=oauth_login_failed",
            {
              replace: true,
            }
          );
        }
      };

    void finishOAuthLogin();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="glass rounded-3xl border border-white/[0.07] p-10 text-center max-w-md w-full">
        <div className="w-12 h-12 mx-auto border-2 border-blue-500/20 border-t-blue-400 rounded-full animate-spin" />

        <h1
          className="text-2xl font-bold text-white mt-6"
          style={{
            fontFamily:
              "'Rajdhani', sans-serif",
          }}
        >
          Signing you in
        </h1>

        <p className="text-sm text-[#6b7db3] mt-2">
          {message}
        </p>
      </div>
    </div>
  );
}