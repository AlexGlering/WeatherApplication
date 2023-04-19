const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Forecast = require('./models/forecast.model');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.on('error', (error) => {
  console.log('MongoDB connection error:', error);
});

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

app.get('/forecast/:city', async (req, res) => {
  const { city } = req.params;
  const days = req.query.days || 3;
  const shouldSaveData = req.query.shouldSaveData === 'true';

  // Check if forecast data already exists in the database for the specified city
  let forecastData = await Forecast.findOne({ city, days });

  if (!forecastData) {
    // If no forecast data exists in the database, fetch it from the API and store it in the database
    const options = {
      method: "GET",
      url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
      params: { q: city, days: days },
      headers: {
        "X-RapidAPI-Key": "bf37078114mshf90b5103cee1f0dp176d3cjsn3b6c0adcfc58",
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const hourlyData = response.data.forecast.forecastday.flatMap(day =>
        day.hour.map(hour => ({
          time: hour.time,
          temperature: hour.temp_c,
          windSpeed: hour.wind_kph,
        }))
      );

      forecastData = new Forecast({
        city,
        days,
        hourlyData,
      });

      if (shouldSaveData) {
        await forecastData.save();
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch forecast data" });
    }
  }

  // Return the forecast data from the database
  res.json(forecastData.hourlyData);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
