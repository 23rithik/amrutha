import React from 'react';
import './ParentHeader.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';

const ParentHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('parentStatusSeen');
    navigate('/login');
  };

  return (
    <header className="parent-header">
      <div className="toolbar">
        {/* Logo */}
        <NavLink to="/patienthome" className="logo" style={{ textDecoration: 'none' }}>
          <img src="/mom and child 1.png" alt="Logo" className="logo-image" style={{ height: '45px',width:'45px' }} />
          <Typography variant="h6" className="logo-text" style={{ color: 'white' }}>
            Pediatric Pal
          </Typography>
        </NavLink>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink
            to="/patienthome"
            className={({ isActive }) =>
              isActive ? 'nav-button active' : 'nav-button'
            }
          >
            Home
          </NavLink>
          <span
            className="nav-button"
            onClick={handleLogout}
            style={{ cursor: 'pointer',fontWeight:300 }}
          >
            Logout
          </span>
        </nav>
      </div>
    </header>
  );
};

export default ParentHeader;
