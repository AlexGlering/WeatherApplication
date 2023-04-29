// Importing necessary modules from the "recharts" library and "React" module
import React from "react";
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

// Defining a functional component called "WeatherBarChart" that takes in "data", defined in Weather.js as a prop
const WeatherBarChart = ({ data }) => {
  // Rendering a BarChart component from "recharts" library with the given "data" and other props
  return (
    <BarChart
      width={300}
      height={150}
      data={data}
      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
    >
      {/* Rendering X and Y axis components */}
      <XAxis dataKey="name" />
      <YAxis />
      {/* Rendering tooltip and legend components */}
      <Tooltip />
      <Legend />
      {/* Rendering a bar chart using "Bar" component */}
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
};

export default WeatherBarChart;