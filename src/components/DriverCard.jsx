import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaStar, FaLanguage, FaCar, FaPhone } from 'react-icons/fa';
import './DriverCard.css';

const DriverCard = ({ driver }) => {
  return (
    <div className="driver-card">
      <div className="driver-header">
        <img src={driver.image} alt={driver.name} className="driver-photo" />
        <div className="driver-badge">
          {driver.available ? 'Available' : 'On Trip'}
        </div>
      </div>
      
      <div className="driver-info">
        <h3>{driver.name}</h3>
        <p className="driver-experience">
          <FaUser /> {driver.experience} years experience
        </p>
        
        <div className="driver-rating">
          <FaStar />
          <span>{driver.rating}</span>
          <span className="total-trips">({driver.totalTrips} trips)</span>
        </div>
        
        <div className="driver-languages">
          <FaLanguage />
          <span>{driver.languages.join(', ')}</span>
        </div>
        
        <div className="driver-vehicles">
          <FaCar />
          <span>{driver.vehicles.join(', ')}</span>
        </div>
        
        <div className="driver-actions">
          <Link to={`/driver/${driver.id}`} className="view-profile">
            View Profile
          </Link>
          <a href={`tel:${driver.phone}`} className="call-driver">
            <FaPhone /> Call
          </a>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;