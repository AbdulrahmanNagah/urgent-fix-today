import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookingRequest, Feedback, ServiceType, Technician, BookingStatus } from '@/types';

interface BookingContextType {
  selectedService: ServiceType | null;
  setSelectedService: (service: ServiceType | null) => void;
  selectedTechnician: Technician | null;
  setSelectedTechnician: (technician: Technician | null) => void;
  currentBooking: BookingRequest | null;
  setCurrentBooking: (booking: BookingRequest | null) => void;
  bookings: BookingRequest[];
  addBooking: (booking: BookingRequest) => void;
  feedbacks: Feedback[];
  addFeedback: (feedback: Feedback) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [currentBooking, setCurrentBooking] = useState<BookingRequest | null>(null);
  
  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('sanay3i_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse bookings from localStorage', e);
      return [];
    }
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    try {
      const saved = localStorage.getItem('sanay3i_feedbacks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse feedbacks from localStorage', e);
      return [];
    }
  });

  const addBooking = (booking: BookingRequest) => {
    setBookings((prev) => {
      const updated = [...prev, booking];
      localStorage.setItem('sanay3i_bookings', JSON.stringify(updated));
      return updated;
    });
    setCurrentBooking(booking);
  };

  const addFeedback = (feedback: Feedback) => {
    setFeedbacks((prev) => {
      const updated = [...prev, feedback];
      localStorage.setItem('sanay3i_feedbacks', JSON.stringify(updated));
      return updated;
    });
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === bookingId ? { ...b, status } : b));
      localStorage.setItem('sanay3i_bookings', JSON.stringify(updated));
      // Update current booking too if it's the one modified
      if (currentBooking && currentBooking.id === bookingId) {
        setCurrentBooking({ ...currentBooking, status });
      }
      return updated;
    });
  };

  return (
    <BookingContext.Provider
      value={{
        selectedService,
        setSelectedService,
        selectedTechnician,
        setSelectedTechnician,
        currentBooking,
        setCurrentBooking,
        bookings,
        addBooking,
        feedbacks,
        addFeedback,
        updateBookingStatus,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
