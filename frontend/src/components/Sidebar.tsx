import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../App.css';

interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, toggleSidebar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Sync with parent state if provided
  useEffect(() => {
    setSidebarOpen(isOpen);
  }, [isOpen]);
  
  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.hamburger-menu')
      ) {
        if (toggleSidebar) {
          toggleSidebar();
        } else {
          setSidebarOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, toggleSidebar]);
  
  // Internal toggle function if not provided by parent
  const handleToggle = () => {
    if (toggleSidebar) {
      toggleSidebar();
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Navigation handler
  const handleNavigation = (path: string) => {
    navigate(path);
    // Close sidebar after navigation on mobile
    if (window.innerWidth <= 768) {
      if (toggleSidebar) {
        toggleSidebar();
      } else {
        setSidebarOpen(false);
      }
    }
  };
  
  return (
    <>
      {/* Hamburger menu button - this should be visible even when sidebar is closed */}
      <div className="hamburger-menu" onClick={handleToggle}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div 
        ref={sidebarRef}
        className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}
      >
        <div className="sidebar-logo">
          <span>Jira Clone</span>
        </div>
        <nav className="nav-menu">
          <ul>
            <li>
              <NavLink 
                to="/backlog" 
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/backlog');
                }}
              >
                Backlog
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/active-sprint" 
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/active-sprint');
                }}
              >
                Active Sprint
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Overlay for mobile view - clicking this also closes the sidebar */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={handleToggle}></div>
      )}
    </>
  );
};

export default Sidebar;