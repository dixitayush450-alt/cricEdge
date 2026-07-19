import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "motion/react";

import {
  CalendarDays,
  Check,
  Edit3,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import {
  getProfile,
  updateProfile,
  type ProfileResponse,
  type ProfileUser,
} from "../../services/api";

const IPL_TEAMS = [
  "Chennai Super Kings",
  "Mumbai Indians",
  "Royal Challengers Bengaluru",
  "Kolkata Knight Riders",
  "Sunrisers Hyderabad",
  "Delhi Capitals",
  "Punjab Kings",
  "Rajasthan Royals",
  "Gujarat Titans",
  "Lucknow Super Giants",
];

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function Profile() {
  const {
    updateProfile: updateAuthProfile,
  } = useAuth();

  const [profile, setProfile] =
    useState<ProfileResponse | null>(null);

  const [name, setName] =
    useState("");

  const [
    favouriteTeam,
    setFavouriteTeam,
  ] = useState("");

  const [editing, setEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getProfile();

      setProfile(response);

      setName(response.user.name);

      setFavouriteTeam(
        response.user.favouriteTeam || ""
      );
    } catch (profileError) {
      setError(
        profileError instanceof Error
          ? profileError.message
          : "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const initials = useMemo(() => {
    const currentName =
      profile?.user.name?.trim() ||
      "CricEDGE User";

    return currentName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [profile]);

  const handleCancel = () => {
    if (!profile) {
      return;
    }

    setName(profile.user.name);

    setFavouriteTeam(
      profile.user.favouriteTeam || ""
    );

    setSuccessMessage("");
    setError("");
    setEditing(false);
  };

  const handleSave = async () => {
    if (!profile) {
      return;
    }

    const cleanedName = name.trim();

    if (cleanedName.length < 2) {
      setError(
        "Name must contain at least 2 characters"
      );

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const profileResponse =
        await updateProfile({
          name: cleanedName,
          favouriteTeam,
        });

      const mergedUser: ProfileUser = {
        ...profile.user,
        ...profileResponse.user,
      };

      updateAuthProfile({
        id:
          mergedUser.id ||
          mergedUser._id ||
          "",
        name: mergedUser.name,
        email: mergedUser.email,
        avatar: mergedUser.avatar,
        profileImage:
          mergedUser.profileImage,
        favouriteTeam:
          mergedUser.favouriteTeam,
        authProvider:
          mergedUser.authProvider,
        role: mergedUser.role,
        createdAt:
          mergedUser.createdAt,
      });

      setProfile(
        (currentProfile) => {
          if (!currentProfile) {
            return currentProfile;
          }

          return {
            ...currentProfile,
            user: mergedUser,
          };
        }
      );

      setName(mergedUser.name);

      setFavouriteTeam(
        mergedUser.favouriteTeam || ""
      );

      setEditing(false);

      setSuccessMessage(
        "Profile updated successfully"
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl border border-white/[0.07] p-10">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-400 rounded-full animate-spin mb-4" />

              <p
                className="text-lg font-semibold text-white"
                style={{
                  fontFamily:
                    "'Rajdhani', sans-serif",
                }}
              >
                Loading Profile
              </p>

              <p className="text-sm text-[#6b7db3] mt-1">
                Fetching your CricEDGE
                account details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl border border-red-500/20 p-10 text-center">
            <p
              className="text-xl font-semibold text-white"
              style={{
                fontFamily:
                  "'Rajdhani', sans-serif",
              }}
            >
              Profile Could Not Be Loaded
            </p>

            <p className="text-sm text-[#6b7db3] mt-2">
              {error ||
                "Something went wrong"}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadProfile();
              }}
              className="btn-primary mt-5 px-5 py-3 rounded-xl text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = profile.stats;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 uppercase tracking-widest mb-3">
            <UserRound size={11} />
            Account Dashboard
          </span>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{
              fontFamily:
                "'Rajdhani', sans-serif",
            }}
          >
            User{" "}
            <span className="text-gradient-blue">
              Profile
            </span>
          </h1>

          <p className="text-[#6b7db3] mt-3 max-w-xl mx-auto">
            Manage your CricEDGE account
            and review your prediction
            activity.
          </p>
        </motion.div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <Check size={15} />
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="glass rounded-3xl border border-white/[0.07] p-6"
            style={{
              boxShadow:
                "0 0 80px rgba(59,130,246,0.05)",
            }}
          >
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto">
                {profile.user.profileImage ? (
                  <img
                    src={
                      profile.user
                        .profileImage
                    }
                    alt={
                      profile.user.name
                    }
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-3xl object-cover border border-blue-500/20"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <UserRound
                      size={42}
                      className="text-blue-400"
                    />
                  </div>
                )}

                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#0b1120] border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                  {initials}
                </div>
              </div>

              <h2
                className="text-2xl font-bold text-white mt-6"
                style={{
                  fontFamily:
                    "'Rajdhani', sans-serif",
                }}
              >
                {profile.user.name}
              </h2>

              <p className="text-sm text-[#6b7db3] mt-1">
                CricEDGE Member
              </p>
            </div>

            <div className="space-y-3 mt-7">
              <div className="glass rounded-xl border border-white/[0.06] p-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Mail
                    size={15}
                    className="text-blue-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] text-[#6b7db3] uppercase tracking-wider">
                    Email
                  </p>

                  <p className="text-sm text-white mt-1 truncate">
                    {profile.user.email}
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl border border-white/[0.06] p-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Star
                    size={15}
                    className="text-amber-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] text-[#6b7db3] uppercase tracking-wider">
                    Favourite Team
                  </p>

                  <p className="text-sm text-white mt-1 truncate">
                    {profile.user
                      .favouriteTeam ||
                      "Not selected"}
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl border border-white/[0.06] p-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <CalendarDays
                    size={15}
                    className="text-violet-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] text-[#6b7db3] uppercase tracking-wider">
                    Joined
                  </p>

                  <p className="text-sm text-white mt-1">
                    {formatDate(
                      profile.user
                        .createdAt
                    )}
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl border border-white/[0.06] p-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck
                    size={15}
                    className="text-emerald-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] text-[#6b7db3] uppercase tracking-wider">
                    Account Type
                  </p>

                  <p className="text-sm text-white mt-1 capitalize">
                    {profile.user
                      .authProvider ||
                      "local"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="glass rounded-2xl border border-white/[0.07] p-5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Sparkles
                    size={18}
                    className="text-blue-400"
                  />
                </div>

                <p className="text-xs text-[#6b7db3] uppercase tracking-wider">
                  Total Predictions
                </p>

                <p
                  className="text-3xl font-bold text-white mt-2"
                  style={{
                    fontFamily:
                      "'Rajdhani', sans-serif",
                  }}
                >
                  {stats.totalPredictions}
                </p>
              </div>

              <div className="glass rounded-2xl border border-white/[0.07] p-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Trophy
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                <p className="text-xs text-[#6b7db3] uppercase tracking-wider">
                  Last Predicted Winner
                </p>

                <p
                  className="text-lg font-bold text-white mt-2 line-clamp-2"
                  style={{
                    fontFamily:
                      "'Rajdhani', sans-serif",
                  }}
                >
                  {stats.lastPredictedWinner ||
                    "No prediction yet"}
                </p>
              </div>

              <div className="glass rounded-2xl border border-white/[0.07] p-5">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                  <Target
                    size={18}
                    className="text-violet-400"
                  />
                </div>

                <p className="text-xs text-[#6b7db3] uppercase tracking-wider">
                  Prediction Accuracy
                </p>

                <p
                  className="text-lg font-bold text-white mt-2"
                  style={{
                    fontFamily:
                      "'Rajdhani', sans-serif",
                  }}
                >
                  {stats.accuracyStatus ||
                    "Coming Soon"}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.14,
              }}
              className="glass rounded-3xl border border-white/[0.07] p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p
                    className="text-xl font-semibold text-white"
                    style={{
                      fontFamily:
                        "'Rajdhani', sans-serif",
                    }}
                  >
                    Profile Details
                  </p>

                  <p className="text-sm text-[#6b7db3] mt-1">
                    Update your display name
                    and favourite IPL team.
                  </p>
                </div>

                {!editing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true);
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="glass border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-[#6b7db3] hover:text-white hover:border-white/20 transition-all"
                  >
                    <Edit3 size={15} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="glass border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-[#6b7db3] hover:text-white transition-all disabled:opacity-60"
                    >
                      <X size={15} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        void handleSave();
                      }}
                      disabled={saving}
                      className="btn-primary rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-white font-semibold disabled:opacity-60"
                    >
                      <Save size={15} />

                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                    Name
                  </label>

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    disabled={
                      !editing ||
                      saving
                    }
                    maxLength={50}
                    className="w-full input-field rounded-xl px-4 py-3 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                    Email
                  </label>

                  <input
                    value={
                      profile.user.email
                    }
                    disabled
                    className="w-full input-field rounded-xl px-4 py-3 text-sm opacity-70 cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#6b7db3] uppercase tracking-widest mb-2">
                    Favourite Team
                  </label>

                  <select
                    value={
                      favouriteTeam
                    }
                    onChange={(event) =>
                      setFavouriteTeam(
                        event.target.value
                      )
                    }
                    disabled={
                      !editing ||
                      saving
                    }
                    className="w-full input-field rounded-xl px-4 py-3 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <option
                      value=""
                      style={{
                        background:
                          "#0b1120",
                      }}
                    >
                      Select favourite team
                    </option>

                    {IPL_TEAMS.map(
                      (team) => (
                        <option
                          key={team}
                          value={team}
                          style={{
                            background:
                              "#0b1120",
                          }}
                        >
                          {team}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}