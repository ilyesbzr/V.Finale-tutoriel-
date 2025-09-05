import React, { useState } from 'react';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import { formatNumber } from '../utils/formatters';
import InvoiceBreakdownModal from '../components/UI/InvoiceBreakdownModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTranslation } from 'react-i18next';

export default function Entries() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSite, setSelectedSite] = useState('RO');
  const [activeTab, setActiveTab] = useState('billing'); // 'billing' ou 'workshop-rates'
  const [billingViewType, setBillingViewType] = useState('apv'); // 'apv' ou 'pr'
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedYear, setSelectedYear] = useState(2025);
  const { t } = useTranslation();

  // Données simulées - à remplacer par les vraies données de l'API
  const data = {
    daily: {
      mechanical: {
        total: 38,
        breakdown: { client: 25, warranty: 8, transfer: 5 },
        totalPR: 28,
        breakdownPR: { client: 18, warranty: 6, transfer: 4 }
      },
      quickService: {
        total: 28,
        breakdown: { client: 20, warranty: 5, transfer: 3 },
        totalPR: 22,
        breakdownPR: { client: 15, warranty: 4, transfer: 3 }
      },
      bodywork: {
        total: 12,
        breakdown: { client: 8, warranty: 2, transfer: 2 },
        totalPR: 8,
        breakdownPR: { client: 5, warranty: 2, transfer: 1 }
      }
    },
    monthly: {
      mechanical: {
        total: 720,
        breakdown: { client: 500, warranty: 150, transfer: 70 },
        totalPR: 580,
        breakdownPR: { client: 400, warranty: 120, transfer: 60 }
      },
      quickService: {
        total: 580,
        breakdown: { client: 400, warranty: 120, transfer: 60 },
        totalPR: 465,
        breakdownPR: { client: 320, warranty: 95, transfer: 50 }
      },
      bodywork: {
        total: 245,
        breakdown: { client: 180, warranty: 45, transfer: 20 },
        totalPR: 196,
        breakdownPR: { client: 140, warranty: 36, transfer: 20 }
      }
    }
  };

  // Calcul des totaux
  const dailyTotal = billingViewType === 'apv' 
    ? data.daily.mechanical.total + data.daily.quickService.total + data.daily.bodywork.total
    : data.daily.mechanical.totalPR + data.daily.quickService.totalPR + data.daily.bodywork.totalPR;
  const monthlyTotal = billingViewType === 'apv'
    ? data.monthly.mechanical.total + data.monthly.quickService.total + data.monthly.bodywork.total
    : data.monthly.mechanical.totalPR + data.monthly.quickService.totalPR + data.monthly.bodywork.totalPR;

  const handleShowBreakdown = (type, service) => {
    const breakdown = billingViewType === 'apv' 
      ? data[type][service].breakdown 
      : data[type][service].breakdownPR;
    setSelectedData(breakdown);
    setModalTitle(`${t('common.details')} ${type === 'daily' ? t('synthesis.j1') : t('common.month')} - ${
      service === 'mechanical' ? t('dashboard.mechanical') :
      service === 'quickService' ? t('dashboard.quickService') :
      t('dashboard.bodywork')
    }`);
    setShowModal(true);
  };

  const handleShowTotalBreakdown = (type) => {
    const totalBreakdown = billingViewType === 'apv' ? {
      client: Object.values(data[type]).reduce((sum, service) => sum + service.breakdown.client, 0),
      warranty: Object.values(data[type]).reduce((sum, service) => sum + service.breakdown.warranty, 0),
      transfer: Object.values(data[type]).reduce((sum, service) => sum + service.breakdown.transfer, 0)
    } : {
      client: Object.values(data[type]).reduce((sum, service) => sum + service.breakdownPR.client, 0),
      warranty: Object.values(data[type]).reduce((sum, service) => sum + service.breakdownPR.warranty, 0),
      transfer: Object.values(data[type]).reduce((sum, service) => sum + service.breakdownPR.transfer, 0)
    };
    setSelectedData(totalBreakdown);
    setModalTitle(`${t('common.details')} ${type === 'daily' ? t('synthesis.j1') : t('common.month')} - ${t('common.total')}`);
    setShowModal(true);
  };

  // Fonction pour obtenir le facteur d'année (évolution dans le temps)
  const getYearFactor = (year) => {
    const baseYear = 2025;
    const yearDiff = year - baseYear;
    // Simulation d'une croissance de 2% par an pour les taux atelier
    return Math.pow(1.02, yearDiff);
  };

  // Fonction pour obtenir les données des taux atelier
  const getWorkshopRatesData = (mechanicType) => {
    const baseData = {
      'Mécanique T1': { base: 200, variation: 0.08 },
      'Mécanique T2': { base: 6, variation: 0.12 },
      'Mécanique T3': { base: 10, variation: 0.15 }
    };

    const selectedData = baseData[mechanicType];
    
    return [
      {
        name: mechanicType,
        [selectedYear - 2]: Math.round(selectedData.base * getYearFactor(selectedYear - 2)),
        [selectedYear - 1]: Math.round(selectedData.base * getYearFactor(selectedYear - 1)),
        [selectedYear]: Math.round(selectedData.base * getYearFactor(selectedYear))
      }
    ];
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <DateSelector 
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
        <SiteSelector
          selectedSite={selectedSite}
          onChange={setSelectedSite}
        />
      </div>

      {/* Onglets */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex justify-center">
          <nav className="inline-flex bg-gray-100 rounded-xl p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('billing')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'billing'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Facturation</span>
              {activeTab === 'billing' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('workshop-rates')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'workshop-rates'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Taux atelier</span>
              {activeTab === 'workshop-rates' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'billing' ? (
        <div className="space-y-6">
        {/* Facturation J-1 */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-900">
                {billingViewType === 'apv' ? 'Facturation J-1 APV' : 'Facturation J-1 PR'}
              </h3>
              <div className="inline-flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1.5 shadow-lg border border-gray-300">
                <button
                  onClick={() => setBillingViewType('apv')}
                  className={`relative px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ease-in-out transform ${
                    billingViewType === 'apv'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-opacity-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-base font-bold">APV</span>
                  </span>
                  {billingViewType === 'apv' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl opacity-20 animate-pulse"></div>
                  )}
                </button>
                <button
                  onClick={() => setBillingViewType('pr')}
                  className={`relative px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ease-in-out transform ${
                    billingViewType === 'pr'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105 ring-2 ring-purple-300 ring-opacity-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-base font-bold">PR</span>
                  </span>
                  {billingViewType === 'pr' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl opacity-20 animate-pulse"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              {/* Total */}
              <div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleShowTotalBreakdown('daily')}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {dailyTotal}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{t('common.total')}</h3>
                  <p className="text-sm text-gray-500">{t('entries.invoices')}</p>
                  <p className="text-xs text-gray-400 mt-1">vs N-1: {billingViewType === 'apv' ? '85' : '68'}</p>
                </div>
              </div>

              {/* Mécanique */}
              <div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleShowBreakdown('daily', 'mechanical')}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {billingViewType === 'apv' ? data.daily.mechanical.total : data.daily.mechanical.totalPR}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{t('dashboard.mechanical')}</h3>
                  <p className="text-sm text-gray-500">{t('entries.invoices')}</p>
                  <p className="text-xs text-gray-400 mt-1">vs N-1: {billingViewType === 'apv' ? '42' : '32'}</p>
                </div>
              </div>

              {/* Service Rapide */}
              <div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleShowBreakdown('daily', 'quickService')}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {billingViewType === 'apv' ? data.daily.quickService.total : data.daily.quickService.totalPR}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{t('dashboard.quickService')}</h3>
                  <p className="text-sm text-gray-500">{t('entries.invoices')}</p>
                  <p className="text-xs text-gray-400 mt-1">vs N-1: {billingViewType === 'apv' ? '31' : '24'}</p>
                </div>
              </div>

              {/* Carrosserie */}
              <div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleShowBreakdown('daily', 'bodywork')}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {billingViewType === 'apv' ? data.daily.bodywork.total : data.daily.bodywork.totalPR}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{t('dashboard.bodywork')}</h3>
                  <p className="text-sm text-gray-500">{t('entries.invoices')}</p>
                  <p className="text-xs text-gray-400 mt-1">vs N-1: {billingViewType === 'apv' ? '12' : '9'}</p>
                </div>
              </div>

              {/* Nombre d'avoirs */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    3
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Avoirs</h3>
                  <p className="text-sm text-gray-500">émis</p>
                  <p className="text-xs text-gray-400 mt-1">vs N-1: 5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facturation du mois */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-900">
                {billingViewType === 'apv' ? 'Facturation du mois APV' : 'Facturation du mois PR'}
              </h3>
              <div className="inline-flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1.5 shadow-lg border border-gray-300">
                <button
                  onClick={() => setBillingViewType('apv')}
                  className={`relative px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ease-in-out transform ${
                    billingViewType === 'apv'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-opacity-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-base font-bold">APV</span>
                  </span>
                  {billingViewType === 'apv' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl opacity-20 animate-pulse"></div>
                  )}
                </button>
                <button
                  onClick={() => setBillingViewType('pr')}
                  className={`relative px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ease-in-out transform ${
                    billingViewType === 'pr'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105 ring-2 ring-purple-300 ring-opacity-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-base font-bold">PR</span>
                  </span>
                  {billingViewType === 'pr' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl opacity-20 animate-pulse"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              {/* Total */}
              <div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleShowTotalBreakdown('monthly')}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {formatNumber(monthlyTotal)}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{t('common.total')}</h3>
                  <p className="text-sm text-gray-500">{t('entries.invoices')}</p>
                  <p className="text-xs text-gray-400 mt-1">vs N-1: {billingViewType === 'apv' ? '1620' : '1295'}</p>
                </div>
              </div>

              {/* Mécanique */}
              <div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleShowBreakdown('monthly', 'mechanical')}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {formatNumber(billingViewType === 'apv' ? data.monthly.mechanical.total : data.monthly.mechanical.totalPR)}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{t('dashboard.mechanical')}</h3>
                  <p className="text-sm text-gray-500">{t('entries.invoices')}</p>
                  <p className="text-xs text-gray-400 mt-1">vs N-1: {billingViewType === 'apv' ? '780' : '625'}</p>
                </div>
              </div>

              {/* Service Rapide */}
              <div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleShowBreakdown('monthly', 'quickService')}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {formatNumber(billingViewType === 'apv' ? data.monthly.quickService.total : data.monthly.quickService.totalPR)}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{t('dashboard.quickService')}</h3>
                  <p className="text-sm text-gray-500">{t('entries.invoices')}</p>
                  <p className="text-xs text-gray-400 mt-1">vs N-1: {billingViewType === 'apv' ? '620' : '495'}</p>
                </div>
              </div>

              {/* Carrosserie */}
              <div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleShowBreakdown('monthly', 'bodywork')}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {formatNumber(billingViewType === 'apv' ? data.monthly.bodywork.total : data.monthly.bodywork.totalPR)}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{t('dashboard.bodywork')}</h3>
                  <p className="text-sm text-gray-500">{t('entries.invoices')}</p>
                  <p className="text-xs text-gray-400 mt-1">vs N-1: {billingViewType === 'apv' ? '220' : '175'}</p>
                </div>
              </div>

              {/* Nombre d'avoirs */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {billingViewType === 'apv' ? '15' : '12'}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Avoirs</h3>
                  <p className="text-sm text-gray-500">émis</p>
                  <p className="text-xs text-gray-400 mt-1">vs N-1: {billingViewType === 'apv' ? '18' : '14'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      ) : (
        // Onglet Taux atelier
        <div className="space-y-6">
          {/* Contrôles */}
          <Card>
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-900">Taux atelier - Comparaison annuelle</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Année</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-900 rounded"></div>
                      <span className="text-sm">{selectedYear - 2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span className="text-sm">{selectedYear - 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-400 rounded"></div>
                      <span className="text-sm">{selectedYear}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Répartition des taux pour 2025 */}
          <Card>
            <CardContent className="p-6">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6 max-w-sm mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
                  Répartition des taux
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-red-500 rounded mr-3 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T1</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">T1 :</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {getWorkshopRatesData('Mécanique T1')[0][selectedYear]}K€
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-600 rounded mr-3 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T2</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">T2 :</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {getWorkshopRatesData('Mécanique T2')[0][selectedYear]}K€
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-400 rounded mr-3 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T3</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">T3 :</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {getWorkshopRatesData('Mécanique T3')[0][selectedYear]}K€
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Graphiques des taux atelier */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mécanique T1 */}
            <Card>
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mécanique T1</h3>
              </div>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getWorkshopRatesData('Mécanique T1')}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      barGap={10}
                      barCategoryGap={40}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value}K€`}
                        domain={[0, 'auto']}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value}K€`, name]}
                        labelFormatter={(label) => label}
                      />
                      <Bar dataKey={selectedYear - 2} name={selectedYear - 2} fill="#1e3a8a" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear - 2}
                          position="top"
                          formatter={(value) => `${value}K€`}
                          style={{ fontSize: '12px', fill: '#1e3a8a', fontWeight: 'bold' }}
                        />
                      </Bar>
                      <Bar dataKey={selectedYear - 1} name={selectedYear - 1} fill="#3b82f6" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear - 1}
                          position="top"
                          formatter={(value) => `${value}K€`}
                          style={{ fontSize: '12px', fill: '#3b82f6', fontWeight: 'bold' }}
                        />
                      </Bar>
                      <Bar dataKey={selectedYear} name={selectedYear} fill="#93c5fd" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear}
                          position="top"
                          formatter={(value) => `${value}K€`}
                          style={{ fontSize: '12px', fill: '#93c5fd', fontWeight: 'bold' }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Valeurs détaillées pour Mécanique T1 */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  {getWorkshopRatesData('Mécanique T1').map((item, index) => (
                    <div key={item.name} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">{item.name}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear - 2}:</span>
                          <span className="text-sm font-semibold text-blue-900">{item[selectedYear - 2]}K€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear - 1}:</span>
                          <span className="text-sm font-semibold text-blue-600">{item[selectedYear - 1]}K€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear}:</span>
                          <span className="text-sm font-semibold text-blue-400">{item[selectedYear]}K€</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mécanique T2 */}
            <Card>
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mécanique T2</h3>
              </div>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getWorkshopRatesData('Mécanique T2')}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      barGap={10}
                      barCategoryGap={40}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value}K€`}
                        domain={[0, 'auto']}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value}K€`, name]}
                        labelFormatter={(label) => label}
                      />
                      <Bar dataKey={selectedYear - 2} name={selectedYear - 2} fill="#1e3a8a" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear - 2}
                          position="top"
                          formatter={(value) => `${value}K€`}
                          style={{ fontSize: '12px', fill: '#1e3a8a', fontWeight: 'bold' }}
                        />
                      </Bar>
                      <Bar dataKey={selectedYear - 1} name={selectedYear - 1} fill="#3b82f6" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear - 1}
                          position="top"
                          formatter={(value) => `${value}K€`}
                          style={{ fontSize: '12px', fill: '#3b82f6', fontWeight: 'bold' }}
                        />
                      </Bar>
                      <Bar dataKey={selectedYear} name={selectedYear} fill="#93c5fd" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear}
                          position="top"
                          formatter={(value) => `${value}K€`}
                          style={{ fontSize: '12px', fill: '#93c5fd', fontWeight: 'bold' }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Valeurs détaillées pour Mécanique T2 */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  {getWorkshopRatesData('Mécanique T2').map((item, index) => (
                    <div key={item.name} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">{item.name}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear - 2}:</span>
                          <span className="text-sm font-semibold text-blue-900">{item[selectedYear - 2]}K€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear - 1}:</span>
                          <span className="text-sm font-semibold text-blue-600">{item[selectedYear - 1]}K€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear}:</span>
                          <span className="text-sm font-semibold text-blue-400">{item[selectedYear]}K€</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mécanique T3 */}
            <Card>
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mécanique T3</h3>
              </div>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getWorkshopRatesData('Mécanique T3')}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      barGap={10}
                      barCategoryGap={40}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value}K€`}
                        domain={[0, 'auto']}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value}K€`, name]}
                        labelFormatter={(label) => label}
                      />
                      <Bar dataKey={selectedYear - 2} name={selectedYear - 2} fill="#1e3a8a" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear - 2}
                          position="top"
                          formatter={(value) => `${value}K€`}
                          style={{ fontSize: '12px', fill: '#1e3a8a', fontWeight: 'bold' }}
                        />
                      </Bar>
                      <Bar dataKey={selectedYear - 1} name={selectedYear - 1} fill="#3b82f6" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear - 1}
                          position="top"
                          formatter={(value) => `${value}K€`}
                          style={{ fontSize: '12px', fill: '#3b82f6', fontWeight: 'bold' }}
                        />
                      </Bar>
                      <Bar dataKey={selectedYear} name={selectedYear} fill="#93c5fd" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear}
                          position="top"
                          formatter={(value) => `${value}K€`}
                          style={{ fontSize: '12px', fill: '#93c5fd', fontWeight: 'bold' }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Valeurs détaillées pour Mécanique T3 */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  {getWorkshopRatesData('Mécanique T3').map((item, index) => (
                    <div key={item.name} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">{item.name}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear - 2}:</span>
                          <span className="text-sm font-semibold text-blue-900">{item[selectedYear - 2]}K€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear - 1}:</span>
                          <span className="text-sm font-semibold text-blue-600">{item[selectedYear - 1]}K€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear}:</span>
                          <span className="text-sm font-semibold text-blue-400">{item[selectedYear]}K€</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <InvoiceBreakdownModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={selectedData}
        title={modalTitle}
      />
    </div>
  );
}