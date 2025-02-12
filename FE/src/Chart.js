import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './chart.css';

const ChartComponent = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Nhiệt độ',
        borderColor: 'rgba(255, 99, 132, 1)',
        data: [],
        tension: 0.5,
      },
      {
        label: 'Độ ẩm',
        borderColor: 'rgba(54, 162, 235, 1)',
        data: [],
        tension: 0.5,
      },
      {
        label: 'Gas',
        borderColor: 'rgba(255, 206, 86, 1)',
        data: [],
        tension: 0.5,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/iot/dataLast10');
        const result = await response.json();
        console.log(result);

        const labels = result.map((_, index) => `Data ${index + 1}`);
        const temperatureData = result.map(item => item.temp);
        const humidityData = result.map(item => item.humi);
        const gasData = result.map(item => item.gas);

        const newData = {
          labels: labels,
          datasets: [
            {
              label: 'Nhiệt độ',
              borderColor: 'rgba(255, 99, 132, 1)',
              data: temperatureData,
              tension: 0.5,
            },
            {
              label: 'Độ ẩm',
              borderColor: 'rgba(54, 162, 235, 1)',
              data: humidityData,
              tension: 0.5,
            },
            {
              label: 'Gas',
              borderColor: 'rgba(255, 206, 86, 1)',
              data: gasData,
              tension: 0.5,
            },
          ],
        };

        setData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000); // Cập nhật mỗi 5 giây

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const newChartInstance = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    chartInstanceRef.current = newChartInstance;

    // Cập nhật biểu đồ mỗi khi dữ liệu thay đổi
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} className='chart'/>;
};

export default ChartComponent;
