import React, { createContext, useContext, useState } from 'react';
import { createBooking } from '../services/api';

interface BookingContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleBookingSubmit: (formData: BookingFormData) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  services: string[];
  setIsOpen: (open: boolean) => void;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  company: string;
}

const services = [
  'Digital Marketing',
  'Photography',
  'Videography',
  'Brand Development',
  'Social Media Management',
  'Content Creation'
];

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService('');
  };

  const handleBookingSubmit = async (formData: BookingFormData) => {
    try {
      console.log('Booking submitted:', formData);
      // Send the booking data to the backend API
      await createBooking(formData);
      alert('Booking submitted successfully!');
      closeModal();
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking. Please try again.');
    }
  };

  return (
    <BookingContext.Provider 
      value={{ 
        isModalOpen, 
        openModal, 
        closeModal,
        handleBookingSubmit,
        selectedService,
        setSelectedService,
        services,
        setIsOpen: setIsModalOpen
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
