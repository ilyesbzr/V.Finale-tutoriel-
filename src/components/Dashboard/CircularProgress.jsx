import React, { useState, useRef, useEffect } from 'react';
import { formatNumber } from '../../utils/formatters';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const CircularProgressbar = React.lazy(() => 
  import('react-circular-progressbar').then(module => ({ default: module.CircularProgressbar }))
);
const buildStyles = React.lazy(() => 
  import('react-circular-progressbar').then(module => ({ default: module.buildStyles }))
);

export default function CircularProgress({ 
  value, 
  target, 
  color, 
  unit = '', 
  showTarget = true,
  size = 'md' 
}) {
  const [showDetails, setShowDetails] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const progress = Math.round((value / target) * 100);
  const displayValue = unit === '€/h' ? `${formatNumber(value)}€/h` : formatNumber(value) + unit;
  const remaining = target - value;

  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-24 h-24 sm:w-32 sm:h-32'
  };

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showDetails && 
          popupRef.current && 
          !popupRef.current.contains(event.target) &&
          buttonRef.current && 
          !buttonRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetails]);

  return (
    <div className="flex flex-col items-center relative">
      <div className={sizes[size]}>
        <React.Suspense fallback={<div className="w-full h-full bg-gray-100 rounded-full animate-pulse" />}>
          <CircularProgressbar
            value={progress}
            text={displayValue}
            styles={buildStyles({
              pathColor: color,
              textColor: '#1e293b',
              trailColor: '#e2e8f0',
              textSize: unit === '€/h' ? '16px' : '16px'
            })}
          />
        </React.Suspense>
      </div>
      <div className="mt-1 flex items-center">
        <span className="text-xs text-gray-500">/{formatNumber(target)}{unit}</span>
        <button
          ref={buttonRef}
          onClick={() => setShowDetails(!showDetails)}
          className="ml-1 text-gray-400 hover:text-indigo-600 focus:outline-none"
        >
          <InformationCircleIcon className="h-4 w-4" />
        </button>
        
        {showDetails && (
          <div 
            ref={popupRef}
            className="absolute z-50 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-48 text-sm"
            style={{
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '10px'
            }}
          >
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700 block">Détails</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Réalisation :</span>
                <span className="font-medium">{formatNumber(value)}{unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Objectif :</span>
                <span className="font-medium">{formatNumber(target)}{unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avancement :</span>
                <span className="font-bold text-indigo-600">{progress}%</span>
              </div>
              <div className="pt-1 border-t border-gray-100 flex justify-between">
                <span className="text-gray-600">Reste à faire :</span>
                <span className="font-medium text-red-600">{formatNumber(remaining)}{unit}</span>
              </div>
            </div>
            {/* Add a small triangle/arrow at the bottom of the popup */}
            <div 
              className="absolute w-3 h-3 bg-white transform rotate-45 border-b border-r border-gray-200"
              style={{
                bottom: '-6px',
                left: 'calc(50% - 6px)'
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}