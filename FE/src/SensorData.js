import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import './style.css';

const SensorData = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async (page) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/iot/allData?page=${page}`);
      const result = await response.json();
      setData(result.content);
      setTotalPages(result.totalPages);
      console.log(result.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSearchData = async (page = 1) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/iot/searchData?startDate=${startDate}&endDate=${endDate}&page=${page - 1}`);
      const data = await response.json();
      setData(data.content);
      setCurrentPage(data.pageable.pageNumber + 1);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    fetchSearchData();
  };

  return (
    <div className='sensordata-content'>
      <div>
        <h1>Dữ liệu cảm biến</h1>
        <div className='search-controls'>
          <label>
            Start Date:
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            End Date:
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <button onClick={handleSearch}>Search</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nhiệt độ (°C)</th>
              <th>Độ ẩm (%)</th>
              <th>Gas (ppm)</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.temp} °C</td>
                <td>{item.humi} %</td>
                <td>{item.gas} ppm</td>
                <td>{format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-button ${index === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SensorData;
