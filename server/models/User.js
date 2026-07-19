const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const predictionSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      default: null,
    },

    team1: {
      type: String,
      required: true,
      trim: true,
    },

    team2: {
      type: String,
      required: true,
      trim: true,
    },

    venue: {
      type: String,
      default: "",
      trim: true,
    },

    tossWinner: {
      type: String,
      default: "",
      trim: true,
    },

    predictedWinner: {
      type: String,
      required: true,
      trim: true,
    },

    team1Probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    team2Probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    actualWinner: {
      type: String,
      default: "",
      trim: true,
    },

    resultStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    isCorrect: {
      type: Boolean,
      default: null,
    },

    predictedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [
        2,
        "Name must be at least 2 characters",
      ],
      maxlength: [
        50,
        "Name cannot exceed 50 characters",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      minlength: [
        8,
        "Password must be at least 8 characters",
      ],
      select: false,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    googleId: {
      type: String,
      trim: true,
    },

    githubId: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      enum: [
        "avatar1",
        "avatar2",
        "avatar3",
      ],
      default: "avatar1",
    },

    profileImage: {
      type: String,
      default: "",
      trim: true,
    },

    favouriteTeam: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    passwordResetOtp: {
      type: String,
      select: false,
      default: null,
    },

    passwordResetOtpExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },

    passwordResetOtpAttempts: {
      type: Number,
      select: false,
      default: 0,
    },

    predictions: {
      type: [predictionSchema],
      default: [],
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(
  "validate",
  function () {
    if (
      this.authProvider === "local" &&
      this.isNew &&
      !this.password
    ) {
      throw new Error(
        "Password is required for email signup"
      );
    }

    if (
      this.authProvider === "google" &&
      !this.googleId
    ) {
      throw new Error(
        "Google ID is required for Google login"
      );
    }

    if (
      this.authProvider === "github" &&
      !this.githubId
    ) {
      throw new Error(
        "GitHub ID is required for GitHub login"
      );
    }
  }
);

userSchema.pre(
  "save",
  async function () {
    if (
      !this.isModified("password") ||
      !this.password
    ) {
      return;
    }

    const salt =
      await bcrypt.genSalt(12);

    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );
  }
);

userSchema.methods.comparePassword =
  async function (enteredPassword) {
    if (!this.password) {
      return false;
    }

    return bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

userSchema.methods.getPredictionStats =
  function () {
    const predictions =
      this.predictions || [];

    const completedPredictions =
      predictions.filter(
        (prediction) =>
          prediction.resultStatus ===
          "completed"
      );

    const correctPredictions =
      completedPredictions.filter(
        (prediction) =>
          prediction.isCorrect === true
      );

    const accuracy =
      completedPredictions.length > 0
        ? Number(
            (
              (correctPredictions.length /
                completedPredictions.length) *
              100
            ).toFixed(2)
          )
        : 0;

    const latestPrediction =
      predictions.length > 0
        ? predictions
            .slice()
            .sort(
              (
                firstPrediction,
                secondPrediction
              ) =>
                new Date(
                  secondPrediction.predictedAt
                ).getTime() -
                new Date(
                  firstPrediction.predictedAt
                ).getTime()
            )[0]
        : null;

    return {
      totalPredictions:
        predictions.length,

      completedPredictions:
        completedPredictions.length,

      pendingPredictions:
        predictions.length -
        completedPredictions.length,

      correctPredictions:
        correctPredictions.length,

      accuracy,

      lastPredictedWinner:
        latestPrediction
          ? latestPrediction.predictedWinner
          : "",
    };
  };

userSchema.methods.toJSON =
  function () {
    const user =
      this.toObject();

    delete user.password;
    delete user.passwordResetOtp;
    delete user.passwordResetOtpExpiresAt;
    delete user.passwordResetOtpAttempts;
    delete user.__v;

    return user;
  };

userSchema.index(
  {
    googleId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      googleId: {
        $type: "string",
      },
    },
  }
);

userSchema.index(
  {
    githubId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      githubId: {
        $type: "string",
      },
    },
  }
);

userSchema.index({
  authProvider: 1,
});

userSchema.index({
  createdAt: -1,
});

userSchema.index({
  "predictions.predictedAt": -1,
});

module.exports = mongoose.model(
  "User",
  userSchema
);