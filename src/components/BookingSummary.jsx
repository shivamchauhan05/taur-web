import React from 'react';
import { FaCar, FaCalendarAlt, FaRupeeSign, FaCheck } from 'react-icons/fa';
import './BookingSummary.css';

const BookingSummary = ({ car }) => {
  const calculateTotal = () => {
    const dailyRate = parseInt(car.price.replace(/[^0-9]/g, ''));
    const days = 3; // This should come from form
    const insurance = 500;
    const tax = dailyRate * days * 0.18;
    return (dailyRate * days) + insurance + tax;
  };

  return (
    <div className="booking-summary">
      <h3>Booking Summary</h3>
      
      <div className="summary-section">
        <div className="summary-item">
          <FaCar />
          <div className="item-details">
            <span className="item-title">{car.name}</span>
            <span className="item-subtitle">{car.transmission} • {car.seats} seats</span>
          </div>
        </div>

        <div className="summary-item">
          <FaCalendarAlt />
          <div className="item-details">
            <span className="item-title">3 Days Rental</span>
            <span className="item-subtitle">Dec 15 - Dec 18, 2024</span>
          </div>
        </div>
      </div>

      <div className="price-breakdown">
        <h4>Price Breakdown</h4>
        <div className="price-row">
          <span>Daily Rate (3 days)</span>
          <span>₹{parseInt(car.price.replace(/[^0-9]/g, '')) * 3}</span>
        </div>
        <div className="price-row">
          <span>Insurance</span>
          <span>₹500</span>
        </div>
        <div className="price-row">
          <span>Tax (18%)</span>
          <span>₹945</span>
        </div>
        <div className="price-row total">
          <span>Total Amount</span>
          <span>₹{calculateTotal().toLocaleString()}</span>
        </div>
      </div>

      <div className="included-features">
        <h4>What's Included</h4>
        <ul>
          <li><FaCheck /> Unlimited Mileage</li>
          <li><FaCheck /> 24/7 Roadside Assistance</li>
          <li><FaCheck /> Free Cancellation</li>
          <li><FaCheck /> No Hidden Charges</li>
          <li><FaCheck /> Comprehensive Insurance</li>
        </ul>
      </div>

      
    </div>
  );
};

export default BookingSummary;