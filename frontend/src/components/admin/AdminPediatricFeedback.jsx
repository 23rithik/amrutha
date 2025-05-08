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
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  const userAvatar = 'avatar.jpg'; // Replace with actual avatar URL

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
      alert("Reply submitted!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangePasswordClick = () => {
    alert("Redirect to change password!");
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <AppBar position="static" sx={{ backgroundColor: '#ff99bb' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {isMobile && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6">Pediatrician Feedback Management</Typography>
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
    </Box>
  );
};

export default AdminPediatricFeedback;
