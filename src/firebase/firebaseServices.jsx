// All Firebase database operations
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// ==================== BOOKING OPERATIONS ====================

// Save new booking
export const saveBooking = async (bookingData) => {
  try {
    // Add timestamp and status
    const bookingWithMeta = {
      ...bookingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "confirmed",
      paymentStatus: "pending",
      read: false
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, "bookings"), bookingWithMeta);
    
    console.log("✅ Booking saved with ID:", docRef.id);
    
    return {
      success: true,
      docId: docRef.id,
      message: "Booking saved successfully"
    };
    
  } catch (error) {
    console.error("❌ Error saving booking:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to save booking"
    };
  }
};

// Get all bookings
export const getAllBookings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const bookings = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      data: bookings,
      count: bookings.length
    };
  } catch (error) {
    console.error("Error getting bookings:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const q = query(
      collection(db, "bookings"),
      where("bookingId", "==", bookingId)
    );
    
    const querySnapshot = await getDocs(q);
    const bookings = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      data: bookings[0] || null
    };
  } catch (error) {
    console.error("Error getting booking:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update booking status
export const updateBookingStatus = async (docId, updates) => {
  try {
    const bookingRef = doc(db, "bookings", docId);
    
    await updateDoc(bookingRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      message: "Booking updated successfully"
    };
  } catch (error) {
    console.error("Error updating booking:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete booking
export const deleteBooking = async (docId) => {
  try {
    await deleteDoc(doc(db, "bookings", docId));
    
    return {
      success: true,
      message: "Booking deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get today's bookings
export const getTodayBookings = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, "bookings"),
      where("pickupDate", "==", today),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const bookings = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      data: bookings,
      count: bookings.length
    };
  } catch (error) {
    console.error("Error getting today's bookings:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ==================== CUSTOMER OPERATIONS ====================

// Save customer data
export const saveCustomer = async (customerData) => {
  try {
    const customerWithMeta = {
      ...customerData,
      createdAt: serverTimestamp(),
      totalBookings: 1,
      lastBooking: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "customers"), customerWithMeta);
    
    return {
      success: true,
      docId: docRef.id
    };
  } catch (error) {
    console.error("Error saving customer:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ==================== STATISTICS ====================

// Get booking statistics
export const getBookingStats = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    
    let totalAmount = 0;
    let confirmed = 0;
    let pending = 0;
    let cancelled = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalAmount += parseFloat(data.totalAmount || 0);
      
      if (data.status === "confirmed") confirmed++;
      else if (data.status === "pending") pending++;
      else if (data.status === "cancelled") cancelled++;
    });
    
    return {
      success: true,
      data: {
        totalBookings: querySnapshot.size,
        totalRevenue: totalAmount,
        confirmed,
        pending,
        cancelled
      }
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ==================== BACKUP OPERATIONS ====================

// Backup all bookings to JSON
export const backupBookings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const backupData = [];
    
    querySnapshot.forEach((doc) => {
      backupData.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Create downloadable JSON
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    return {
      success: true,
      data: backupData,
      downloadUrl: dataUri,
      count: backupData.length
    };
  } catch (error) {
    console.error("Error backing up:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export all functions
export default {
  saveBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getTodayBookings,
  saveCustomer,
  getBookingStats,
  backupBookings
};