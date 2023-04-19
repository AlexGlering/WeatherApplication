import React, { useState, useEffect } from "react";
import weatherAPI from "./weatherAPI";
import Graph from "./Graph";

// Weather component to display and save weather data for a given city
const Weather = () => {
  // State variables
  const [city, setCity] = useState(""); // City input
  const [days] = useState(3); // Number of days to show weather data
  const [weatherData, setWeatherData] = useState(null); // Weather data received from API
  const [displayWeatherData, setDisplayWeatherData] = useState(false); // Control the display of weather data
  const [displayGraph, setDisplayGraph] = useState(false); // Control the display of the graph
  const [shouldSaveData, setShouldSaveData] = useState(false); // Control whether the data should be saved or not
  const [isDataSaved, setIsDataSaved] = useState(false); // Show if data is saved successfully

  // useEffect to fetch weather data when displayWeatherData, city, days, or shouldSaveData change
  useEffect(() => {
    if (displayWeatherData && city) {
      weatherAPI(city, days, shouldSaveData)
      .then((response) => {
        setWeatherData(response.data);
        if (response.data.isDataSaved) {
          setIsDataSaved(true);
          setTimeout(() => {
            setIsDataSaved(false);
          }, 3000);
        }
        setShouldSaveData(false); // Reset the shouldSaveData state after the request
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }, [displayWeatherData, city, days, shouldSaveData]);

  // Function to render weather data
  const renderWeatherData = () => {
    if (weatherData && weatherData.forecast && weatherData.forecast.forecastday) {
      return (
        <>
          <h1>{weatherData.location.name}</h1>
          {/* Map through the forecast data and display it */}
          {weatherData.forecast.forecastday.slice(0, days).map((day) => (
            <div key={day.date}>
              <h2>{day.date}</h2>
              <p>Max Temp: {day.day.maxtemp_c}°C</p>
              <p>Min Temp: {day.day.mintemp_c}°C</p>
              <p>Average Temp: {day.day.avgtemp_c}°C</p>
              <p>Max Wind: {day.day.maxwind_kph} km/h</p>
              <p>Total Precipitation: {day.day.totalprecip_mm} mm</p>
              <p>Average Humidity: {day.day.avghumidity}%</p>
              <p>UV Index: {day.day.uv}</p>
            </div>
          ))}
          {/* Button to toggle graph display */}
          <button onClick={() => setDisplayGraph(!displayGraph)}>
            {displayGraph ? "Hide Graph" : "Show Graph"}
          </button>
        </>
      );
    }
  };

  return (
    <div>
      {/* City input field */}
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      {/* Button to display weather data */}
      <button onClick={() => setDisplayWeatherData(true)}>Show Weather Data</button>
      {/* Button to save weather data */}
      <button onClick={() => setShouldSaveData(true)}>Save Data</button>
      {/* Message shown when data is saved */}
      {isDataSaved && <p>Data saved</p>}
      {/* Render weather data */}
      {displayWeatherData && renderWeatherData()}
      {/* Display the graph if the displayGraph state is true and weatherData is available */}
      {displayWeatherData && displayGraph && weatherData && (
        <Graph
          hourlyData={weatherData.forecast.forecastday
            .slice(0, days)
            .flatMap((day) => day.hour)
            .map((hour) => ({
              temperature: hour.temp_c,
              windSpeed: hour.wind_kph,
              precipitation: hour.totalprecip_mm,
            }))}
        />
      )}
    </div>
  );
};

export default Weather;

