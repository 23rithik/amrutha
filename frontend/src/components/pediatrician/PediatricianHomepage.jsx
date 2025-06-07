import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Avatar,
  TextField,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../axiosinterceptor';

import PediatricianHeader from './PediatricianHeader';
import PediatricianFooter from './PediatricianFooter';

const PediatricianHomepage = () => {
  const [allChats, setAllChats] = useState([]);
  const [groupedChats, setGroupedChats] = useState({});
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedParentName, setSelectedParentName] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [pediatricianName, setPediatricianName] = useState('');
  const [pediatricianPhoto, setPediatricianPhoto] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200, once: true, easing: 'ease-in-out', delay: 200 });
  }, []);

  useEffect(() => {
    let intervalId;

    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode(token);
        const pediatricianId = decoded.id;

        // Fetch chats
        const res = await axiosInstance.get(`/api/chat/pediatrician/${pediatricianId}`);
        setAllChats(res.data);

        // Group chats by parent_id
        const grouped = {};
        res.data.forEach(chat => {
          const pid = chat.parent_id?._id || 'unknown';
          if (!grouped[pid]) {
            grouped[pid] = {
              parentName: chat.parent_id?.parent_name || 'Unknown Parent',
              messages: [],
            };
          }
          grouped[pid].messages.push(chat);
        });
        setGroupedChats(grouped);

        // Auto-select first parent if none selected
        if (!selectedParentId && Object.keys(grouped).length > 0) {
          setSelectedParentId(Object.keys(grouped)[0]);
          setSelectedParentName(grouped[Object.keys(grouped)[0]].parentName);
        }

        // Fetch pediatrician details once
        if (!pediatricianName) {
          const profileRes = await axiosInstance.get(`/api/pediatrician/profile/${pediatricianId}`);
          setPediatricianName(profileRes.data.name || 'Doctor');
          setPediatricianPhoto(profileRes.data.photo);
        }
      } catch (err) {
        console.error('Error fetching chats or profile:', err);
      }
    };

    fetchChats(); // Initial fetch immediately

    intervalId = setInterval(fetchChats, 4000); // Refresh every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [selectedParentId, pediatricianName]);

  const handleSendMessage = async () => {
    if (chatInput.trim() === '') return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode(token);
      const pediatricianId = decoded.id;

      await axiosInstance.post('/api/chat/send', {
        parent_id: selectedParentId,
        pediatrician_id: pediatricianId,
        sender: 'pediatrician',
        message: chatInput,
      });

      setGroupedChats(prev => {
        const updated = { ...prev };
        updated[selectedParentId].messages.push({
          parent_id: { _id: selectedParentId, parent_name: selectedParentName },
          pediatrician_id: pediatricianId,
          sender: 'pediatrician',
          message: chatInput,
          createdAt: new Date().toISOString(),
        });
        return updated;
      });

      setChatInput('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const homepageContainerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'linear-gradient(to right, #ff758c, #ff7eb3)',
    paddingTop: '90px',
    paddingBottom: '2rem',
  };

  return (
    <>
      <PediatricianHeader />

      <Box sx={homepageContainerStyle}>
        {/* --- Welcome Section --- */}
        <Box
          sx={{
            minHeight: 'calc(100vh - 200px)',
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 2, sm: 4, md: 6 },
            pt: 5,
            pb: 4,
            textAlign: 'left',
            maxWidth: '1100px',
            marginLeft: '200px',
          }}
        >
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
              Welcome, {pediatricianName ? pediatricianName.charAt(0).toUpperCase() + pediatricianName.slice(1) : 'Doctor'}!
            </Typography>

            <Box
              onClick={() => navigate('/pediatric-editprofile')}
              sx={{
                cursor: 'pointer',
                borderRadius: '50%',
                '&:hover': {
                  boxShadow: '0 0 0 3px rgba(194,24,91,0.3)',
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#c2185b',
                  width: 50,
                  height: 50,
                  fontSize: 30,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  border: '2px solid rgb(4, 15, 5)',
                }}
              >
                {pediatricianName ? pediatricianName.charAt(0).toUpperCase() : 'D'}
              </Avatar>

            </Box>
          </Box>

          {/* --- Chat Section --- */}
          <Box sx={{ display: 'flex', gap: 3, height: 400 }}>
            {/* Parent List */}
            <Paper sx={{ width: 250, overflowY: 'auto' }}>
              <Typography variant="h6" sx={{ p: 2, bgcolor: '#c2185b', color: '#fff' }}>
                Parents
              </Typography>
              <List>
                {Object.entries(groupedChats).map(([parentId, chat]) => (
                  <ListItem
                    button
                    key={parentId}
                    selected={parentId === selectedParentId}
                    onClick={() => {
                      setSelectedParentId(parentId);
                      setSelectedParentName(chat.parentName);
                    }}
                    sx={{
                      bgcolor: parentId === selectedParentId ? 'rgba(233, 142, 169, 0.8)' : 'inherit',
                      pointer: 'cursor',
                      color: parentId === selectedParentId ? '#fff' : 'inherit',
                      '&:hover': {
                        bgcolor: parentId === selectedParentId ? '#b21550' : '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemText primary={chat.parentName} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Chat Window */}
            <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Chat with {selectedParentName || 'Select a parent'}
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  mb: 2,
                  bgcolor: '#f9f9f9',
                  p: 1,
                  borderRadius: 2,
                }}
              >
                {selectedParentId && groupedChats[selectedParentId]?.messages.length > 0 ? (
                  groupedChats[selectedParentId].messages.map((msg, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        justifyContent: msg.sender === 'pediatrician' ? 'flex-end' : 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: msg.sender === 'pediatrician' ? '#c2185b' : '#e0e0e0',
                          color: msg.sender === 'pediatrician' ? '#fff' : '#000',
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          maxWidth: '70%',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        <Typography variant="body2">{msg.message || msg.text}</Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No messages yet.
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  variant="outlined"
                  size="small"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button variant="contained" color="secondary" onClick={handleSendMessage}>
                  Send
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      <PediatricianFooter />
    </>
  );
};

export default PediatricianHomepage;
