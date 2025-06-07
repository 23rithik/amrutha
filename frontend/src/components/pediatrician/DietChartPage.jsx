import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Stack,
  Link,
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '../../axiosinterceptor';
import PediatricianHeader from './PediatricianHeader';
import PediatricianFooter from './PediatricianFooter';

const createInitialWeek = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map(day => ({
    day,
    meals: [{ time: '', food: '' }],
  }));
};

const DietChartPage = () => {
  const [parentList, setParentList] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [week, setWeek] = useState(createInitialWeek);
  const [dietCharts, setDietCharts] = useState([]);

  const pediatricianId = (() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return '';
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.id || '';
    } catch {
      return '';
    }
  })();

  useEffect(() => {
    if (!pediatricianId) return;
    axiosInstance.get(`/api/patients/byPediatrician/${pediatricianId}`)
      .then(res => setParentList(res.data || []))
      .catch(console.error);
  }, [pediatricianId]);

  useEffect(() => {
    if (!selectedParent) {
      setDietCharts([]);
      return;
    }
    axiosInstance.get(`/api/dietchart/${selectedParent._id}`)
      .then(res => setDietCharts(res.data || []))
      .catch(console.error);
  }, [selectedParent]);

  const handleMealChange = (dayIndex, mealIndex, field, value) => {
    const updatedWeek = [...week];
    updatedWeek[dayIndex].meals[mealIndex][field] = value;
    setWeek(updatedWeek);
  };

  const addMealRow = (dayIndex) => {
    const updatedWeek = [...week];
    updatedWeek[dayIndex].meals.push({ time: '', food: '' });
    setWeek(updatedWeek);
  };

  const removeMealRow = (dayIndex, mealIndex) => {
    const updatedWeek = [...week];
    if (updatedWeek[dayIndex].meals.length > 1) {
      updatedWeek[dayIndex].meals.splice(mealIndex, 1);
      setWeek(updatedWeek);
    }
  };

  const handleSubmit = async () => {
    if (!selectedParent) {
      alert('Please select a parent');
      return;
    }

    for (const day of week) {
      for (const meal of day.meals) {
        if (!meal.time.trim() || !meal.food.trim()) {
          alert(`Please fill all meal times and foods (check day: ${day.day})`);
          return;
        }
      }
    }

    try {
      const payload = {
        parent_id: selectedParent._id,
        pediatrician_id: pediatricianId,
        week,
      };
      await axiosInstance.post('/api/dietchart/add', payload);
      alert('Diet chart added successfully!');
      setWeek(createInitialWeek());
      const res = await axiosInstance.get(`/api/dietchart/${selectedParent._id}`);
      setDietCharts(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to add diet chart.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diet chart?')) return;
    try {
      await axiosInstance.delete(`/api/dietchart/${id}`);
      setDietCharts(dietCharts.filter(chart => chart._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete diet chart.');
    }
  };

  if (!selectedParent) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <PediatricianHeader />
        <Box sx={{ flexGrow: 1, maxWidth: 1000, mx: 'auto', mt: 16, px: 2, pb: 8 }}>
          <Typography variant="h4" sx={{pb:4}} gutterBottom>Select Parent to Manage Diet Chart</Typography>
          {parentList.length === 0 && (
            <Typography>No parents assigned or available.</Typography>
          )}
          <Grid container spacing={3}>
            {parentList.map((parent) => (
              <Grid item xs={12} md={6} key={parent._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{parent.parent_name} (Child: {parent.child_name})</Typography>
                    <Typography><strong>Address:</strong> {parent.address}</Typography>
                    <Typography><strong>Phone:</strong> {parent.phone_number}</Typography>
                    <Typography><strong>Email:</strong> {parent.emailid}</Typography>
                    <Typography><strong>Status:</strong> {parent.status}</Typography>
                    <Box mt={2}>
                      <Typography variant="subtitle2">Child Photo:</Typography>
                      {parent.child_photo ? (
                        <CardMedia
                          component="img"
                          height="150"
                          image={`http://localhost:4000/${parent.child_photo}`}
                          alt="Child photo"
                          sx={{ borderRadius: 1 }}
                        />
                      ) : (
                        <Typography>No photo uploaded</Typography>
                      )}
                    </Box>
                    <Box mt={1}>
                      <Typography variant="subtitle2">Medical History PDF:</Typography>
                      {parent.medical_history_pdf ? (
                        <Link
                          href={`http://localhost:4000/${parent.medical_history_pdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                        >
                          View Medical History
                        </Link>
                      ) : (
                        <Typography>No medical history uploaded</Typography>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => setSelectedParent(parent)}
                      disabled={parent.status === 'rejected'}
                    >
                      Select Parent
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <PediatricianFooter />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PediatricianHeader />
      <Box sx={{ flexGrow: 1, maxWidth: 1000, mx: 'auto', mt: 16, px: 2, pb: 8 }}>
        <Button variant="text" onClick={() => setSelectedParent(null)}>← Back to Parent List</Button>
        <Typography variant="h4" gutterBottom>
          Diet Chart Management for {selectedParent.parent_name} (Child: {selectedParent.child_name})
        </Typography>

        <Paper sx={{ p: 3, mb: 5, bgcolor: 'rgba(255,255,255,0.8)' }} elevation={4}>
          <Typography variant="h6" gutterBottom>Add New Diet Chart</Typography>

          {week.map((day, dayIndex) => (
            <Box key={day.day} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{day.day}</Typography>
              {day.meals.map((meal, mealIndex) => (
                <Stack
                  key={mealIndex}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <TextField
                    label="Time"
                    value={meal.time}
                    onChange={(e) => handleMealChange(dayIndex, mealIndex, 'time', e.target.value)}
                    size="small"
                    sx={{ width: '30%' }}
                  />
                  <TextField
                    label="Food"
                    value={meal.food}
                    onChange={(e) => handleMealChange(dayIndex, mealIndex, 'food', e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeMealRow(dayIndex, mealIndex)}
                    disabled={day.meals.length === 1}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
              <Button variant="text" onClick={() => addMealRow(dayIndex)}>+ Add Meal</Button>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}

          <Button variant="contained" onClick={handleSubmit}>Save Diet Chart</Button>
        </Paper>

        {dietCharts.length > 0 && (
          <>
            <Typography variant="h5" gutterBottom>Previous Diet Charts</Typography>
            {dietCharts.map((chart, i) => (
              <Accordion key={chart._id} sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-content-${chart._id}`}
                  id={`panel-header-${chart._id}`}
                  sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Chart {i + 1} - {new Date(chart.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {chart.week.length} days, {chart.week.reduce((sum, day) => sum + day.meals.length, 0)} meals total
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(chart._id);
                    }}
                  >
                    Delete
                  </Button>
                </AccordionSummary>
                <AccordionDetails>
                  {chart.week.map((day, dIndex) => (
                    <Box key={dIndex} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">{day.day}</Typography>
                      <List dense disablePadding>
                        {day.meals.map((meal, mIndex) => (
                          <ListItem key={mIndex} sx={{ pl: 2 }}>
                            <ListItemText primary={`${meal.time} - ${meal.food}`} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </Box>
      <PediatricianFooter />
    </Box>
  );
};

export default DietChartPage;
