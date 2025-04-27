import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import axiosInstance from '../axiosinterceptor';

const SignupPediatrician = () => {
  const [formData, setFormData] = useState({
    name: '',
    emailid: '',
    password: '',
    confirmPassword: '',
    license_number: '',
    phone_number: '',
    address: '',
    license_pdf: null
  });

  const [fileName, setFileName] = useState("No file chosen");
  const [fileError, setFileError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'license_pdf') {
      const file = files[0];
      if (file && file.type !== 'application/pdf') {
        setFileError('Only PDF format is allowed for license.');
        return;
      }
      setFormData({ ...formData, license_pdf: file });
      setFileName(file?.name || "No file chosen");
      setFileError('');
    } else if (name === 'name') {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, '');
      setFormData({ ...formData, [name]: lettersOnly });
    } else if (name === 'phone_number' || name === 'license_number') {
      const numbersOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numbersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      emailid: '',
      password: '',
      confirmPassword: '',
      license_number: '',
      phone_number: '',
      address: '',
      license_pdf: null
    });
    setFileName("No file chosen");
    setFileError('');
    const fileInput = document.getElementById('license_pdf');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fileError) {
      alert(fileError);
      return;
    }

    // Regex patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validations
    if (!emailRegex.test(formData.emailid)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(formData.phone_number)) {
      alert("Phone number must be 10 digits starting with 6-9.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!strongPasswordRegex.test(formData.password)) {
      alert("Password must be at least 8 characters and include a capital letter, a number, and a special character.");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      if (key !== 'confirmPassword') {
        data.append(key, formData[key]);
      }
    }

    try {
      const res = await axiosInstance.post('http://localhost:4000/api/pediatricians/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Signup successful!');
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Signup failed.');
    }
  };

  return (
    <>
    <div className="signup-container">
      <Navbar />
      <h1>Sign Up - Pediatrician</h1>
      <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <input
          type="email"
          name="emailid"
          placeholder="Email"
          value={formData.emailid}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <input
          type="text"
          name="license_number"
          placeholder="License Number"
          value={formData.license_number}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          rows="4"
          className="address-textarea"
          autoComplete="off"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <div className="custom-file-upload">
          <label htmlFor="license_pdf" className="file-label">Choose License PDF</label>
          <input
            type="file"
            name="license_pdf"
            id="license_pdf"
            accept="application/pdf"
            onChange={handleChange}
            required
          />
          <span className="file-name">{fileName}</span>
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

export default SignupPediatrician;
