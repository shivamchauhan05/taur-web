import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="tagline">We're here to help. Get in touch with us!</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <FaPhone className="contact-icon" />
              <h3>Phone</h3>
              <p>+91 92209 28080</p>
              <p className="timing">Mon-Sun: 6 AM - 12 AM</p>
            </div>
            
            <div className="contact-info-card">
              <FaEnvelope className="contact-icon" />
              <h3>Email</h3>
              <p>chauhanshivam8836@gmail.com</p>
              <p>bookings@cartour.com</p>
            </div>
            
            <div className="contact-info-card">
              <FaMapMarkerAlt className="contact-icon" />
              <h3>Head Office</h3>
              <p>123 Business Street,</p>
              <p>Mumbai, Maharashtra 400001</p>
            </div>
            
            <div className="contact-info-card">
              <FaClock className="contact-icon" />
              <h3>Working Hours</h3>
              <p>24/7 Customer Support</p>
              <p>Booking: 6 AM - 12 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-wrapper">
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              {submitSuccess && (
                <div className="success-message">
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject *"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message *"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/*  Quick Contact */}
            <div className="contact-sidebar">
  
             

              {/* Quick Contact */}
              <div className="quick-contact">
                <h3>Quick Connect</h3>
                <div className="social-links">
                  <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <a href="mailto:support@cartour.com" className="social-link email">
                    <FaEnvelope /> Email Us
                  </a>
                  <a href="tel:+911234567890" className="social-link phone">
                    <FaPhone /> Call Now
                  </a>
                </div>

                <div className="social-media">
                  <h4>Follow Us</h4>
                  <div className="social-icons">
                    <a href="https://facebook.com/cartour" target="_blank" rel="noopener noreferrer">
                      <FaFacebook />
                    </a>
                    <a href="https://twitter.com/cartour" target="_blank" rel="noopener noreferrer">
                      <FaTwitter />
                    </a>
                    <a href="https://instagram.com/cartour" target="_blank" rel="noopener noreferrer">
                      <FaInstagram />
                    </a>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="faq-link">
                <h3>Need Help?</h3>
                <p>Check our FAQ section for quick answers to common questions.</p>
                <a href="/faq" className="faq-btn">View FAQs</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="emergency-contact">
        <div className="container">
          <div className="emergency-content">
            <h2>24/7 Emergency Support</h2>
            <p>For urgent assistance during your rental period</p>
            <div className="emergency-number">
              <FaPhone /> +91 92209 28080
            </div>
            <p className="emergency-note">Available round the clock for breakdowns, accidents, or any emergency situations.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;