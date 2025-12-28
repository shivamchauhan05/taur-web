import React from 'react';
import CarCard from '../components/CarCard';
import carsData from '../data/carsData';
import './Cars.css';

const Cars = () => {
  // सारी कारें दिखाएं
  const allCars = carsData;

  return (
    <div className="cars-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Our Car Collection</h1>
          <p>Choose from our wide range of premium vehicles</p>
        </div>

        {/* Direct Cars Grid */}
        <div className="cars-main">
          <div className="cars-header">
            <h2>{allCars.length} Cars Available</h2>
            <p className="cars-subtitle">All our premium vehicles are available for booking</p>
          </div>

          {allCars.length > 0 ? (
            <div className="cars-grid">
              {allCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="no-cars">
              <h3>No cars available at the moment</h3>
              <p>Please check back later</p>
            </div>
          )}

          {/* Additional Info Section */}
          <div className="cars-info-section">
            <h3>Why Choose Our Cars?</h3>
            <div className="info-grid">
              <div className="info-card">
                <h4>Well Maintained</h4>
                <p>All vehicles undergo regular maintenance and safety checks</p>
              </div>
              <div className="info-card">
                <h4>Fully Insured</h4>
                <p>Comprehensive insurance coverage for all our cars</p>
              </div>
              <div className="info-card">
                <h4>Clean & Sanitized</h4>
                <p>All cars are thoroughly cleaned and sanitized before each booking</p>
              </div>
              <div className="info-card">
                <h4>24/7 Support</h4>
                <p>Round-the-clock customer support for any assistance</p>
              </div>
            </div>
          </div>

          {/* Booking Process Info */}
          <div className="booking-process">
            <h3>Easy Booking Process</h3>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h4>Select Your Car</h4>
                <p>Choose from our premium collection</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h4>Enter Details</h4>
                <p>Fill in trip and personal details</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h4>Make Payment</h4>
                <p>Secure online payment options</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h4>Enjoy Your Ride</h4>
                <p>Get your car delivered as scheduled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;