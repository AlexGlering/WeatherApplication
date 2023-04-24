// Import the axios library for making HTTP requests
const axios = require("axios");

// Define the weatherAPI function that takes city and days as parameters
const weatherAPI = (city, days = false) => {
  // Configure the options for the API request
  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
    // Pass city and days as query parameters
    params: { q: city, days: days },
    headers: {
      // The API key and host are required for authenticating with the Weather API
      "X-RapidAPI-Key": "bf37078114mshf90b5103cee1f0dp176d3cjsn3b6c0adcfc58",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  // Use axios to make the API request with the provided options
  return axios.request(options);
};

// Export the weatherAPI function for use in other modules
module.exports = weatherAPI;
