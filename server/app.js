const express = require("express");
const cors = require("cors");

const passport = require("./config/passport");

const matchRoutes = require("./routes/matchRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,

  "http://localhost:5173",
  "http://localhost:5174",

  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("CORS blocked origin:", origin);

    return callback(
      new Error(`Origin ${origin} is not allowed by CORS`)
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
  ],

  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(passport.initialize());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "CricEDGE Backend Running Successfully!",
  });
});

app.use("/api/matches", matchRoutes);

app.use("/api/predict", predictionRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/weather", weatherRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Application error:", error);

  if (
    error.message &&
    error.message.includes("not allowed by CORS")
  ) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(error.status || 500).json({
    success: false,
    message:
      error.message ||
      "Internal server error",
  });
});

module.exports = app;