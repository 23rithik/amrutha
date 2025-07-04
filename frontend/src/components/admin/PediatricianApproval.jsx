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
  Snackbar,
  Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import axiosInstance from '../../axiosinterceptor';

function PediatricianApproval() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [approvedPediatricians, setApprovedPediatricians] = useState([]);
  const [rejectedPediatricians, setRejectedPediatricians] = useState([]);
  const [pediatricians, setPediatricians] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const navigate = useNavigate();

  const userAvatar = 'avatar.jpg';

  const recordActivity = async (action, details = '') => {
    try {
      const userType = 'pediatrician'; // Assuming this is used by pediatricians
      const userId = localStorage.getItem('userId'); // Make sure this is stored during login
      
      await axiosInstance.post('/api/activities', {
        userType,
        userId,
        action,
        details
      });
      
    } catch (err) {
      console.error('Error recording activity:', err);
      // Don't show error to user as this shouldn't affect main functionality
    }
  };

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
      showSnackbar('Error fetching pediatricians', 'error');
    }
  };

  useEffect(() => {
    fetchPediatricians();
  }, []);

  useEffect(() => {
    fetchApprovedPediatricians();
    fetchRejectedPediatricians();
  }, []);
  
  const fetchApprovedPediatricians = async () => {
    try {
      const res = await axiosInstance.get('/api/pediatricians-by-status/1');
      setApprovedPediatricians(res.data);
    } catch (err) {
      console.error("Failed to fetch approved:", err);
    }
  };
  
  const fetchRejectedPediatricians = async () => {
    try {
      const res = await axiosInstance.get('/api/pediatricians-by-status/2');
      setRejectedPediatricians(res.data);
    } catch (err) {
      console.error("Failed to fetch rejected:", err);
    }
  };
  


  const updateStatus = async (id, status) => {
  try {
    const pediatrician = pediatricians.find(p => p._id === id);
    if (!pediatrician) {
      showSnackbar('Pediatrician not found', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    const response = await axiosInstance.put(
      `/api/pediatricians/${id}/status`, 
      { status }, 
      { headers: { Authorization: token } }
    );

    console.log("Pediatrician status updated:", response.data);
    fetchPediatricians(); // Refresh list

    // Show success message with pediatrician's name
    const action = status === 1 ? 'approved' : 'rejected';
    showSnackbar(
      `Dr. ${pediatrician.name} has been ${action} successfully`, 
      'success'
    );

    // ✅ Record this action in the activity log
    await recordActivity(`Pediatrician ${action}`, `Pediatrician ID: ${id}, Name: ${pediatrician.name}`);

  } catch (err) {
    console.error("Error updating status:", err);
    showSnackbar(
      `Error: ${err.response?.data?.message || err.message}`,
      'error'
    );
  }
};


  const statusColors = {
  0: 'default',     // Pending
  1: 'success',     // Approved
  2: 'error',       // Rejected
  3: 'warning'      // Deactivated
};

const statusText = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Deactivated'
};


  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleChangePasswordClick = () => {
    navigate('/cpassword');
    setAnchorEl(null);
  };

  return (
    <>
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
            {/* <IconButton onClick={handleAvatarClick}>
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
            </Menu> */}
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
                <TableCell>Status</TableCell>
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
                  <TableCell>
                    <Alert
                      icon={false}
                      severity={statusColors[pediatrician.login_status] || 'info'}
                      variant="outlined"
                      sx={{ py: 0, px: 1, borderRadius: '8px', fontSize: '0.8rem' }}
                    >
                      {statusText[pediatrician.login_status] || 'Unknown'}
                    </Alert>
                  </TableCell>
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
                      disabled={pediatrician.login_status === 1 || pediatrician.login_status === 3}
                    >
                      Approve
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => updateStatus(pediatrician._id, 2)}
                      disabled={pediatrician.login_status === 2 || pediatrician.login_status === 3}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
    {/* Footer styled like AppBar */}
            <Box
              component="footer"
              sx={{
                backgroundColor: '#ff99bb',
                color: '#fff',
                py: 2,
                px: 2,
                mt: 'auto',
                textAlign: 'center',
                ml: 30,
                
              }}
            >
              <Typography variant="body2">
                © {new Date().getFullYear()} PEDIATRIC-PAL | Pediatrician Approval
              </Typography>
            </Box>
            </>
  );
}

export default PediatricianApproval;