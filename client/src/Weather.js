import React, { useState } from "react";
import axios from "axios";

function Weather() {
  // Define state variables for city and forecast data
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState(null);

  // Function to fetch weather data from the server
  const fetchData = async () => {
    try {
      // Make an axios POST request to fetch weather data for the specified city
      const response = await axios.post("http://localhost:3001/weather", {
        city: city,
        days: 1,
      });

      // Set the fetched data to the forecastData state variable
      setForecastData(response.data);
    } catch (error) {
      // Handle errors while fetching weather data
      console.error("Error fetching weather data:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  // Function to handle changes in the city input field
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  // Render the component
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

// Export the Weather component for use in other modules
export default Weather;
