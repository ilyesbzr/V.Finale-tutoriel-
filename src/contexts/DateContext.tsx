import React, { createContext, useContext, useState, ReactNode } from 'react';
import { subDays } from 'date-fns';

interface DateContextType {
  selectedDate: Date;
  displayDate: Date;
  updateDate: (newDate: Date) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

interface DateProviderProps {
  children: ReactNode;
}

export function DateProvider({ children }: DateProviderProps): JSX.Element {
  // Get today's date
  const today = new Date();
  const [displayDate, setDisplayDate] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(() => subDays(today, 1));

  const updateDate = (newDate: Date): void => {
    setDisplayDate(newDate);
    setSelectedDate(subDays(newDate, 1));
  };

  return (
    <DateContext.Provider value={{ selectedDate, displayDate, updateDate }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDateContext(): DateContextType {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDateContext must be used within a DateProvider');
  }
  return context;
}