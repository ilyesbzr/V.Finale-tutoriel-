import { useState } from 'react';

export function useSelections() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSite, setSelectedSite] = useState('RO');

  return {
    selectedDate,
    setSelectedDate,
    selectedSite,
    setSelectedSite
  };
}