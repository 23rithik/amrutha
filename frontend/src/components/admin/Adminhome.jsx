import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Avatar, IconButton, Typography,
  Menu, MenuItem, Grid, Card, CardContent, useMediaQuery,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import axiosInstance from '../../axiosinterceptor';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

const userAvatar = 'avatar.jpg';

function AdminDashboard() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userStats, setUserStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    axiosInstance.get('/api/performance/analytics')
      .then((response) => {
        setUserStats({
          totalUsers: response.data.totalUsers,
          activeUsers: response.data.activeUsers,
          newRegistrations: response.data.newRegistrations,
        });

        axiosInstance.get('/api/performance/weekly-stats')
          .then((weeklyDataResponse) => {
            setChartData(weeklyDataResponse.data);
          })
          .catch((error) => {
            console.error('Error fetching weekly stats:', error);
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
    setOpenPasswordDialog(true);
    setAnchorEl(null);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }

    try {
      const response = await axiosInstance.put('/api/password/change', {
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        alert('Password changed successfully');
        handleClosePasswordDialog();
      } else {
        setErrorMsg(response.data.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setErrorMsg('Password change failed');
    }
  };

  return (
    <Box sx={{ display: 'flex' }} className="admin-dashboard">
      <Sidebar isMobile={isMobile} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <AppBar position="static" sx={{ backgroundColor: '#ff99bb' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {isMobile && (
              <IconButton edge="start" color="inherit" onClick={() => setMobileOpen(true)}>
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

        {/* Change Password Dialog */}
        <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              label="Old Password"
              type="password"
              fullWidth
              margin="normal"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMsg && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errorMsg}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePasswordDialog}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handlePasswordSubmit}>
              Update Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* Stats Cards and Graph */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card><CardContent>
              <Typography variant="h4">{userStats.totalUsers ?? 'Loading...'}</Typography>
              <Typography>Total Users</Typography>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card><CardContent>
              <Typography variant="h4">{userStats.activeUsers ?? 'Loading...'}</Typography>
              <Typography>Active Users</Typography>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card><CardContent>
              <Typography variant="h4">{userStats.newRegistrations ?? 'Loading...'}</Typography>
              <Typography>New Registrations</Typography>
            </CardContent></Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card><CardContent>
              <Typography variant="h6">User Activity (Last 6 Weeks)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="newRegistrations" stroke="#ffc658" />
                  <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card><CardContent>
              <Typography variant="h6">Weekly Breakdown</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Week</TableCell>
                      <TableCell align="right">Active Users</TableCell>
                      <TableCell align="right">New Registrations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chartData.map((row) => (
                      <TableRow key={row.week}>
                        <TableCell>{row.week}</TableCell>
                        <TableCell align="right">{row.activeUsers}</TableCell>
                        <TableCell align="right">{row.newRegistrations}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent></Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
