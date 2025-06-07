import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Box, Snackbar, Alert } from '@mui/material';  // Added Snackbar and Alert
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosinterceptor';
import {jwtDecode} from 'jwt-decode'; // corrected import (remove curly braces)
import AOS from 'aos';
import 'aos/dist/aos.css';

import ParentHeader from './ParentHeader';
import ParentFooter from './ParentFooter';

const ParentHomepage = () => {
  const [showHomepage, setShowHomepage] = useState(false);
  const [pediatricians, setPediatricians] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [parentName, setParentName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);   // Snackbar state
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200 });

    const checkParentStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const decoded = jwtDecode(token);
      const parentId = decoded.id;

      try {
        const res = await axiosInstance.get(`/api/parent/status/${parentId}`);
        const status = res.data.status;
        if (status === 'not selected') {
          setShowHomepage(true);
          setParentId(parentId);

          const pediatricianRes = await axiosInstance.get('/api/pediatricians');
          setPediatricians(pediatricianRes.data);

          const nameRes = await axiosInstance.get(`/api/parent/name/${parentId}`);
          setParentName(nameRes.data.name);
        } else {
          navigate('/parent-dashboard');
        }
      } catch (err) {
        console.error('Error checking status:', err);
        navigate('/login');
      }
    };

    checkParentStatus();
  }, [navigate]);

  const handleSelectPediatrician = async (pediatricianId) => {
    try {
      await axiosInstance.put(`/api/parent/select-pediatrician/${parentId}`, {
        pediatricianId,
      });
      setSnackbarMsg('Pediatrician selected successfully!');
      setSnackbarOpen(true);
      localStorage.removeItem('parentStatusSeen');
      setTimeout(() => {
        navigate('/parent-dashboard');
      }, 1500); // Delay navigation to show the message
    } catch (error) {
      console.error('Error selecting pediatrician:', error);
      alert('Failed to select pediatrician');
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (!showHomepage) return null;

  return (
    <>
      <ParentHeader />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(to right, #f9778d, #ff77b0)',
          paddingTop: '100px',
          paddingBottom: '2rem',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
            data-aos="fade-down"
          >
            Welcome, {capitalizeFirstLetter(parentName)}!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#ffeef7',
              mt: 2,
              textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
            }}
            data-aos="fade-up"
          >
            Select a pediatrician to partner with you in providing the best care for your child.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ padding: '0 30px' }}>
          {pediatricians.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card
                data-aos="zoom-in"
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
                  backgroundColor: '#fff',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.05)',
                    boxShadow: '0 14px 28px rgba(0,0,0,0.35)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Email:</strong> {p.emailid}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Phone:</strong> {p.phone_number}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>License Number:</strong> {p.license_number}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Address:</strong> {p.address}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <a
                      href={`http://localhost:4000/${p.license_pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#d32f2f',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = '#b71c1c')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = '#d32f2f')
                      }
                    >
                      View License PDF
                    </a>
                  </Typography>
                  <Box textAlign="center" mt={2}>
                    <button
                      onClick={() => handleSelectPediatrician(p._id)}
                      style={{
                        padding: '12px 28px',
                        backgroundColor: '#c2185b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 15,
                        transition: 'background-color 0.3s ease',
                        boxShadow: '0 4px 12px rgba(194,24,91,0.6)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#880e4f')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#c2185b')
                      }
                    >
                      Select Pediatrician
                    </button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <ParentFooter />

        {/* Snackbar for success message */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default ParentHomepage;
