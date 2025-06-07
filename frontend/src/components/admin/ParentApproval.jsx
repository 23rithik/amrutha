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
  Chip,
  CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axiosInstance from '../../axiosinterceptor';

function ParentApproval() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [parents, setParents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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


  const fetchParents = async () => {
    setIsRefreshing(true);
    try {
      const response = await axiosInstance.get('/api/all-parents');
      setParents(response.data);
      localStorage.setItem('parentsData', JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
      showSnackbar('Error fetching parents', 'error');
      
      // Fallback to cached data if available
      const cachedData = localStorage.getItem('parentsData');
      if (cachedData) {
        setParents(JSON.parse(cachedData));
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Load cached data immediately
    const cachedData = localStorage.getItem('parentsData');
    if (cachedData) {
      setParents(JSON.parse(cachedData));
    }

    fetchParents();

    const handleBeforeUnload = (e) => {
      if (isRefreshing) {
        e.preventDefault();
        e.returnValue = 'Data is still loading. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const updateStatus = async (parentId, status, parentName) => {
  if (isRefreshing) {
    showSnackbar('Please wait until data loading completes', 'warning');
    return;
  }

  try {
    const response = await axiosInstance.put(
      `/api/parents/${parentId}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    const updatedParents = parents.map(parent =>
      parent._id === parentId ? { ...parent, login_status: status } : parent
    );

    setParents(updatedParents);
    localStorage.setItem('parentsData', JSON.stringify(updatedParents));

    showSnackbar(
      `${parentName} ${status === 1 ? 'approved' : 'rejected'} successfully!`,
      'success'
    );

  } catch (err) {
    console.error("Error updating status:", err);
    const errorMessage = err.response?.data?.message ||
      err.message ||
      'Failed to update status';
    showSnackbar(errorMessage, 'error');
  }
};


  // Snackbar functions
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
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
            {/* <IconButton onClick={handleAvatarClick}>
              <Avatar sx={{ bgcolor: '#ff99bb' }}>A</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleChangePasswordClick}>Change Password</MenuItem>
            </Menu> */}
          </Toolbar>
        </AppBar>

        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
          Registered Parents
          {loading && <Chip label="Loading..." size="small" sx={{ ml: 2 }} />}
        </Typography>
        
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#ffe6ee' }}>
              <TableRow>
                <TableCell>Parent Name</TableCell>
                <TableCell>Child Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Child Photo</TableCell>
                <TableCell>Medical History</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {parents.length > 0 ? (
                parents.map((parent) => (
                  <TableRow key={parent._id}>
                    <TableCell>{parent.parent_name}</TableCell>
                    <TableCell>{parent.child_name}</TableCell>
                    <TableCell>{parent.emailid}</TableCell>
                    <TableCell>{parent.phone_number}</TableCell>
                    <TableCell>
                      <Chip 
                        label={statusText[parent.login_status] || 'Unknown'} 
                        color={statusColors[parent.login_status] || 'default'} 
                      />
                    </TableCell>

                    <TableCell>
                      <img
                        src={parent.child_photo}
                        alt="Child"
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        href={`http://localhost:4000/uploads/medical_history/${parent.medical_history_pdf.split('/').pop()}`}
                        target="_blank"
                        disabled={isRefreshing}
                      >
                        View PDF
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mr: 1, mb: 1 }}
                        onClick={() => updateStatus(parent._id, 1, parent.parent_name)}
                        disabled={parent.login_status === 1 || parent.login_status === 3 || isRefreshing}
                        startIcon={isRefreshing ? <CircularProgress size={20} /> : null}
                      >
                        {isRefreshing ? 'Processing...' : 'Approve'}
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => updateStatus(parent._id, 2, parent.parent_name)}
                        disabled={parent.login_status === 2 || parent.login_status === 3 || isRefreshing}
                        startIcon={isRefreshing ? <CircularProgress size={20} /> : null}
                      >
                        {isRefreshing ? 'Processing...' : 'Reject'}
                      </Button>

                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      'No parents found'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default ParentApproval;