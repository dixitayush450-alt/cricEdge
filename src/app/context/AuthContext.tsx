import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const TOKEN_KEY = "cricedge_token";
const USER_KEY = "cricedge_user";

export type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  avatar?: "avatar1" | "avatar2" | "avatar3";
  profileImage?: string;
  authProvider?:
    | "local"
    | "google"
    | "github"
    | "otp";
  favouriteTeam?: string;
  role?: "user" | "admin";
  createdAt?: string;
};

type ApiError = {
  msg?: string;
  message?: string;
};

type AuthResponse = {
  success: boolean;
  message?: string;
  token?: string;
  resetToken?: string;
  user?: AuthUser;
  errors?: ApiError[];
};

type LoginInput = {
  email: string;
  password: string;
  remember?: boolean;
};

type SignupInput = {
  name: string;
  email: string;
  password: string;
  avatar?: "avatar1" | "avatar2" | "avatar3";
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isRestoringSession: boolean;

  login: (
    input: LoginInput
  ) => Promise<AuthUser>;

  signup: (
    input: SignupInput
  ) => Promise<AuthUser>;

  completeOAuthLogin: (
    newToken: string
  ) => Promise<AuthUser>;

  forgotPassword: (
    email: string
  ) => Promise<string>;

  verifyResetOtp: (
    email: string,
    otp: string
  ) => Promise<string>;

  resetPassword: (
    resetToken: string,
    password: string
  ) => Promise<string>;

  updateProfile: (
    updatedUser: AuthUser
  ) => void;

  logout: () => void;

  restoreSession: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

function parseStoredUser(
  rawUser: string | null
): AuthUser | null {
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

function getStoredSession() {
  const localToken =
    localStorage.getItem(TOKEN_KEY);

  if (localToken) {
    return {
      token: localToken,
      user: parseStoredUser(
        localStorage.getItem(USER_KEY)
      ),
      storage: localStorage,
    };
  }

  return {
    token:
      sessionStorage.getItem(TOKEN_KEY),
    user: parseStoredUser(
      sessionStorage.getItem(USER_KEY)
    ),
    storage: sessionStorage,
  };
}

function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

function getApiError(
  data: AuthResponse,
  fallbackMessage: string
) {
  return (
    data.errors?.[0]?.msg ||
    data.errors?.[0]?.message ||
    data.message ||
    fallbackMessage
  );
}

async function readResponse(
  response: Response
): Promise<AuthResponse> {
  try {
    return (await response.json()) as AuthResponse;
  } catch {
    return {
      success: false,
      message:
        "Server returned an invalid response",
    };
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const initialSession = getStoredSession();

  const [token, setToken] =
    useState<string | null>(
      initialSession.token
    );

  const [user, setUser] =
    useState<AuthUser | null>(
      initialSession.user
    );

  const [
    isRestoringSession,
    setIsRestoringSession,
  ] = useState(true);

  const saveSession = useCallback(
    (
      newToken: string,
      newUser: AuthUser,
      remember: boolean
    ) => {
      clearStoredSession();

      const storage = remember
        ? localStorage
        : sessionStorage;

      storage.setItem(
        TOKEN_KEY,
        newToken
      );

      storage.setItem(
        USER_KEY,
        JSON.stringify(newUser)
      );

      setToken(newToken);
      setUser(newUser);
    },
    []
  );

  const logout = useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (updatedUser: AuthUser) => {
      const storedSession =
        getStoredSession();

      if (storedSession.token) {
        storedSession.storage.setItem(
          USER_KEY,
          JSON.stringify(updatedUser)
        );
      }

      setUser(updatedUser);
    },
    []
  );

  const fetchCurrentUser =
    useCallback(
      async (
        currentToken: string
      ): Promise<AuthUser> => {
        const response = await fetch(
          `${API_BASE_URL}/auth/me`,
          {
            headers: {
              Accept:
                "application/json",
              Authorization:
                `Bearer ${currentToken}`,
            },
          }
        );

        const data =
          await readResponse(response);

        if (
          !response.ok ||
          !data.success ||
          !data.user
        ) {
          throw new Error(
            getApiError(
              data,
              "Unable to fetch user"
            )
          );
        }

        return data.user;
      },
      []
    );

  const restoreSession =
    useCallback(async () => {
      const storedSession =
        getStoredSession();

      if (!storedSession.token) {
        setToken(null);
        setUser(null);
        setIsRestoringSession(false);
        return;
      }

      try {
        const currentUser =
          await fetchCurrentUser(
            storedSession.token
          );

        storedSession.storage.setItem(
          USER_KEY,
          JSON.stringify(currentUser)
        );

        setToken(storedSession.token);
        setUser(currentUser);
      } catch {
        logout();
      } finally {
        setIsRestoringSession(false);
      }
    }, [fetchCurrentUser, logout]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const login = useCallback(
    async ({
      email,
      password,
      remember = false,
    }: LoginInput) => {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
            remember,
          }),
        }
      );

      const data =
        await readResponse(response);

      if (
        !response.ok ||
        !data.success ||
        !data.token ||
        !data.user
      ) {
        throw new Error(
          getApiError(
            data,
            "Unable to sign in"
          )
        );
      }

      saveSession(
        data.token,
        data.user,
        remember
      );

      return data.user;
    },
    [saveSession]
  );

  const signup = useCallback(
    async ({
      name,
      email,
      password,
      avatar = "avatar1",
    }: SignupInput) => {
      const response = await fetch(
        `${API_BASE_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            avatar,
          }),
        }
      );

      const data =
        await readResponse(response);

      if (
        !response.ok ||
        !data.success ||
        !data.token ||
        !data.user
      ) {
        throw new Error(
          getApiError(
            data,
            "Unable to create account"
          )
        );
      }

      saveSession(
        data.token,
        data.user,
        true
      );

      return data.user;
    },
    [saveSession]
  );

  const completeOAuthLogin =
    useCallback(
      async (
        newToken: string
      ) => {
        const currentUser =
          await fetchCurrentUser(
            newToken
          );

        saveSession(
          newToken,
          currentUser,
          true
        );

        return currentUser;
      },
      [
        fetchCurrentUser,
        saveSession,
      ]
    );

  const forgotPassword =
    useCallback(
      async (email: string) => {
        const response = await fetch(
          `${API_BASE_URL}/auth/forgot-password`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              email: email.trim(),
            }),
          }
        );

        const data =
          await readResponse(response);

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            getApiError(
              data,
              "Unable to send OTP"
            )
          );
        }

        return (
          data.message ||
          "OTP sent successfully"
        );
      },
      []
    );

  const verifyResetOtp =
    useCallback(
      async (
        email: string,
        otp: string
      ) => {
        const response = await fetch(
          `${API_BASE_URL}/auth/verify-reset-otp`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              email: email.trim(),
              otp: otp.trim(),
            }),
          }
        );

        const data =
          await readResponse(response);

        if (
          !response.ok ||
          !data.success ||
          !data.resetToken
        ) {
          throw new Error(
            getApiError(
              data,
              "Unable to verify OTP"
            )
          );
        }

        return data.resetToken;
      },
      []
    );

  const resetPassword =
    useCallback(
      async (
        resetToken: string,
        password: string
      ) => {
        const response = await fetch(
          `${API_BASE_URL}/auth/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              resetToken,
              password,
            }),
          }
        );

        const data =
          await readResponse(response);

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            getApiError(
              data,
              "Unable to reset password"
            )
          );
        }

        return (
          data.message ||
          "Password reset successfully"
        );
      },
      []
    );

  const contextValue =
    useMemo<AuthContextValue>(
      () => ({
        user,
        token,
        isAuthenticated:
          Boolean(token && user),
        isRestoringSession,
        login,
        signup,
        completeOAuthLogin,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        updateProfile,
        logout,
        restoreSession,
      }),
      [
        user,
        token,
        isRestoringSession,
        login,
        signup,
        completeOAuthLogin,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        updateProfile,
        logout,
        restoreSession,
      ]
    );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}