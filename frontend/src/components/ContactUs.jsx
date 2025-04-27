import React from 'react';
import './ContactUs.css';
import Navbar from './Navbar';
import Footer from './Footer';

const ContactUs = () => {
  return (
    <>
      <Navbar />
      <div className="contact-page">
        <h1>Contact Us</h1>
        <p className="intro-text">
          We’d love to hear from you. Whether you have a question about our services, support, or anything else,
          our team is ready to answer all your questions.
        </p>

        <div className="contact-grid">
        <div className="contact-info">
            <h2>Headquarters</h2>
            <table className="contact-table">
              <tbody>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>amrutha@pediatricpal.com</td>
                </tr>
                <tr>
                  <td><strong>Phone:</strong></td>
                  <td>+91-8714779564</td>
                </tr>
                <tr>
                  <td><strong>Location:</strong></td>
                  <td>
                    Amruthalayam<br />
                    Ayiram Tengucherry,<br />
                    Koottikada PO,<br />
                    Kollam, Kerala, India
                  </td>
                </tr>
                <tr>
                  <td><strong>Coordinates:</strong></td>
                  <td>8°51'20.2"N 76°38'41.7"E</td>
                </tr>
              </tbody>
            </table>
          </div>


          <div className="contact-map">
            <iframe
              title="Pediatric Pal HQ"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d393.8757132522223!2d76.64509405976905!3d8.855551162053294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1744051913984!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
