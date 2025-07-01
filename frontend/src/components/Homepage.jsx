import React, { useEffect } from 'react';
import { Typography, Card, CardContent, CardMedia, Grid, Button } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import Navbar from './Navbar';
import './Homepage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: 'ease-in-out',
      delay: 200,
    });
  }, []);

  const navigate = useNavigate();

  const carouselItems = [
    {
      image: '/assets/slide1.jpg',
      title: 'Expert Pediatric Care',
      description: 'Providing top-notch healthcare for your children.',
    },
    {
      image: '/assets/slide2.jpg',
      title: 'Compassionate Staff',
      description: 'Our team is dedicated to your child\'s well-being.',
    },
    {
      image: '/assets/slide3.jpg',
      title: 'State-of-the-Art Facilities',
      description: 'Equipped with modern technology for accurate diagnoses.',
    },
  ];

  return (
    <>
      <Navbar />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          marginTop: '340px',
        }}
      >
        {/* Main content that grows to push footer down */}
        <div style={{ flex: 1 }}>
          <div className="homepage-container">
            <div className="homepage-content">
              {/* Intro Section */}
              <div className="intro-section" data-aos="fade-up" data-aos-delay="400">
                <div className="image-container">
                  <img
                    src="/assets/mother-baby.png"
                    alt="Child Care"
                    className="homepage-image"
                  />
                </div>
                <div className="text-container">
                  <Typography
                    variant="h2"
                    className="welcome-text"
                    data-aos="fade-down"
                    data-aos-delay="200"
                  >
                    Welcome to Pediatric Pal
                  </Typography>
                  <Typography variant="h6" className="description-text">
                    Dedicated to providing expert pediatric care and support for your child's well-being.
                  </Typography>
                  <Button
                    variant="contained"
                    className="cta-button"
                    onClick={() => navigate('/login')}
                  >
                    Get Assistance
                  </Button>
                </div>
              </div>

              {/* Carousel Section */}
              <div className="carousel-wrapper" style={{ marginTop: '40px', padding: '0 10px' }}>
                <Carousel animation="fade" interval={2000} indicators navButtonsAlwaysVisible={false}>
                  {carouselItems.map((item, index) => (
                    <Card key={index} className="carousel-card">
                      <CardMedia
                        component="img"
                        height="700"
                        image={item.image}
                        alt={item.title}
                        style={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="h5">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Carousel>
              </div>

              {/* Info Cards Section */}
              <div className="info-section" style={{ marginTop: '60px', padding: '0 20px',marginBottom: '400px' }}>
                <Grid container spacing={4}>
                  {/* Services Card */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      className="info-card"
                      data-aos="fade-up-right"
                      data-aos-delay="100"
                      style={{
                        backgroundColor: '#e3f2fd',
                        borderRadius: '20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <CardContent>
                        <img
                          src="/assets/services-icon.png"
                          alt="Services"
                          style={{ width: '390px', height: '300px', marginBottom: '10px',borderRadius: '20px', objectFit: 'cover' }}
                        />
                        <Typography variant="h5" gutterBottom>Our Services</Typography>
                        <Typography variant="body2">
                          Comprehensive pediatric services from newborn to adolescence.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Team Card */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      className="info-card"
                      data-aos="fade-up"
                      data-aos-delay="200"
                      style={{
                        backgroundColor: '#fff3e0',
                        borderRadius: '20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <CardContent>
                        <img
                            src="/assets/team-icon.png"
                            alt="Team"
                            style={{
                              width: '390px',
                              height: '300px',
                              marginBottom: '10px',
                              borderRadius: '20px', // 👈 Rounded corners
                              objectFit: 'cover'     // 👈 Keeps image nicely fitted
                            }}
                          />

                        <Typography variant="h5" gutterBottom>Meet Our Team</Typography>
                        <Typography variant="body2">
                          Experienced and caring pediatricians dedicated to your child's health.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Contact Card */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      className="info-card"
                      data-aos="fade-up-left"
                      data-aos-delay="300"
                      style={{
                        backgroundColor: '#ede7f6',
                        borderRadius: '20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <CardContent>
                        <img
                          src="/assets/contact-icon.png"
                          alt="Contact"
                          style={{ width: '390px', height: '300px', marginBottom: '10px', borderRadius: '20px', objectFit: 'cover' }}
                        />
                        <Typography variant="h5" gutterBottom>Contact Us</Typography>
                        <Typography variant="body2">
                          Get in touch to schedule an appointment or ask questions.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>

        {/* Footer shown at the end of all content */}
        <Footer />
      </div>
    </>
  );
};

export default Homepage;
