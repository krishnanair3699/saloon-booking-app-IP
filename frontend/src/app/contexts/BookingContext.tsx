import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  icon: string;
}

export interface BookingData {
  city?: string;
  bodyArea?: string;
  service?: Service;
  services?: any[];
  date?: string;
  time?: string;
  name?: string;
  email?: string;
  phone?: string;
  couponApplied?: boolean;
}

interface BookingContextType {
  bookingData: BookingData;
  updateBooking: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
  usedCoupons: Set<string>;
  applyCoupon: (phone: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [usedCoupons, setUsedCoupons] = useState<Set<string>>(new Set());

  const updateBooking = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingData({});
  };

  const applyCoupon = (phone: string): boolean => {
    if (usedCoupons.has(phone)) {
      return false;
    }
    setUsedCoupons((prev) => new Set(prev).add(phone));
    return true;
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking, resetBooking, usedCoupons, applyCoupon }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};