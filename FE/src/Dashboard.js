import React, { useEffect, useState } from 'react';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faTint, faFire, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import ChartComponent from './Chart';

const Dashboard = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [gas, setGas] = useState(null);
  const [isLightOn, setIsLightOn] = useState(false);
  const [isFanOn, setIsFanOn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/iot/dataLatest');
        const data = await response.json();
        console.log(data);
        setTemperature(data.temp.toFixed(2));
        setHumidity(data.humi.toFixed(2));
        setGas(data.gas.toFixed(2));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000); // Gọi API mỗi 5 giây

    return () => clearInterval(interval); // Xóa interval khi component bị unmount
  }, []);

  useEffect(() => {
    const temperatureThreshold = 32;
    const humidityThreshold = 60;
    const gasThreshold = 600;

    if (temperature > temperatureThreshold) {
      document.querySelector('.temperature').classList.add('high');
    } else {
      document.querySelector('.temperature').classList.remove('high');
    }

    if (humidity > humidityThreshold) {
      document.querySelector('.humidity').classList.add('high');
    } else {
      document.querySelector('.humidity').classList.remove('high');
    }

    if (gas > gasThreshold) {
      document.querySelector('.gas').classList.add('high');
    } else {
      document.querySelector('.gas').classList.remove('high');
    }
  }, [temperature, humidity, gas]);

  const toggleLight = () => {
    setIsLightOn(!isLightOn);
    // Gửi yêu cầu bật/tắt đèn đến API
    fetch('http://localhost:8080/api/v1/iot/control', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ light: 'PN', state: isLightOn ? '0' : '1' }),
    });
  };

  const toggleFan = () => {
    setIsFanOn(!isFanOn);
    // Gửi yêu cầu bật/tắt quạt đến API
    fetch('http://localhost:8080/api/v1/iot/control', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ light: 'PK', state: isFanOn ? '0' : '1' }),
    });
  };

  return (
    <div className="dashboard-content">
      <div className="parameter">
        <div className="parameter-box temperature">
          <FontAwesomeIcon icon={faThermometerHalf} className="icon" />
          <h2>Nhiệt độ</h2>
          <p>{temperature !== null ? `${temperature} °C` : 'Loading...'}</p>
        </div>
        <div className="parameter-box humidity">
          <FontAwesomeIcon icon={faTint} className="icon" />
          <h2>Độ ẩm</h2>
          <p>{humidity !== null ? `${humidity} %` : 'Loading...'}</p>
        </div>
        <div className="parameter-box gas">
          <FontAwesomeIcon icon={faFire} className="icon" />
          <h2>Gas</h2>
          <p>{gas !== null ? `${gas} ppm` : 'Loading...'}</p>
        </div>
      </div>
      <div className='a-container'>
        <div className="chart-custom">
          <ChartComponent />
        </div>
        <div className="controls">
          <div className="control-box">
            <FontAwesomeIcon icon={faLightbulb} className={`control-icon-lb ${isLightOn ? 'on' : 'off'}`} onClick={toggleLight} />
            <h3>Phòng ngủ</h3>
            <button onClick={toggleLight}>{isLightOn ? 'OFF' : 'ON'}</button>
          </div>
          <div className="control-box">
            <FontAwesomeIcon icon={faLightbulb} className={`control-icon-fan ${isFanOn ? 'on' : 'off'}`} onClick={toggleFan} />
            <h3>Phòng khách</h3>
            <button onClick={toggleFan}>{isFanOn ? 'OFF' : 'ON'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
