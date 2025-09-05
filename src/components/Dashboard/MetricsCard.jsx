import React from 'react';
import { memo, useMemo } from 'react';
import { formatNumber } from '../../utils/formatters';
import { getCurrentMonthProgress } from '../../utils/dateCalculations';
import { calculateProjection, calculateProjectedValue, calculateRemaining } from '../../utils/helpers/progressHelpers';

const MetricsCard = memo(function MetricsCard({ 
  title, 
  value, 
  target, 
  unit = '', 
  progress, 
  previousDayBilling,
  baseValue
}) {
  // Obtenir la date actuelle pour les calculs
  const currentDate = new Date();
  
  // Calculer le projection
  const monthProgress = getCurrentMonthProgress(currentDate);
  
  const calculations = useMemo(() => ({
    projection: calculateProjection(value, target, monthProgress, currentDate),
    remaining: calculateRemaining(value, target, monthProgress, currentDate),
    remainingToTarget: target - value
  }), [value, target, monthProgress]);
  
  // Déterminer les couleurs en fonction du projection
  const getColorClass = (projectionValue) => {
    if (projectionValue >= 90) return 'text-green-600';
    if (projectionValue >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (projectionValue) => {
    if (projectionValue >= 90) return 'bg-green-500';
    if (projectionValue >= 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const { projection, remaining, remainingToTarget } = calculations;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <span className={`text-xs ${getColorClass(projection)} mt-1`}>
            Projection: {projection}%
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400">
            Objectif: {formatNumber(target)}{unit} ({formatNumber(remainingToTarget)}{unit})
          </span>
          <span className="text-xs text-gray-600 mt-1">
            Réalisé {progress}%
          </span>
        </div>
      </div>
      <div className="mt-2">
        <div className="relative w-full">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressBarColor(projection)}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">
            {projection >= 100 || remaining <= 0
              ? 'Projection ≥ 100% : reste à faire 0'
              : `Reste à faire : ${formatNumber(remaining)}${unit}`
            }
          </span>
        </div>
        {baseValue && (
          <p className="mt-3 text-sm text-gray-600">
            {baseValue}
          </p>
        )}
        {previousDayBilling && (
          <p className="mt-3 text-sm text-gray-600">
            Facturation J-1: {formatNumber(previousDayBilling)}h
          </p>
        )}
      </div>
    </div>
  );
});

export default MetricsCard;