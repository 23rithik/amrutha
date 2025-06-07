import React, { useEffect, useState } from 'react';
import {
    Box, TextField, Button, Typography, Paper
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../axiosinterceptor';
import PediatricianHeader from './PediatricianHeader';
import PediatricianFooter from './PediatricianFooter';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // add at top with other imports

const EditPediatricProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        emailid: '',
        password: '', // Empty by default
        phone_number: '',
        address: '',
        license_number: '',
        license_pdf: null,
    });

    const [previewLicense, setPreviewLicense] = useState('');
    const [pediatricianId, setPediatricianId] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const decoded = jwtDecode(token);
                const id = decoded.id;
                setPediatricianId(id);

                // 🔄 New API endpoint
                const res = await axiosInstance.get(`/api/pediatric/profile/view/${id}`);
                setFormData(prev => ({
                    ...prev,
                    name: res.data.name,
                    emailid: res.data.emailid,
                    phone_number: res.data.phone_number,
                    address: res.data.address,
                    license_number: res.data.license_number,
                    password: '' // Don't pre-fill password
                }));
                if (res.data.license_pdf) {
                    setPreviewLicense(`http://localhost:4000/uploads/licenses/${res.data.license_pdf}`);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = e => {
        setFormData(prev => ({ ...prev, license_pdf: e.target.files[0] }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const form = new FormData();

        for (const key in formData) {
            // Only include password if filled
            if (key === 'password' && !formData[key]) continue;
            form.append(key, formData[key]);
        }

        try {
            // 🔄 New API endpoint
            await axiosInstance.put(`/api/pediatric/profile/edit/${pediatricianId}`, form);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            alert('Error updating profile');
        }
    };

    return (
        <>
            <PediatricianHeader />
            <Box sx={{ minHeight: '100vh', pt: 17, mb: 30 }}>
                <Paper sx={{ maxWidth: 600, mx: 'auto', p: 4,borderRadius:15,backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)' }}>
                    <Typography variant="h5" gutterBottom>Edit Profile</Typography>
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            padding: '30px',
                            borderRadius: '25px',
                            background: 'rgba(255, 178, 178, 0.15)',      // translucent white
                            backdropFilter: 'blur(10px)',                   // blur behind
                            WebkitBackdropFilter: 'blur(10px)',             // for Safari
                            border: '1px solid rgba(255, 255, 255, 0.6)',   // subtle white border
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.307)', // soft shadow for depth
                        }}
                    >
                        <TextField
                            label="Name"
                            name="name"
                            fullWidth
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            sx={{
                                bgcolor: '#f9f9f9',
                                borderRadius: 1,
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        />

                        <TextField
                            label="Email"
                            name="emailid"
                            fullWidth
                            value={formData.emailid}
                            onChange={handleChange}
                            required
                            type="email"
                            autoComplete="email"
                            sx={{
                                bgcolor: '#f9f9f9',
                                borderRadius: 1,
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        />

                        <TextField
                            label="New Password (optional)"
                            name="password"
                            fullWidth
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            sx={{
                                bgcolor: '#f9f9f9',
                                borderRadius: 1,
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        />

                        <TextField
                            label="Phone Number"
                            name="phone_number"
                            fullWidth
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                            type="tel"
                            sx={{
                                bgcolor: '#f9f9f9',
                                borderRadius: 1,
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        />

                        <TextField
                            label="Address"
                            name="address"
                            fullWidth
                            multiline
                            minRows={2}
                            value={formData.address}
                            onChange={handleChange}
                            required
                            sx={{
                                bgcolor: '#f9f9f9',
                                borderRadius: 1,
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        />

                        <TextField
                            label="License Number"
                            name="license_number"
                            fullWidth
                            value={formData.license_number}
                            onChange={handleChange}
                            required
                            sx={{
                                bgcolor: '#f9f9f9',
                                borderRadius: 1,
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        />

                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{ mb: 1, fontWeight: 600, color: '#555' }}
                            >
                                Current License:
                            </Typography>
                            {previewLicense ? (
                                <a
                                    href={previewLicense}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: '#1976d2',
                                        fontWeight: '500',
                                        textDecoration: 'underline',
                                    }}
                                >
                                    View Current License
                                </a>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No license uploaded yet.
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{ mb: 1, fontWeight: 600, color: '#555' }}
                            >
                                Upload New License (optional):
                            </Typography>

                            <input
                                type="file"
                                accept="application/pdf"
                                id="license-upload"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />

                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<UploadFileIcon />}
                                onClick={() => document.getElementById('license-upload').click()}
                                sx={{
                                    textTransform: 'none',
                                    boxShadow: '0px 3px 8px rgba(25, 118, 210, 0.4)',
                                    '&:hover': {
                                        backgroundColor: '#155a9a',
                                        boxShadow: '0px 5px 15px rgba(21, 90, 154, 0.6)',
                                    },
                                }}
                            >
                                Choose PDF
                            </Button>

                            {formData.license_pdf && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Selected file: <strong>{formData.license_pdf.name}</strong>
                                </Typography>
                            )}
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                boxShadow: '0px 6px 16px rgba(25, 118, 210, 0.5)',
                                '&:hover': {
                                    backgroundColor: '#115293',
                                    boxShadow: '0px 8px 20px rgba(17, 82, 147, 0.7)',
                                },
                            }}
                        >
                            Save Changes
                        </Button>
                    </form>
                </Paper>
            </Box>
            <PediatricianFooter />
        </>
    );
};

export default EditPediatricProfile;
