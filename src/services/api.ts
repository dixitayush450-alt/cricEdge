const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export type AvatarType =
  | "avatar1"
  | "avatar2"
  | "avatar3";

export interface PredictionWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  precipitation: number;
  rain: number;
  weatherCode: number;
  condition: string;
  observedAt: string;
  city: string;
}

export interface PredictPayload {
  team1: string;
  team2: string;
  tossWinner?: string;
  venue: string;
  matchId?: string;
  weather?: PredictionWeather | null;
}

export interface ProfileUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  avatar?: AvatarType;
  profileImage?: string;
  favouriteTeam?: string;

  authProvider?:
    | "local"
    | "google"
    | "github";

  role?: "user" | "admin";
  createdAt?: string;
}

export interface ProfileStats {
  totalPredictions: number;
  lastPredictedWinner: string;
  lastPredictionDate: string | null;
  predictionAccuracy: number | null;
  accuracyStatus: string;
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  user: ProfileUser;
  stats: ProfileStats;
}

export interface UpdateProfilePayload {
  name: string;
  favouriteTeam: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  user: ProfileUser;
}

export interface UpdateAvatarResponse {
  success: boolean;
  message?: string;
  user: ProfileUser;
}

const getAuthToken = () => {
  return (
    localStorage.getItem(
      "cricedge_token"
    ) ||
    sessionStorage.getItem(
      "cricedge_token"
    )
  );
};

const readJsonResponse = async <T>(
  response: Response
): Promise<T> => {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error(
      "Server returned an invalid response"
    );
  }
};

export const getTeams = async () => {
  const response = await fetch(
    `${API_BASE_URL}/matches/teams`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch teams"
    );
  }

  return response.json();
};

export const getTeamStats = async (
  team: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/matches/team/${encodeURIComponent(
      team
    )}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch team stats"
    );
  }

  return response.json();
};

export const getHeadToHead = async (
  team1: string,
  team2: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/matches/headtohead?team1=${encodeURIComponent(
      team1
    )}&team2=${encodeURIComponent(
      team2
    )}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch head-to-head data"
    );
  }

  return response.json();
};

export const getRecentForm = async (
  team: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/matches/recentform/${encodeURIComponent(
      team
    )}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch recent form"
    );
  }

  return response.json();
};

export const predictMatch = async (
  data: PredictPayload
) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      "Please login before generating a prediction"
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/predict`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Accept:
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    }
  );

  const responseData =
    await readJsonResponse<{
      success?: boolean;
      message?: string;
      [key: string]: unknown;
    }>(response);

  if (
    !response.ok ||
    responseData.success === false
  ) {
    throw new Error(
      responseData.message ||
        "Failed to generate prediction"
    );
  }

  return responseData;
};

export const getPredictionHistory =
  async () => {
    const token = getAuthToken();

    if (!token) {
      throw new Error(
        "Please login first"
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/predict/history`,
      {
        headers: {
          Accept:
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const responseData =
      await readJsonResponse<{
        success?: boolean;
        message?: string;
        [key: string]: unknown;
      }>(response);

    if (
      !response.ok ||
      responseData.success === false
    ) {
      throw new Error(
        responseData.message ||
          "Failed to fetch prediction history"
      );
    }

    return responseData;
  };

export const getProfile =
  async (): Promise<ProfileResponse> => {
    const token = getAuthToken();

    if (!token) {
      throw new Error(
        "Please login first"
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/profile`,
      {
        headers: {
          Accept:
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const responseData =
      await readJsonResponse<ProfileResponse>(
        response
      );

    if (
      !response.ok ||
      !responseData.success
    ) {
      throw new Error(
        responseData.message ||
          "Failed to fetch profile"
      );
    }

    return responseData;
  };

export const updateProfile = async (
  data: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      "Please login first"
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/profile`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",

        Accept:
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    }
  );

  const responseData =
    await readJsonResponse<UpdateProfileResponse>(
      response
    );

  if (
    !response.ok ||
    !responseData.success
  ) {
    throw new Error(
      responseData.message ||
        "Failed to update profile"
    );
  }

  return responseData;
};

export const updateAvatar = async (
  avatar: AvatarType
): Promise<UpdateAvatarResponse> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error(
      "Please login first"
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/auth/avatar`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",

        Accept:
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        avatar,
      }),
    }
  );

  const responseData =
    await readJsonResponse<UpdateAvatarResponse>(
      response
    );

  if (
    !response.ok ||
    !responseData.success
  ) {
    throw new Error(
      responseData.message ||
        "Failed to update avatar"
    );
  }

  return responseData;
};