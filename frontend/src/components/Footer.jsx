import React from 'react';
import { Typography, Box, Link, Container } from '@mui/material';
import './Footer.css';

const Footer = () => {
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg" className="footer-container">
        <Box className="footer-section">
          <Typography variant="h6" className="footer-title">Pediatric Pal</Typography>
          <Typography variant="body2">
            Your trusted partner in pediatric care. Compassionate, expert, and family-centered services for your little ones.
          </Typography>
        </Box>

        <Box className="footer-links">
          <Typography variant="h6" className="footer-title">Quick Links</Typography>
          <Link href="/" underline="hover" className="footer-link">Home</Link>
          <Link href="/about" underline="hover" className="footer-link">About Us</Link>
          <Link href="/contact" underline="hover" className="footer-link">Contact</Link>
          <Link href="/login" underline="hover" className="footer-link">Login</Link>
        </Box>

        <Box className="footer-contact">
          <Typography variant="h6" className="footer-title">Contact Us</Typography>
          <Typography variant="body2">Email: amrutha@pediatricpal.com</Typography>
          <Typography variant="body2">Phone: +91-8714779564</Typography>
          <Typography variant="body2">Location: Amruthalayam, Mayyanadu</Typography>
        </Box>
      </Container>

      <Box className="footer-bottom">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Pediatric Pal. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
