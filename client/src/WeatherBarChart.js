import React from "react";
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Label } from "recharts";

// WeatherBarChart component for rendering a bar chart with custom data, title, dataKey, and yAxisLabel for showing weather data 
const WeatherBarChart = ({ data, title, dataKey, yAxisLabel }) => {
  return (
    <div>
      <h3>{title}</h3>
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <XAxis dataKey="name" />
        <YAxis>
          <Label
            angle={-90}
            value={yAxisLabel}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default WeatherBarChart;
