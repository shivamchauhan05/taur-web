import React from 'react';
import { FaCar, FaUsers, FaAward, FaHandshake } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>About CarTour</h1>
          <p className="tagline">Your Trusted Partner in Car Rentals Since 2010</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2010, CarTour started with a simple mission: to make car rentals 
                accessible, affordable, and hassle-free for everyone. What began as a small 
                fleet of 2 cars in one city has now grown to over 10 vehicles across 
                50+ cities nationwide.
              </p>
              <p>
                We believe that every journey deserves the perfect vehicle. Whether it's a 
                business trip, family vacation, or weekend getaway, we're here to ensure 
                you travel in comfort and style.
              </p>
            </div>
            <div className="story-image">
              <img 
                src="/images/about-story.jpg" 
                alt="CarTour Team"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mv-card mission">
              <FaCar className="mv-icon" />
              <h3>Our Mission</h3>
              <p>
                To provide reliable, safe, and affordable car rental services that 
                empower people to explore new destinations with confidence and convenience.
              </p>
            </div>
            <div className="mv-card vision">
              <FaHandshake className="mv-icon" />
              <h3>Our Vision</h3>
              <p>
                To become the most trusted car rental platform in India, known for 
                exceptional service, innovative solutions, and customer-centric approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">By The Numbers</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10</div>
              <div className="stat-label">Cars in Fleet</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <FaUsers className="value-icon" />
              <h3>Customer First</h3>
              <p>Our customers are at the heart of everything we do. Their satisfaction is our top priority.</p>
            </div>
            <div className="value-card">
              <FaAward className="value-icon" />
              <h3>Excellence</h3>
              <p>We strive for excellence in every aspect of our service, from vehicle maintenance to customer support.</p>
            </div>
            <div className="value-card">
              <FaHandshake className="value-icon" />
              <h3>Integrity</h3>
              <p>We believe in transparent pricing and honest communication with our customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet Our Leadership</h2>
          <div className="team-grid">
            <div className="team-member">
              <img 
                src="/images/team-ceo.jpg" 
                alt="CEO"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w-300&h=300&fit=crop';
                }}
              />
              <h3>Rajesh Kumar</h3>
              <p className="position">Founder & CEO</p>
              <p className="bio">15+ years in automotive industry</p>
            </div>
            <div className="team-member">
              <img 
                src="/images/team-coo.jpg" 
                alt="COO"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop';
                }}
              />
              <h3>Priya Sharma</h3>
              <p className="position">Chief Operations Officer</p>
              <p className="bio">Expert in logistics and operations</p>
            </div>
            <div className="team-member">
              <img 
                src="/images/team-cto.jpg" 
                alt="CTO"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop';
                }}
              />
              <h3>Amit Verma</h3>
              <p className="position">Chief Technology Officer</p>
              <p className="bio">Tech innovator with 10+ years experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience the CarTour Difference?</h2>
            <p>Join thousands of satisfied customers who trust us for their travel needs.</p>
            <div className="cta-buttons">
              <a href="/cars" className="cta-btn primary">Book a Car</a>
              <a href="/contact" className="cta-btn secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;