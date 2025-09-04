import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { formatNumber } from '../../utils/formatters';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { PROGRESS_THRESHOLDS } from '../../utils/constants/metrics';
import { calculateProjection, calculateProjectedValue } from '../../utils/helpers/progressHelpers';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { isWeekend, isHoliday, getLastWorkingDay } from '../../utils/dateCalculations';
import { useTranslation } from 'react-i18next';

export default function MetricCard({ 
  title, 
  value, 
  target, 
  unit = '', 
  monthProgress,
  showDetails = true,
  showTarget = true,
  size = 'md', 
  renderPopup,
  popupId,
  triggerRef,
  togglePopup,
  segments = null,
  onMouseEnter = null,
  onMouseLeave = null,
  hoveredMetric = null,
  metricId = null,
  date = new Date(),
  projection,
  projectedValue
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const { t } = useTranslation();
  
  // Get circle color based on projection
  const getCircleColor = (projection) => {
    if (projection >= 90) return '#22c55e'; // green-500 - VERT
    if (projection >= 75) return '#f59e0b'; // amber-500 - ORANGE
    return '#ef4444'; // red-500
  };

  // Get projection text color
  const getProjectionTextColor = (projection) => {
    if (projection >= 90) return 'text-green-600';
    if (projection >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  // Get projection background color
  const getProjectionColor = (projection) => {
    if (projection >= 90) return 'bg-green-500';
    if (projection >= 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Calculate projection using the working days method
  // Use provided projection and projectedValue or calculate them
  const calculatedProjectedValue = projectedValue || (monthProgress > 0 ? Math.round(value / (monthProgress / 100)) : 0);
  const calculatedProjection = projection !== undefined ? projection : (target > 0 ? Math.round((calculatedProjectedValue / target) * 100) : 0);

  // Use the actual values without adjustment
  const adjustedValue = value;
  const adjustedProjection = calculatedProjection;

  const progress = target ? Math.round((adjustedValue / target) * 100) : 0;

  // Get the day before the analysis date (which is the day before the selected date)
  const getJ1Date = () => {
    // First get the analysis date (which is the last working day before the selected date)
    const analysisDate = getLastWorkingDay(date);
    
    // Then get the last working day before the analysis date
    let j1Date = subDays(analysisDate, 1);
    while (isWeekend(j1Date) || isHoliday(j1Date)) {
      j1Date = subDays(j1Date, 1);
    }
    
    return j1Date;
  };

  // Format the J-1 date
  const j1Date = getJ1Date();
  const formattedJ1Date = format(j1Date, 'dd/MM', { locale: fr });

  // Check if this is a J-1 card
  const isJ1Card = false; // Suppression de la mention J-1

  // Animate the circle filling
  useEffect(() => {
    setAnimatedValue(0);
    setAnimatedProgress(0);
    
    const duration = 1000; // 1 second animation
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedValue(Math.min(adjustedValue * progress, adjustedValue));
      setAnimatedProgress(Math.min(progress * 100, progress * 100));
      
      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [adjustedValue, target]);

  return (
    <div className="metric-card-modern h-full flex flex-col relative" style={{ minHeight: '380px' }}>
      
      <div className="flex flex-col items-center mb-6 flex-grow" style={{ paddingTop: '16px' }}>
        <div 
          className="w-44 h-44 sm:w-52 sm:h-52 relative transition-none" 
          style={{ marginTop: '8px' }}
          onMouseEnter={onMouseEnter ? () => onMouseEnter(metricId) : undefined}
          onMouseLeave={onMouseLeave ? () => onMouseLeave() : undefined}
        >
          {segments ? (
            <>
              {/* Base circle with text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full">
                  <CircularProgressbar
                    value={100}
                    text={`${formatNumber(value)}${unit}`}
                    styles={buildStyles({
                      pathColor: 'transparent',
                      textColor: '#0f172a',
                      trailColor: '#e2e8f0',
                      strokeWidth: 10,
                      textSize: '18px',
                      fontWeight: '700'
                    })}
                  />
                </div>
              </div>
              
              {/* Colored segments with animation */}
              <svg width="100%" height="100%" viewBox="0 0 160 160" className="absolute inset-0">
                {/* Background circle */}
                <circle cx="80" cy="80" r="70" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                
                {segments.map((segment, index) => {
                  const previousSegmentsTotal = segments
                    .slice(0, index)
                    .reduce((sum, s) => sum + s.percentage, 0);
                  
                  // Calculate animated percentage
                  const animatedPercentage = (segment.percentage * animatedProgress) / 100;
                  
                  return (
                    <circle 
                      key={segment.name}
                      cx="80" 
                      cy="80" 
                      r="70" 
                      fill="none" 
                      stroke={segment.color} 
                      strokeWidth="12" 
                      strokeDasharray={`${animatedPercentage * 4.4} 440`} 
                      transform={`rotate(${(previousSegmentsTotal * 3.6) - 90} 80 80)`}
                      strokeLinecap="round"
                      style={{ 
                        transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }}
                    />
                  );
                })}
              </svg>
            </>
          ) : (
            <>
              <CircularProgressbar
                value={animatedValue}
                maxValue={target || value * 2}
                text={hoveredMetric === metricId ? '' : `${formatNumber(value)}${unit}`}
                styles={buildStyles({
                  pathColor: getCircleColor(unit === 'K€' ? adjustedProjection : calculatedProjection),
                  textColor: '#0f172a',
                  trailColor: '#f1f5f9',
                  pathTransition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0s',
                  textSize: '18px',
                  strokeWidth: 12,
                  fontWeight: '700'
                })}
              />
              {hoveredMetric === metricId && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getProjectionTextColor(unit === 'K€' ? adjustedProjection : calculatedProjection)}`}>{progress}%</div>
                    <div className="text-sm text-gray-600 font-medium">{t('common.ofTarget')}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {title && (
          <h3 className="text-2xl font-semibold text-gray-800 mt-6 text-center">
            <span className="font-semibold text-gray-900">{title}</span>
          </h3>
        )}
      </div>
      
      {showDetails && (
        <div className="mt-auto text-center relative bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
          <div className="mb-3">
            <span className={`text-lg ${getProjectionTextColor(unit === 'K€' ? adjustedProjection : projection)}`}>
              {t('common.projection')} : {unit === 'K€' ? adjustedProjection : calculatedProjection}% → {formatNumber(calculatedProjectedValue)}{unit}
              <span className="font-bold text-gray-900 ml-2 text-lg">/{formatNumber(target)}{unit}</span>
            </span>
          </div>
          
          <div className="progress-modern h-4">
            <div 
              className={`progress-fill-modern h-full ${getProjectionColor(unit === 'K€' ? adjustedProjection : calculatedProjection).includes('green') ? 'progress-fill-success' : getProjectionColor(unit === 'K€' ? adjustedProjection : calculatedProjection).includes('amber') ? 'progress-fill-warning' : 'progress-fill-error'}`} 
              style={{ 
                width: `${Math.min(animatedProgress * (progress / 100), 100)}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {segments && (
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
          <div className="grid grid-cols-3 gap-3">
            {segments.map(segment => (
              <div key={segment.name} className="flex flex-col items-center p-2 rounded-lg hover:bg-white transition-colors duration-200">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2 shadow-sm" style={{ backgroundColor: segment.color }} />
                  <span className="text-xs font-semibold text-gray-700">{segment.name}</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-bold text-gray-900">{formatNumber(segment.value)}{segment.unit}</span>
                  <span className="text-xs text-gray-500 ml-1 font-medium">({segment.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}