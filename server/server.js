const express = require("express");
const cors = require("cors");
const weatherAPI = require("./routes/weatherAPI");
const Forecast = require("./models/forecast");
const { Sequelize, Op, DataTypes, Model } = require("sequelize");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/weather", async (req, res) => {
  const { city, days } = req.body;

  try {
    const response = await weatherAPI(city, days);
    const weatherData = response.data.forecast.forecastday;

    const forecasts = weatherData.map((weather) => ({
      city: city,
      date: weather.date,
      avgtemp_c: weather.day.avgtemp_c,
      totalprecip_mm: weather.day.totalprecip_mm,
      maxwind_kph: weather.day.maxwind_kph,
      avghumidity: weather.day.avghumidity,
    }));

    // Delete any existing entries for the city
    /*await Forecast.destroy({
      where: {
        city: city,
      },
    });
    */


    const currentDate = new Date().toISOString().split('T')[0];

    const forecastsExpired = await Forecast.findAll({
      where: {
        city: city,
        date: {
          [Op.lt]: currentDate,
        },
      },
    });

    // Delete any existing entries for the city
    if (forecastsExpired.length >= 1){
      await Forecast.destroy({
        where: {
          city: city,
        },
      });
    }


    // Insert the new forecast data
    const savedForecasts = await Forecast.bulkCreate(forecasts);

    res.status(200).json(savedForecasts);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ message: "Error fetching weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
