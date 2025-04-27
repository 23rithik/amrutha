import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  useMediaQuery,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import axiosInstance from '../../axiosinterceptor';

function PediatricianApproval() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pediatricians, setPediatricians] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const userAvatar = '/user-avatar.jpg';

  const fetchPediatricians = async () => {
    try {
      const response = await axiosInstance.get('/api/all-pediatricians');
      if (Array.isArray(response.data)) {
        setPediatricians(response.data);
      } else {
        console.error("Expected array, got:", typeof response.data);
        setPediatricians([]);
      }
    } catch (err) {
      console.error("Error fetching pediatricians:", err);
    }
  };

  useEffect(() => {
    fetchPediatricians();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.put(`/api/pediatricians/${id}/status`, { status }, {
        headers: { Authorization: token },
      });
      console.log("Pediatrician status updated:", response.data);
      fetchPediatricians(); // Refresh list
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleChangePasswordClick = () => {
    navigate('/cpassword');
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        
        <AppBar position="static" sx={{ backgroundColor: '#ff99bb' }}>
                  <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {isMobile && (
                      <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMobileOpen(true)}>
                        <MenuIcon />
                      </IconButton>
                    )}
                    <Typography variant="h6">Pediatrician Approval</Typography>
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

        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
          Registered Pediatricians
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e6f2ff' }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>License Number</TableCell>
                <TableCell>License PDF</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pediatricians.map((pediatrician) => (
                <TableRow key={pediatrician._id}>
                  <TableCell>{pediatrician.name}</TableCell>
                  <TableCell>{pediatrician.emailid}</TableCell>
                  <TableCell>{pediatrician.phone_number}</TableCell>
                  <TableCell>{pediatrician.address}</TableCell>
                  <TableCell>{pediatrician.license_number}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      component="a"
                      href={`http://localhost:4000/uploads/licenses/${pediatrician.license_pdf.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View License
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mr: 1 }}
                      onClick={() => updateStatus(pediatrician._id, 1)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => updateStatus(pediatrician._id, 2)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default PediatricianApproval;
