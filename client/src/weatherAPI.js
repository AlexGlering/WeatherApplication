import axios from "axios";

const weatherAPI = (city, days, shouldSaveData = false) => {
  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
    params: { q: city, days: days, shouldSaveData },
    headers: {
      "X-RapidAPI-Key": "bf37078114mshf90b5103cee1f0dp176d3cjsn3b6c0adcfc58",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  return axios.request(options);
};

export default weatherAPI;
