import { useState } from 'react';

interface UseSelectionsReturn {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedSite: string;
  setSelectedSite: (site: string) => void;
}

export function useSelections(): UseSelectionsReturn {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSite, setSelectedSite] = useState<string>('RO');

  return {
    selectedDate,
    setSelectedDate,
    selectedSite,
    setSelectedSite
  };
}