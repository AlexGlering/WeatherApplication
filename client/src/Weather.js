import React, { useState } from "react";
import axios from "axios";

function Weather() {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:3001/weather", {
        city: city,
        days: 1,
      });

      setForecastData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          City:
          <input type="text" value={city} onChange={handleCityChange} />
        </label>
        <button type="submit">Display Data</button>
      </form>
      {forecastData && (
        <div>
          <h2>{forecastData.city}</h2>
          <ul>
            <li>Average Temperature: {forecastData.avgtemp_c}°C</li>
            <li>Total Precipitation: {forecastData.totalprecip_mm} mm</li>
            <li>Max Wind Speed: {forecastData.maxwind_kph} km/h</li>
            <li>Average Humidity: {forecastData.avghumidity}%</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Weather;
