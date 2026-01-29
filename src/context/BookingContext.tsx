import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookingRequest, Feedback, ServiceType, Technician } from '@/types';

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
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [currentBooking, setCurrentBooking] = useState<BookingRequest | null>(null);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const addBooking = (booking: BookingRequest) => {
    setBookings((prev) => [...prev, booking]);
    setCurrentBooking(booking);
  };

  const addFeedback = (feedback: Feedback) => {
    setFeedbacks((prev) => [...prev, feedback]);
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
