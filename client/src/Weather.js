// Imports
import React, { useState } from "react"; // Import React and useState hook
import axios from "axios"; // Import axios for HTTP requests
import WeatherBarChart from "./WeatherBarChart"; // Import WeatherBarChart component

// Weather component for rendering a form for entering a city and displaying weather data
function Weather() {
  // State variables
  const [city, setCity] = useState(""); // City input
  const [displayedCity, setDisplayedCity] = useState(""); // Displayed city name
  const [forecastData, setForecastData] = useState(null); // Forecast data

  // Fetch weather data from server
  const fetchData = async () => {
    try {
      // Send HTTP request with city and days
      const response = await axios.post("http://localhost:3001/weather", {
        city: city,
        days: 3,
      });

      // Update state with fetched data
      setForecastData(response.data);
      setDisplayedCity(city);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  // Handle city input change
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  // Process forecast data into desired format
  const forecastList = forecastData
    ? forecastData.map((forecast) => ({
        name: forecast.date,
        temp: forecast.avgtemp_c,
        precip: forecast.totalprecip_mm,
        wind: forecast.maxwind_kph,
        humidity: forecast.avghumidity,
      }))
    : [];

  // Render component
  return (
    <div>
      {/* Form for city input and button */}
      <form onSubmit={handleSubmit}>
        <label>
          City:
          <input id="cityName" type="text" value={city} onChange={handleCityChange} />
        </label>
        <button id="displayButton" type="submit">Display Data</button>
      </form>
      {/* Render weather data */}
      {forecastData && (
        <div>
          {/* Display city name */}
          <h2>{displayedCity}</h2>
          {/* Map forecast data to list items */}
          {forecastList.map((dayData, index) => (
            <div key={index}>
              <h3>{dayData.name}</h3>
              <ul>
                <li id="avgTemp">Average Temperature: {dayData.temp}°C</li>
                <li id="totPrec">Total Precipitation: {dayData.precip} mm</li>
                <li id="maxWind">Max Wind Speed: {dayData.wind} km/h</li>
                <li id="avgHumi">Average Humidity: {dayData.humidity}%</li>
              </ul>
            </div>
          ))}
          {/* Render WeatherBarChart components */}
          <WeatherBarChart
            data={forecastList.map((day) => ({
              name: day.name,
              value: day.temp,
            }))}
            title="Average Temperature"
            dataKey="value"
            yAxisLabel="°C"
          />
          <WeatherBarChart
            data={forecastList.map((day) => ({
              name: day.name,
              value: day.precip,
            }))}
            title="Total Precipitation"
            dataKey="value"
            yAxisLabel="mm"
          />
          <WeatherBarChart
            data={forecastList.map((day) => ({
              name: day.name,
              value: day.wind,
            }))}
            title="Max Wind Speed"
            dataKey="value"
            yAxisLabel="km/h"
          />
          <WeatherBarChart
            data={forecastList.map((day) => ({
              name: day.name,
              value: day.humidity,
            }))}
            title="Average Humidity"
            dataKey="value"
            yAxisLabel="%"
          />
        </div>
      )}
    </div>
  );
}

export default Weather;
