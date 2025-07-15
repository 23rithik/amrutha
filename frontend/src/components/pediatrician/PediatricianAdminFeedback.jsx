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
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../axiosinterceptor';
import PediatricianHeader from './PediatricianHeader';
import PediatricianFooter from './PediatricianFooter';

const PediatricianAdminFeedback = () => {
  const [pediatricianId, setPediatricianId] = useState('');
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingReply, setEditingReply] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const decoded = jwtDecode(token);
    setPediatricianId(decoded.id);
  }, []);

  useEffect(() => {
    if (!pediatricianId) return;
    fetchFeedbacks();
  }, [pediatricianId]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axiosInstance.get(`/api/pediatric-feedbacks/${pediatricianId}`);
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await axiosInstance.post('/api/pediatric-feedbacks', {
        pediatrician_id: pediatricianId,
        message,
      });
      setMessage('');
      fetchFeedbacks();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to submit feedback');
    }
  };

  const startEditing = (id, currentReply) => {
    setEditingId(id);
    setEditingReply(currentReply || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingReply('');
  };

  const saveReplyEdit = async () => {
    try {
      await axiosInstance.put(`/api/pediatric-feedbacks/reply/${editingId}`, {
        reply: editingReply,
      });
      setEditingId(null);
      setEditingReply('');
      fetchFeedbacks();
    } catch (err) {
      console.error('Failed to update reply:', err);
      alert('Failed to update reply');
    }
  };

  return (
  <Box display="flex" flexDirection="column" minHeight="100vh">
    <PediatricianHeader />
    <Box sx={{ flex: 1, pt: 17 }}>
      <Paper
        sx={{
          maxWidth: 700,
          mx: 'auto',
          p: 4,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.85)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Pediatrician Feedback to Admin
        </Typography>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <TextField
            label="Your Feedback"
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Submit Feedback
          </Button>
        </form>

        <Typography variant="h6" gutterBottom>
          Your Previous Feedbacks
        </Typography>
        {feedbacks.length === 0 ? (
          <Typography>No feedback submitted yet.</Typography>
        ) : (
          <List>
            {feedbacks.map(fb => (
              <Paper
                key={fb._id}
                sx={{ p: 2, mb: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}
                elevation={1}
              >
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  <strong>Message:</strong> {fb.message}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography>
                  <strong>Admin Reply:</strong>{' '}
                  {editingId === fb._id ? (
                    <>
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        value={editingReply}
                        onChange={e => setEditingReply(e.target.value)}
                      />
                      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={saveReplyEdit}
                          color="primary"
                        >
                          Save
                        </Button>
                        <Button variant="outlined" size="small" onClick={cancelEditing}>
                          Cancel
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <span>{fb.reply || 'No reply yet'}</span>
                  )}
                </Typography>
              </Paper>
            ))}
          </List>
        )}
      </Paper>
    </Box>
    <PediatricianFooter />
  </Box>
);

};

export default PediatricianAdminFeedback;
