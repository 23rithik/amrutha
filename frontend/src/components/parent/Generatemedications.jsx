import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import HealingIcon from '@mui/icons-material/Healing';
import ParentHeader1 from './ParentHeader1';
import ParentFooter from './ParentFooter1';
import axiosInstance from '../../axiosinterceptor';

const Generatemedications = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/medication/predict', { symptoms });
      setResult(res.data);
    } catch (err) {
      alert('Prediction failed. Try again.');
    }
  };

  return (
    <>
      <ParentHeader1 />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          // backgroundColor: '#f3f6f9',
          pt: 15,
        }}
      >
        <Container maxWidth="md" sx={{ flex: 1 }}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
              Generate Medications
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Enter the newborn's symptoms (comma-separated)
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                label="Symptoms"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="e.g., fever, rash, poor_feeding"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button variant="contained" color="primary" type="submit" size="large">
                  Predict
                </Button>
              </Box>
            </Box>

            {result && (
              <Box sx={{ mt: 5 }}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="h5" color="secondary" gutterBottom>
                  <HealingIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Predicted Disease: {result.disease}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Suggested Medications:
                </Typography>
                <List>
                  {result.medications.map((med, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <MedicationIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary={med} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Container>
        <ParentFooter />
      </Box>
    </>
  );
};

export default Generatemedications;
