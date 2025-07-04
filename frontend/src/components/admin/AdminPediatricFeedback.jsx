import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axiosInstance from '../../axiosinterceptor';
import Sidebar from './Sidebar';

const AdminPediatricFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replies, setReplies] = useState({});
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success | error | warning | info


  useEffect(() => {
    axiosInstance.get('/api/pediatric-feedbacks')
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
        }
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleChange = (id, value) => {
    setReplies({ ...replies, [id]: value });
  };

  const handleSubmit = async (id) => {
    try {
      await axiosInstance.put(`/api/pediatric-feedbacks/${id}`, {
        reply: replies[id]
      });
      setSnackbarMsg("Reply submitted!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (err) {
      setSnackbarMsg("Failed to submit reply");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar on the left */}
      <Sidebar isMobile={isMobile} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content with flex column layout */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top AppBar */}
        <AppBar position="static" sx={{ backgroundColor: '#ff99bb' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {isMobile && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6">Pediatrician Feedback Management</Typography>
          </Toolbar>
        </AppBar>

        {/* Main scrollable content */}
        <Box sx={{ flex: 1, p: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
            Pediatrician Feedbacks
          </Typography>
          <List sx={{ width: '100%' }}>
            {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
              feedbacks.map(fb => (
                <ListItem key={fb._id} sx={{ width: '100%', mb: 2 }}>
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <Typography><strong>Doctor:</strong> {fb.username}</Typography>
                      <Typography sx={{ my: 1 }}>
                        <strong>Message:</strong> {fb.message}
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        label="Reply"
                        value={replies[fb._id]}
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
                </ListItem>
              ))
            ) : (
              <Typography>No feedback found or invalid response.</Typography>
            )}
          </List>
        </Box>

        {/* Footer styled like AppBar */}
        <AppBar position="static" sx={{ backgroundColor: '#ff99bb', top: 'auto', bottom: 0, }}>
          <Toolbar sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="inherit">
              © {new Date().getFullYear()} PEDIATRIC-PAL | Pediatrician Feedback
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default AdminPediatricFeedback;
