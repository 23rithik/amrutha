import React from 'react';
import './AboutUs.css';
import Navbar from './Navbar';
import Footer from './Footer';

const AboutUs = () => {
  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrap">
        <div className="about-container">
          <h1 className="about-title">Who We Are</h1>
          <p className="about-description">
            At Pediatric Pal, we are dedicated to the health and well-being of children. 
            With a team of experienced pediatricians, we provide compassionate care and 
            state-of-the-art treatment tailored to each child’s needs.
          </p>

          <div className="grid-section">
            <div className="card">
              <h2>Our Mission</h2>
              <p>
                To deliver quality pediatric care that promotes healthy growth and development, 
                while supporting families through every stage of childhood.
              </p>
            </div>
            <div className="card">
              <h2>Our Vision</h2>
              <p>
                To be a trusted leader in pediatric healthcare, known for excellence in service, 
                innovation in treatment, and dedication to patient-centered care.
              </p>
            </div>
            <div className="card">
              <h2>Our Values</h2>
              <ul>
                <li>Compassion</li>
                <li>Expertise</li>
                <li>Family-Centered Approach</li>
                <li>Continuous Innovation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
