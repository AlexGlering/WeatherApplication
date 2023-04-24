// Import necessary modules
const express = require("express");
const cors = require("cors");
const weatherAPI = require("./weatherAPI");
const Forecast = require("./models/forecast");

// Initialize Express app and set the port
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for CORS and parsing JSON in request body
app.use(cors());
app.use(express.json());

// POST route to fetch weather data
app.post("/weather", async (req, res) => {
  const { city, days } = req.body;
  const currentDate = new Date().toISOString().split("T")[0];

  try {
    const response = await weatherAPI(city, days, false);
    const weather = response.data.forecast.forecastday[0];

    const forecast = {
      city: city,
      date: currentDate,
      avgtemp_c: weather.day.avgtemp_c,
      totalprecip_mm: weather.day.totalprecip_mm,
      maxwind_kph: weather.day.maxwind_kph,
      avghumidity: weather.day.avghumidity,
    };

    // Delete any existing entries for the city
    await Forecast.destroy({
      where: {
        city: city,
      },
    });

    // Insert the new forecast data
    const savedForecast = await Forecast.create(forecast);

    res.status(200).json(savedForecast);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ message: "Error fetching weather data" });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
