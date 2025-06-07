import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Avatar, TextField, Paper } from '@mui/material';
import ParentHeader from './ParentHeader1';
import ParentFooter from './ParentFooter1';

import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';

import axiosInstance from '../../axiosinterceptor';
import { jwtDecode } from 'jwt-decode'; // Fixed import: no curly braces
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const [parentName, setParentName] = useState('');
  const [childPhoto, setChildPhoto] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'pediatrician', text: 'Hello! How is your child doing today?' },
    { sender: 'parent', text: 'She had a mild fever yesterday.' },
    { sender: 'pediatrician', text: 'Keep her hydrated. Let me know if the fever continues.' }
  ]);

  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const parentId = decoded.id;

      const res = await axiosInstance.get(`/api/chat/${parentId}`);
      setMessages(res.data.map(msg => ({
        sender: msg.sender,
        text: msg.message
      })));
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() === '') return;

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const parentId = decoded.id;

      await axiosInstance.post('/api/chat/send', {
        parent_id: parentId,
        pediatrician_id: null, // Update this when linked
        sender: 'parent',
        message: chatInput
      });

      setMessages([...messages, { sender: 'parent', text: chatInput }]);
      setChatInput('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const fetchChildPhoto = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const parentId = decoded.id;

      const res = await axiosInstance.get(`/api/patient/photo/${parentId}`);
      setChildPhoto(res.data.child_photo);
    } catch (err) {
      console.error('Error fetching child photo:', err);
    }
  };

  useEffect(() => {
    const fetchParentName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const decoded = jwtDecode(token);
        const parentId = decoded.id;

        const res = await axiosInstance.get(`/api/parent/name/${parentId}`);
        setParentName(res.data.name);
      } catch (err) {
        console.error('Error fetching parent name:', err);
        navigate('/login');
      }
    };

    fetchParentName();
    fetchChildPhoto();
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 4000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ParentHeader />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 2, sm: 4, md: 6 },
          pt: 13,
          pb: 4,
          textAlign: 'left',
          maxWidth: '1100px',
          marginLeft: '200px',
        }}
      >
        {/* Welcome + Avatar row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 6,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Welcome, {parentName ? parentName.charAt(0).toUpperCase() + parentName.slice(1) : 'Parent'}!
          </Typography>

          <Box
            onClick={() => navigate('/editprofile')}
            sx={{
              cursor: 'pointer',
              borderRadius: '50%',
              '&:hover': {
                boxShadow: '0 0 0 3px rgba(194,24,91,0.3)',
              },
            }}
          >
            <Avatar
              src={childPhoto ? `http://localhost:4000/${childPhoto}` : null}
              sx={{
                bgcolor: '#c2185b',
                width: 60,
                height: 60,
                fontSize: 36,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                border: '2px solid rgb(4, 15, 5)',
              }}
            >
              {!childPhoto && <PersonIcon fontSize="large" />}
            </Avatar>
          </Box>
        </Box>

        {/* Interact Section */}
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: 3,
            boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
            p: 4,
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
            Interact with Your Pediatrician
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Communicate directly with your pediatrician for queries and updates on your child's health.
          </Typography>

          {/* Chat Box */}
          <Paper elevation={3} sx={{ p: 2, maxHeight: 300, overflowY: 'auto', mb: 2, backgroundColor: '#fefefe' }}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'parent' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor: msg.sender === 'parent' ? '#c2185b' : '#e0e0e0',
                    color: msg.sender === 'parent' ? '#fff' : '#000',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: '70%',
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>

          {/* Input Box */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              variant="outlined"
              size="small"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ChatIcon />}
              onClick={handleSendMessage}
              sx={{ px: 3 }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
      <ParentFooter />
    </Box>
  );
};

export default ParentDashboard;
