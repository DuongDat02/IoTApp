import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './style.css';

const ActionHistory = () => {
  const [actions, setActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const fetchActions = async (page) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/iot/allAction?page=${page}`);
      const result = await response.json();
      setActions(result.content);
      setTotalPages(result.totalPages);
      console.log("Data "+result.totalPages)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSearchActions = async (page = 1) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/iot/searchAction?startDate=${startDate}&endDate=${endDate}&page=${page - 1}`);
      const data = await response.json();
      setActions(data.content);
      setCurrentPage(data.pageable.pageNumber + 1);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };

  useEffect(() => {
    fetchActions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    fetchSearchActions();
  };

  return (
    <div className='actionhistory-content'>
      <div>
        <h1>Lịch sử bật, tắt đèn</h1>
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
        <table className='tbaction'>
          <thead>
            <tr>
              <th>Hành động</th>
              <th>Phòng</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((item, index) => (
              <tr key={index}>
                <td>{item.action}</td>
                <td>{item.type}</td>
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

export default ActionHistory;
