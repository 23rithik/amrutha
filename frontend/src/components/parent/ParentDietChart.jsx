import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';
import ParentHeader from './ParentHeader1';
import ParentFooter from './ParentFooter1';
import axiosInstance from '../../axiosinterceptor';
import { jwtDecode } from 'jwt-decode';

const ParentDietChart = () => {
  const [dietCharts, setDietCharts] = useState([]);

  useEffect(() => {
    const fetchDietChart = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const res = await axiosInstance.get(`/api/dietchart/${decoded.id}`);
        setDietCharts(res.data);
      } catch (err) {
        console.error('Failed to fetch diet chart:', err);
      }
    };

    fetchDietChart();
  }, []);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <ParentHeader />
      <Container sx={{ pt: 13, pb: 1, flex: 1 }}>
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
          Weekly Diet Chart
        </Typography>

        {dietCharts.length === 0 ? (
          <Typography variant="body1">No diet chart available.</Typography>
        ) : (
          dietCharts.map((chart, index) => (
            <Box key={index} sx={{ mb: 6 }}>
              <Typography variant="h6" color="lightblue" gutterBottom sx={{ mb: 3 }}>
                Pediatrician: {chart.pediatrician_id?.name || 'N/A'}
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#e8f5e9' }}>
                    <TableRow>
                      <TableCell><strong>Day</strong></TableCell>
                      <TableCell><strong>Meal 1</strong></TableCell>
                      <TableCell><strong>Meal 2</strong></TableCell>
                      <TableCell><strong>Meal 3</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chart.week.map((day, idx) => (
                      <TableRow key={idx}>
                        <TableCell><strong>{day.day}</strong></TableCell>
                        {day.meals.slice(0, 3).map((meal, i) => (
                          <TableCell key={i}>
                            <Typography variant="body2">
                              <strong>{meal.time}</strong><br />
                              {meal.food}
                            </Typography>
                          </TableCell>
                        ))}
                        {/* If meals < 3, fill the rest with empty cells */}
                        {Array.from({ length: 3 - day.meals.length }).map((_, i) => (
                          <TableCell key={`empty-${i}`}></TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))
        )}
      </Container>
      <ParentFooter />
    </Box>
  );
};

export default ParentDietChart;
