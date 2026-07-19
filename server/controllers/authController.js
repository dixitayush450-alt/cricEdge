const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const {
  sendPasswordResetOtpEmail,
} = require("../services/emailService");

const ALLOWED_AVATARS = [
  "avatar1",
  "avatar2",
  "avatar3",
];

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const hashValue = (value) => {
  return crypto
    .createHash("sha256")
    .update(String(value))
    .digest("hex");
};

const generateOtp = () => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};

const safeUser = (user) => {
  const data =
    typeof user.toObject === "function"
      ? user.toObject()
      : { ...user };

  delete data.password;
  delete data.otp;
  delete data.otpExpiresAt;
  delete data.otpAttempts;
  delete data.passwordResetOtp;
  delete data.passwordResetOtpExpiresAt;
  delete data.passwordResetOtpAttempts;
  delete data.__v;

  return data;
};

const sendAuthResponse = (
  res,
  statusCode,
  message,
  user,
  remember = true
) => {
  const token = generateToken(user._id);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    remember,
    user: safeUser(user),
  });
};

const getValidationError = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });

    return true;
  }

  return false;
};

const signup = async (req, res) => {
  try {
    if (getValidationError(req, res)) {
      return;
    }

    const {
      name,
      email,
      password,
      avatar = "avatar1",
    } = req.body;

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    const selectedAvatar =
      ALLOWED_AVATARS.includes(avatar)
        ? avatar
        : "avatar1";

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      avatar: selectedAvatar,
      authProvider: "local",
      isEmailVerified: false,
      lastLoginAt: new Date(),
    });

    return sendAuthResponse(
      res,
      201,
      "Account created successfully",
      user
    );
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create account",
    });
  }
};

const login = async (req, res) => {
  try {
    if (getValidationError(req, res)) {
      return;
    }

    const {
      email,
      password,
      remember = false,
    } = req.body;

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "This account has been disabled",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: `This account uses ${user.authProvider} login`,
      });
    }

    const passwordMatches =
      await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLoginAt = new Date();

    await user.save({
      validateBeforeSave: false,
    });

    return sendAuthResponse(
      res,
      200,
      "Login successful",
      user,
      remember
    );
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    if (getValidationError(req, res)) {
      return;
    }

    const normalizedEmail = req.body.email
      .toLowerCase()
      .trim();

    const user = await User.findOne({
  email: normalizedEmail,
}).select(
  "+password +passwordResetOtp +passwordResetOtpExpiresAt +passwordResetOtpAttempts"
);
    /*
      Security ke liye unknown email par bhi same message.
      Isse account enumeration nahi hota.
    */
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists, a reset OTP has been sent",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: `This account uses ${user.authProvider} login. Please continue with ${user.authProvider}.`,
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "This account has been disabled",
      });
    }

    const otp = generateOtp();

    user.passwordResetOtp = hashValue(otp);
    user.passwordResetOtpExpiresAt =
      new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetOtpAttempts = 0;

    await user.save({
      validateBeforeSave: false,
    });

    try {
      await sendPasswordResetOtpEmail({
        email: user.email,
        name: user.name,
        otp,
      });
    } catch (emailError) {
      user.passwordResetOtp = null;
      user.passwordResetOtpExpiresAt = null;
      user.passwordResetOtpAttempts = 0;

      await user.save({
        validateBeforeSave: false,
      });

      console.error(
        "Password reset email error:",
        emailError
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to send reset email. Check email configuration.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Password reset OTP has been sent to your email",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request",
    });
  }
};

const verifyResetOtp = async (req, res) => {
  try {
    if (getValidationError(req, res)) {
      return;
    }

    const {
      email,
      otp,
    } = req.body;

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+passwordResetOtp +passwordResetOtpExpiresAt +passwordResetOtpAttempts"
    );

    if (
      !user ||
      !user.passwordResetOtp ||
      !user.passwordResetOtpExpiresAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset request was not found",
      });
    }

    if (
      user.passwordResetOtpExpiresAt.getTime() <
      Date.now()
    ) {
      user.passwordResetOtp = null;
      user.passwordResetOtpExpiresAt = null;
      user.passwordResetOtpAttempts = 0;

      await user.save({
        validateBeforeSave: false,
      });

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Request a new OTP.",
      });
    }

    if (
      (user.passwordResetOtpAttempts || 0) >= 5
    ) {
      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Request a new OTP.",
      });
    }

    const enteredOtpHash = hashValue(otp);

    if (
      enteredOtpHash !== user.passwordResetOtp
    ) {
      user.passwordResetOtpAttempts =
        (user.passwordResetOtpAttempts || 0) +
        1;

      await user.save({
        validateBeforeSave: false,
      });

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const resetToken = jwt.sign(
      {
        userId: user._id,
        purpose: "password-reset",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error(
      "Verify reset OTP error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    if (getValidationError(req, res)) {
      return;
    }

    const {
      resetToken,
      password,
    } = req.body;

    let decoded;

    try {
      decoded = jwt.verify(
        resetToken,
        process.env.JWT_SECRET
      );
    } catch {
      return res.status(401).json({
        success: false,
        message:
          "Reset session expired. Request a new OTP.",
      });
    }

    if (
      decoded.purpose !== "password-reset"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    const user = await User.findById(
      decoded.userId
    ).select(
      "+password +passwordResetOtp +passwordResetOtpExpiresAt +passwordResetOtpAttempts"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !user.passwordResetOtp ||
      !user.passwordResetOtpExpiresAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset request has already been used or expired",
      });
    }

    user.password = password;
    user.passwordResetOtp = null;
    user.passwordResetOtpExpiresAt = null;
    user.passwordResetOtpAttempts = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};

const googleCallback = async (req, res) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5173";

  try {
    if (!req.user) {
      return res.redirect(
        `${frontendUrl}/login?error=google_auth_failed`
      );
    }

    req.user.lastLoginAt = new Date();

    await req.user.save({
      validateBeforeSave: false,
    });

    const token = generateToken(req.user._id);

    return res.redirect(
      `${frontendUrl}/oauth-success?token=${encodeURIComponent(
        token
      )}`
    );
  } catch (error) {
    console.error(
      "Google callback error:",
      error
    );

    return res.redirect(
      `${frontendUrl}/login?error=google_auth_failed`
    );
  }
};

const githubCallback = async (req, res) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5173";

  try {
    if (!req.user) {
      return res.redirect(
        `${frontendUrl}/login?error=github_auth_failed`
      );
    }

    req.user.lastLoginAt = new Date();

    await req.user.save({
      validateBeforeSave: false,
    });

    const token = generateToken(req.user._id);

    return res.redirect(
      `${frontendUrl}/oauth-success?token=${encodeURIComponent(
        token
      )}`
    );
  } catch (error) {
    console.error(
      "GitHub callback error:",
      error
    );

    return res.redirect(
      `${frontendUrl}/login?error=github_auth_failed`
    );
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId =
      req.user.userId || req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: safeUser(user),
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user",
    });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (getValidationError(req, res)) {
      return;
    }

    const userId =
      req.user.userId || req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        avatar: req.body.avatar,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: safeUser(user),
    });
  } catch (error) {
    console.error(
      "Update avatar error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update avatar",
    });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  googleCallback,
  githubCallback,
  getCurrentUser,
  updateAvatar,
};