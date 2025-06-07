import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ParentHeader from './ParentHeader1';
import ParentFooter from './ParentFooter1';
import axiosInstance from '../../axiosinterceptor';
import { jwtDecode } from 'jwt-decode';

const frostedPaperStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.5)', // frosted glass
  backdropFilter: 'blur(80px)',
  borderRadius: 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
};

const ParentPediatricianFeedbackPage = () => {
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [parentId, setParentId] = useState('');
  const [pediatricianId, setPediatricianId] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const id = decoded.id;
      setParentId(id);

      // Assuming pediatrician_id is stored in token or somewhere accessible
      // Adjust this if pediatrician_id is to be fetched differently
      const pedId = decoded.pediatrician_id || decoded.assignedPediatricianId || ''; 
      setPediatricianId(pedId);

      try {
        const res = await axiosInstance.get(`/api/pediatricfeedback/${id}`); // backend should filter by parent_id
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Failed to fetch pediatrician feedbacks:', err);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleSubmit = async () => {
    try {
      await axiosInstance.post('/api/pediatricfeedback', {
        message,
        parent_id: parentId,
        pediatrician_id: pediatricianId,
        username: jwtDecode(localStorage.getItem('token')).username || 'Anonymous',
      });
      setMessage('');
      const res = await axiosInstance.get(`/api/pediatricfeedback/${parentId}`);
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error submitting pediatrician feedback:', err);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <ParentHeader />
      <Container sx={{ pt: 13, pb: 5, flex: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#c2185b',
            mb: 4,
            mt: 2,
            textShadow: '3px 3px 1px rgba(0, 0, 0, 0.2)',
          }}
        >
          Feedback to Pediatrician
        </Typography>

        {/* Feedback submission with frosted glass */}
        <Paper sx={{ p: 3, mb: 4, ...frostedPaperStyle }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Enter your feedback"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: 'rgba(176, 50, 69, 0.6)', // light pink with some transparency
              color: '#fff',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(252, 48, 150, 0.8)', // deeper pink on hover
                backdropFilter: 'blur(6px)',
              },
            }}
            onClick={handleSubmit}
            disabled={!message.trim()}
          >
            Submit Feedback
          </Button>
        </Paper>

        <Typography variant="h5" sx={{ mb: 2 }}>
          Your Previous Feedbacks to Pediatrician
        </Typography>

        <List>
          {feedbacks.map((fb, index) => (
            // Each previous feedback with frosted glass style
            <Paper key={index} sx={{ mb: 2, p: 2, ...frostedPaperStyle }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`You: ${fb.message}`}
                  secondary={
                    fb.reply ? (
                      <Typography sx={{ color: 'green' }}>
                        Pediatrician: {fb.reply}
                      </Typography>
                    ) : (
                      <Typography sx={{ color: 'gray' }}>
                        Awaiting pediatrician reply...
                      </Typography>
                    )
                  }
                />
              </ListItem>
              <Divider />
            </Paper>
          ))}
        </List>
      </Container>
      <ParentFooter />
    </Box>
  );
};

export default ParentPediatricianFeedbackPage;
