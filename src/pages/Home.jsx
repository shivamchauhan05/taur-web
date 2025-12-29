import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import carsData from '../data/carsData';
import { FaShieldAlt, FaTachometerAlt, FaHeadset, FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const featuredCars = carsData.slice(0, 4);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel images from public folder
  const carouselImages = [
    'download maruti.jfif',
    '/download wagonar.jfif',
    '/download maruti.jfif',
    '/download wagonar.jfif'
  ];

  // WhatsApp contact URL - Replace with your actual WhatsApp number
  const whatsappNumber = '919220928080'; // Example: 91 for India, followed by number
  const whatsappMessage = encodeURIComponent("Hello! I'm interested in renting a car.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Manual slide navigation
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? carouselImages.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="home">
      {/* WhatsApp Floating Button */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
      >
        <FaWhatsapp className="whatsapp-icon" />
      </a>

      {/* Hero Section with Image Slider */}
      <section className="hero-section">
        <div className="carousel-container">
          <div 
            className="carousel-slides" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((image, index) => (
              <div className="carousel-slide" key={index}>
                <img 
                  src={image} 
                  alt={`Car ${index + 1}`}
                  onError={(e) => {
                    // Fallback image if specified image doesn't exist
                    e.target.src = '/images/car-fallback.jpg';
                  }}
                />
                <div className="carousel-overlay">
                  <div className="container">
                    <div className="hero-content">
                      <h1>Find Your Perfect Car for Every Journey</h1>
                      <p>Book premium cars at affordable prices with flexible options</p>
                      <Link to="/cars" className="cta-btn">Explore Cars</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel Navigation Buttons */}
          <button className="carousel-btn prev-btn" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="carousel-btn next-btn" onClick={nextSlide}>
            <FaChevronRight />
          </button>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose CarTour?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <h3>Safe & Secure</h3>
              <p>All cars are sanitized and maintained with highest safety standards</p>
            </div>
            <div className="feature-card">
              <FaTachometerAlt className="feature-icon" />
              <h3>Best Prices</h3>
              <p>Get the best deals with no hidden charges and transparent pricing</p>
            </div>
            <div className="feature-card">
              <FaHeadset className="feature-icon" />
              <h3>24/7 Support</h3>
              <p>Round the clock customer support for all your queries and assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Service Section */}
      <section className="driver-service-section">
        <div className="container">
          <div className="driver-service-content">
            <div className="driver-service-text">
              <h2>Professional Drivers Included</h2>
              <p>Every booking comes with our verified professional drivers</p>
              <ul className="driver-features">
                <li>✅ Trained and verified drivers</li>
                <li>✅ Local route expertise</li>
                <li>✅ 24/7 availability</li>
                <li>✅ Multi-lingual communication</li>
                <li>✅ Safety first approach</li>
              </ul>
              
            </div>
            <div className="driver-service-image">
              <img 
                src="WhatsApp Image 2025-12-28 at 11.53.48 AM.jpeg" 
                alt="Professional Driver"
                onError={(e) => {
                  e.target.src = '/images/driver-fallback.jpg';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="featured-cars">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Cars</h2>
            <Link to="/cars" className="view-all">View All →</Link>
          </div>
          <div className="cars-grid">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready for Your Next Adventure?</h2>
            <p>Book your car now and get 15% off on your first booking!</p>
            <Link to="/cars" className="cta-btn">Book Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;