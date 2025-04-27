import React, { useState } from 'react';
import './Login.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import axiosInstance from '../axiosinterceptor';

const Login = () => {
  const [formData, setFormData] = useState({ emailid: '', password: '' });
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await axiosInstance.post('/api/login', {
        emailid: formData.emailid,
        password: formData.password
      });

      const { userId, userType, token } = loginRes.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userId', userId);

      let userData = null;

      if (userType === 'parent') {
        const res = await axiosInstance.get(`/api/patients/${userId}`);
        userData = res.data;
        navigate('/patienthome', { state: { user: userData } });

      } else if (userType === 'pediatrician') {
        const res = await axiosInstance.get(`/api/pediatricians/${userId}`);
        userData = res.data;
        navigate('/pediatrichome', { state: { user: userData } });

      } else if (userType === 'admin') {
        navigate('/adminhome');
      }

    }  catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); // Show backend message
      } else {
        alert('Login failed. Please try again.');
      }
    }
  };

  const handleSignupRedirect = (userType) => {
    if (userType === 'parent') {
      navigate('/signup-parent');
    } else if (userType === 'pediatrician') {
      navigate('/signup-pediatrition');
    }
  };

  return (
    <>
    <div className="login-container" style={{ marginTop: '90px' }}>
      <Navbar />
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
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
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <div style={{ marginTop: '5px', marginBottom: '15px' }}>
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(prev => !prev)}
          />
          <label htmlFor="showPassword" style={{ marginLeft: '8px' }}>
            Show Password
          </label>
        </div>
        <button type="submit">Login</button>
      </form>

      <div className="signup-prompt" style={{ marginBottom: '100px' }}>
        <p>Don’t have an account?</p>
        <button
          type="button"
          className="signup-toggle"
          onClick={() => setShowSignupOptions(!showSignupOptions)}
        >
          Create New Account
        </button>

        {showSignupOptions && (
          <div className="signup-dropdown">
            <button onClick={() => handleSignupRedirect('parent')}>
              Sign Up as Parent
            </button>
            <button onClick={() => handleSignupRedirect('pediatrician')}>
              Sign Up as Pediatrician
            </button>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Login;
