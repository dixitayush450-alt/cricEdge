const {
  getVenueWeather,
} = require("../services/weatherService");

const getWeather = async (req, res) => {
  try {
    const venue =
      typeof req.query.venue === "string"
        ? req.query.venue.trim()
        : "";

    if (!venue) {
      return res.status(400).json({
        success: false,
        message: "Venue is required",
      });
    }

    const weather =
      await getVenueWeather(venue);

    return res.status(200).json({
      success: true,
      weather,
    });
  } catch (error) {
    console.error(
      "Weather Controller Error:",
      error
    );

    return res
      .status(error.statusCode || 500)
      .json({
        success: false,
        message:
          error.message ||
          "Failed to fetch live weather",
      });
  }
};

module.exports = {
  getWeather,
};