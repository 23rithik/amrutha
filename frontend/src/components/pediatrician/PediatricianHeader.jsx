import React, { useState, useRef, useEffect } from 'react';
import './PediatricianHeader.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';

const ParentHeader1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedbackDropdownOpen, setFeedbackDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('parentStatusSeen');
    navigate('/login');
  };

  const toggleFeedbackDropdown = () => {
    setFeedbackDropdownOpen((prev) => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFeedbackDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="parent-header">
      <div className="toolbar">
        {/* Logo */}
        <NavLink to="/pediatrichome" className="logo" style={{ textDecoration: 'none' }}>
          <img
            src="/mom and child 1.png"
            alt="Logo"
            className="logo-image"
            style={{ height: '45px', width: '45px' }}
          />
          <Typography variant="h6" className="logo-text" style={{ color: 'white' }}>
            Pediatric Pal
          </Typography>
        </NavLink>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink
            to="/pediatrichome"
            className={
              location.pathname.startsWith('/pediatrichome') || location.pathname === '/pediatric-editprofile'
                ? 'nav-button active'
                : 'nav-button'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/refer-hospitals"
            className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
          >
            Refer Hospitals
          </NavLink>

          

          <NavLink
            to="/give-diet"
            className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
          >
            Give Diet 
          </NavLink>

          {/* Feedback dropdown */}
          <div
            className={`nav-button ${location.pathname.startsWith('/feedback-pediatric') ? 'active' : ''}`}
            style={{ position: 'relative', cursor: 'pointer', userSelect: 'none' }}
            onClick={toggleFeedbackDropdown}
            ref={dropdownRef}
          >
            Feedback ▼
            {feedbackDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'rgba(255, 143, 176, 0.9)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  padding: '8px 0',
                  minWidth: '160px',
                  zIndex: 2000,
                  fontSize: '14px',
                  fontWeight: 300,
                }}
              >
                <NavLink
                  to="/feedback-pediatric/admin"
                  className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
                  style={{ display: 'block', padding: '8px 16px', textDecoration: 'none', color: 'white' }}
                  onClick={() => setFeedbackDropdownOpen(false)}
                >
                  Admin
                </NavLink>
                <NavLink
                  to="/feedback-pediatric/parent"
                  className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
                  style={{ display: 'block', padding: '8px 16px', textDecoration: 'none', color: 'white' }}
                  onClick={() => setFeedbackDropdownOpen(false)}
                >
                  Parents
                </NavLink>
              </div>
            )}
          </div>
          <span
            className="nav-button"
            onClick={handleLogout}
            style={{ cursor: 'pointer', fontWeight: 300, fontSize: '14px' }}
          >
            Logout
          </span>
        </nav>
      </div>
    </header>
  );
};

export default ParentHeader1;
