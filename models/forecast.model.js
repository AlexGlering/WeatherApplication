const mongoose = require('mongoose');

const hourlyDataSchema = new mongoose.Schema({
  time: String,
  temperature: Number,
  windSpeed: Number,
});

const forecastSchema = new mongoose.Schema({
  city: String,
  days: Number,
  hourlyData: [hourlyDataSchema],
});

const Forecast = mongoose.model('Forecast', forecastSchema);

module.exports = Forecast;
