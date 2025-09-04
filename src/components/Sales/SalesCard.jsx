import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import { formatNumber } from '../../utils/formatters';
import { getCurrentMonthProgress } from '../../utils/dateCalculations';
import { 
  getProgressTextColor, 
  getProgressBgColor, 
  calculateProgress,
  calculateProjection,
  calculateProjectedValue,
  calculateRemaining
} from '../../utils/helpers/progressHelpers';
import { useTranslation } from 'react-i18next';

export default function SalesCard({ title, data, staffCount = 1 }) {
  const [isVisible, setIsVisible] = useState(false);
  const monthProgress = getCurrentMonthProgress(new Date());
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculer le nombre de jours restants dans le mois
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, lastDayOfMonth - today.getDate());

  const salesItems = [
    { name: t('crescendo.products.tires'), data: data.tires },
    { name: t('crescendo.products.shockAbsorbers'), data: data.shockAbsorbers },
    { name: t('crescendo.products.wipers'), data: data.wipers },
    { name: t('crescendo.products.brakePads'), data: data.brakePads },
    { name: t('crescendo.products.batteries'), data: data.batteries },
    { name: t('crescendo.products.windshields'), data: data.windshields }
  ].filter(item => item.data.target > 0 || item.data.actual > 0);

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <div className="space-y-4">
          {salesItems.map((item) => {
            const progress = calculateProgress(item.data.actual, item.data.target);
            const projection = calculateProjection(item.data.actual, item.data.target, monthProgress);
            const projectedValue = calculateProjectedValue(item.data.actual, monthProgress);
            const remainingToTarget = item.data.target - item.data.actual;
            const dailyTarget = Math.round(remainingToTarget / daysRemaining);
            
            const projectionTextColor = getProgressTextColor(projection);
            const progressBgColor = getProgressBgColor(projection);

            return (
              <div key={item.name} className="metric-card-modern p-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <span className="text-lg font-semibold text-gray-900">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">
                      {formatNumber(item.data.actual)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 font-medium">
                      / {formatNumber(item.data.target)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${projectionTextColor}`}>
                    {t('common.projection')} : {projection}% → {formatNumber(projectedValue)}
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
          })}
        </div>
      </CardContent>
    </Card>
  );
}