import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/Dashboard/Card';
import { RevenueDetails } from '../components/Revenue/RevenueDetails';
import { RevenueDistributionChart } from '../components/Revenue/RevenueDistributionChart';
import { RevenuePerHourChart } from '../components/Revenue/RevenuePerHourChart';
import { PreviousDayBilling } from '../components/Revenue/PreviousDayBilling';
import { useDate } from '../contexts/DateContext';
import { mockData } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

export const Revenue: React.FC = () => {
  const { t } = useTranslation();
  const { selectedDate } = useDate();
  const [activeView, setActiveView] = useState<'progress' | 'targets' | 'comparison'>('progress');
  const [selectedType, setSelectedType] = useState<'apv' | 'pr'>('apv');

  const currentData = useMemo(() => {
    const monthKey = selectedDate.toISOString().slice(0, 7);
    return mockData.monthlyData[monthKey] || mockData.monthlyData['2024-01'];
  }, [selectedDate]);

  const renderViewTabs = () => (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 p-1 rounded-xl shadow-inner">
        <button
          onClick={() => setActiveView('progress')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            activeView === 'progress'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📊 {t('revenue.progress')}
        </button>
        <button
          onClick={() => setActiveView('targets')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            activeView === 'targets'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🎯 {t('revenue.targets')}
        </button>
        <button
          onClick={() => setActiveView('comparison')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            activeView === 'comparison'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📈 {t('revenue.comparison')}
        </button>
      </div>
    </div>
  );

  const renderTypeButtons = () => (
    <div className="flex justify-start mb-6">
      <div className="flex space-x-3">
        <button
          onClick={() => setSelectedType('apv')}
          className={`min-w-[280px] px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
            selectedType === 'apv'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📊 CA APV
        </button>
        <button
          onClick={() => setSelectedType('pr')}
          className={`min-w-[280px] px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
            selectedType === 'pr'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔧 CA PR
        </button>
      </div>
    </div>
  );

  const renderProgressView = () => (
    <div className="space-y-8">
      {renderTypeButtons()}
      <RevenueDetails type={selectedType} />
    </div>
  );

  const renderTargetsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card title={t('revenue.apvTargets')} className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('revenue.monthlyTarget')}</span>
            <span className="font-bold text-lg">{formatCurrency(currentData.apv.target)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('revenue.achieved')}</span>
            <span className="font-bold text-lg text-green-600">{formatCurrency(currentData.apv.current)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('revenue.remaining')}</span>
            <span className="font-bold text-lg text-orange-600">
              {formatCurrency(Math.max(0, currentData.apv.target - currentData.apv.current))}
            </span>
          </div>
        </div>
      </Card>

      <Card title={t('revenue.prTargets')} className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('revenue.monthlyTarget')}</span>
            <span className="font-bold text-lg">{formatCurrency(currentData.pr.target)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('revenue.achieved')}</span>
            <span className="font-bold text-lg text-green-600">{formatCurrency(currentData.pr.current)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('revenue.remaining')}</span>
            <span className="font-bold text-lg text-orange-600">
              {formatCurrency(Math.max(0, currentData.pr.target - currentData.pr.current))}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderComparisonView = () => (
    <div className="space-y-8">
      {renderTypeButtons()}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueDistributionChart type={selectedType} />
        <RevenuePerHourChart type={selectedType} />
      </div>
      <PreviousDayBilling />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('revenue.title')}</h1>
      </div>

      {renderViewTabs()}

      {activeView === 'progress' && renderProgressView()}
      {activeView === 'targets' && renderTargetsView()}
      {activeView === 'comparison' && renderComparisonView()}
    </div>
  );
};