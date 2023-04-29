// Importing necessary modules
import React, { useState } from "react"; // Importing React and useState hooks
import axios from "axios"; // Importing axios library for making HTTP requests

// Defining a functional component called "Weather"
function Weather() {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState(null);

  // Defining an asynchronous function to fetch weather data from the server
  const fetchData = async () => {
    try {
      // Making a post request to the server to fetch weather data for the given city and day
      const response = await axios.post("http://localhost:3001/weather", {
        city: city,
        days: 1,
      });

      // Setting the fetched data to "forecastData" state variable
      setForecastData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Handling form submission by calling "fetchData" function
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  // Handling input change by setting "city" state variable
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  // Formatting weather data into an array of objects
  const data = forecastData
    ? [
        {
          name: "Avg Temp",
          value: forecastData.avgtemp_c,
        },
        {
          name: "Total Precip",
          value: forecastData.totalprecip_mm,
        },
        {
          name: "Max Wind",
          value: forecastData.maxwind_kph,
        },
        {
          name: "Avg Humidity",
          value: forecastData.avghumidity,
        },
      ]
    : [];

  // Rendering form and weather data
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
