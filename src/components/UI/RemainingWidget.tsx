import React, { useState, useRef, useEffect } from 'react';
import { formatNumber } from '../../utils/formatters';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface RemainingWidgetProps {
  value: number;
  target: number;
  unit?: string;
}

export default function RemainingWidget({ value, target, unit = '' }: RemainingWidgetProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  
  const remaining = target - value;
  const percentage = Math.round((value / target) * 100);
  
  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center text-gray-500 hover:text-indigo-600 focus:outline-none ml-1"
        title="Voir les détails"
      >
        <InformationCircleIcon className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div 
          ref={popupRef}
          className="absolute z-20 mt-2 -right-2 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-48 text-sm"
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
              <span className="font-bold text-indigo-600">{percentage}%</span>
            </div>
            <div className="pt-1 border-t border-gray-100 flex justify-between">
              <span className="text-gray-600">Reste à faire :</span>
              <span className="font-medium text-red-600">{formatNumber(remaining)}{unit}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}