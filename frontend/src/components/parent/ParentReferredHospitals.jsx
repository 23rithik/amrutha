import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid
} from '@mui/material';
import ParentHeader from './ParentHeader1';
import ParentFooter from './ParentFooter1';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../axiosinterceptor';

const ReferredHospitals = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const parentId = decoded.id;

        const res = await axiosInstance.get(`/api/hospitals/${parentId}`);
        setHospitals(res.data);
      } catch (err) {
        console.error('Error fetching hospital referrals:', err);
      }
    };

    fetchReferrals();
  }, []);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <ParentHeader />
      <Container sx={{ pt: 13, pb: 5, flex: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#c2185b',
            mb: 4,
            mt: 2,
            textShadow: '3px 3px 1px rgba(0, 0, 0, 0.2)',
          }}
        >
          Referred Hospitals
        </Typography>

        <Grid container spacing={4}>
          {hospitals.map((hospital, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ boxShadow: 5 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={`http://localhost:4000/${hospital.hospital_image}`}
                  alt={hospital.hospital_name}
                />
                <CardContent>
                  <Typography variant="h6">{hospital.hospital_name}</Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {hospital.address}
                  </Typography>
                  <Typography variant="body2">Phone: {hospital.phone_number}</Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>{hospital.description}</Typography>
                  {hospital.website && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => window.open(hospital.website, '_blank')}
                    >
                      Visit Website
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <ParentFooter />
    </Box>
  );
};

export default ReferredHospitals;
