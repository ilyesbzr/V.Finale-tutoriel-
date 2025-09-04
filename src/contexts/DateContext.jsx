import React, { createContext, useContext, useState } from 'react';
import { subDays } from 'date-fns';

const DateContext = createContext();

export function DateProvider({ children }) {
  // Get today's date
  const today = new Date();
  const [displayDate, setDisplayDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(() => subDays(today, 1));

  const updateDate = (newDate) => {
    setDisplayDate(newDate);
    setSelectedDate(subDays(newDate, 1));
  };

  return (
    <DateContext.Provider value={{ selectedDate, displayDate, updateDate }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDateContext() {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDateContext must be used within a DateProvider');
  }
  return context;
}