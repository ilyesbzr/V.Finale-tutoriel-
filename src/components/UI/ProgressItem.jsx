import React from 'react';
import { memo } from 'react';
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

const ProgressItem = memo(function ProgressItem({ 
  name, 
  actual, 
  target, 
  monthProgress, 
  unit = '', 
  isVisible = true,
  showProjectedValue = false,
  date = new Date()
}) {
  const { t } = useTranslation();
  
  const progress = calculateProgress(actual, target);
  const projection = calculateProjection(actual, target, monthProgress, date);
  const projectedValue = calculateProjectedValue(actual, monthProgress, date);
  const remaining = calculateRemaining(actual, target, monthProgress, date);
  const remainingToTarget = target - actual;
  
  // Calculer le nombre de jours restants dans le mois
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, lastDayOfMonth - today.getDate());
  
  // Calculer l'objectif du jour (reste à faire / jours restants)
  const dailyTarget = Math.round(remainingToTarget / daysRemaining);
  
  const projectionTextColor = getProgressTextColor(projection);
  const progressBgColor = getProgressBgColor(projection);

  return (
    <div className="metric-card-modern p-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex-1">
          <span className="text-xl font-semibold text-gray-900">{name}</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-gray-900">
            {formatNumber(actual)}{unit}
          </span>
          <span className="ml-2 text-sm text-gray-500 font-medium">
            / {formatNumber(target)}{unit}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className={`text-lg font-medium ${projectionTextColor}`}>
          {t('common.projection')} : {projection}%
          {showProjectedValue && (
            <span className="ml-1">→ {formatNumber(projectedValue)}{unit}</span>
          )}
        </span>
        <span className="text-md font-semibold text-gray-600">
          {progress}% {t('common.ofTarget')}
        </span>
      </div>
      
      <div className="relative pt-2">
        <div className="progress-modern h-4 flex">
          <div
            className={`progress-fill-modern ${progressBgColor.includes('green') ? 'progress-fill-success' : progressBgColor.includes('orange') ? 'progress-fill-warning' : 'progress-fill-error'}`}
            style={{ 
              width: isVisible ? `${Math.min(progress, 100)}%` : '0%',
            }}
          />
        </div>
        
        <div className="flex justify-between mt-4">
          <span className="text-md text-gray-600 font-medium">
            {projection >= 100
              ? t('hours.dailyTargetZero')
              : `${t('hours.dailyTarget')} : ${formatNumber(dailyTarget)}${unit}`
            }
          </span>
          <span className="text-md text-gray-600 font-medium">
            {t('hours.remainingToTarget')} : {formatNumber(remainingToTarget)}{unit}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ProgressItem;