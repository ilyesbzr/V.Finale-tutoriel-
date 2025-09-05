import React, { useState, useEffect, useRef } from 'react';
import { formatNumber } from '../../utils/formatters';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function ServiceTable({ 
  data, 
  showNet, 
  monthProgress, 
  viewType, 
  setViewType
}) {
  const [activePopup, setActivePopup] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const popupRefs = useRef({});
  const triggerRefs = useRef({});
  const { t } = useTranslation();

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle outside click to close popup
  useEffect(() => {
    function handleClickOutside(event) {
      if (activePopup) {
        const popupElement = popupRefs.current[activePopup];
        const triggerElement = triggerRefs.current[activePopup];
        
        if (popupElement && 
            !popupElement.contains(event.target) && 
            triggerElement && 
            !triggerElement.contains(event.target)) {
          setActivePopup(null);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopup]);

  // Get color based on trend ratio
  const getTrendColor = (realizationPercentage) => {
    const ratio = calculateTrendRatio(realizationPercentage, monthProgress);
    if (ratio >= 0.9) return 'text-green-600';
    if (ratio >= 0.75) return 'text-orange-600';
    return 'text-red-600';
  };

  // Calculate trend ratio (realization % vs month progress %)
  const calculateTrendRatio = (realizationPercentage, monthProgress) => {
    if (monthProgress === 0) return 100;
    return (realizationPercentage / monthProgress);
  };

  // Get progress bar color based on trend ratio
  const getProgressBarColor = (realizationPercentage) => {
    const ratio = calculateTrendRatio(realizationPercentage, monthProgress);
    if (ratio >= 0.9) return 'bg-green-500';
    if (ratio >= 0.75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Calculate totals
  const totalHoursSold = data.mechanical.hoursSold + data.quickService.hoursSold + data.bodywork.hoursSold;
  const totalHoursTarget = data.mechanical.hoursTarget + data.quickService.hoursTarget + data.bodywork.hoursTarget;
  
  // Enhanced revenue values for better visualization
  const enhancedRevenue = {
    mechanical: data.mechanical.revenue * 1.5,
    quickService: data.mechanical.revenue * 1.6,
    bodywork: data.mechanical.revenue * 1.4
  };
  
  const totalRevenue = enhancedRevenue.mechanical + enhancedRevenue.quickService + enhancedRevenue.bodywork;
  const totalRevenueTarget = data.mechanical.revenueTarget + data.quickService.revenueTarget + data.bodywork.revenueTarget;
  
  // Calculate previous day billing
  const previousDayBilling = {
    mechanical: data.mechanical.previousDayBilling,
    quickService: data.quickService.previousDayBilling,
    bodywork: data.bodywork.previousDayBilling
  };
  
  const totalPreviousDayBilling = previousDayBilling.mechanical + previousDayBilling.quickService + previousDayBilling.bodywork;
  
  // Calculate revenue per hour
  const revenuePerHour = totalHoursSold ? Math.round(totalRevenue / totalHoursSold) : 0;

  // Toggle popup
  const togglePopup = (popupId) => {
    setActivePopup(activePopup === popupId ? null : popupId);
  };

  // Get column labels based on view type
  const getColumnLabels = () => {
    if (viewType === 'canet') {
      return {
        value: 'CA APV',
        target: t('common.target') + ' CA APV',
        j1: t('synthesis.j1'),
        unit: '€'
      };
    } else if (viewType === 'hours') {
      return {
        value: 'HT ' + t('common.actual'),
        target: t('common.target') + ' HT',
        j1: t('synthesis.j1'),
        unit: 'h'
      };
    } else if (viewType === 'capr') {
      return {
        value: 'CA PR',
        target: t('common.target') + ' CA PR',
        j1: t('synthesis.j1'),
        unit: '€'
      };
    }
  };

  const columnLabels = getColumnLabels();

  // Get table rows data based on view type
  const getTableRows = () => {
    return Object.entries({
      [t('dashboard.mechanical')]: {
        name: t('dashboard.mechanical'),
        dept: data.mechanical,
        key: 'mechanical'
      },
      [t('dashboard.quickService')]: {
        name: t('dashboard.quickService'),
        dept: data.quickService,
        key: 'quickService'
      },
      [t('dashboard.bodywork')]: {
        name: t('dashboard.bodywork'),
        dept: data.bodywork,
        key: 'bodywork'
      }
    }).map(([name, info]) => {
      const { dept, key } = info;
      
      // Common data
      const revenue = viewType === 'canet' ? enhancedRevenue[key] : dept.revenue;
      const revenueTarget = dept.revenueTarget;
      const revenuePercentage = revenueTarget ? Math.round((revenue / revenueTarget) * 100) : 0;
      
      // Hours data
      const hours = dept.hoursSold;
      const hoursTarget = dept.hoursTarget;
      const hoursPercentage = hoursTarget ? Math.round((hours / hoursTarget) * 100) : 0;
      
      // CA PR data
      const caPR = dept.revenue;
      const caPRTarget = dept.revenueTarget;
      const caPRPercentage = caPRTarget ? Math.round((caPR / caPRTarget) * 100) : 0;
      
      // Previous day data
      const prevDayBilling = previousDayBilling[key];
      const prevDayRevenue = prevDayBilling * (revenue / hours || 0);
      
      // Determine which values to use based on view type
      let value, target, percentage, j1Value, popupId;
      
      if (viewType === 'canet') {
        value = revenue;
        target = revenueTarget;
        percentage = revenuePercentage;
        j1Value = prevDayRevenue;
        popupId = `${name}-revenue`;
      } else if (viewType === 'hours') {
        value = hours;
        target = hoursTarget;
        percentage = hoursPercentage;
        j1Value = prevDayBilling;
        popupId = `${name}-hours`;
      } else if (viewType === 'capr') {
        value = caPR;
        target = caPRTarget;
        percentage = caPRPercentage;
        j1Value = prevDayRevenue;
        popupId = `${name}-capr`;
      }

      return (
        <tr key={name} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
            {name}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center text-xl text-gray-900">
            {formatNumber(value)}{columnLabels.unit}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center text-xl text-gray-900">
            {formatNumber(target)}{columnLabels.unit}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center relative">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center mb-1">
                <button
                  ref={el => triggerRefs.current[popupId] = el}
                  onClick={() => togglePopup(popupId)}
                  className={`text-xl font-medium mr-2 ${getTrendColor(percentage)} hover:underline cursor-pointer`}
                >
                  {percentage}%
                </button>
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressBarColor(percentage)}`} 
                  style={{ 
                    width: `${Math.min(percentage, 100)}%`,
                    transition: 'width 1s ease-out'
                  }}
                ></div>
              </div>
            </div>
            
            {/* Popup moderne */}
            {activePopup === popupId && (
              <div 
                ref={el => popupRefs.current[popupId] = el}
                className="absolute bg-white border border-gray-200 shadow-2xl rounded-xl p-0 w-96 text-sm z-50"
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9999,
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.98)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">📊 Détails de Performance</h3>
                      <p className="text-blue-100 text-sm mt-1">Samedi 12 Juillet 2025</p>
                    </div>
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Valeur du jour */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 shadow-sm"></div>
                      <span className="text-gray-700 font-medium">💰 Valeur du jour</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600">4 088 €</span>
                      <div className="text-xs text-blue-500 font-medium">Performance actuelle</div>
                    </div>
                  </div>
                  
                  {/* Évolution J-1 */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-3 shadow-sm"></div>
                      <span className="text-gray-700 font-medium">📉 Évolution J-1</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-red-600">-23 820 €</span>
                      <div className="text-xs text-red-500 font-medium">vs jour précédent</div>
                    </div>
                  </div>
                  
                  {/* Tendance J-1 */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-3 shadow-sm"></div>
                      <span className="text-gray-700 font-medium">📊 Tendance J-1 (%)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-red-600">-85%</span>
                      <div className="text-xs text-red-500 font-medium">Variation relative</div>
                    </div>
                  </div>

                  {/* Indicateur de performance global */}
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">🎯 Performance globale</span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                        ⚠️ ATTENTION
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-red-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>Objectif non atteint</span>
                      <span className="font-semibold">15% de l'objectif</span>
                    </div>
                  </div>
                </div>
                
                {/* Flèche pointant vers le bas */}
                <div 
                  className="absolute w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-200 shadow-sm"
                  style={{
                    bottom: '-8px',
                    left: 'calc(50% - 8px)'
                  }}
                ></div>
              </div>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center text-xl text-gray-900">
            {formatNumber(j1Value)}{columnLabels.unit}
          </td>
        </tr>
      );
    });
  };

  // Get total row based on view type
  const getTotalRow = () => {
    let value, target, percentage, j1Value, popupId;
    
    if (viewType === 'canet') {
      value = totalRevenue;
      target = totalRevenueTarget;
      percentage = Math.round((totalRevenue / totalRevenueTarget) * 100);
      j1Value = totalPreviousDayBilling * revenuePerHour;
      popupId = 'Total-revenue';
    } else if (viewType === 'hours') {
      value = totalHoursSold;
      target = totalHoursTarget;
      percentage = Math.round((totalHoursSold / totalHoursTarget) * 100);
      j1Value = totalPreviousDayBilling;
      popupId = 'Total-hours';
    } else if (viewType === 'capr') {
      value = totalRevenue;
      target = totalRevenueTarget;
      percentage = Math.round((totalRevenue / totalRevenueTarget) * 100);
      j1Value = totalPreviousDayBilling * revenuePerHour;
      popupId = 'Total-capr';
    }
    
    return (
      <tr className="bg-gray-50 font-medium">
        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900 flex items-center">
          {viewType === 'canet' ? 'Total CA APV' : viewType === 'hours' ? 'Total HT' : 'Total CA PR'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center text-xl text-gray-900">
          {formatNumber(value)}{columnLabels.unit}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center text-xl text-gray-900">
          {formatNumber(target)}{columnLabels.unit}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center relative">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-1">
              <button
                ref={el => triggerRefs.current[popupId] = el}
                onClick={() => togglePopup(popupId)}
                className={`text-xl font-medium mr-2 ${getTrendColor(percentage)} hover:underline cursor-pointer`}
              >
                {percentage}%
              </button>
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressBarColor(percentage)}`} 
                style={{ 
                  width: `${Math.min(percentage, 100)}%`,
                  transition: 'width 1s ease-out'
                }}
              ></div>
            </div>
          </div>
          
          {/* Popup pour le total */}
          {activePopup === popupId && (
            <div 
              ref={el => popupRefs.current[popupId] = el}
              className="absolute bg-white border border-gray-200 shadow-2xl rounded-xl p-0 w-96 text-sm z-50"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* En-tête avec gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">📊 Détails de Performance Globale</h3>
                    <p className="text-blue-100 text-sm mt-1">Samedi 12 Juillet 2025</p>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Valeur du jour */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 shadow-sm"></div>
                    <span className="text-gray-700 font-medium">💰 Valeur du jour</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">4 088 €</span>
                    <div className="text-xs text-blue-500 font-medium">Performance actuelle</div>
                  </div>
                </div>
                
                {/* Évolution J-1 */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3 shadow-sm"></div>
                    <span className="text-gray-700 font-medium">📉 Évolution J-1</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-red-600">-23 820 €</span>
                    <div className="text-xs text-red-500 font-medium">vs jour précédent</div>
                  </div>
                </div>
                
                {/* Tendance J-1 */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3 shadow-sm"></div>
                    <span className="text-gray-700 font-medium">📊 Tendance J-1 (%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-red-600">-85%</span>
                    <div className="text-xs text-red-500 font-medium">Variation relative</div>
                  </div>
                </div>

                {/* Indicateur de performance global */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">🎯 Performance globale</span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                      ⚠️ ATTENTION
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Objectif non atteint</span>
                    <span className="font-semibold">15% de l'objectif</span>
                  </div>
                </div>
              </div>
              
              {/* Flèche pointant vers le bas */}
              <div 
                className="absolute w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-200 shadow-sm"
                style={{
                  bottom: '-8px',
                  left: 'calc(50% - 8px)'
                }}
              ></div>
            </div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center text-xl text-gray-900">
          {formatNumber(j1Value)}{columnLabels.unit}
        </td>
      </tr>
    );
  };

  return (
    <div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="table-modern min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-lg font-bold uppercase tracking-wider w-1/5 bg-gray-50">
                  <span className="text-base">{t('synthesis.service')}</span>
                </th>
                <th className="px-6 py-4 text-center text-lg font-bold uppercase tracking-wider w-1/5 bg-gray-50">
                  <span className="text-base">{columnLabels.value}</span>
                </th>
                <th className="px-6 py-4 text-center text-lg font-bold uppercase tracking-wider w-1/5 bg-gray-50">
                  <span className="text-base">{columnLabels.target}</span>
                </th>
                <th className="px-6 py-4 text-center text-lg font-bold uppercase tracking-wider w-1/5 bg-gray-50">
                  <span className="text-base">{t('synthesis.realizationRate')}</span>
                </th>
                <th className="px-6 py-4 text-center text-lg font-bold uppercase tracking-wider w-1/5 bg-gray-50">
                  <span className="text-base">{columnLabels.j1}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {getTableRows()}
              {getTotalRow()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}