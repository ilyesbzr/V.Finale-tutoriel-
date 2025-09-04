import React from 'react';
import { memo, useMemo } from 'react';
import { formatNumber } from '../../utils/formatters';
import { 
  getProgressTextColor, 
  getProgressBgColor, 
  calculateProgress,
  calculateProjection,
  calculateProjectedValue,
  calculateRemaining
} from '../../utils/helpers/progressHelpers';
import { useTranslation } from 'react-i18next';

const SalesProgressItem = memo(function SalesProgressItem({ 
  name, 
  actual, 
  target, 
  monthProgress, 
  isVisible = true,
  showProjectedValue = false,
  staffCount = 1,
  date = new Date()
}) {
  const { t } = useTranslation();
  
  const calculations = useMemo(() => ({
    progress: calculateProgress(actual, target),
    projection: calculateProjection(actual, target, monthProgress, date),
    projectedValue: calculateProjectedValue(actual, monthProgress, date),
    remaining: calculateRemaining(actual, target, monthProgress, date),
    remainingToTarget: target - actual
  }), [actual, target, monthProgress, date]);
  
  // Calculer le nombre de jours restants dans le mois
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, lastDayOfMonth - today.getDate());
  
  // Calculer l'objectif du jour (reste à faire / jours restants)
  const { remainingToTarget } = calculations;
  const dailyTarget = Math.round(remainingToTarget / daysRemaining);
  
  const { projection, progress, projectedValue } = calculations;
  const projectionTextColor = getProgressTextColor(projection);
  const progressBgColor = getProgressBgColor(projection);

  return (
    <div className="metric-card-modern p-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex-1">
          <span className="text-lg font-semibold text-gray-900">{name}</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-gray-900">
            {formatNumber(actual)}
          </span>
          <span className="ml-2 text-sm text-gray-500 font-medium">
            / {formatNumber(target)}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-medium ${projectionTextColor}`}>
          {t('common.projection')} : {projection}%
          {showProjectedValue && (
            <span className="ml-1">→ {formatNumber(projectedValue)}</span>
          )}
        </span>
        <span className="text-sm font-semibold text-gray-600">
          {progress}% {t('common.ofTarget')}
        </span>
      </div>
      
      <div className="relative pt-2">
        <div className="progress-modern h-4">
          <div
            className={`progress-fill-modern h-full ${progressBgColor.includes('green') ? 'progress-fill-success' : progressBgColor.includes('orange') ? 'progress-fill-warning' : 'progress-fill-error'}`}
            style={{ 
              width: isVisible ? `${Math.min(progress, 100)}%` : '0%',
            }}
          />
        </div>
        
        <div className="flex justify-between mt-4">
          <span className="text-sm text-gray-600 font-medium">
            {projection >= 100
              ? t('crescendo.dailyTargetZero')
              : `${t('crescendo.dailyTarget')} : ${formatNumber(dailyTarget)}`
            }
          </span>
          <span className="text-sm text-gray-600 font-medium">
            {t('crescendo.remainingToTarget')} : {formatNumber(remainingToTarget)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default SalesProgressItem;