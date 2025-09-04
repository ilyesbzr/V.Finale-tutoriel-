import React, { useState, useRef, useEffect } from 'react';
import { format, setMonth, getMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function MonthSelector({ selectedDate, onChange }) {
  const [showMonths, setShowMonths] = useState(false);
  const monthSelectorRef = useRef(null);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (monthSelectorRef.current && !monthSelectorRef.current.contains(event.target)) {
        setShowMonths(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMonthSelect = (monthIndex) => {
    const newDate = setMonth(selectedDate, monthIndex);
    onChange(newDate);
    setShowMonths(false);
  };

  return (
    <div className="relative" ref={monthSelectorRef}>
      <button
        onClick={() => setShowMonths(!showMonths)}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50"
      >
        <span className="text-lg font-medium text-gray-900">
          {format(selectedDate, 'MMMM', { locale: fr })}
        </span>
        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
      </button>

      {showMonths && (
        <div className="absolute top-12 left-0 z-10 bg-white rounded-lg shadow-lg border border-gray-200 w-48">
          <div className="grid grid-cols-1 gap-1 p-2">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(index)}
                className={`px-4 py-2 text-left rounded hover:bg-gray-100 ${
                  getMonth(selectedDate) === index 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}