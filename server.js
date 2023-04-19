const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Import the Forecast model
const Forecast = require('./models/forecast.model');

// Create an instance of the express server
const app = express();
const port = process.env.PORT || 5000;

// Start the server
app.use(cors());
app.use(express.json());


const uri = process.env.DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the connection to the database
const connection = mongoose.connection;

connection.on('error', (error) => {
  console.log('MongoDB connection error:', error);
});

// Once the connection is established, log a message to the console
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Route to fetch weather data from the API and store it in the database
app.get('/forecast/:city', async (req, res) => {
  const { city } = req.params;
  const days = req.query.days || 3;
  // Convert the string value of the 'shouldSaveData' query parameter to a boolean value
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

    // Use axios to make the API request with the provided options
    try {
      const response = await axios.request(options);
      // Extract the hourly data from the response
      const hourlyData = response.data.forecast.forecastday.flatMap(day =>
        day.hour.map(hour => ({
          time: hour.time,
          temperature: hour.temp_c,
          windSpeed: hour.wind_kph,
        }))
      );

      // Create a new Forecast document
      forecastData = new Forecast({
        city,
        days,
        hourlyData,
      });

      // Save the document to the database if shouldSaveData is true
      if (shouldSaveData) {
        await forecastData.save();
      }
      // Catch any errors that occur while fetching the data from the API
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch forecast data" });
    }
  }

  // Add the 'isDataSaved' property to the response object
  // This property is set to 'true' if and only if the data is successfully stored in the MongoDB database
  // The condition checks if shouldSaveData is true, forecastData exists, and forecastData has an _id property
  res.json({
    hourlyData: forecastData.hourlyData,
    isDataSaved: shouldSaveData && forecastData && forecastData._id,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
