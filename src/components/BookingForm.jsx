import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaUserTie } from 'react-icons/fa';
import driversData from '../data/driversData';
import './BookingForm.css';

const BookingForm = ({ car }) => {
  const navigate = useNavigate();
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    returnLocation: '',
    passengers: '',
    purpose: 'tour',
    driverPreference: '',
    additionalRequests: ''
  });

  useEffect(() => {
    // Filter available drivers for this car
    const drivers = driversData.filter(driver => 
      driver.available && car.assignedDrivers.includes(driver.id)
    );
    setAvailableDrivers(drivers);
    if (drivers.length > 0) {
      setSelectedDriver(drivers[0].id);
      setFormData(prev => ({ ...prev, driverPreference: drivers[0].id }));
    }
  }, [car]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDriverData = driversData.find(d => d.id === parseInt(selectedDriver));
    
    const bookingData = {
      car,
      driver: selectedDriverData,
      ...formData,
      bookingDate: new Date().toISOString(),
      bookingId: `CT${Date.now().toString().slice(-8)}`,
      totalAmount: calculateTotal()
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/confirmation');
  };

  const calculateTotal = () => {
    const days = Math.ceil(
      (new Date(formData.returnDate) - new Date(formData.pickupDate)) / (1000 * 60 * 60 * 24)
    ) || 1;
    
    const carPrice = parseInt(car.price.replace(/[^0-9]/g, ''));
    const driverPrice = car.driverIncluded ? parseInt(car.driverCharge.replace(/[^0-9]/g, '')) : 0;
    
    return (carPrice + driverPrice) * days;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="booking-form-container">
      <h2 className="form-title">Book {car.name}</h2>
      
      <form onSubmit={handleSubmit} className="booking-form">
        {/* Customer Details */}
        <div className="form-section">
          <h3><FaUser /> Your Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Trip Details */}
        <div className="form-section">
          <h3><FaCalendarAlt /> Trip Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Pickup Date & Time</label>
              <input
                type="datetime-local"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Return Date & Time</label>
              <input
                type="datetime-local"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><FaMapMarkerAlt /> Pickup Location</label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Enter pickup address"
                required
              />
            </div>
            
            <div className="form-group">
              <label><FaMapMarkerAlt /> Return Location</label>
              <input
                type="text"
                name="returnLocation"
                value={formData.returnLocation}
                onChange={handleChange}
                placeholder="Enter return address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Number of Passengers</label>
              <select 
                name="passengers" 
                value={formData.passengers} 
                onChange={handleChange}
                required
              >
                <option value="">Select passengers</option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4 Persons</option>
                <option value="5">5 Persons</option>
                <option value="6">6+ Persons</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Purpose of Trip</label>
              <select 
                name="purpose" 
                value={formData.purpose} 
                onChange={handleChange}
                required
              >
                <option value="tour">Tour/Travel</option>
                <option value="wedding">Wedding</option>
                <option value="business">Business</option>
                <option value="airport">Airport Transfer</option>
                <option value="outstation">Outstation</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Driver Selection */}
        {car.driverIncluded && availableDrivers.length > 0 && (
          <div className="form-section">
            <h3><FaUserTie /> Select Your Driver</h3>
            <div className="drivers-selection">
              {availableDrivers.map(driver => (
                <div 
                  key={driver.id} 
                  className={`driver-option ${selectedDriver === driver.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedDriver(driver.id);
                    setFormData({...formData, driverPreference: driver.id});
                  }}
                >
                  <img src={driver.image} alt={driver.name} />
                  <div className="driver-info">
                    <h4>{driver.name}</h4>
                    <p>{driver.experience} years experience • {driver.rating} ★</p>
                    <p className="driver-languages">{driver.languages.join(', ')}</p>
                  </div>
                  <div className="driver-charge">{driver.chargePerDay}</div>
                </div>
              ))}
            </div>
            <p className="driver-note">
              * Driver charge is already included in the package price
            </p>
          </div>
        )}

        {/* Additional Requests */}
        <div className="form-section">
          <h3>Additional Requirements</h3>
          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              name="additionalRequests"
              value={formData.additionalRequests}
              onChange={handleChange}
              placeholder="Any special requirements? (e.g., child seat, extra stops, etc.)"
              rows="4"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Confirm Booking with Driver
        </button>
      </form>
    </div>
  );
};

export default BookingForm;