const passport = require("passport");

const GoogleStrategy =
  require("passport-google-oauth20").Strategy;

const GitHubStrategy =
  require("passport-github2").Strategy;

const User = require("../models/User");

const DEFAULT_AVATAR = "avatar1";

const getUniqueGithubEmail = (profile) => {
  return `github-${profile.id}@users.cricedge.local`;
};

const repairUserAvatar = (user, profileImage) => {
  const allowedAvatars = [
    "avatar1",
    "avatar2",
    "avatar3",
  ];

  if (!allowedAvatars.includes(user.avatar)) {
    user.avatar = DEFAULT_AVATAR;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }
};

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          process.env.GOOGLE_CLIENT_ID,

        clientSecret:
          process.env.GOOGLE_CLIENT_SECRET,

        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:5000/api/auth/google/callback",
      },

      async (
        accessToken,
        refreshToken,
        profile,
        done
      ) => {
        try {
          const googleId = String(
            profile.id
          );

          const email =
            profile.emails?.[0]?.value
              ?.toLowerCase()
              .trim() || "";

          const name =
            profile.displayName?.trim() ||
            email.split("@")[0] ||
            "CricEDGE User";

          const profileImage =
            profile.photos?.[0]?.value ||
            "";

          let user = await User.findOne({
            googleId,
          });

          if (user) {
            repairUserAvatar(
              user,
              profileImage
            );

            user.isEmailVerified = true;
            user.lastLoginAt = new Date();

            await user.save({
              validateBeforeSave: false,
            });

            return done(null, user);
          }

          if (email) {
            user = await User.findOne({
              email,
            });

            if (user) {
              user.googleId = googleId;

              if (
                user.authProvider !==
                "local"
              ) {
                user.authProvider =
                  "google";
              }

              repairUserAvatar(
                user,
                profileImage
              );

              user.isEmailVerified = true;
              user.lastLoginAt =
                new Date();

              await user.save({
                validateBeforeSave: false,
              });

              return done(null, user);
            }
          }

          user = await User.create({
            name,

            email:
              email ||
              `google-${googleId}@users.cricedge.local`,

            avatar: DEFAULT_AVATAR,
            profileImage,

            authProvider: "google",
            googleId,

            isEmailVerified: true,
            lastLoginAt: new Date(),
          });

          return done(null, user);
        } catch (error) {
          console.error(
            "Google OAuth error:",
            error
          );

          return done(error, null);
        }
      }
    )
  );
}

if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
) {
  passport.use(
    new GitHubStrategy(
      {
        clientID:
          process.env.GITHUB_CLIENT_ID,

        clientSecret:
          process.env.GITHUB_CLIENT_SECRET,

        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          "http://localhost:5000/api/auth/github/callback",

        scope: ["user:email"],
      },

      async (
        accessToken,
        refreshToken,
        profile,
        done
      ) => {
        try {
          const githubId = String(
            profile.id
          );

          const email =
            profile.emails?.[0]?.value
              ?.toLowerCase()
              .trim() ||
            getUniqueGithubEmail(profile);

          const name =
            profile.displayName?.trim() ||
            profile.username?.trim() ||
            email.split("@")[0] ||
            "CricEDGE User";

          const profileImage =
            profile.photos?.[0]?.value ||
            "";

          let user = await User.findOne({
            githubId,
          });

          if (user) {
            repairUserAvatar(
              user,
              profileImage
            );

            user.isEmailVerified = true;
            user.lastLoginAt = new Date();

            await user.save({
              validateBeforeSave: false,
            });

            return done(null, user);
          }

          user = await User.findOne({
            email,
          });

          if (user) {
            user.githubId = githubId;

            if (
              user.authProvider !==
              "local"
            ) {
              user.authProvider =
                "github";
            }

            repairUserAvatar(
              user,
              profileImage
            );

            user.isEmailVerified = true;
            user.lastLoginAt = new Date();

            await user.save({
              validateBeforeSave: false,
            });

            return done(null, user);
          }

          user = await User.create({
            name,
            email,

            avatar: DEFAULT_AVATAR,
            profileImage,

            authProvider: "github",
            githubId,

            isEmailVerified: true,
            lastLoginAt: new Date(),
          });

          return done(null, user);
        } catch (error) {
          console.error(
            "GitHub OAuth error:",
            error
          );

          return done(error, null);
        }
      }
    )
  );
}

module.exports = passport;