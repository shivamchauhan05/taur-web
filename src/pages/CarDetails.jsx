import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaCog, FaGasPump, FaStar, FaCheck, FaUserTie, FaRupeeSign } from 'react-icons/fa';
import carsData from '../data/carsData';
import driversData from '../data/driversData';
import DriverCard from '../components/DriverCard';
import './CarDetails.css';

const CarDetails = () => {
  const { id } = useParams();
  const car = carsData.find(car => car.id === parseInt(id));

  if (!car) {
    return (
      <div className="car-not-found">
        <h2>Car not found</h2>
        <Link to="/cars">Browse all cars</Link>
      </div>
    );
  }

  // Get assigned drivers
  const assignedDrivers = driversData.filter(driver => 
    car.assignedDrivers.includes(driver.id)
  );

  return (
    <div className="car-details-page">
      <div className="container">
        <div className="car-details-content">
          {/* Car Images & Basic Info */}
          <div className="car-main-info">
            <div className="car-images">
              <img src={car.image} alt={car.name} className="main-image" />
            </div>
            
            <div className="car-basic-info">
              <div className="car-header">
                <h1>{car.name}</h1>
                <div className="car-rating">
                  <FaStar />
                  <span>{car.rating}</span>
                </div>
              </div>
              
              <p className="car-description">{car.description}</p>
              
              <div className="price-box">
                <div className="price-details">
                  <div className="price-row">
                    <span>Car Rental:</span>
                    <span>{car.price}/day</span>
                  </div>
                  {car.driverIncluded && (
                    <>
                      <div className="price-row">
                        <span>Driver Charge:</span>
                        <span>{car.driverCharge}</span>
                      </div>
                      <div className="price-row total">
                        <strong>Total Package:</strong>
                        <strong>{car.totalWithDriver}/day</strong>
                      </div>
                    </>
                  )}
                </div>
                
                <Link to={`/booking/${car.id}`} className="book-now-btn">
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* Driver Section */}
          {car.driverIncluded && (
            <div className="driver-section">
              <h2>Available Drivers</h2>
              <p className="section-subtitle">Choose from our professional drivers</p>
              
              <div className="drivers-grid">
                {assignedDrivers.map(driver => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
              
              <div className="driver-note">
                <FaUserTie />
                <p>
                  <strong>Note:</strong> Driver selection can be done during booking. 
                  Driver charges are included in the package price.
                </p>
              </div>
            </div>
          )}

          {/* Car Specifications */}
          <div className="specifications-section">
            <h3>Car Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <FaUser />
                <span>Seating Capacity</span>
                <strong>{car.seats} Persons</strong>
              </div>
              <div className="spec-item">
                <FaCog />
                <span>Transmission</span>
                <strong>{car.transmission}</strong>
              </div>
              <div className="spec-item">
                <FaGasPump />
                <span>Fuel Type</span>
                <strong>{car.fuel}</strong>
              </div>
              {car.driverIncluded && (
                <div className="spec-item">
                  <FaUserTie />
                  <span>Driver Service</span>
                  <strong>Included</strong>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="features-section">
            <h3>What's Included</h3>
            <div className="features-grid">
              {car.includes.map((item, index) => (
                <div key={index} className="feature-item">
                  <FaCheck />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended For */}
          <div className="recommended-section">
            <h3>Recommended For</h3>
            <div className="tags-container">
              {car.recommendedFor.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Booking CTA */}
          <div className="booking-cta">
            <h2>Ready to Book?</h2>
            <p>Get the best car with professional driver for your trip</p>
            <div className="cta-actions">
              <Link to={`/booking/${car.id}`} className="cta-btn primary">
                Book Now - {car.totalWithDriver}/day
              </Link>
              <Link to="/drivers" className="cta-btn secondary">
                View All Drivers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;