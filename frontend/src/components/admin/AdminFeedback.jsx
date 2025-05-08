import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  Divider,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import axiosInstance from '../../axiosinterceptor';
import Sidebar from './Sidebar';
import { AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);  
  const [replies, setReplies] = useState({}); 
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    axiosInstance.get('/api/feedbacks')
      .then(res => {
        if (Array.isArray(res.data)) {
          setFeedbacks(res.data);
          const map = {};
          res.data.forEach(fb => {
            map[fb._id] = fb.reply || '';
          });
          setReplies(map);
        } else {
          console.error('Invalid response format:', res.data);
          setError('Invalid feedback data received.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load feedbacks.');
      })
      .finally(() => setLoading(false));  // Set loading state to false after the API call
  }, []);

  const handleChange = (id, value) => {
    setReplies({ ...replies, [id]: value });
  };

  const handleSubmit = async (id) => {
    try {
      await axiosInstance.put(`/api/feedbacks/${id}`, { reply: replies[id] });
      setSnackbarMessage('Reply sent successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage('Failed to send reply.');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          marginLeft: isMobile ? 0 : '24px',
          transition: 'margin-left 0.3s',
        }}
      >
        <AppBar position="static" sx={{ backgroundColor: '#ff99bb' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {isMobile && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6">Parent Feedback Management</Typography>
            <IconButton>
              <Avatar src='/avatar.jpg' alt="Admin" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Typography variant="h4" gutterBottom>Parent Feedbacks</Typography>
        {feedbacks.length > 0 ? (
          <List>
            {feedbacks.map(fb => (
              <ListItem key={fb._id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Card sx={{ width: '100%', mb: 2, bgcolor: '#ffe6ee' }}>
                  <CardContent>
                    <Typography><strong>User:</strong> {fb.username}</Typography>
                    <Typography sx={{ my: 1 }}><strong>Message:</strong> {fb.message}</Typography>
                    <TextField
                      fullWidth
                      multiline
                      label="Reply"
                      value={replies[fb._id] || ''}
                      onChange={(e) => handleChange(fb._id, e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleSubmit(fb._id)}
                      disabled={!replies[fb._id].trim()}
                    >
                      Submit Reply
                    </Button>
                  </CardContent>
                </Card>
                <Divider sx={{ my: 2 }} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No feedback available.</Typography>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminFeedback;
