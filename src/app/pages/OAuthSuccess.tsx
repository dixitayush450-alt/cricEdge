import { useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router";

import { useAuth } from "../context/AuthContext";

export function OAuthSuccess() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const {
    completeOAuthLogin,
  } = useAuth();

  useEffect(() => {
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

    const finishLogin = async () => {
      try {
        await completeOAuthLogin(token);

        navigate("/", {
          replace: true,
        });
      } catch {
        navigate(
          "/login?error=oauth_login_failed",
          {
            replace: true,
          }
        );
      }
    };

    void finishLogin();
  }, [
    completeOAuthLogin,
    navigate,
    searchParams,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />

        <p className="text-white font-medium">
          Completing secure login…
        </p>
      </div>
    </div>
  );
}