import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, 
  FaCog, 
  FaGasPump, 
  FaStar, 
  FaUserTie, 
  FaRoad, 
  FaCalendarDay,
  FaCar,
  FaCheck
} from 'react-icons/fa';
import './CarCard.css';

const CarCard = ({ car }) => {
  const [activeTab, setActiveTab] = useState('perDay');

  // Calculate per day total
  const calculatePerDayTotal = () => {
    return car.perDayModel.pricePerDay + car.perDayModel.driverChargePerDay + 
           car.perDayModel.tollTaxPerDay + car.perDayModel.stateTaxPerDay;
  };

  return (
    <div className="car-card-professional">
      {/* Card Header with Image */}
      <div className="car-card-header">
        <img src={car.image} alt={car.name} className="car-image" />
        <div className="car-badge">{'Driver Included'}</div>
        <div className="car-rating-badge">
          <FaStar />
          <span>{car.rating}</span>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="car-card-body">
        {/* Car Title */}
        <div className="car-title-section">
          <h3 className="car-name">{car.name}</h3>
          <p className="car-category">{car.type.toUpperCase()}</p>
        </div>
        
        {/* Car Description */}
        <p className="car-description">{car.description}</p>
        
        {/* Features Icons */}
        <div className="car-features-icons">
          <div className="feature-icon">
            <FaUser />
            <span>{car.seats}</span>
          </div>
          <div className="feature-icon">
            <FaCog />
            <span>{car.transmission}</span>
          </div>
          <div className="feature-icon">
            <FaGasPump />
            <span>{car.fuel}</span>
          </div>
          <div className="feature-icon">
            <FaRoad />
            <span>{car.perDayModel.freeKmsPerDay}KM</span>
          </div>
        </div>
        
        {/* Pricing Tabs */}
        <div className="pricing-tabs">
          <button 
            className={`tab-btn ${activeTab === 'perDay' ? 'active' : ''}`}
            onClick={() => setActiveTab('perDay')}
          >
            <FaCalendarDay />
            Per Day
          </button>
          <button 
            className={`tab-btn ${activeTab === 'perKm' ? 'active' : ''}`}
            onClick={() => setActiveTab('perKm')}
          >
            <FaRoad />
            Per KM
          </button>
        </div>
        
        {/* Pricing Content */}
        <div className="pricing-content">
          {activeTab === 'perDay' ? (
            <div className="per-day-pricing">
              <div className="price-display">
                <span className="price-amount">₹{calculatePerDayTotal()}</span>
                <span className="price-period">/ day</span>
              </div>
              <div className="price-breakdown">
                <div className="breakdown-item">
                  <FaCar />
                  <span>Car Rent</span>
                  <span>₹{car.perDayModel.pricePerDay}/day</span>
                </div>
                <div className="breakdown-item">
                  <FaUserTie />
                  <span>Driver</span>
                  <span>₹{car.perDayModel.driverChargePerDay}/day</span>
                </div>
                <div className="breakdown-item">
                  <FaRoad />
                  <span>Included KMs</span>
                  <span>{car.perDayModel.maxKmsPerDay} KM/day</span>
                </div>
                <div className="breakdown-item">
                  <FaRoad />
                  <span>Extra KM Rate</span>
                  <span>₹{car.perDayModel.extraKmRate}/km</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="per-km-pricing">
              <div className="price-display">
                <span className="price-amount">₹{car.perKmModel.pricePerKm}</span>
                <span className="price-period">/ km</span>
              </div>
              <div className="price-breakdown">
                <div className="breakdown-item">
                  <FaCar />
                  <span>Car Charge</span>
                  <span>₹{car.perKmModel.pricePerKm}/km</span>
                </div>
                <div className="breakdown-item">
                  <FaUserTie />
                  <span>Driver</span>
                  <span>₹{car.perKmModel.driverChargePerKm}/km</span>
                </div>
                <div className="breakdown-item">
                  <FaRoad />
                  <span>Toll Tax</span>
                  <span>₹{car.perKmModel.tollTaxPerKm}/km</span>
                </div>
                <div className="breakdown-item">
                  <FaRoad />
                  <span>Min. Distance</span>
                  <span>{car.perKmModel.minKms || 50} KMs</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Included Features */}
        <div className="included-features">
          <h4>What's Included:</h4>
          <div className="features-grid">
            {car.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="feature-item">
                <FaCheck />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="action-buttons">
          
          <Link to={`/booking/${car.id}`} className="btn-book">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;