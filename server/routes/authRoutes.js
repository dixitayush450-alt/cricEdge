const express = require("express");
const passport = require("passport");
const { body } = require("express-validator");

const {
  signup,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  googleCallback,
  githubCallback,
  getCurrentUser,
  updateAvatar,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name")
      .trim()
      .isLength({
        min: 2,
        max: 50,
      })
      .withMessage(
        "Name must contain between 2 and 50 characters"
      ),

    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage(
        "Please enter a valid email address"
      ),

    body("password")
      .isLength({
        min: 6,
      })
      .withMessage(
        "Password must contain at least 6 characters"
      ),
  ],
  signup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage(
        "Please enter a valid email address"
      ),

    body("password")
      .notEmpty()
      .withMessage(
        "Password is required"
      ),
  ],
  login
);

if (forgotPassword) {
  router.post(
    "/forgot-password",
    [
      body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage(
          "Please enter a valid email address"
        ),
    ],
    forgotPassword
  );
}

if (verifyResetOtp) {
  router.post(
    "/verify-reset-otp",
    [
      body("email")
        .isEmail()
        .normalizeEmail(),

      body("otp")
        .isLength({
          min: 6,
          max: 6,
        })
        .withMessage(
          "OTP must contain 6 digits"
        ),
    ],
    verifyResetOtp
  );
}

if (resetPassword) {
  router.post(
    "/reset-password",
    [
      body("resetToken")
        .notEmpty()
        .withMessage(
          "Reset token is required"
        ),

      body("password")
        .isLength({
          min: 6,
        })
        .withMessage(
          "Password must contain at least 6 characters"
        ),
    ],
    resetPassword
  );
}

router.get(
  "/google",
  passport.authenticate(
    "google",
    {
      scope: [
        "profile",
        "email",
      ],
      session: false,
      prompt: "select_account",
    }
  )
);

router.get(
  "/google/callback",
  passport.authenticate(
    "google",
    {
      session: false,
      failureRedirect: `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/login?error=google_auth_failed`,
    }
  ),
  googleCallback
);

router.get(
  "/github",
  passport.authenticate(
    "github",
    {
      scope: ["user:email"],
      session: false,
    }
  )
);

router.get(
  "/github/callback",
  passport.authenticate(
    "github",
    {
      session: false,
      failureRedirect:
        "http://localhost:5173/login?error=github_auth_failed",
    }
  ),
  githubCallback
);

router.get(
  "/me",
  protect,
  getCurrentUser
);

if (updateAvatar) {
  router.put(
    "/avatar",
    protect,
    [
      body("avatar")
        .isIn([
          "avatar1",
          "avatar2",
          "avatar3",
        ])
        .withMessage(
          "Invalid avatar selected"
        ),
    ],
    updateAvatar
  );
}

module.exports = router;