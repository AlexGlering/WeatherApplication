import React from "react";
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

const WeatherBarChart = ({ data }) => {
  return (
    <BarChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="avgtemp_c" fill="#8884d8" name="Average Temperature" />
      <Bar dataKey="totalprecip_mm" fill="#82ca9d" name="Total Precipitation" />
      <Bar dataKey="maxwind_kph" fill="#ffc658" name="Max Wind Speed" />
      <Bar dataKey="avghumidity" fill="#FF8042" name="Average Humidity" />
    </BarChart>
  );
};

export default WeatherBarChart;
