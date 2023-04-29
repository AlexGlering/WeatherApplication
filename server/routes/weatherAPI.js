const axios = require("axios");

const weatherAPI = (city, days = 3) => { // Set the default value of days to 3
  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
    params: { q: city, days: days }, // Pass the days value to the API request
    headers: {
      "X-RapidAPI-Key": "bf37078114mshf90b5103cee1f0dp176d3cjsn3b6c0adcfc58",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  return axios.request(options);
};

module.exports = weatherAPI;
