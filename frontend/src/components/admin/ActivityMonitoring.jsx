import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import axiosInstance from '../../axiosinterceptor'; // Import the axiosInstance

const ActivityMonitoring = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch activities from the backend using axios
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get('/api/activities');
        setActivities(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Display loading indicator or error message
  if (loading) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>Loading activities...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Activity Monitoring
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity._id}>
                <TableCell>{activity.userId.name}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                <TableCell>{activity.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ActivityMonitoring;
