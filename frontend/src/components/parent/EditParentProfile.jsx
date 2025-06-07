import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import axiosInstance from '../../axiosinterceptor';
import {jwtDecode} from 'jwt-decode';
import ParentHeader from './ParentHeader1';
import ParentFooter from './ParentFooter1';
import { useNavigate } from 'react-router-dom';

const EditParentProfile = () => {
  const [form, setForm] = useState({
    parent_name: '',
    child_name: '',
    address: '',
    phone_number: '',
    emailid: '',
    password: '',
    child_photo: '',
    medical_history_pdf: ''
  });

  const [childPhotoFile, setChildPhotoFile] = useState(null);
  const [medicalHistoryFile, setMedicalHistoryFile] = useState(null);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { id } = jwtDecode(token);
      try {
        const res = await axiosInstance.get(`/api/patient/profile/${id}`);
        setForm(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, fileType) => {
    if (fileType === 'child_photo') setChildPhotoFile(e.target.files[0]);
    else if (fileType === 'medical_history_pdf') setMedicalHistoryFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    const { id } = jwtDecode(token);

    const data = new FormData();
    data.append('parent_name', form.parent_name);
    data.append('child_name', form.child_name);
    data.append('address', form.address);
    data.append('phone_number', form.phone_number);
    data.append('emailid', form.emailid);
    data.append('password', form.password);

    if (childPhotoFile) data.append('child_photo', childPhotoFile);
    if (medicalHistoryFile) data.append('medical_history_pdf', medicalHistoryFile);

    try {
      await axiosInstance.put(`/api/patient/profile/update/${id}`, data);
      setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      setTimeout(() => {
        navigate('/editprofile');
      }, 1500);
    } catch (err) {
      console.error('Profile update error:', err);
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    }
  };

  return (
    <>
      <ParentHeader />
      <Container sx={{ mt: 16, mb: 5, width: '50%', maxWidth: '400px' }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#2e7d32', mb: 2 }}>
            Edit Parent Profile
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {['parent_name', 'child_name', 'address', 'phone_number', 'emailid', 'password'].map((field) => (
              <TextField
                key={field}
                label={field.replace('_', ' ').toUpperCase()}
                name={field}
                value={form[field]}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type={field === 'password' ? 'password' : 'text'}
                required
                sx={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 1,
                  input: { color: '#333' }
                }}
              />
            ))}

            {form.child_photo && !childPhotoFile && (
              <Box mt={3} display="flex" flexDirection="column" alignItems="center">
                <Typography fontWeight={500} gutterBottom>
                  Current Child Photo
                </Typography>
                <img
                  src={`http://localhost:4000/${form.child_photo}`}
                  alt="Child"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%', // Circular
                    objectFit: 'cover',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    border: '3px solid rgb(4, 15, 5)',
                    marginBottom: '1rem'
                  }}
                />
              </Box>
            )}

            <Typography mt={2} mb={1}>Upload New Child Photo</Typography>
            <Button variant="outlined" component="label" sx={{ mb: 1 }}>
              Choose Child Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFileChange(e, 'child_photo')}
              />
            </Button>
            {childPhotoFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selected: {childPhotoFile.name}
              </Typography>
            )}

            {form.medical_history_pdf && !medicalHistoryFile && (
              <Box mt={4}>
                <Typography fontWeight={500}>Current Medical History PDF</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    window.open(`http://localhost:4000/${form.medical_history_pdf}`, '_blank')
                  }
                  sx={{ mt: 1 }}
                >
                  View PDF
                </Button>
              </Box>
            )}

            <Typography mt={3} mb={1}>Upload New Medical History PDF</Typography>
            <Button variant="outlined" component="label" sx={{ mb: 1 }}>
              Choose Medical PDF
              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => handleFileChange(e, 'medical_history_pdf')}
              />
            </Button>
            {medicalHistoryFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Selected: {medicalHistoryFile.name}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 4,
                py: 1.5,
                background: '#2e7d32',
                fontWeight: 600,
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: '#27632a'
                }
              }}
            >
              Save Changes
            </Button>
          </form>
        </Paper>
      </Container>

      {/* Snackbar Component */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      <ParentFooter />
    </>
  );
};

export default EditParentProfile;
