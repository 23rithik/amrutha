import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Paper
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ParentHeader from './ParentHeader1';
import ParentFooter from './ParentFooter1';
import axiosInstance from '../../axiosinterceptor';

import axios from 'axios';

const ParentAIChatbot = () => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I’m your AI assistant. How can I help you today?' },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // if (chatEndRef.current) {
    //   chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    // }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const newMessages = [...messages, { sender: 'parent', text: chatInput }];
    setMessages(newMessages);
    setChatInput('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/api/aichat', {
        message: chatInput,
      });
      const aiReply = res.data.reply || "Sorry, I didn't get that.";
      setMessages([...newMessages, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { sender: 'ai', text: 'An error occurred.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ParentHeader />
      <Box sx={{ flexGrow: 1, px: 4, pt: 13, pb: 4, maxWidth: '1100px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#c2185b', mb: 3 }}>
          Talk to Our AI Assistant
        </Typography>
        <Paper
  elevation={6}
  sx={{
    p: 2,
    maxHeight: 400,
    overflowY: 'auto',
    mb: 2,
    bgcolor: 'background.default',
    borderRadius: 3,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    background: 'linear-gradient(135deg, #f9f9fb 0%, #e3e7f1 100%)',
     // or a fixed width like 600
     // optional to prevent overflow
  }}
>

  {messages.map((msg, i) => (
    <Box
      key={i}
      sx={{
        display: 'flex',
        justifyContent: msg.sender === 'parent' ? 'flex-end' : 'flex-start',
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          bgcolor: msg.sender === 'parent' ? '#c2185b' : '#f0f0f0',
          color: msg.sender === 'parent' ? '#fff' : '#333',
          px: 3,
          py: 1.25,
          borderRadius: 3,
          maxWidth: '70%',
          boxShadow:
            msg.sender === 'parent'
              ? '0 2px 8px rgba(194, 24, 91, 0.3)'
              : '0 2px 8px rgba(0,0,0,0.08)',
          fontSize: '0.9rem',
          fontWeight: 500,
          // Bubble shape tweaks
          borderTopRightRadius: msg.sender === 'parent' ? 0 : 12,
          borderTopLeftRadius: msg.sender === 'parent' ? 12 : 0,
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        <Typography variant="body2">{msg.text}</Typography>
      </Box>
    </Box>
  ))}
  <div ref={chatEndRef} />
  {loading && (
    <Typography
      variant="body2"
      sx={{
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        mt: 1,
      }}
    >
      Typing...
    </Typography>
  )}
</Paper>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
  fullWidth
  placeholder="Ask anything about your child's health..."
  value={chatInput}
  onChange={(e) => setChatInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: '#ccc',
      },
      '&:hover fieldset': {
        borderColor: '#c2185b',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#c2185b',
        boxShadow: '0 0 8px rgba(194, 24, 91, 0.4)',
      },
      background: 'rgba(255, 255, 255, 0.8)',
    },
    '& .MuiInputBase-input': {
      padding: '12px 14px',
      fontSize: '1rem',
    },
    '& .MuiInputBase-input::placeholder': {
      color: '#999',
      fontStyle: 'italic',
    },
    
  }}
/>

          <Button variant="contained" onClick={handleSendMessage} disabled={loading || !chatInput}>
            <ChatIcon /> Send
          </Button>
        </Box>
      </Box>
      <ParentFooter />
    </Box>
  );
};

export default ParentAIChatbot;
