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

import axios from 'axios'; // ⬅️ use regular axios temporarily
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axiosInstance from '../../axiosinterceptor';

function ParentApproval() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [parents, setParents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const userAvatar = '/user-avatar.jpg';

  // ✅ Fetch parents from backend
  const fetchParents = async () => {
    console.log("Fetching parents...");
    try {
      const response = await axiosInstance.get('/api/all-parents');
      console.log("Fetched parents data:", response.data);
      if (Array.isArray(response.data)) {
        setParents(response.data);
      } else {
        console.error("Expected an array but got:", typeof response.data);
        setParents([]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  // ✅ Trigger fetch on mount
  useEffect(() => {
    console.log("🚀 Component mounted");
    fetchParents();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/parents/${id}/status`, { status }, {
        headers: { Authorization: token },
      });
      console.log("Status updated:", response.data);
      fetchParents(); // Refresh list
    } catch (err) {
      console.error("❌ Error updating status:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.message || err.message}`); // Display error
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
            <Typography variant="h6">Parent Approval</Typography>
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

        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>Registered Parents</Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
          <TableHead sx={{ backgroundColor: '#ffe6ee' }}>
            <TableRow>
                <TableCell>Parent Name</TableCell>
                <TableCell>Child Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Child Photo</TableCell>
                <TableCell>Medical History</TableCell>
                <TableCell align="center">Actions</TableCell>
            </TableRow>
            </TableHead>

            <TableBody>
                {parents.map((entry) => (
                    <TableRow key={entry._id}>
                    <TableCell>{entry.parent_name}</TableCell>
                    <TableCell>{entry.child_name}</TableCell>
                    <TableCell>{entry.emailid}</TableCell>
                    <TableCell>{entry.phone_number}</TableCell>
                    <TableCell>{entry.address}</TableCell>
                    <TableCell>
                        <img
                        src={entry.child_photo}
                        alt="Child"
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px' }}
                        />
                    </TableCell>
                    <TableCell>
                    <Button
                        variant="outlined"
                        component="a"
                        href={`http://localhost:4000/uploads/medical_history/${entry.medical_history_pdf.split('/').pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        Show medical history
                    </Button>

                    </TableCell>
                    <TableCell align="center">
                        <Button
                        variant="contained"
                        color="success"
                        sx={{ mr: 1 }}
                        onClick={() => updateStatus(entry._id, 1)}
                        >
                        Approve
                        </Button>
                        <Button
                        variant="contained"
                        color="error"
                        onClick={() => updateStatus(entry._id, 2)}
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

export default ParentApproval;
