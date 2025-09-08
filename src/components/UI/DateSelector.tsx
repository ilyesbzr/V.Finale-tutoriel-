import React, { useState, useRef, useEffect } from 'react';
import { format, subDays, getDay, isAfter, isSameDay, addDays, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from '@heroicons/react/24/outline';
import MonthProgress from './MonthProgress';
import Calendar from './Calendar';
import { useDateContext } from '../../contexts/DateContext';
import { isWeekend, isHoliday } from '../../utils/dateCalculations';
import { useTranslation } from 'react-i18next';

export default function DateSelector(): JSX.Element {
  const { displayDate, updateDate } = useDateContext();
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCalendarClick = (): void => {
    setShowCalendar(!showCalendar);
  };

  const handleCalendarDateSelect = (date: Date): void => {
    updateDate(date);
    setShowCalendar(false);
  };

  // Get the last working day before a date (skipping weekends and holidays)
  const getLastWorkingDayBefore = (date: Date): Date => {
    let currentDate = new Date(date);
    
    // Go back one day initially
    currentDate = subDays(currentDate, 1);
    
    // Keep going back until we find a working day
    while (isWeekend(currentDate) || isHoliday(currentDate)) {
      currentDate = subDays(currentDate, 1);
    }
    
    return currentDate;
  };

  // Calculate the analysis date based on the new logic
  const getAnalysisDate = (): Date => {
    const today = new Date();
    
    // Pour les dates passées: la date d'analyse est la date elle-même
    if (isBefore(displayDate, today) && !isSameDay(displayDate, today)) {
      return displayDate;
    }
    
    // Pour aujourd'hui ou les dates futures: la date d'analyse est J-1
    return subDays(displayDate, 1);
  };

  // Calculate the import date
  const getImportDate = (): Date => {
    const today = new Date();
    
    // Pour les dates passées: la date d'import est J+1
    if (isBefore(displayDate, today) && !isSameDay(displayDate, today)) {
      return addDays(displayDate, 1);
    }
    
    // Pour aujourd'hui ou les dates futures: la date d'import est la date sélectionnée
    return displayDate;
  };

  const analysisDate = getAnalysisDate();
  const importDate = getImportDate();
  
  // Format the analysis date with full day name
  const formattedAnalysisDate = format(analysisDate, 'EEEE dd MMMM yyyy', { locale: fr });
  // Capitalize first letter
  const capitalizedAnalysisDate = formattedAnalysisDate.charAt(0).toUpperCase() + formattedAnalysisDate.slice(1);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative" ref={calendarRef}>
        <div 
          className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow cursor-pointer"
          onClick={handleCalendarClick}
        >
          <CalendarIcon className="h-7 w-7 text-gray-500" />
          <span className="text-md text-gray-900">
            {format(displayDate, 'EEEE dd MMMM yyyy', { locale: fr }).charAt(0).toUpperCase() + 
             format(displayDate, 'EEEE dd MMMM yyyy', { locale: fr }).slice(1)}
          </span>
        </div>
        {showCalendar && (
          <div className="absolute top-12 left-0 z-10">
            <div className="flex flex-col">
              <Calendar 
                selectedDate={displayDate} 
                onChange={handleCalendarDateSelect}
                importDate={importDate}
              />
              {/* Analyzed day information below calendar */}
              <div className="bg-blue-50 border border-blue-200 rounded-b-lg px-4 py-3 text-sm text-blue-800 flex items-center justify-center">
                <span className="font-medium mr-1">{t('synthesis.analyzedDay', 'Jour analysé')} : </span> {capitalizedAnalysisDate}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full sm:w-auto">
        <MonthProgress date={displayDate} />
      </div>
    </div>
  );
}