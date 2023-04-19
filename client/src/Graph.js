import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register the controllers, elements, and scales for Chart.js
Chart.register(...registerables);

const Graph = ({ hourlyData = [] }) => {
  // Create a reference to the canvas element
  const chartRef = useRef(null);

  // useEffect hook to create or update the chart when the hourlyData prop changes
  useEffect(() => {
    if (hourlyData.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy any existing chart before creating a new one
      if (window.myChart) {
        window.myChart.destroy();
      }

      // Prepare the data for the chart: labels, temperatures, and wind speeds
      const labels = hourlyData.map((data, index) => `Hour ${index + 1}`);
      const temperatures = hourlyData.map((data) => data.temperature);
      const windSpeeds = hourlyData.map((data) => data.windSpeed);

      // Create a new chart with the prepared data and options
      window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Temperature (°C)',
              data: temperatures,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              yAxisID: 'y1',
            },
            {
              label: 'Wind Speed (km/h)',
              data: windSpeeds,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              yAxisID: 'y2',
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Hours',
              },
            },
            y1: {
              position: 'left',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Temperature (°C)',
              },
              ticks: {
                callback: function (value) {
                  return value.toFixed(1) + '°C';
                },
              },
            },
            y2: {
              position: 'right',
              beginAtZero: true,
              grid: {
                drawOnChartArea: false,
              },
              title: {
                display: true,
                text: 'Wind Speed (km/h)',
              },
            },
          },
        },
      });
    }
  }, [hourlyData]);

  // Render the canvas element for the chart
  return <canvas ref={chartRef} width="800" height="400"></canvas>;
};

export default Graph;
