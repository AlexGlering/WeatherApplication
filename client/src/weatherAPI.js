import axios from "axios";

// This function fetches weather data for a given city and number of days,
// and optionally saves the fetched data to the server-side database
const weatherAPI = (city, days, shouldSaveData = false) => {
  // Configure the options for the API request
  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
    // Pass city, days, and shouldSaveData as query parameters
    params: { q: city, days: days, shouldSaveData },
    headers: {
      // The API key and host are required for authenticating with the Weather API
      "X-RapidAPI-Key": "bf37078114mshf90b5103cee1f0dp176d3cjsn3b6c0adcfc58",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  // Use axios to make the API request with the provided options
  return axios.request(options);
};

export default weatherAPI;
