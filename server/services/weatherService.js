const VENUE_COORDINATES = {
  "Chepauk, Chennai": {
    latitude: 13.0627,
    longitude: 80.2792,
    city: "Chennai",
  },
  "Wankhede, Mumbai": {
    latitude: 18.9389,
    longitude: 72.8258,
    city: "Mumbai",
  },
  "Chinnaswamy, Bengaluru": {
    latitude: 12.9788,
    longitude: 77.5996,
    city: "Bengaluru",
  },
  "Eden Gardens, Kolkata": {
    latitude: 22.5646,
    longitude: 88.3433,
    city: "Kolkata",
  },
  "Rajiv Gandhi, Hyderabad": {
    latitude: 17.4065,
    longitude: 78.5504,
    city: "Hyderabad",
  },
  "Arun Jaitley, Delhi": {
    latitude: 28.6378,
    longitude: 77.2432,
    city: "Delhi",
  },
  "Punjab CA, Mohali": {
    latitude: 30.6909,
    longitude: 76.7375,
    city: "Mohali",
  },
  "Sawai Mansingh, Jaipur": {
    latitude: 26.894,
    longitude: 75.8032,
    city: "Jaipur",
  },
  "Narendra Modi, Ahmedabad": {
    latitude: 23.0917,
    longitude: 72.5975,
    city: "Ahmedabad",
  },
  "BRSABV Ekana, Lucknow": {
    latitude: 26.8115,
    longitude: 80.8836,
    city: "Lucknow",
  },
};

const normalizeVenue = (venue) => {
  if (typeof venue !== "string") {
    return "";
  }

  return venue.trim();
};

const findVenueCoordinates = (venue) => {
  const normalizedVenue = normalizeVenue(venue);

  if (VENUE_COORDINATES[normalizedVenue]) {
    return {
      venue: normalizedVenue,
      ...VENUE_COORDINATES[normalizedVenue],
    };
  }

  const matchingVenue = Object.keys(
    VENUE_COORDINATES
  ).find((knownVenue) => {
    const knownVenueLower =
      knownVenue.toLowerCase();

    const requestedVenueLower =
      normalizedVenue.toLowerCase();

    return (
      knownVenueLower.includes(
        requestedVenueLower
      ) ||
      requestedVenueLower.includes(
        knownVenueLower
      )
    );
  });

  if (!matchingVenue) {
    return null;
  }

  return {
    venue: matchingVenue,
    ...VENUE_COORDINATES[matchingVenue],
  };
};

const getNearestHourlyValue = (
  hourlyTimes,
  hourlyValues
) => {
  if (
    !Array.isArray(hourlyTimes) ||
    !Array.isArray(hourlyValues) ||
    hourlyTimes.length === 0 ||
    hourlyValues.length === 0
  ) {
    return 0;
  }

  const currentTime = Date.now();

  let closestIndex = 0;
  let smallestDifference = Infinity;

  hourlyTimes.forEach((time, index) => {
    const parsedTime = new Date(time).getTime();

    if (Number.isNaN(parsedTime)) {
      return;
    }

    const difference = Math.abs(
      parsedTime - currentTime
    );

    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestIndex = index;
    }
  });

  const value = Number(
    hourlyValues[closestIndex]
  );

  return Number.isFinite(value) ? value : 0;
};

const getWeatherDescription = (
  weatherCode
) => {
  const code = Number(weatherCode);

  if (code === 0) {
    return "Clear";
  }

  if ([1, 2, 3].includes(code)) {
    return "Partly cloudy";
  }

  if ([45, 48].includes(code)) {
    return "Foggy";
  }

  if (
    [51, 53, 55, 56, 57].includes(code)
  ) {
    return "Drizzle";
  }

  if (
    [61, 63, 65, 66, 67].includes(code)
  ) {
    return "Rain";
  }

  if ([71, 73, 75, 77].includes(code)) {
    return "Snow";
  }

  if ([80, 81, 82].includes(code)) {
    return "Rain showers";
  }

  if ([95, 96, 99].includes(code)) {
    return "Thunderstorm";
  }

  return "Current conditions";
};

const getVenueWeather = async (venue) => {
  const venueDetails =
    findVenueCoordinates(venue);

  if (!venueDetails) {
    const error = new Error(
      "Weather is not available for the selected venue"
    );

    error.statusCode = 400;
    throw error;
  }

  const params = new URLSearchParams({
    latitude: String(
      venueDetails.latitude
    ),
    longitude: String(
      venueDetails.longitude
    ),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation",
      "rain",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    hourly: "precipitation_probability",
    forecast_days: "1",
    timezone: "auto",
  });

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const response = await fetch(weatherUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      "Live weather service is unavailable"
    );
  }

  const weatherResponse =
    await response.json();

  const current =
    weatherResponse.current || {};

  const rainProbability =
    getNearestHourlyValue(
      weatherResponse.hourly?.time,
      weatherResponse.hourly
        ?.precipitation_probability
    );

  const temperature = Number(
    current.temperature_2m
  );

  const humidity = Number(
    current.relative_humidity_2m
  );

  const windSpeed = Number(
    current.wind_speed_10m
  );

  const precipitation = Number(
    current.precipitation
  );

  const rain = Number(current.rain);

  return {
    venue: venueDetails.venue,
    city: venueDetails.city,
    latitude: venueDetails.latitude,
    longitude: venueDetails.longitude,

    temperature: Number.isFinite(
      temperature
    )
      ? temperature
      : 0,

    humidity: Number.isFinite(humidity)
      ? humidity
      : 0,

    windSpeed: Number.isFinite(windSpeed)
      ? windSpeed
      : 0,

    rainProbability: Number.isFinite(
      rainProbability
    )
      ? rainProbability
      : 0,

    precipitation: Number.isFinite(
      precipitation
    )
      ? precipitation
      : 0,

    rain: Number.isFinite(rain)
      ? rain
      : 0,

    weatherCode:
      Number(current.weather_code) || 0,

    condition: getWeatherDescription(
      current.weather_code
    ),

    observedAt:
      current.time ||
      new Date().toISOString(),
  };
};

module.exports = {
  getVenueWeather,
  findVenueCoordinates,
};