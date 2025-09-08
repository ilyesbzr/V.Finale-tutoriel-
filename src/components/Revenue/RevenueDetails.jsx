import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../Dashboard/Card';
import { getCurrentMonthProgress } from '../../utils/dateCalculations';
import ProgressItem from '../UI/ProgressItem';

export default function RevenueDetails({ data, viewType, setViewType }) {
  const [isVisible, setIsVisible] = useState(false);

  // Calcul des totaux
  const totalRevenue = data.mechanical.revenue + data.quickService.revenue + data.bodywork.revenue;
  const totalTarget = data.mechanical.revenueTarget + data.quickService.revenueTarget + data.bodywork.revenueTarget;
  const monthProgress = getCurrentMonthProgress(new Date());

  // Calcul du CA net (70% du CA total)
  const netRevenue = {
    mechanical: Math.round(data.mechanical.revenue * 0.7),
    quickService: Math.round(data.quickService.revenue * 0.7),
    bodywork: Math.round(data.bodywork.revenue * 0.7)
  };

  const netTarget = {
    mechanical: Math.round(data.mechanical.revenueTarget * 0.7),
    quickService: Math.round(data.quickService.revenueTarget * 0.7),
    bodywork: Math.round(data.bodywork.revenueTarget * 0.7)
  };

  const totalNetRevenue = netRevenue.mechanical + netRevenue.quickService + netRevenue.bodywork;
  const totalNetTarget = netTarget.mechanical + netTarget.quickService + netTarget.bodywork;

  // Calcul du PR basé sur les objectifs définis dans l'onglet Objectifs
  // CA PR = CA total, PR comptoir = 60% du CA total, Accessoires = 20% du CA total
  const prRevenue = {
    total: totalRevenue, // CA PR = CA total
    mechanical: Math.round(totalRevenue * 0.4), // Mécanique = 40%
    quickService: Math.round(totalRevenue * 0.35), // Service Rapide = 35%
    bodywork: Math.round(totalRevenue * 0.25) // Carrosserie = 25%
  };

  const prTarget = {
    total: totalTarget, // CA PR = CA total
    mechanical: Math.round(totalTarget * 0.4), // Mécanique = 40%
    quickService: Math.round(totalTarget * 0.35), // Service Rapide = 35%
    bodywork: Math.round(totalTarget * 0.25) // Carrosserie = 25%
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Définir les départements selon la vue sélectionnée
  const departments = viewType === 'pr' ? [
    {
      name: 'Total CA PR',
      revenue: prRevenue.total,
      target: prTarget.total
    },
    {
      name: 'Mécanique',
      revenue: prRevenue.mechanical,
      target: prTarget.mechanical
    },
    {
      name: 'Service Rapide',
      revenue: prRevenue.quickService,
      target: prTarget.quickService
    },
    {
      name: 'Carrosserie',
      revenue: prRevenue.bodywork,
      target: prTarget.bodywork
    }
  ] : [
    {
      name: 'Total CA APV',
      revenue: totalNetRevenue,
      target: totalNetTarget
    },
    {
      name: 'Mécanique',
      revenue: netRevenue.mechanical,
      target: netTarget.mechanical
    },
    {
      name: 'Service Rapide',
      revenue: netRevenue.quickService,
      target: netTarget.quickService
    },
    {
      name: 'Carrosserie',
      revenue: netRevenue.bodywork,
      target: netTarget.bodywork
    }
  ];

  return (
    <Card>
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-900">
            {viewType === 'pr' ? 'Avancement du CA PR' : 'Avancement du CA APV'}
          </h3>
          <div className="inline-flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1.5 shadow-lg border border-gray-300 min-w-[280px]">
            <button
              onClick={() => setViewType('canet')}
              className={`relative px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out transform ${viewType === 'canet'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-opacity-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                }`}
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-bold">CA APV</span>
              </span>
              {viewType === 'canet' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl opacity-20 animate-pulse"></div>
              )}
            </button>
            <button
              onClick={() => setViewType('pr')}
              className={`relative px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out transform ${viewType === 'pr'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105 ring-2 ring-purple-300 ring-opacity-50'
                : 'text-gray-700 hover:text-purple-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                }`}
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-sm font-bold">CA PR</span>
              </span>
              {viewType === 'pr' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl opacity-20 animate-pulse"></div>
              )}
            </button>
          </div>
        </div>
      </div>
      <CardContent>
        <div className="space-y-4">
          {departments.map((dept) => (
            <ProgressItem
              key={dept.name}
              name={dept.name}
              actual={dept.revenue}
              target={dept.target}
              monthProgress={monthProgress}
              unit="€"
              isVisible={isVisible}
              showProjectedValue={true}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}