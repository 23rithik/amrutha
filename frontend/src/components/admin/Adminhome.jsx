import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Avatar, IconButton, Typography, Menu, MenuItem, Grid, Card, CardContent, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import axiosInstance from '../../axiosinterceptor';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Import Chart.js

const userAvatar = '/user-avatar.jpg';

function AdminDashboard() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [userStats, setUserStats] = useState({});
  const [usageTrends, setUsageTrends] = useState({
    labels: [],
    datasets: [
      {
        label: 'Active Users',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    // Fetch system performance analytics
    axiosInstance.get('/api/performance/analytics')
      .then((response) => {
        setAnalyticsData(response.data);

        // Example of performance metrics data
        setUserStats({
          totalUsers: response.data.totalUsers,
          activeUsers: response.data.activeUsers,
          newRegistrations: response.data.newRegistrations,
        });

        // Set usage trends for active users
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']; // Replace with dynamic data if available
        const activeUserCounts = [120, 130, 140, 150, 160]; // Replace with actual dynamic data

        setUsageTrends({
          labels: months,
          datasets: [
            {
              label: 'Active Users',
              data: activeUserCounts,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
            },
          ],
        });
      })
      .catch((error) => {
        console.error('Error fetching performance analytics:', error);
      });
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
    <Box sx={{ display: 'flex' }} className="admin-dashboard">
      <Sidebar isMobile={isMobile} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <AppBar position="static" sx={{ backgroundColor: '#ff99bb' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {isMobile && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6">Performance Analytics Dashboard</Typography>
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

        {/* Main Dashboard Content */}
        <Grid container spacing={2} mt={2}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={4}>
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h4">{userStats.totalUsers ? userStats.totalUsers : 'Loading...'}</Typography>
                <Typography>Total Users</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h4">{userStats.activeUsers ? userStats.activeUsers : 'Loading...'}</Typography>
                <Typography>Active Users</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h4">{userStats.newRegistrations ? userStats.newRegistrations : 'Loading...'}</Typography>
                <Typography>New Registrations</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Usage Trends Chart */}
          <Grid item xs={12}>
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h5">Active User Trends</Typography>
                <Line data={usageTrends} />
              </CardContent>
            </Card>
          </Grid>

          {/* System Performance Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5">System Performance</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Server Uptime</TableCell>
                        <TableCell>99.9%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>API Call Success Rate</TableCell>
                        <TableCell>98%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Database Health</TableCell>
                        <TableCell>Good</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">Notifications</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography>System Maintenance: Tonight from 12 AM to 3 AM</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography>New updates available for the Dashboard</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
