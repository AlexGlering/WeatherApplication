import { render, waitFor, screen } from "@testing-library/react";
import server from "../../../server/server.js";
import axios from "../../node_modules/axios";
import Forecast from "../../../server/models/forecast.js";


jest.mock("axios");

// Sets up 3 dates in the same format as the weather app receives
const today = new Date();
const tomorrow = new Date(today.getDate() + 1);
const dayAfterTomorrow = new Date(tomorrow.getDate() + 1);

today = today.toISOString().split('T')[0]
tomorrow = tomorrow.toISOString().split('T')[0]
dayAfterTomorrow = dayAfterTomorrow.toISOString().split('T')[0]

// Creates a dummy forecast that only contains the important information
const dummyForecast = [
{
city: "New York",
date: today,

},
{
city: "New York",
date: tomorrow,
},
{
city: "New York",
date: dayAfterTomorrow
},
];
describe("Server Endpoint Test", () => {
    it("should return forecast data for New York with matching dates from the dummy data", async () => {
      // Mock the axios response to return the dummy forecast data
      axios.post.mockResolvedValue({ data: dummyForecast });
  
      // Make a request to the server endpoint
      const response = await axios.post("http://localhost:3001/weather", {
        city: "New York",
        days: 3,
      });
  
    // Extract the forecast data from the response
    const forecastData = response.data;

    // Extract only the cities from the received forecast data
    const receivedCities = forecastData.map((forecast) => forecast.city);

    // Extract only the dates from the received forecast data
    const receivedDates = forecastData.map((forecast) => forecast.city);
    // Extract only the cities from the dummy forecast
    const dummyCities = dummyForecast.map((forecast) => forecast.city);

    // Extract only the dates from the dummy forecast
    const dummyDates = dummyForecast.map((forecast) => forecast.date);

    // Compare the received cities with the dummy cities
    expect(receivedCities).toEqual(dummyCities);

    // Compare the received dates with the dummy dates
    expect(receivedDates).toEqual(dummyDates);
    });
  });