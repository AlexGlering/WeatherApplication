import React, { useState, useEffect } from "react";
import weatherAPI from "./weatherAPI";
import Graph from "./Graph";

const Weather = () => {
  const [city, setCity] = useState("");
  const [days] = useState(3);
  const [weatherData, setWeatherData] = useState(null);
  const [displayWeatherData, setDisplayWeatherData] = useState(false);
  const [displayGraph, setDisplayGraph] = useState(false);
  const [shouldSaveData, setShouldSaveData] = useState(false);
  const [isDataSaved, setIsDataSaved] = useState(false);

  useEffect(() => {
    if (displayWeatherData && city) {
      weatherAPI(city, days, shouldSaveData)
        .then((response) => {
          setWeatherData(response.data);
          if (shouldSaveData) {
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

  const renderWeatherData = () => {
    if (weatherData && weatherData.forecast && weatherData.forecast.forecastday) {
      return (
        <>
          <h1>{weatherData.location.name}</h1>
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
          <button onClick={() => setDisplayGraph(!displayGraph)}>
            {displayGraph ? "Hide Graph" : "Show Graph"}
          </button>
        </>
      );
    }
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={() => setDisplayWeatherData(true)}>Show Weather Data</button>
      <button onClick={() => setShouldSaveData(true)}>Save Data</button>
      {isDataSaved && <p>Data saved</p>}
      {displayWeatherData && renderWeatherData()}
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
