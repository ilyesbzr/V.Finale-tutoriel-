import React from 'react';
import { formatNumber } from '../../utils/formatters';

export default function RemainingPopup({ value, target, unit = '', isVisible = false }) {
  if (!isVisible) return null;
  
  const remaining = target - value;
  const percentage = Math.round((value / target) * 100);
  
  return (
    <div className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-48 text-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">Détails</span>
        <span className="font-bold text-indigo-600">{percentage}%</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600">Objectif:</span>
          <span className="font-medium">{formatNumber(target)}{unit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Réalisé:</span>
          <span className="font-medium">{formatNumber(value)}{unit}</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-gray-100">
          <span className="text-gray-600">Reste à faire:</span>
          <span className="font-medium text-red-600">{formatNumber(remaining)}{unit}</span>
        </div>
      </div>
    </div>
  );
}