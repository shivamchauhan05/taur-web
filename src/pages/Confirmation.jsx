import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaCar, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaPrint, 
  FaFileExcel,
  FaEnvelope,
  FaDownload,
  FaUser,
  FaPhone,
  FaRupeeSign,
  FaDatabase,
  FaCloudUploadAlt,
  FaWhatsapp
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './Confirmation.css';

// Firebase Import
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs 
} from "firebase/firestore";

// ✅ PROPER FIREBASE CONFIG - Replace with your values
const firebaseConfig = {
  apiKey: "AIzaSyAcznxGcfbMl_oNXVaq0JEEOSqXFrIFX-k",
  authDomain: "p-web-1b4cd.firebaseapp.com",
  projectId: "p-web-1b4cd",
  storageBucket: "p-web-1b4cd.firebasestorage.app",
  messagingSenderId: "828332648036",
  appId: "1:828332648036:web:5f6d6772f0e8166f65a171",
  measurementId: "G-7VMTVX27C9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Confirmation = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [notificationsSent, setNotificationsSent] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState({
    loading: false,
    success: false,
    error: null,
    docId: null
  });
  
  // ✅ FIX 1: Use useRef to prevent double saving
  const hasSavedRef = useRef(false);

  // ✅ Check if booking already exists in Firebase
  const checkBookingExists = async (bookingId) => {
    try {
      const q = query(
        collection(db, "bookings"), 
        where("bookingId", "==", bookingId)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking booking:", error);
      return false;
    }
  };

  // ✅ FIXED: Save booking to Firebase (NO DOUBLE SAVING)
  const saveToFirebase = async (data) => {
    try {
      setFirebaseStatus({ loading: true, success: false, error: null, docId: null });
      
      // First check if already saved
      const alreadyExists = await checkBookingExists(data.bookingId);
      if (alreadyExists) {
        console.log("⚠️ Booking already exists in Firebase, skipping...");
        setFirebaseStatus({
          loading: false,
          success: true,
          error: null,
          docId: "AlreadyExists"
        });
        return "AlreadyExists";
      }
      
      // Add booking to Firestore with proper structure
      const docRef = await addDoc(collection(db, "bookings"), {
        // Booking Info
        bookingId: data.bookingId,
        bookingDate: new Date().toISOString(),
        
        // Customer Info
        customerName: data.name,
        customerPhone: data.phone,
        customerEmail: data.email || "",
        
        // Car Info
        carName: data.car.name,
        carSeats: data.car.seats,
        carTransmission: data.car.transmission,
        carFuel: data.car.fuel,
        
        // Trip Info
        pickupDate: data.pickupDate,
        returnDate: data.returnDate || "",
        pickupLocation: data.pickupLocation,
        dropLocation: data.dropLocation || "",
        estimatedDistance: data.estimatedDistance || 0,
        
        // Payment Info
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        driverRequired: data.driverRequired || false,
        
        // System Fields
        status: "confirmed",
        paymentStatus: "completed",
        read: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        
        // Metadata
        source: "website",
        ipAddress: await getIPAddress(),
        userAgent: navigator.userAgent
      });
      
      console.log("✅ Booking saved to Firebase with ID:", docRef.id);
      
      setFirebaseStatus({
        loading: false,
        success: true,
        error: null,
        docId: docRef.id
      });
      
      localStorage.setItem('firebaseDocId', docRef.id);
      localStorage.setItem('lastSaved', new Date().toISOString());
      
      return docRef.id;
      
    } catch (error) {
      console.error("❌ Error saving to Firebase:", error);
      setFirebaseStatus({
        loading: false,
        success: false,
        error: error.message,
        docId: null
      });
      return null;
    }
  };

  // Get IP Address
  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  };

  // ✅ FIXED: Download Excel
  const downloadExcel = () => {
    if (!bookingData) return;
    
    const firebaseId = firebaseStatus.docId || "Not saved to cloud";
    
    const worksheetData = [
      ["🚗 CarTour - Booking Receipt", "", "", "", ""],
      ["==========================================", "", "", "", ""],
      ["", "", "", "", ""],
      ["📋 Booking Details", "", "", "", ""],
      ["Booking ID", bookingData.bookingId, "", "", ""],
      ["Database ID", firebaseId, "", "", ""],
      ["Booking Date", new Date().toLocaleDateString(), "", "", ""],
      ["", "", "", "", ""],
      ["👤 Customer Details", "", "", "", ""],
      ["Name", bookingData.name, "", "", ""],
      ["Phone", bookingData.phone, "", "", ""],
      ["Email", bookingData.email || "N/A", "", "", ""],
      ["", "", "", "", ""],
      ["🚗 Car Details", "", "", "", ""],
      ["Car Name", bookingData.car.name, "", "", ""],
      ["Seats", bookingData.car.seats, "", "", ""],
      ["Transmission", bookingData.car.transmission, "", "", ""],
      ["Fuel", bookingData.car.fuel, "", "", ""],
      ["", "", "", "", ""],
      ["📍 Trip Details", "", "", "", ""],
      ["Pickup Date", bookingData.pickupDate, "", "", ""],
      ["Return Date", bookingData.returnDate || "N/A", "", "", ""],
      ["Pickup Location", bookingData.pickupLocation, "", "", ""],
      ["Drop Location", bookingData.dropLocation || "Same as pickup", "", "", ""],
      ["Distance", `${bookingData.estimatedDistance || 0} KMs`, "", "", ""],
      ["", "", "", "", ""],
      ["💰 Payment Details", "", "", "", ""],
      ["Total Amount", `₹${bookingData.totalAmount}`, "", "", ""],
      ["Payment Method", bookingData.paymentMethod, "", "", ""],
      ["Driver", bookingData.driverRequired ? "Included" : "Self Drive", "", "", ""],
      ["Security Deposit", "₹5,000 (Refundable)", "", "", ""],
      ["", "", "", "", ""],
      ["📞 Contact Information", "", "", "", ""],
      ["CarTour Support", "+91 98765 43210", "", "", ""],
      ["Email", "support@cartour.com", "", "", ""],
      ["Website", "www.cartour.com", "", "", ""],
      ["Emergency", "+91 91234 56789", "", "", ""]
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 25 }, // First column width
      { wch: 30 }, // Second column width
      { wch: 10 },
      { wch: 10 },
      { wch: 10 }
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Booking Receipt");
    XLSX.writeFile(wb, `CarTour_Booking_${bookingData.bookingId}.xlsx`);
  };

  // ✅ FIXED: Print Receipt - Professional Format
  const printReceipt = () => {
    if (!bookingData) return;
    
    const printWindow = window.open('', '_blank');
    
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CarTour Booking Receipt - ${bookingData.bookingId}</title>
        <style>
          @media print {
            @page {
              size: A5;
              margin: 0.5cm;
            }
            body {
              margin: 0;
              padding: 15px;
              font-family: 'Courier New', monospace;
              background: white !important;
              color: black !important;
            }
          }
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
          }
          
          .receipt-container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .logo {
            color: #4CAF50;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .title {
            font-size: 24px;
            margin-bottom: 5px;
            color: #333;
          }
          
          .subtitle {
            color: #666;
            font-size: 14px;
          }
          
          .booking-id {
            background: #f0f8ff;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            margin: 15px 0;
            border-left: 4px solid #4CAF50;
          }
          
          .section {
            margin: 25px 0;
          }
          
          .section-title {
            color: #4CAF50;
            font-size: 18px;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          
          .info-item {
            margin: 8px 0;
          }
          
          .info-label {
            font-weight: 600;
            color: #555;
            display: inline-block;
            min-width: 140px;
          }
          
          .info-value {
            color: #333;
          }
          
          .amount-section {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
          }
          
          .total-amount {
            font-size: 28px;
            color: #4CAF50;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px dashed #ccc;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          
          .terms {
            font-size: 12px;
            color: #888;
            margin-top: 20px;
            line-height: 1.5;
          }
          
          .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            color: rgba(0,0,0,0.1);
            font-size: 48px;
            transform: rotate(-45deg);
            pointer-events: none;
          }
          
          .print-btn {
            display: none;
          }
          
          @media screen {
            .print-btn {
              display: block;
              background: #4CAF50;
              color: white;
              border: none;
              padding: 12px 30px;
              border-radius: 5px;
              font-size: 16px;
              cursor: pointer;
              margin: 20px auto;
              display: block;
            }
            
            .print-btn:hover {
              background: #45a049;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="logo">🚗 CarTour</div>
            <h1 class="title">BOOKING CONFIRMATION</h1>
            <p class="subtitle">Rental Service Receipt</p>
            
            <div class="booking-id">
              <strong>Booking ID:</strong> ${bookingData.bookingId}<br>
              <small>Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</small>
            </div>
          </div>
          
          <div class="section">
            <h3 class="section-title">Customer Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Full Name:</span>
                <span class="info-value">${bookingData.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Phone:</span>
                <span class="info-value">${bookingData.phone}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${bookingData.email || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3 class="section-title">Vehicle Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Car Model:</span>
                <span class="info-value">${bookingData.car.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Seating Capacity:</span>
                <span class="info-value">${bookingData.car.seats} seats</span>
              </div>
              <div class="info-item">
                <span class="info-label">Transmission:</span>
                <span class="info-value">${bookingData.car.transmission}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Fuel Type:</span>
                <span class="info-value">${bookingData.car.fuel}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3 class="section-title">Trip Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Pickup Date:</span>
                <span class="info-value">${bookingData.pickupDate}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Return Date:</span>
                <span class="info-value">${bookingData.returnDate || 'Not specified'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Pickup Location:</span>
                <span class="info-value">${bookingData.pickupLocation}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Drop Location:</span>
                <span class="info-value">${bookingData.dropLocation || 'Same as pickup'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Estimated Distance:</span>
                <span class="info-value">${bookingData.estimatedDistance || 0} KMs</span>
              </div>
              <div class="info-item">
                <span class="info-label">Driver:</span>
                <span class="info-value">${bookingData.driverRequired ? 'Included ✓' : 'Self Drive'}</span>
              </div>
            </div>
          </div>
          
          <div class="amount-section">
            <h3 class="section-title">Payment Summary</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Total Amount:</span>
                <div class="total-amount">₹${bookingData.totalAmount}</div>
              </div>
              <div class="info-item">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">${bookingData.paymentMethod}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Security Deposit:</span>
                <span class="info-value">₹5,000 (Refundable)</span>
              </div>
              <div class="info-item">
                <span class="info-label">Payment Status:</span>
                <span class="info-value" style="color: #4CAF50; font-weight: bold;">PAID ✓</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3 class="section-title">Important Notes</h3>
            <div class="terms">
              1. Please carry original ID proof and driving license at the time of pickup.<br>
              2. Security deposit of ₹5,000 will be refunded after vehicle return and inspection.<br>
              3. Free cancellation up to 24 hours before pickup time.<br>
              4. Additional charges apply for extra kilometers and late returns.<br>
              5. Please check the vehicle thoroughly before taking possession.<br>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>CarTour Customer Support</strong></p>
            <p>📞 +91 98765 43210 | 📧 support@cartour.com</p>
            <p>🌐 www.cartour.com | 🕒 24/7 Support Available</p>
            <p class="terms">
              This is a computer-generated receipt. No signature required.<br>
              Receipt ID: ${bookingData.bookingId} | Generated on: ${new Date().toLocaleString()}
            </p>
          </div>
          
          <div class="watermark">CarTour</div>
        </div>
        
        <button class="print-btn" onclick="window.print()">🖨️ Print Receipt</button>
        
        <script>
          // Auto print after 1 second
          setTimeout(() => {
            window.print();
          }, 1000);
          
          // Close window after print
          window.onafterprint = function() {
            setTimeout(() => {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  // Send Email
  const sendToCustomerEmail = () => {
    if (!bookingData) return;
    
    if (!bookingData.email) {
      alert('Please enter your email address');
      return;
    }
    
    const firebaseInfo = firebaseStatus.success 
      ? `Database Reference: ${firebaseStatus.docId}\n(Keep this for support queries)`
      : 'Note: Booking saved locally. Cloud sync pending.';
    
    const subject = `CarTour Booking Confirmation - ${bookingData.bookingId}`;
    const body = `
Dear ${bookingData.name},

🎉 Thank you for choosing CarTour! Your booking is confirmed.

📋 BOOKING SUMMARY
-----------------
Booking ID: ${bookingData.bookingId}
${firebaseInfo}
Booking Date: ${new Date().toLocaleDateString()}

🚗 CAR DETAILS
--------------
Car: ${bookingData.car.name}
Seats: ${bookingData.car.seats}
Transmission: ${bookingData.car.transmission}
Fuel Type: ${bookingData.car.fuel}

📍 TRIP DETAILS
---------------
Pickup Date: ${bookingData.pickupDate}
Pickup Location: ${bookingData.pickupLocation}
${bookingData.returnDate ? `Return Date: ${bookingData.returnDate}` : ''}
Distance: ${bookingData.estimatedDistance || 0} KMs

💰 PAYMENT DETAILS
-----------------
Total Amount: ₹${bookingData.totalAmount}
Payment Method: ${bookingData.paymentMethod}
Driver: ${bookingData.driverRequired ? 'Included' : 'Self Drive'}

📞 IMPORTANT INFORMATION
-----------------------
1. Carry original ID proof & driving license
2. Security deposit: ₹5,000 (refundable after inspection)
3. Free cancellation 24 hours before pickup
4. Contact support: +91 98765 43210

We look forward to serving you!

Best regards,
CarTour Team
📱 +91 98765 43210 | ✉️ support@cartour.com
    `;
    
    const mailto = `mailto:${bookingData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto);
  };

  // WhatsApp Share
  const shareOnWhatsApp = () => {
    if (!bookingData) return;
    
    const message = `🚗 My CarTour Booking Confirmed!\n\nBooking ID: ${bookingData.bookingId}\nCar: ${bookingData.car.name}\nPickup: ${bookingData.pickupDate}\nAmount: ₹${bookingData.totalAmount}\n\nThank you CarTour!`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (!data) {
      navigate('/');
      return;
    }
    
    const parsedData = JSON.parse(data);
    setBookingData(parsedData);
    
    // ✅ FIX: Prevent double execution
    if (hasSavedRef.current) return;
    
    // ✅ Check if we already saved this booking
    const lastSavedBookingId = localStorage.getItem('lastSavedBookingId');
    if (lastSavedBookingId === parsedData.bookingId) {
      console.log("📝 Booking already saved previously, skipping...");
      setFirebaseStatus({
        loading: false,
        success: true,
        error: null,
        docId: localStorage.getItem('firebaseDocId') || 'AlreadySaved'
      });
      return;
    }
    
    // Mark as saving
    hasSavedRef.current = true;
    localStorage.setItem('lastSavedBookingId', parsedData.bookingId);
    
    // Send notifications (only once)
    
    
    // Save to Firebase (only once)
    saveToFirebase(parsedData);
    
    // Backup to localStorage
    const allBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
    const existingIndex = allBookings.findIndex(b => b.bookingId === parsedData.bookingId);
    
    if (existingIndex === -1) {
      allBookings.push({
        ...parsedData,
        savedAt: new Date().toISOString(),
        firebaseSaved: false
      });
      localStorage.setItem('allBookings', JSON.stringify(allBookings));
    }
    
  }, [navigate, notificationsSent]);

  if (!bookingData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="container">
        {/* Success Message */}
        <div className="success-card">
          <FaCheckCircle className="success-icon" />
          <h1>Booking Confirmed!</h1>
          <p className="success-subtitle">Your booking has been successfully confirmed</p>
          <div className="booking-id">
            Booking ID: <strong>{bookingData.bookingId}</strong>
          </div>
          
          {/* Firebase Status */}
          <div className="firebase-status">
            {firebaseStatus.loading ? (
              <div className="status-loading">
                <div className="small-spinner"></div>
                <span>Saving to database...</span>
              </div>
            ) : firebaseStatus.success ? (
              <div className="status-success">
                <FaCloudUploadAlt /> 
                <span>✅ Saved to Cloud Database</span>
                <small>Reference ID: {firebaseStatus.docId}</small>
              </div>
            ) : firebaseStatus.error ? (
              <div className="status-error">
                <span>⚠️ Database sync failed (local copy saved)</span>
                <small>{firebaseStatus.error}</small>
              </div>
            ) : null}
          </div>
          
          <p className="success-note">
            ✅ Booking details have been sent to the owner. You'll receive a confirmation call shortly.
          </p>
        </div>

        {/* Booking Summary */}
        <div className="summary-card">
          <h2><FaCar /> Booking Summary</h2>
          
          <div className="summary-grid">
            <div className="summary-section">
              <h3>Customer Details</h3>
              <div className="detail-row">
                <FaUser />
                <span>Name</span>
                <strong>{bookingData.name}</strong>
              </div>
              <div className="detail-row">
                <FaPhone />
                <span>Phone</span>
                <strong>{bookingData.phone}</strong>
              </div>
              <div className="detail-row">
                <FaEnvelope />
                <span>Email</span>
                <strong>{bookingData.email || 'Not provided'}</strong>
              </div>
            </div>
            
            <div className="summary-section">
              <h3>Trip Details</h3>
              <div className="detail-row">
                <FaCalendarAlt />
                <span>Pickup Date</span>
                <strong>{bookingData.pickupDate}</strong>
              </div>
              <div className="detail-row">
                <FaMapMarkerAlt />
                <span>Pickup Location</span>
                <strong>{bookingData.pickupLocation}</strong>
              </div>
              <div className="detail-row">
                <FaMapMarkerAlt />
                <span>Distance</span>
                <strong>{bookingData.estimatedDistance || 0} KMs</strong>
              </div>
            </div>
            
            <div className="summary-section">
              <h3>Car & Payment</h3>
              <div className="detail-row">
                <FaCar />
                <span>Car</span>
                <strong>{bookingData.car.name}</strong>
              </div>
              <div className="detail-row">
                <FaRupeeSign />
                <span>Total Amount</span>
                <strong>₹{bookingData.totalAmount}</strong>
              </div>
              <div className="detail-row">
                <span>Payment Method</span>
                <strong>{bookingData.paymentMethod}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Actions for Customer */}
        <div className="actions-card">
          <h3>Your Receipt & Actions</h3>
          <div className="actions-grid">
            <button onClick={downloadExcel} className="action-btn excel">
              <FaFileExcel />
              <span>Download Excel</span>
              <small>.xlsx format</small>
            </button>
            
            <button onClick={printReceipt} className="action-btn print">
              <FaPrint />
              <span>Print Receipt</span>
              <small>Professional Format</small>
            </button>
            
            <button onClick={sendToCustomerEmail} className="action-btn email">
              <FaEnvelope />
              <span>Email Receipt</span>
              <small>Send to email</small>
            </button>
            
            <button onClick={shareOnWhatsApp} className="action-btn whatsapp">
              <FaWhatsapp />
              <span>Share on WhatsApp</span>
              <small>Share with friends</small>
            </button>
            
            <button className="action-btn database" disabled={!firebaseStatus.success}>
              <FaDatabase />
              <span>Cloud Backup</span>
              <small>{firebaseStatus.success ? 'Saved ✓' : 'Saving...'}</small>
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps-card">
          <h3>What's Next?</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Confirmation Call</h4>
                <p>Our team will call you within 30 minutes</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Driver Assignment</h4>
                <p>Driver details shared 2 hours before pickup</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Pickup Process</h4>
                <p>Car inspection & documentation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="support-card">
          <h3>Need Help?</h3>
          <div className="support-info">
            <div className="support-item">
              <FaPhone />
              <div>
                <h4>24/7 Support</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="support-item">
              <FaEnvelope />
              <div>
                <h4>Email Support</h4>
                <p>support@cartour.com</p>
              </div>
            </div>
            <div className="support-item">
              <FaDatabase />
              <div>
                <h4>Data Status</h4>
                <p>{firebaseStatus.success ? 'Cloud Saved ✓' : 'Saving...'}</p>
              </div>
            </div>
          </div>
          
          <div className="cta-buttons">
            <Link to="/cars" className="cta-btn secondary">
              Book Another Car
            </Link>
            <button 
              onClick={() => window.open(`tel:+919876543210`)}
              className="cta-btn primary"
            >
              Call Support Now
            </button>
          </div>
        </div>
        
        {/* Database Info */}
        <div className="database-info">
          <small>
            Booking ID: {bookingData.bookingId} | 
            Firebase ID: {firebaseStatus.docId || 'Pending'} | 
            Local Backup: ✓ | 
            Timestamp: {new Date().toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;