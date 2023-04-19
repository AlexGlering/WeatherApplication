// Import required modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Import Forecast schema
const Forecast = require('./models/forecast.model');

// Create an Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware for handling CORS and parsing JSON
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the connection URI from environment variables
const uri = process.env.DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

// Handle connection errors
connection.on('error', (error) => {
  console.log('MongoDB connection error:', error);
});

// Log successful connection to the MongoDB database
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Route for fetching forecast data for a city
app.get('/forecast/:city', async (req, res) => {
  const { city } = req.params;
  const days = req.query.days || 3;
  const shouldSaveData = req.query.shouldSaveData === 'true';

  // Check if forecast data already exists in the database for the specified city
  let forecastData = await Forecast.findOne({ city, days });

  // If no forecast data exists in the database, fetch it from the API and store it in the database
  if (!forecastData) {
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
      // Fetch the forecast data from the API
      const response = await axios.request(options);
      // Process the hourly data from the API response
      const hourlyData = response.data.forecast.forecastday.flatMap(day =>
        day.hour.map(hour => ({
          time: hour.time,
          temperature: hour.temp_c,
          windSpeed: hour.wind_kph,
        }))
      );

      // Create a new Forecast document using the fetched data
      forecastData = new Forecast({
        city,
        days,
        hourlyData,
      });

      // Save the forecast data to the database if shouldSaveData is true
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

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
