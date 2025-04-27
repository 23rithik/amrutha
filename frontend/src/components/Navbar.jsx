import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button,
  Menu, MenuItem, IconButton, Container, Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './Navbar.css';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isSignUpActive = location.pathname.startsWith('/signup');

  return (
    <>
      <AppBar position="fixed" className="navbar">
        <Container>
          <Toolbar className="navbar-toolbar">
            {/* Logo and Brand Name */}
            <NavLink to="/" className="logo-link" onClick={closeMobileMenu}>
              <img src="/mom and child 1.png" alt="Logo" className="logo-image" />
              <Typography variant="h6" className="logo-text">
                Pediatric Pal
              </Typography>
            </NavLink>

            {/* Navigation Links */}
            <Box className="nav-links">
              <Button component={NavLink} to="/" className="nav-button" onClick={closeMobileMenu} end>Home</Button>
              <Button component={NavLink} to="/about" className="nav-button" onClick={closeMobileMenu}>About Us</Button>
              <Button component={NavLink} to="/contact" className="nav-button" onClick={closeMobileMenu}>Contact Us</Button>

              <Button
                className={`nav-button ${isSignUpActive ? 'active' : ''}`}
                onClick={handleMenuClick}
              >
                Sign Up ▼
              </Button>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem component={NavLink} to="/signup-pediatrition" onClick={handleMenuClose}>
                  Pediatrician
                </MenuItem>
                <MenuItem component={NavLink} to="/signup-parent" onClick={handleMenuClose}>
                  Parent
                </MenuItem>
              </Menu>

              <Button component={NavLink} to="/login" className="nav-button" onClick={closeMobileMenu}>Login</Button>
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              className="menu-icon"
              onClick={toggleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Items */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Button component={NavLink} to="/" className="nav-button" onClick={closeMobileMenu} end>Home</Button>
          <Button component={NavLink} to="/about" className="nav-button" onClick={closeMobileMenu}>About Us</Button>
          <Button component={NavLink} to="/contact" className="nav-button" onClick={closeMobileMenu}>Contact Us</Button>
          <Button component={NavLink} to="/signup-pediatrician" className="nav-button" onClick={closeMobileMenu}>Sign Up - Pediatrician</Button>
          <Button component={NavLink} to="/signup-parent" className="nav-button" onClick={closeMobileMenu}>Sign Up - Parent</Button>
          <Button component={NavLink} to="/login" className="nav-button" onClick={closeMobileMenu}>Login</Button>
        </div>
      )}
    </>
  );
};

export default Navbar;
