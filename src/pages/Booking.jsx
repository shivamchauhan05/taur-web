import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import carsData from '../data/carsData';
import { 
  FaArrowLeft, 
  FaCheck, 
  FaUser, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaCar, 
  FaCreditCard,
  FaRoad,
  FaExchangeAlt
} from 'react-icons/fa';
import './Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pricingModel, setPricingModel] = useState('perDay'); // 'perDay' or 'perKm'
  
  // Form Data State
  const [formData, setFormData] = useState({
    // Step 1: Trip Details
    pickupDate: '',
    returnDate: '',
    pickupTime: '09:00',
    returnTime: '18:00',
    pickupLocation: '',
    dropLocation: '',
    tripType: 'round', // 'round' or 'oneway'
    estimatedDistance: 0,
    
    // Step 2: Customer Details
    name: '',
    email: '',
    phone: '',
    address: '',
    idProof: '',
    idNumber: '',
    
    // Step 4: Extras & Payment
    insurance: true,
    childSeat: false,
    gps: false,
    waterBottles: 0,
    paymentMethod: 'cash',
    termsAccepted: false
  });

  useEffect(() => {
    setTimeout(() => {
      const foundCar = carsData.find(c => c.id === parseInt(id));
      setCar(foundCar);
      setLoading(false);
    }, 500);
  }, [id]);

  // Auto-select pricing model based on trip type
  useEffect(() => {
    if (formData.tripType === 'round') {
      setPricingModel('perDay');
    } else {
      setPricingModel('perKm');
    }
  }, [formData.tripType]);

  // Updated steps array - removed Driver step
  const steps = [
    { id: 1, title: 'Trip Details', icon: <FaCalendarAlt /> },
    { id: 2, title: 'Your Info', icon: <FaUser /> },
    { id: 3, title: 'Payment & Extras', icon: <FaCreditCard /> }
  ];

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Calculate number of days between pickup and return dates
  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 1;
    
    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    
    // Add one day because return date should be inclusive
    const timeDiff = returnDate.getTime() - pickup.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    
    // Minimum 1 day
    return daysDiff >= 1 ? daysDiff : 1;
  };

  // Calculate Total Amount Based on Selected Model
  const calculateTotal = () => {
    if (!car) return 0;
    
    const days = calculateDays();
    const distance = parseInt(formData.estimatedDistance) || 0;
    let total = 0;

    if (pricingModel === 'perDay') {
      // PER DAY CALCULATION - ROUND TRIP
      const model = car.perDayModel;
      
      // Base charges per day
      const dailyBase = model.pricePerDay + model.tollTaxPerDay + model.stateTaxPerDay;
      total = dailyBase * days;
      
      // Check for extra kilometers
      const maxAllowedKms = model.maxKmsPerDay * days;
      if (distance > maxAllowedKms) {
        const extraKms = distance - maxAllowedKms;
        total += extraKms * model.extraKmRate;
      }
      
    } else {
      // PER KM CALCULATION - ONE WAY TRIP
      const model = car.perKmModel;
      const minKms = model.minKms || 50;
      const actualKms = Math.max(distance, minKms);
      
      total = (actualKms * model.pricePerKm) +
              (actualKms * model.tollTaxPerKm) +
              (actualKms * model.stateTaxPerKm);
    }
    
    // Add Extras
    if (formData.insurance) total += 500;
    if (formData.childSeat) total += 300;
    if (formData.gps) total += 200;
    if (formData.waterBottles > 0) total += formData.waterBottles * 50;
    
    return total;
  };

  // Calculate Detailed Breakdown
  const calculateBreakdown = () => {
    if (!car) return null;
    
    const days = calculateDays();
    const distance = parseInt(formData.estimatedDistance) || 0;
    
    if (pricingModel === 'perDay') {
      const model = car.perDayModel;
      const maxAllowedKms = model.maxKmsPerDay * days;
      
      let extraKms = 0;
      if (distance > maxAllowedKms) {
        extraKms = distance - maxAllowedKms;
      }
      
      return {
        model: 'perDay',
        days,
        distance,
        maxAllowedKms,
        extraKms,
        dailyCharges: {
          carRent: model.pricePerDay * days,
          tollTax: model.tollTaxPerDay * days,
          stateTax: model.stateTaxPerDay * days,
        },
        kmCharges: {
          extraKmCharge: extraKms * model.extraKmRate,
        }
      };
    } else {
      const model = car.perKmModel;
      const minKms = model.minKms || 50;
      const actualKms = Math.max(distance, minKms);
      
      return {
        model: 'perKm',
        days,
        distance,
        actualKms,
        charges: {
          carPerKm: actualKms * model.pricePerKm,
          tollTaxPerKm: actualKms * model.tollTaxPerKm,
          stateTaxPerKm: actualKms * model.stateTaxPerKm,
        }
      };
    }
  };

  // Navigation Functions
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit Booking
  const submitBooking = () => {
    const breakdown = calculateBreakdown();
    
    const bookingData = {
      car,
      ...formData,
      pricingModel,
      breakdown,
      bookingDate: new Date().toISOString(),
      bookingId: `CT${Date.now().toString().slice(-8)}`,
      totalAmount: calculateTotal(),
      numberOfDays: calculateDays()
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/confirmation');
  };

  // Validation for each step
  const validateStep = (step) => {
    switch(step) {
      case 1:
        return formData.pickupDate && 
               formData.returnDate && 
               formData.pickupLocation && 
               formData.dropLocation &&
               formData.estimatedDistance > 0;
      case 2:
        return formData.name && formData.email && formData.phone && formData.idNumber;
      case 3:
        return formData.termsAccepted;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading car details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="booking-error">
        <h2>Car not found</h2>
        <button onClick={() => navigate('/cars')}>Browse Cars</button>
      </div>
    );
  }

  const breakdown = calculateBreakdown();
  const totalAmount = calculateTotal();

  return (
    <div className="booking-page">
      <div className="container">
        {/* Header */}
        <div className="booking-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
            Back to Car
          </button>
          <h1>Book {car.name}</h1>
          <p>Complete your booking in 3 simple steps</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          {steps.map((step, index) => (
            <div key={step.id} className="progress-step">
              <div className={`step-circle ${currentStep >= step.id ? 'active' : ''}`}>
                {currentStep > step.id ? <FaCheck /> : step.icon}
              </div>
              <span className="step-title">{step.title}</span>
              {index < steps.length - 1 && (
                <div className={`step-line ${currentStep > step.id ? 'active' : ''}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="main-layout">
          {/* Main Content */}
          <div className="main-content">
            {/* Step Content */}
            <div className="step-content">
              {/* Step 1: Trip Details */}
              {currentStep === 1 && (
                <div className="step-card">
                  <h2><FaCalendarAlt /> Trip Details</h2>
                  
                  {/* Trip Type Selection */}
                  <div className="pricing-model-selector">
                    <h3>Select Trip Type</h3>
                    <div className="model-options">
                      <div 
                        className={`model-option ${formData.tripType === 'round' ? 'selected' : ''}`}
                        onClick={() => setFormData({...formData, tripType: 'round'})}
                      >
                        <FaExchangeAlt />
                        <div className="model-info">
                          <h4>Round Trip</h4>
                          <p>Pickup & Drop at same location</p>
                          <span className="model-price">Per Day Basis</span>
                        </div>
                        <div className="model-details">
                          <ul>
                            <li>₹{car.perDayModel.pricePerDay}/day</li>
                            <li>{car.perDayModel.maxKmsPerDay} KMs/day included</li>
                            <li>Extra: ₹{car.perDayModel.extraKmRate}/km</li>
                            <li>Same location required</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div 
                        className={`model-option ${formData.tripType === 'oneway' ? 'selected' : ''}`}
                        onClick={() => setFormData({...formData, tripType: 'oneway'})}
                      >
                        <FaRoad />
                        <div className="model-info">
                          <h4>One Way Trip</h4>
                          <p>Pickup & Drop at different locations</p>
                          <span className="model-price">Per KM Basis</span>
                        </div>
                        <div className="model-details">
                          <ul>
                            <li>₹{car.perKmModel.pricePerKm}/km</li>
                            <li>Minimum {car.perKmModel.minKms || 50} KMs</li>
                            <li>Toll tax included</li>
                            <li>Different locations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="model-summary">
                      <h4>Selected: {formData.tripType === 'round' ? 'Per Day Model' : 'Per KM Model'}</h4>
                      <p>
                        {formData.tripType === 'round' 
                          ? `You'll be charged per day with ${car.perDayModel.maxKmsPerDay} KMs included per day. Extra KMs charged at ₹${car.perDayModel.extraKmRate}/km`
                          : `You'll be charged per kilometer. Minimum ${car.perKmModel.minKms || 50} KMs charged at ₹${car.perKmModel.pricePerKm}/km`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Location Inputs */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label><FaMapMarkerAlt /> Pickup Location *</label>
                      <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        placeholder="Enter pickup address"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label><FaMapMarkerAlt /> Drop Location *</label>
                      <input
                        type="text"
                        name="dropLocation"
                        value={formData.dropLocation}
                        onChange={handleInputChange}
                        placeholder="Enter drop address"
                        required
                      />
                    </div>
                  </div>

                  {/* Show warning if locations don't match for round trip */}
                  {formData.tripType === 'round' && 
                   formData.pickupLocation && 
                   formData.dropLocation &&
                   formData.pickupLocation.toLowerCase() !== formData.dropLocation.toLowerCase() && (
                    <div className="location-warning">
                      <p>⚠️ For round trip, pickup and drop locations should be same. If different, please select One Way Trip.</p>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Pickup Date *</label>
                      <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Return Date *</label>
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleInputChange}
                        required
                        min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  {/* Show number of days */}
                  {formData.pickupDate && formData.returnDate && (
                    <div className="days-info">
                      <p><strong>Total Days:</strong> {calculateDays()} days</p>
                      {formData.tripType === 'round' && (
                        <p><strong>Included KMs:</strong> {car.perDayModel.maxKmsPerDay * calculateDays()} KMs (₹{car.perDayModel.pricePerDay}/day)</p>
                      )}
                    </div>
                  )}

                  {/* Times */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Pickup Time</label>
                      <select 
                        name="pickupTime" 
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                      >
                        {['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'].map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Return Time</label>
                      <select 
                        name="returnTime" 
                        value={formData.returnTime}
                        onChange={handleInputChange}
                      >
                        {['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Simple Distance Input */}
                  <div className="distance-section">
                    <div className="form-group">
                      <label><FaRoad /> Total Distance (KMs) *</label>
                      <input
                        type="number"
                        name="estimatedDistance"
                        value={formData.estimatedDistance}
                        onChange={handleInputChange}
                        placeholder="Enter total kilometers"
                        required
                        min="0"
                      />
                      <small className="input-help">
                        {formData.tripType === 'round' 
                          ? `Included: ${car.perDayModel.maxKmsPerDay} KMs/day (Total: ${car.perDayModel.maxKmsPerDay * calculateDays()} KMs). Extra: ₹${car.perDayModel.extraKmRate}/km`
                          : `Rate: ₹${car.perKmModel.pricePerKm}/km + taxes (Min ${car.perKmModel.minKms || 50} KMs)`
                        }
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Customer Details */}
              {currentStep === 2 && (
                <div className="step-card">
                  <h2><FaUser /> Your Information</h2>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address"
                      rows="3"
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>ID Proof Type *</label>
                      <select 
                        name="idProof" 
                        value={formData.idProof}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select ID Proof</option>
                        <option value="aadhar">Aadhar Card</option>
                        <option value="pan">PAN Card</option>
                        <option value="passport">Passport</option>
                        <option value="dl">Driving License</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>ID Number *</label>
                      <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        placeholder="Enter ID number"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Extras & Payment with Detailed Bill */}
              {currentStep === 3 && (
                <div className="step-card">
                  <h2><FaCreditCard /> Final Booking Summary</h2>
                  
                  {/* Pricing Model Info */}
                  <div className="model-info-card">
                    <h3>{pricingModel === 'perDay' ? 'Per Day Package' : 'Per KM Package'}</h3>
                    <p>
                      {pricingModel === 'perDay' 
                        ? `₹${car.perDayModel.pricePerDay}/day (Includes ${car.perDayModel.maxKmsPerDay} KMs/day)`
                        : `₹${car.perKmModel.pricePerKm}/km (Minimum ${car.perKmModel.minKms || 50} KMs)`
                      }
                    </p>
                  </div>

                  {/* Detailed Bill */}
                  <div className="detailed-bill-summary">
                    <h3>Detailed Bill Breakdown</h3>
                    
                    {breakdown && (
                      <div className="bill-details">
                        {/* Per Day Model Bill */}
                        {breakdown.model === 'perDay' && (
                          <>
                            <div className="bill-section">
                              <h4>Per Day Charges ({breakdown.days} days)</h4>
                              <div className="bill-row">
                                <span>Car Rental (₹{car.perDayModel.pricePerDay}/day)</span>
                                <span>₹{breakdown.dailyCharges.carRent}</span>
                              </div>
                              <div className="bill-row">
                                <span>Toll Tax (₹{car.perDayModel.tollTaxPerDay}/day)</span>
                                <span>₹{breakdown.dailyCharges.tollTax}</span>
                              </div>
                              <div className="bill-row">
                                <span>State Tax (₹{car.perDayModel.stateTaxPerDay}/day)</span>
                                <span>₹{breakdown.dailyCharges.stateTax}</span>
                              </div>
                            </div>

                            <div className="bill-section">
                              <h4>Distance Charges ({breakdown.distance} KMs)</h4>
                              <div className="bill-row">
                                <span>Included KMs ({Math.min(breakdown.distance, breakdown.maxAllowedKms)} KMs)</span>
                                <span>Included</span>
                              </div>
                              {breakdown.extraKms > 0 && (
                                <div className="bill-row">
                                  <span>Extra KMs Beyond Limit ({breakdown.extraKms} KMs × ₹{car.perDayModel.extraKmRate})</span>
                                  <span>₹{breakdown.kmCharges.extraKmCharge}</span>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {/* Per KM Model Bill */}
                        {breakdown.model === 'perKm' && (
                          <div className="bill-section">
                            <h4>Per KM Charges ({breakdown.actualKms} KMs)</h4>
                            <div className="bill-row">
                              <span>Car Charges ({breakdown.actualKms} × ₹{car.perKmModel.pricePerKm}/km)</span>
                              <span>₹{breakdown.charges.carPerKm}</span>
                            </div>
                            <div className="bill-row">
                              <span>Toll Tax ({breakdown.actualKms} × ₹{car.perKmModel.tollTaxPerKm}/km)</span>
                              <span>₹{breakdown.charges.tollTaxPerKm}</span>
                            </div>
                            <div className="bill-row">
                              <span>State Tax ({breakdown.actualKms} × ₹{car.perKmModel.stateTaxPerKm}/km)</span>
                              <span>₹{breakdown.charges.stateTaxPerKm}</span>
                            </div>
                          </div>
                        )}

                        {/* Extras */}
                        <div className="bill-section">
                          <h4>Additional Services</h4>
                          {formData.insurance && (
                            <div className="bill-row">
                              <span>Full Insurance</span>
                              <span>₹500</span>
                            </div>
                          )}
                          {formData.childSeat && (
                            <div className="bill-row">
                              <span>Child Seat</span>
                              <span>₹300</span>
                            </div>
                          )}
                          {formData.gps && (
                            <div className="bill-row">
                              <span>GPS Navigation</span>
                              <span>₹200</span>
                            </div>
                          )}
                          {formData.waterBottles > 0 && (
                            <div className="bill-row">
                              <span>Water Bottles ({formData.waterBottles})</span>
                              <span>₹{formData.waterBottles * 50}</span>
                            </div>
                          )}
                        </div>

                        {/* Total */}
                        <div className="bill-total">
                          <div className="bill-row final-total">
                            <span><strong>Total Amount</strong></span>
                            <span><strong>₹{totalAmount}</strong></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Payment Method */}
                  <div className="payment-section">
                    <h3>Payment Method</h3>
                    <div className="payment-options">
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                        />
                        <span>Cash on Delivery</span>
                      </label>
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={formData.paymentMethod === 'online'}
                          onChange={handleInputChange}
                        />
                        <span>Online Payment</span>
                      </label>
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={handleInputChange}
                        />
                        <span>UPI</span>
                      </label>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="terms-section">
                    <label className="terms-checkbox">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        required
                      />
                      <span>
                        I agree to the <a href="/terms">Terms & Conditions</a>. I understand that:
                        <ul>
                          <li>Final bill based on actual distance</li>
                          <li>Cancellation charges apply</li>
                          <li>Valid driving license required</li>
                          <li>Fuel charges extra as per usage</li>
                        </ul>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="step-navigation">
                {currentStep > 1 && (
                  <button className="btn-prev" onClick={prevStep}>
                    Previous
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button 
                    className="btn-next" 
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                  >
                    Next Step
                  </button>
                ) : (
                  <button 
                    className="btn-submit" 
                    onClick={submitBooking}
                    disabled={!validateStep(3)}
                  >
                    Confirm Booking - ₹{totalAmount}
                  </button>
                )}
              </div>

              <div className="step-indicator">
                Step {currentStep} of 3
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="booking-sidebar">
            <div className="sidebar-card">
              <h3>Booking Summary</h3>
              
              <div className="car-summary">
              <img src={car.image} alt={car.name}  />

                <div>
                  <h4>{car.name}</h4>
                  <p>{car.seats} seats • {car.transmission} • {car.fuel}</p>
                </div>
              </div>
              
              <div className="trip-details">
                <div className="detail-item">
                  <FaCalendarAlt />
                  <div>
                    <span>Trip Type</span>
                    <strong>{formData.tripType === 'round' ? 'Round Trip' : 'One Way'}</strong>
                  </div>
                </div>
                
                <div className="detail-item">
                  <FaMapMarkerAlt />
                  <div>
                    <span>Pickup</span>
                    <strong>{formData.pickupLocation || 'Not selected'}</strong>
                  </div>
                </div>
                
                <div className="detail-item">
                  <FaMapMarkerAlt />
                  <div>
                    <span>Drop</span>
                    <strong>{formData.dropLocation || 'Not selected'}</strong>
                  </div>
                </div>
                
                {formData.pickupDate && formData.returnDate && (
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <div>
                      <span>Duration</span>
                      <strong>{calculateDays()} days</strong>
                    </div>
                  </div>
                )}
                
                <div className="detail-item">
                  <FaRoad />
                  <div>
                    <span>Distance</span>
                    <strong>{formData.estimatedDistance || 0} KMs</strong>
                  </div>
                </div>
              </div>
              
              <div className="price-summary-sidebar">
                <div className="price-row">
                  <span>Car Rental</span>
                  <span className="price">
                    {pricingModel === 'perDay' 
                      ? `₹${car.perDayModel.pricePerDay} × ${calculateDays()} days`
                      : `₹${car.perKmModel.pricePerKm} × ${Math.max(parseInt(formData.estimatedDistance) || 0, car.perKmModel.minKms || 50)} KMs`
                    }
                  </span>
                </div>
                
                {formData.insurance && (
                  <div className="price-row">
                    <span>Insurance</span>
                    <span className="price">₹500</span>
                  </div>
                )}
                
               
                
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span className="price">₹{totalAmount}</span>
                </div>
                
                <p className="price-note">
                  * Includes all taxes and toll charges<br />
                  * Fuel charges extra as per usage
                </p>
              </div>
              
              <div className="help-section">
                <h4>Need Help?</h4>
                <p>Call: +91 98765 43210</p>
                <p>Email: support@cartour.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;