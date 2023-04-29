import React, { useState } from "react";
import axios from "axios";
//import WeatherBarChart from "./WeatherBarChart";

function Weather() {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:3001/weather", {
        city: city,
        days: 3,
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

  const forecastList = forecastData
    ? forecastData.map((forecast) => ({
        name: forecast.date,
        temp: forecast.avgtemp_c,
        precip: forecast.totalprecip_mm,
        wind: forecast.maxwind_kph,
        humidity: forecast.avghumidity,
      }))
    : [];

  {/*const data = {
    temp: forecastList.map((day) => ({ name: day.name, value: day.temp })),
    precip: forecastList.map((day) => ({ name: day.name, value: day.precip })),
    wind: forecastList.map((day) => ({ name: day.name, value: day.wind })),
    humidity: forecastList.map((day) => ({ name: day.name, value: day.humidity })),
  };
  */}

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
          <h2>{city}</h2>
          {forecastList.map((dayData, index) => (
            <div key={index}>
              <h3>{dayData.name}</h3>
              <ul>
                <li>Average Temperature: {dayData.temp}°C</li>
                <li>Total Precipitation: {dayData.precip} mm</li>
                <li>Max Wind Speed: {dayData.wind} km/h</li>
                <li>Average Humidity: {dayData.humidity}%</li>
              </ul>
            </div>
          ))}
          {/*<h3>Average Temperature</h3>
          <WeatherBarChart data={data.temp} />
          <h3>Total Precipitation</h3>
          <WeatherBarChart data={data.precip} />
          <h3>Max Wind Speed</h3>
          <WeatherBarChart data={data.wind} />
          <h3>Average Humidity</h3>
          <WeatherBarChart data={data.humidity} />*/}
        </div>
      )}
    </div>
  );
}

export default Weather;
