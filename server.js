const express = require("express");
const cors = require("cors");
const weatherAPI = require("./weatherAPI");
const Forecast = require("./models/forecast");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/weather", async (req, res) => {
  const { city, days } = req.body;

  try {
    const forecastData = await Forecast.findOne({
      where: {
        city: city,
        date: new Date().toISOString().split("T")[0],
      },
    });

    if (!forecastData) {
      const response = await weatherAPI(city, days, false);
      const weather = response.data.forecast.forecastday[0];

      const newForecast = {
        city: city,
        date: new Date(),
        avgtemp_c: weather.day.avgtemp_c,
        totalprecip_mm: weather.day.totalprecip_mm,
        maxwind_kph: weather.day.maxwind_kph,
        avghumidity: weather.day.avghumidity,
      };

      const savedForecast = await Forecast.create(newForecast);
      res.status(200).json(savedForecast);
    } else {
      res.status(200).json(forecastData);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ message: "Error fetching weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
