import React, { useState } from 'react';
import { Typography, Box, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import './PediatricianFooter.css';

const Footer = () => {
  const [feedbackDropdownOpen, setFeedbackDropdownOpen] = useState(false);

  const toggleFeedbackDropdown = () => {
    setFeedbackDropdownOpen(!feedbackDropdownOpen);
  };

  const closeDropdown = () => {
    setFeedbackDropdownOpen(false);
  };

  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg" className="footer-container" sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <Box className="footer-section" sx={{ flex: '1 1 300px', minWidth: 280 }}>
          <Typography variant="h6" className="footer-title">Pediatric Pal</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Your trusted partner in pediatric care. Compassionate, expert, and family-centered services for your little ones.
          </Typography>
        </Box>

        <Box className="footer-links" sx={{ flex: '2 1 500px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {/* Column 1 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.1, minWidth: 200 }}>
            <Typography variant="h6" className="footer-title">Quick Links</Typography>
            <NavLink to="/pediatrichome" className="footer-link" onClick={closeDropdown} style={{ textDecoration: 'none', color: 'inherit' }}>
              Home
            </NavLink>
            <NavLink to="/refer-hospitals" className="footer-link" onClick={closeDropdown} style={{ textDecoration: 'none', color: 'inherit' }}>
              Refer Hospitals
            </NavLink>
            <NavLink to="/give-diet" className="footer-link" onClick={closeDropdown} style={{ textDecoration: 'none', color: 'inherit' }}>
              Give Diet 
            </NavLink>
            
          </Box>

          {/* Column 2 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200, position: 'relative' }}>
            <Typography variant="h6" className="footer-title" sx={{ mb: 1 }}>
              Feedback
            </Typography>

            {/* Feedback dropdown as simple links */}
            <NavLink to="/feedback-pediatric/admin" className="footer-link" onClick={closeDropdown} style={{ textDecoration: 'none', color: 'inherit' }}>
              Admin
            </NavLink>
            <NavLink to="/feedback-pediatric/parent" className="footer-link" onClick={closeDropdown} style={{ textDecoration: 'none', color: 'inherit' }}>
              Parent
            </NavLink>

            {/* Login Link */}
            {/* <NavLink to="/login" className="footer-link" onClick={closeDropdown} style={{ marginTop: '16px', textDecoration: 'none', color: 'inherit' }}>
              Login
            </NavLink> */}
          </Box>
        </Box>

        <Box className="footer-contact" sx={{ flex: '1 1 280px', minWidth: 280 }}>
          <Typography variant="h6" className="footer-title">Contact Us</Typography>
          <Typography variant="body2">Email: amrutha@pediatricpal.com</Typography>
          <Typography variant="body2">Phone: +91-8714779564</Typography>
          <Typography variant="body2">Location: Amruthalayam, Mayyanadu</Typography>
        </Box>
      </Container>

      <Box className="footer-bottom" sx={{ mt: 4 }}>
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Pediatric Pal. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
