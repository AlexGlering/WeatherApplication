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

    console.log("Hi! I am alive");

    const currentDate = new Date().toISOString().split('T')[0];
    
    
    // Checking if info on the city exists in the DB already
    const inDatabase = await Forecast.findAll({
      where: {
        city: city,
      },
    })

    // If inDatabase is not empty then it exists in the DB if not we can just immediately insert the pulled information.
    if (inDatabase.length > 0){
    
      // Checks if any of the forecasts for the given city is out of date.
      const forecastsExpired = inDatabase.filter((forecast) => {
        return forecast.date < currentDate;
      });


    // Delete any existing entries for the city if anything is expired or data is missing
      if (forecastsExpired.length >= 1 || inDatabase.length != 3){
      
        await Forecast.destroy({
          where: {
            city: city,
          },
        });
        const savedForecasts = await Forecast.bulkCreate(forecasts);
        res.status(200).json(savedForecasts);
      } 
      else{
        // If the city exists in the DB and nothing is expired,then just present the info from the database.
        res.status(200).json(inDatabase);
      }
    } else{ 
        // The city is not in the DB
        const savedForecasts = await Forecast.bulkCreate(forecasts);
        res.status(200).json(savedForecasts);
      }
  } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ message: "Error fetching weather data" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

