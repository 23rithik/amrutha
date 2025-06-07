import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import PediatricianHeader from './PediatricianHeader';
import PediatricianFooter from './PediatricianFooter';
import axiosInstance from '../../axiosinterceptor';
import {jwtDecode} from 'jwt-decode';

const PediatricianFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replies, setReplies] = useState({}); // key: feedback _id, value: reply text
  const [editing, setEditing] = useState({}); // key: feedback _id, value: boolean (editing or not)

  const pediatricianId = React.useMemo(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.id;
  }, []);

  // Fetch feedbacks given to this pediatrician (by pediatricianId)
  useEffect(() => {
    if (!pediatricianId) return;

    const fetchFeedbacks = async () => {
      try {
        const res = await axiosInstance.get(`/api/pediatricfeedback/pediatrician/${pediatricianId}`);
        setFeedbacks(res.data);

        // Initialize replies state for each feedback
        const initialReplies = {};
        res.data.forEach(fb => {
          initialReplies[fb._id] = fb.reply || '';
        });
        setReplies(initialReplies);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      }
    };

    fetchFeedbacks();
  }, [pediatricianId]);

  const handleReplyChange = (id, value) => {
    setReplies(prev => ({ ...prev, [id]: value }));
  };

  const toggleEditing = id => {
    setEditing(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const saveReply = async id => {
    try {
      await axiosInstance.put(`/api/pediatricfeedback/reply/${id}`, {
        reply: replies[id]
      });

      setEditing(prev => ({ ...prev, [id]: false }));

      // Optionally update local feedback state reply (if you want immediate UI sync)
      setFeedbacks(prev =>
        prev.map(fb => (fb._id === id ? { ...fb, reply: replies[id] } : fb))
      );
    } catch (err) {
      console.error('Failed to save reply:', err);
      alert('Failed to save reply. Please try again.');
    }
  };

  return (
    <>
      <PediatricianHeader />
      <Box sx={{ minHeight: '100vh', pt: 17, mb: 10, px: 3 }}>
        <Paper
          sx={{
            maxWidth: 800,
            mx: 'auto',
            p: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Parent Feedback
          </Typography>

          {feedbacks.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No feedback received yet.
            </Typography>
          ) : (
            <List>
              {feedbacks.map(fb => (
                <Box key={fb._id} sx={{ mb: 3 }}>
                  <ListItem alignItems="flex-start" disableGutters>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="600" color="#1976d2">
                          From: {fb.username}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body1"
                            sx={{ whiteSpace: 'pre-wrap', mb: 1 }}
                          >
                            {fb.message}
                          </Typography>

                          {/* Reply Section */}
                          {editing[fb._id] ? (
                            <>
                              <TextField
                                multiline
                                minRows={2}
                                fullWidth
                                value={replies[fb._id]}
                                onChange={e => handleReplyChange(fb._id, e.target.value)}
                                placeholder="Write your reply here..."
                                sx={{ mb: 1 }}
                              />
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => saveReply(fb._id)}
                                >
                                  Save Reply
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => toggleEditing(fb._id)}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </>
                          ) : (
                            <>
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: 'pre-wrap',
                                  fontStyle: fb.reply ? 'normal' : 'italic',
                                  color: fb.reply ? 'text.primary' : 'text.secondary',
                                  mb: 1,
                                }}
                              >
                                {fb.reply || 'No reply yet.'}
                              </Typography>
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => toggleEditing(fb._id)}
                              >
                                {fb.reply ? 'Edit Reply' : 'Add Reply'}
                              </Button>
                            </>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </Box>
      <PediatricianFooter />
    </>
  );
};

export default PediatricianFeedback;
