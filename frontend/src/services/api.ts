/**
 * API Service
 * Central place for handling API requests to the backend
 */

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Create a booking
 * @param bookingData The booking data to send to the backend
 * @returns Promise with the response data
 */
export const createBooking = async (bookingData: {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  company: string;
  service: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create booking');
    }

    return await response.json();
  } catch (error) {
    console.error('API error creating booking:', error);
    throw error;
  }
};

// Add other API functions as needed