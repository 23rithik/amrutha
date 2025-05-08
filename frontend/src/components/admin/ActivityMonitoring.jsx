import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, AppBar, Toolbar, IconButton,
  Avatar, Menu, MenuItem, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import axiosInstance from '../../axiosinterceptor';
import { useNavigate } from 'react-router-dom';

const userAvatar = 'avatar.jpg';

const ActivityMonitoring = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get('/api/activities');
        if (Array.isArray(response.data)) {
          setActivities(response.data);
        } else {
          console.error('Expected array but got:', response.data);
          setActivities([]); // Fallback to empty array to avoid crash
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    

    fetchActivities();
  }, [navigate]);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangePasswordClick = () => {
    navigate('/cpassword');
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar isMobile={isMobile} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <AppBar position="static" sx={{ backgroundColor: '#ff99bb' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {isMobile && (
              <IconButton edge="start" color="inherit" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6">Activity Monitoring</Typography>
            <IconButton onClick={handleAvatarClick}>
              <Avatar src={userAvatar} alt="Admin" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MenuItem onClick={handleChangePasswordClick}>Change Password</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {loading ? (
          <Box sx={{ padding: 3, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Loading activities...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ padding: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>
          </Box>
        ) : (
          <Box sx={{ padding: 3 }}>
            
            <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#fce4ec' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activities.map((activity, index) => (
                    <TableRow
                      key={activity._id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                        '&:hover': {
                          backgroundColor: '#ffe4f0',
                        },
                        transition: 'background-color 0.3s',
                      }}
                    >
                      <TableCell>{activity.userInfo?.parent_name || activity.userInfo?.name || 'N/A'}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{activity.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

        )}
      </Box>
    </Box>
  );
};

export default ActivityMonitoring;
