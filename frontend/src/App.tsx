import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Backlog from './pages/BacklogPage';
import ActiveSprint from './pages/ActiveSprintPage';
import './App.css';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
          <Routes>
            <Route path="/" element={<Backlog />} />
            <Route path="/backlog" element={<Backlog />} />
            <Route path="/active-sprint" element={<ActiveSprint />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
