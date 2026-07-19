const User = require("../models/User");

// GET /api/profile
// Logged-in user profile aur dashboard stats
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const predictionHistory = Array.isArray(user.predictions)
  ? user.predictions
  : [];

    const sortedHistory = [
      ...predictionHistory,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    const latestPrediction =
      sortedHistory.length > 0
        ? sortedHistory[0]
        : null;

    const completedPredictions =
      predictionHistory.filter(
        (prediction) =>
          prediction.resultStatus ===
            "completed" &&
          typeof prediction.isCorrect ===
            "boolean"
      );

    const correctPredictions =
      completedPredictions.filter(
        (prediction) =>
          prediction.isCorrect === true
      ).length;

    const pendingPredictions =
      predictionHistory.length -
      completedPredictions.length;

    const predictionAccuracy =
      completedPredictions.length > 0
        ? Number(
            (
              (correctPredictions /
                completedPredictions.length) *
              100
            ).toFixed(1)
          )
        : null;

    return res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        profileImage:
          user.profileImage || "",
        favouriteTeam:
          user.favouriteTeam || "",
        authProvider: user.authProvider,
        role: user.role,
        createdAt: user.createdAt,
      },

      stats: {
        totalPredictions:
          predictionHistory.length,

        completedPredictions:
          completedPredictions.length,

        pendingPredictions,
        correctPredictions,

        lastPredictedWinner:
          latestPrediction
            ?.predictedWinner || "",

        lastPredictionDate:
          latestPrediction?.createdAt ||
          null,

        predictionAccuracy,

        accuracyStatus:
          predictionAccuracy === null
            ? "No completed results"
            : `${predictionAccuracy}%`,
      },
    });
  } catch (error) {
    console.error(
      "Get Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch profile",
    });
  }
};

// PUT /api/profile
// Name aur favourite team update
const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      favouriteTeam,
    } = req.body;

    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (typeof name === "string") {
      const cleanedName =
        name.trim();

      if (cleanedName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Name must contain at least 2 characters",
        });
      }

      if (cleanedName.length > 50) {
        return res.status(400).json({
          success: false,
          message:
            "Name cannot exceed 50 characters",
        });
      }

      user.name = cleanedName;
    }

    if (
      typeof favouriteTeam ===
      "string"
    ) {
      user.favouriteTeam =
        favouriteTeam.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        profileImage:
          user.profileImage || "",
        favouriteTeam:
          user.favouriteTeam || "",
        authProvider: user.authProvider,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update profile",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};