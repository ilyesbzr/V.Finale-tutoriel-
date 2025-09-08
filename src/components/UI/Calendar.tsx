import React, { useState, useEffect, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isSameDay, addMonths, subMonths, isToday, setMonth, subDays, getDay, isAfter, isBefore, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { isHoliday, getHolidayName, getLastWorkingDay } from '../../utils/dateCalculations';

interface CalendarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  importDate?: Date;
}

interface DayClassResult {
  className: string;
  tooltipClass: string;
  holidayName: string | null;
}

export default function Calendar({ selectedDate, onChange, importDate }: CalendarProps): JSX.Element {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);
  const [showMonths, setShowMonths] = useState<boolean>(false);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['lu', 'ma', 'me', 'je', 've', 'sa', 'di'];
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Ajuster le premier jour du mois pour commencer au lundi
  const startDay = monthStart.getDay();
  const emptyDays = startDay === 0 ? 6 : startDay - 1;

  const handlePreviousMonth = (): void => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (): void => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleMonthClick = (): void => {
    setShowMonths(!showMonths);
  };

  const handleMonthSelect = (monthIndex: number): void => {
    setCurrentMonth(setMonth(currentMonth, monthIndex));
    setShowMonths(false);
  };

  const handleDateClick = (date: Date): void => {
    // Get today's date for comparison
    const today = new Date();
    
    // For past dates: always allow selection regardless of previous day
    if (isBefore(date, today)) {
      onChange(date);
      return;
    }
    
    // For today or future dates: maintain current logic
    // For Mondays, always allow selection
    const dayOfWeek = getDay(date);
    if (dayOfWeek === 1) {
      onChange(date);
      return;
    }
    
    // For other days, check if previous day is a holiday
    const previousDay = subDays(date, 1);
    if (!isHoliday(previousDay)) {
      onChange(date);
    }
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

  // Calculate the analysis date based on the selected date
  const getAnalysisDate = (date: Date): Date => {
    const today = new Date();
    
    // Pour les dates passées: la date d'analyse est la date elle-même
    if (isBefore(date, today) && !isSameDay(date, today)) {
      return date;
    }
    
    // Pour aujourd'hui ou les dates futures: la date d'analyse est J-1
    return subDays(date, 1);
  };
  
  // Get the analysis date for the currently selected date
  const analysisDate = getAnalysisDate(selectedDate);

  const getDayClass = (date: Date): DayClassResult => {
    const baseClass = "w-10 h-10 flex items-center justify-center text-sm rounded-full relative group";
    const today = new Date();
    const isPastDate = isBefore(date, today);
    const isTodayDate = isToday(date);
    const isDisplayDate = isSameDay(date, selectedDate);
    const isImportDate = importDate && isSameDay(date, importDate);
    
    // Check if this date is the analysis date
    const isAnalysisDate = isSameDay(date, analysisDate);
    
    const isWeekendDay = isWeekend(date);
    const isHolidayDay = isHoliday(date);
    const isPreviousDayHoliday = isHoliday(subDays(date, 1));
    const holidayName = isHolidayDay ? getHolidayName(date) : null;
    const dayOfWeek = getDay(date);

    let className = baseClass;
    let tooltipClass = "absolute bottom-full mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10";

    // Apply styles in priority order
    if (isAnalysisDate) {
      // Analysis date is always blue
      className += ' bg-blue-500 text-white font-bold';
    } else if (isDisplayDate) {
      // Selected date is gray
      className += ' bg-gray-200 text-gray-700 font-bold';
    } else if (isImportDate) {
      // Import date is light gray
      className += ' bg-gray-100 text-gray-500 font-medium';
    } else if (isTodayDate) {
      // Today's date gets a distinct color (indigo)
      className += ' bg-indigo-100 text-indigo-700 font-medium ring-2 ring-indigo-400';
    } else if (isHolidayDay) {
      className += ' text-red-600 font-medium';
    } else if (isWeekendDay) {
      className += ' text-gray-400';
    } else if (isPreviousDayHoliday && dayOfWeek !== 1 && !isPastDate) {
      // Only apply this style for today/future dates that follow a holiday and aren't Mondays
      className += ' text-gray-400 cursor-not-allowed';
    } else {
      className += ' hover:bg-gray-100 text-gray-900';
    }

    // Add cursor-pointer for:
    // 1. All past dates
    // 2. Today/future dates that don't follow a holiday or are Mondays
    if (isPastDate || !isPreviousDayHoliday || dayOfWeek === 1) {
      className += ' cursor-pointer';
    }

    return { className, tooltipClass, holidayName };
  };

  return (
    <div className="calendar-modern w-[320px]">
      {/* En-tête du calendrier */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
        <button
          onClick={handleMonthClick}
          className="flex items-center gap-2 text-base font-bold text-gray-900 hover:bg-white/70 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
        >
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          <span className="text-blue-500 text-sm">▼</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-white/70 rounded-lg transition-all duration-200 hover:scale-110 text-gray-600 hover:text-blue-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white/70 rounded-lg transition-all duration-200 hover:scale-110 text-gray-600 hover:text-blue-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {showMonths ? (
        // Vue des mois
        <div className="grid grid-cols-3 gap-2 p-4">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => handleMonthSelect(index)}
              className={`p-3 text-sm rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                currentMonth.getMonth() === index 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100'
              }`}
            >
              {month.slice(0, 4)}
            </button>
          ))}
        </div>
      ) : (
        // Vue des jours
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm text-gray-600 font-bold uppercase tracking-wide">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(emptyDays)].map((_, index) => (
              <div key={`empty-${index}`} className="w-11 h-11" />
            ))}
            {days.map(day => {
              const { className, tooltipClass, holidayName } = getDayClass(day);
              const today = new Date();
              const isPastDate = isBefore(day, today);
              const isPreviousDayHoliday = isHoliday(subDays(day, 1));
              const dayOfWeek = getDay(day);
              
              // A day is disabled only if:
              // 1. It's not in the past, AND
              // 2. It follows a holiday, AND
              // 3. It's not a Monday
              const isDisabled = !isPastDate && isPreviousDayHoliday && dayOfWeek !== 1;

              return (
                <div key={day.toISOString()} className="relative group">
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`calendar-day ${className}`}
                    disabled={isDisabled}
                  >
                    {format(day, 'd')}
                    {holidayName && (
                      <span className={`tooltip-modern ${tooltipClass}`}>
                        {holidayName}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Legend for calendar colors */}
      <div className="p-4 border-t border-gray-100 text-xs bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
            <span className="text-gray-700 font-medium">Date analysée</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-300 shadow-sm"></div>
            <span className="text-gray-700 font-medium">Date sélectionnée</span>
          </div>
          {importDate && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-200 shadow-sm"></div>
              <span className="text-gray-700 font-medium">Date d'import</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-200 ring-2 ring-blue-400 shadow-sm"></div>
            <span className="text-gray-700 font-medium">Aujourd'hui</span>
          </div>
        </div>
      </div>
    </div>
  );
}