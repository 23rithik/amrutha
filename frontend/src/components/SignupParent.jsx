import React, { useState } from 'react';
import './Signup.css';
import Navbar from './Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import axiosInstance from '../axiosinterceptor';

const SignupParent = () => {
  const [formData, setFormData] = useState({
    parent_name: '',
    child_name: '',
    emailid: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone_number: '',
    child_photo: null,
    medical_history_pdf: null,
  });

  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [childPhotoName, setChildPhotoName] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [fileError, setFileError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];

      if (name === 'child_photo') {
        if (!file.type.startsWith('image/')) {
          setFileError('Only image files (JPG, PNG) are allowed for Child Photo.');
          return;
        }
        setFormData({ ...formData, child_photo: file });
        setPreviewPhoto(URL.createObjectURL(file));
        setChildPhotoName(file.name);
        setFileError('');
      }

      if (name === 'medical_history_pdf') {
        if (file.type !== 'application/pdf') {
          setFileError('Only PDF format is allowed for Medical History.');
          return;
        }
        setFormData({ ...formData, medical_history_pdf: file });
        setPdfName(file.name);
        setFileError('');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      parent_name: '',
      child_name: '',
      emailid: '',
      password: '',
      confirmPassword: '',
      address: '',
      phone_number: '',
      child_photo: null,
      medical_history_pdf: null,
    });
    setChildPhotoName('');
    setPdfName('');
    setPreviewPhoto(null);
    setFileError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fileError) {
      alert(fileError);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailid)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Name validation (only letters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.parent_name)) {
      alert('Parent name should contain only letters.');
      return;
    }
    if (!nameRegex.test(formData.child_name)) {
      alert('Child name should contain only letters.');
      return;
    }

    // Phone number validation (only digits, exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    // Confirm password match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Password strength validation
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      alert('Password must be at least 8 characters and include a capital letter, a number, and a special character.');
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (key !== 'confirmPassword') {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await axiosInstance.post('http://localhost:4000/api/patients/register', data);
      alert(response.data.message);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <>  
    <div className="signup-container">
      <Navbar />
      <h1>Sign Up - Parent</h1>
      <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
        <input
          type="text"
          name="parent_name"
          placeholder="Parent Name"
          required
          value={formData.parent_name}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="text"
          name="child_name"
          placeholder="Child's Name"
          required
          value={formData.child_name}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="email"
          name="emailid"
          placeholder="Email"
          required
          value={formData.emailid}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          required
          value={formData.phone_number}
          onChange={handleChange}
          autoComplete="off"
        />
        <textarea
          name="address"
          placeholder="Address"
          required
          value={formData.address}
          onChange={handleChange}
          rows="4"
          className="address-textarea"
          autoComplete="off"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        {/* Child Photo Upload */}
        <div className="custom-file-upload">
          <label htmlFor="child_photo" className="file-label">Upload Child Photo (JPG, PNG)</label>
          <input
            type="file"
            name="child_photo"
            id="child_photo"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <span className="file-name">{childPhotoName}</span>
          {previewPhoto && (
            <img
              src={previewPhoto}
              alt="Child Preview"
              style={{ maxWidth: '100px', marginTop: '10px' }}
            />
          )}
        </div>

        {/* Medical History PDF Upload */}
        <div className="custom-file-upload">
          <label htmlFor="medical_history_pdf" className="file-label">Upload Medical History (PDF)</label>
          <input
            type="file"
            name="medical_history_pdf"
            id="medical_history_pdf"
            accept="application/pdf"
            onChange={handleChange}
            required
          />
          <span className="file-name">{pdfName}</span>
        </div>

        {fileError && <p style={{ color: 'red' }}>{fileError}</p>}

        <button type="submit">Sign Up</button>
      </form>

      <p style={{ marginTop: '15px' }}>
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
    
    <Footer />
    
    </>
  );
};

export default SignupParent;
