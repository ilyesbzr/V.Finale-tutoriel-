import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface YearSelectorProps {
  selectedYear: number;
  onChange: (year: number) => void;
}

export default function YearSelector({ selectedYear, onChange }: YearSelectorProps): JSX.Element {
  const [showYears, setShowYears] = useState<boolean>(false);
  const yearSelectorRef = useRef<HTMLDivElement>(null);

  // Generate array of years from 2024 to current year + 2
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: (currentYear + 2) - 2024 + 1 }, 
    (_, i) => 2024 + i
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (yearSelectorRef.current && !yearSelectorRef.current.contains(event.target as Node)) {
        setShowYears(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleYearSelect = (year: number): void => {
    onChange(year);
    setShowYears(false);
  };

  return (
    <div className="relative" ref={yearSelectorRef}>
      <button
        onClick={() => setShowYears(!showYears)}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50"
      >
        <span className="text-lg font-medium text-gray-900">
          {selectedYear}
        </span>
        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
      </button>

      {showYears && (
        <div className="absolute top-12 left-0 z-10 bg-white rounded-lg shadow-lg border border-gray-200 w-48">
          <div className="grid grid-cols-1 gap-1 p-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`px-4 py-2 text-left rounded hover:bg-gray-100 ${
                  selectedYear === year 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}