import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axiosInstance from '../../axiosinterceptor';
import PediatricianHeader from './PediatricianHeader';
import PediatricianFooter from './PediatricianFooter';

const ReferHospital = () => {
  const [patients, setPatients] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [formData, setFormData] = useState({
    hospital_name: '',
    address: '',
    phone_number: '',
    website: '',
    description: '',
    hospital_image: null,
  });
  const [referrals, setReferrals] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);

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
    axiosInstance
      .get(`/api/patients/byPediatrician/${pediatricianId}`)
      .then(res => setPatients(res.data || []))
      .catch(err => console.error('Error fetching patients:', err));
  }, [pediatricianId]);

  useEffect(() => {
    if (selectedParentId) {
      axiosInstance
        .get(`/api/hospitals/${selectedParentId}`)
        .then(res => setReferrals(res.data || []))
        .catch(err => console.error('Error fetching referred hospitals:', err));
    } else {
      setReferrals([]);
    }
  }, [selectedParentId]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, hospital_image: e.target.files[0] }));
  };

  const handleRefer = async () => {
    if (!selectedParentId || !formData.hospital_name.trim()) {
      alert('Please fill all required fields.');
      return;
    }

    const data = new FormData();
    data.append('pediatrician_id', pediatricianId);
    data.append('parent_id', selectedParentId);
    data.append('hospital_name', formData.hospital_name);
    data.append('address', formData.address);
    data.append('phone_number', formData.phone_number);
    data.append('website', formData.website);
    data.append('description', formData.description);
    if (formData.hospital_image) {
      data.append('hospital_image', formData.hospital_image);
    }

    try {
      await axiosInstance.post('/api/hospitals/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Hospital referred successfully!');
      setFormData({
        hospital_name: '', address: '', phone_number: '', website: '', description: '', hospital_image: null
      });
      setSelectedParentId('');
    } catch (err) {
      console.error(err);
      alert('Error referring hospital.');
    }
  };

  const handleDeleteReferral = async () => {
    try {
      await axiosInstance.delete(`/api/hospitals/${hospitalToDelete}`);
      setReferrals(prev => prev.filter(h => h._id !== hospitalToDelete));
      setDeleteDialogOpen(false);
      alert('Referral deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Error deleting referral.');
    }
  };

  return (
    <>
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <PediatricianHeader />
      <Box component="main" flex="1">
      <Box sx={{ maxWidth: 960, mx: 'auto', mt: 16, mb: 3 }}>
        <Typography variant="h4" mb={4} align="center">Parents Available</Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {patients.map(parent => (
            <Card key={parent._id} sx={{ width: '30%', minWidth: 280, p: 2, borderRadius: 3, boxShadow: 3 }}>
              <CardMedia
                component="img"
                sx={{ height: 150, width: 150, borderRadius: '50%', objectFit: 'cover', mb: 2, border: '3px solid rgba(0,0,0,0.6)', boxShadow: '0 0 8px rgba(0,0,0,0.2)', ml: 6 }}
                image={parent.child_photo.startsWith('http') ? parent.child_photo : `http://localhost:4000/${parent.child_photo}`}
                alt={`${parent.child_name}'s photo`}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{parent.parent_name}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Child:</strong> {parent.child_name}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Address:</strong> {parent.address}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Phone:</strong> {parent.phone_number}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Email:</strong> {parent.emailid}</Typography>
                <Typography variant="body2">
                  <a href={`http://localhost:4000/${parent.medical_history_pdf.split('/').pop()}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#1976d2' }}>
                    View Medical History PDF
                  </a>
                </Typography>
              </CardContent>
              <Box sx={{ textAlign: 'center', mt: 'auto' }}>
                <Button
                  variant={selectedParentId === parent._id ? 'contained' : 'outlined'}
                  onClick={() =>
                    setSelectedParentId(prevId => (prevId === parent._id ? '' : parent._id))
                  }
                  fullWidth
                >
                  {selectedParentId === parent._id ? 'Selected (Click to Deselect)' : 'Select to Refer Hospital'}
                </Button>
              </Box>
            </Card>
          ))}
        </Box>

        {selectedParentId && (
          <>
            <Paper sx={{ p: 4, mt: 6, backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.7)' }}>
              <Typography variant="h5" gutterBottom>Refer Hospital to Selected Parent</Typography>
              {['hospital_name', 'address', 'phone_number', 'website', 'description'].map(field => (
                <TextField
                  key={field}
                  label={field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  multiline={field === 'description'}
                  rows={field === 'description' ? 3 : 1}
                />
              ))}
              <Box mt={2}>
                <input
                  type="file"
                  id="hospital-image-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <Button variant="contained" component="span" startIcon={<UploadFileIcon />} onClick={() => document.getElementById('hospital-image-upload').click()}>
                  Choose Hospital Image (optional)
                </Button>
                {formData.hospital_image && (
                  <Typography variant="body2" mt={1}>Selected file: {formData.hospital_image.name}</Typography>
                )}
              </Box>
              <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleRefer}>Refer Hospital</Button>
            </Paper>

            {referrals.length > 0 && (
              <Box mt={6}>
                <Typography variant="h5" gutterBottom>Previously Referred Hospitals</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                  {referrals.map(hospital => (
                    <Card key={hospital._id} sx={{ width: 300, p: 2, borderRadius: 3, boxShadow: 3 }}>
                      {hospital.hospital_image && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={`http://localhost:4000/${hospital.hospital_image}`}
                          alt={hospital.hospital_name}
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{hospital.hospital_name}</Typography>
                        <Typography variant="body2"><strong>Address:</strong> {hospital.address}</Typography>
                        <Typography variant="body2"><strong>Phone:</strong> {hospital.phone_number}</Typography>
                        <Typography variant="body2"><strong>Website:</strong> <a href={hospital.website} target="_blank" rel="noreferrer">{hospital.website}</a></Typography>
                        <Typography variant="body2" mt={1}>{hospital.description}</Typography>
                        <Button
                          color="error"
                          variant="outlined"
                          sx={{ mt: 2 }}
                          onClick={() => {
                            setHospitalToDelete(hospital._id);
                            setDeleteDialogOpen(true);
                          }}
                          fullWidth
                        >
                          Delete Referral
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this referred hospital?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteReferral} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
</Box>
      <PediatricianFooter />
      </Box>
    </>
  );
};

export default ReferHospital;
