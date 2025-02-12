import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import Profile from './Profile';
import SensorData from './SensorData';
import ActionHistory from './ActionHistory';

const App = () => {
  return (
    <Router>
      <div className="container">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>IoT</h1>
          </div>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/sensor-data">Sensor Data</Link>
            </li>
            <li>
              <Link to="/action-history">Action History</Link>
            </li>
          </ul>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sensor-data" element={<SensorData />} />
            <Route path="/action-history" element={<ActionHistory />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};


export default App;
