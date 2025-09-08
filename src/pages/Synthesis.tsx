import React, { useState, useEffect, useRef } from 'react';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import { formatNumber } from '../utils/formatters';
import { useSelections } from '../hooks/useSelections';
import { mockData } from '../data/mockData';
import { calculateProjection } from '../utils/helpers/progressHelpers';
import { getCurrentMonthProgress } from '../utils/dateCalculations';
import MetricCard from '../components/Synthesis/MetricCard';
import ServiceTable from '../components/Synthesis/ServiceTable';
import { PrinterIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import FinancialView from '../components/Synthesis/FinancialView';
import { useTranslation } from 'react-i18next';
import { generateEmailReport } from '../utils/reportGenerator';
import EmailReportModal from '../components/UI/EmailReportModal';
import { MockData, Department } from '../types';

interface ReportData {
  text: string;
  html: string;
  subject: string;
}

interface TriggerRefs {
  [key: string]: HTMLElement | null;
}

function Synthesis(): JSX.Element {
  const { selectedDate, setSelectedDate, selectedSite, setSelectedSite } = useSelections();
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [dailyViewType, setDailyViewType] = useState<'capr' | 'prcomptoir' | 'accessoires' | 'pratelier'>('capr');
  const [showHEC, setShowHEC] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'financial'>('overview');
  const [emailReportData, setEmailReportData] = useState<ReportData | null>(null);
  const [showEmailReportModal, setShowEmailReportModal] = useState<boolean>(false);
  const [viewType, setViewType] = useState<'canet' | 'hours' | 'capr'>('canet');
  const { t } = useTranslation();
  const triggerRefs = useRef<TriggerRefs>({});

  // Get current month progress
  const monthProgress = getCurrentMonthProgress(new Date());

  // Calculate totals from mockData
  const totalHoursSold = mockData.departments.mechanical.hoursSold + 
                        mockData.departments.quickService.hoursSold + 
                        mockData.departments.bodywork.hoursSold;
  const totalHoursTarget = mockData.departments.mechanical.hoursTarget + 
                          mockData.departments.quickService.hoursTarget + 
                          mockData.departments.bodywork.hoursTarget;
  
  // CA APV (70% du CA total des départements)
  const caAPV = 270000; // 270K€
  const caAPVTarget = 275000; // 275K€
  
  // CA PR
  const caPR = 180000; // 180K€
  const caPRTarget = 392000; // 392K€
  
  // CA Total = CA APV + CA PR
  const totalRevenue = caAPV + caPR; // 406K€
  const totalRevenueTarget = caAPVTarget + caPRTarget; // 667K€
  
  const totalPreviousDayBilling = mockData.departments.mechanical.previousDayBilling + 
                                 mockData.departments.quickService.previousDayBilling + 
                                 mockData.departments.bodywork.previousDayBilling;

  // Calculate HEC hours (70% of total hours)
  const totalHECHoursSold = Math.round(totalHoursSold * 0.7);
  const totalHECHoursTarget = Math.round(totalHoursTarget * 0.7);
  
  // Calculate HEC hours for J-1
  const totalHECPreviousDayBilling = Math.round(totalPreviousDayBilling * 0.7);

  // Calculate daily revenue (CA J-1) - assuming average revenue per hour is consistent
  const revenuePerHour = totalHoursSold ? Math.round((totalRevenue / totalHoursSold)) : 0;
  
  // Previous day revenue by department
  const mechanicalDailyRevenue = mockData.departments.mechanical.previousDayBilling * revenuePerHour;
  const quickServiceDailyRevenue = mockData.departments.quickService.previousDayBilling * revenuePerHour;
  const bodyworkDailyRevenue = mockData.departments.bodywork.previousDayBilling * revenuePerHour;
  const dailyRevenue = mechanicalDailyRevenue + quickServiceDailyRevenue + bodyworkDailyRevenue;

  // Calculate progress percentages
  const hoursProgress = Math.round((totalHoursSold / totalHoursTarget) * 100);
  const hecHoursProgress = Math.round((totalHECHoursSold / totalHECHoursTarget) * 100);
  const revenueProgress = Math.round((totalRevenue / totalRevenueTarget) * 100);
  const caAPVProgress = Math.round((caAPV / caAPVTarget) * 100);
  const caPRProgress = Math.round((caPR / caPRTarget) * 100);

  // Calculate projections
  const hoursProjection = calculateProjection(totalHoursSold, totalHoursTarget, monthProgress);
  const hecHoursProjection = calculateProjection(totalHECHoursSold, totalHECHoursTarget, monthProgress);
  const revenueProjection = calculateProjection(totalRevenue, totalRevenueTarget, monthProgress);
  const caAPVProjection = calculateProjection(caAPV, caAPVTarget, monthProgress);
  const caPRProjection = calculateProjection(caPR, caPRTarget, monthProgress);

  // Calculate projected end values
  const projectedHours = Math.round(totalHoursSold / (monthProgress / 100));
  const projectedHECHours = Math.round(totalHECHoursSold / (monthProgress / 100));
  const projectedRevenue = Math.round(totalRevenue / (monthProgress / 100));
  const projectedCAAPV = Math.round(caAPV / (monthProgress / 100));
  const projectedCAPR = Math.round(caPR / (monthProgress / 100));

  const handlePrint = (): void => {
    window.print();
  };

  const handleGenerateEmailReport = async (): Promise<void> => {
    try {
      const reportData = await generateEmailReport(mockData, selectedDate, selectedSite);
      setEmailReportData(reportData);
      setShowEmailReportModal(true);
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      alert('Une erreur est survenue lors de la génération du rapport.');
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <DateSelector />
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <button
            onClick={handleGenerateEmailReport}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
            title={t('common.generateEmailReport', 'Générer un rapport pour email')}
          >
            <EnvelopeIcon className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:inline-block text-sm font-medium">
              {t('common.emailReport', 'Rapport email')}
            </span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
            title={t('common.print')}
          >
            <PrinterIcon className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:inline-block text-sm font-medium">
              {t('common.print')}
            </span>
          </button>
          <SiteSelector
            selectedSite={selectedSite}
            onChange={setSelectedSite}
          />
        </div>
      </div>

      {/* Onglets */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex justify-center">
          <nav className="nav-tabs-modern inline-flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <span className="text-xl font-medium">{t('synthesis.overview')}</span>
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'financial'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              <span className="text-xl font-medium">{t('synthesis.monthProgress')}</span>
              {activeTab === 'financial' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Vue d'ensemble */}
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                {/* CA Total */}
                <div className="relative">
                  <MetricCard
                    title="CA Total"
                    value={Math.round(totalRevenue / 1000)}
                    target={Math.round(totalRevenueTarget / 1000)}
                    unit="K€"
                    projection={revenueProjection}
                    projectedValue={Math.round(projectedRevenue / 1000)}
                    monthProgress={monthProgress}
                    popupId="totalRevenue"
                    triggerRef={(el: HTMLElement | null) => triggerRefs.current['totalRevenue'] = el}
                    onMouseEnter={setHoveredMetric}
                    onMouseLeave={() => setHoveredMetric(null)}
                    hoveredMetric={hoveredMetric}
                    metricId="totalRevenue"
                  />
                </div>

                {/* CA APV */}
                <div className="relative">
                  <MetricCard
                    title="CA Après-Vente"
                    value={Math.round(caAPV / 1000)}
                    target={Math.round(caAPVTarget / 1000)}
                    unit="K€"
                    projection={caAPVProgress}
                    projectedValue={Math.round(projectedCAAPV / 1000)}
                    monthProgress={monthProgress}
                    popupId="caApv"
                    triggerRef={(el: HTMLElement | null) => triggerRefs.current['caApv'] = el}
                    onMouseEnter={setHoveredMetric}
                    onMouseLeave={() => setHoveredMetric(null)}
                    hoveredMetric={hoveredMetric}
                    metricId="caApv"
                  />
                </div>

                {/* HT facturées */}
                <div className="relative">
                  <MetricCard
                    title="Heures Totales Facturées"
                    value={totalHoursSold}
                    target={totalHoursTarget}
                    unit="h"
                    projection={hoursProjection}
                    projectedValue={projectedHours}
                    monthProgress={monthProgress}
                    popupId="hours"
                    triggerRef={(el: HTMLElement | null) => triggerRefs.current['hours'] = el}
                    onMouseEnter={setHoveredMetric}
                    onMouseLeave={() => setHoveredMetric(null)}
                    hoveredMetric={hoveredMetric}
                    metricId="hours"
                  />
                </div>

                {/* CA PR avec sélecteur vertical */}
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setDailyViewType('capr')} 
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                          dailyViewType === 'capr' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        CA PR
                      </button>
                      <button
                        onClick={() => setDailyViewType('pratelier')}
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                          dailyViewType === 'pratelier' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        PR Atelier
                      </button>
                      <button
                        onClick={() => setDailyViewType('prcomptoir')}
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                          dailyViewType === 'prcomptoir' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        PR comptoir
                      </button>
                      <button
                        onClick={() => setDailyViewType('accessoires')}
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                          dailyViewType === 'accessoires' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Accessoires
                      </button>
                    </div>
                  </div>
                  
                  {dailyViewType === 'capr' && (
                    <MetricCard
                      title="CA Pièces"
                      value={Math.round(caPR / 1000)}
                      target={Math.round(caPRTarget / 1000)}
                      unit="K€"
                      showDetails={true}
                      monthProgress={monthProgress}
                      projection={caPRProjection}
                      projectedValue={Math.round(projectedCAPR / 1000)}
                      onMouseEnter={setHoveredMetric}
                      onMouseLeave={() => setHoveredMetric(null)}
                      hoveredMetric={hoveredMetric}
                      metricId="capr"
                    />
                  )}
                  {dailyViewType === 'prcomptoir' && (
                    <MetricCard
                      title="PR comptoir"
                      value={Math.round((caPR * 0.6) / 1000)}
                      target={Math.round((caPRTarget * 0.6) / 1000)}
                      unit="K€"
                      showDetails={true}
                      monthProgress={monthProgress}
                      projection={Math.round(((caPR * 0.6) / (caPRTarget * 0.6)) * 100)}
                      projectedValue={Math.round((projectedCAPR * 0.6) / 1000)}
                      onMouseEnter={setHoveredMetric}
                      onMouseLeave={() => setHoveredMetric(null)}
                      hoveredMetric={hoveredMetric}
                      metricId="prcomptoir"
                    />
                  )}
                  {dailyViewType === 'accessoires' && (
                    <MetricCard
                      title="Accessoires"
                      value={Math.round((caPR * 0.4) / 1000)}
                      target={Math.round((caPRTarget * 0.4) / 1000)}
                      unit="K€"
                      showDetails={true}
                      monthProgress={monthProgress}
                      projection={Math.round(((caPR * 0.4) / (caPRTarget * 0.4)) * 100)}
                      projectedValue={Math.round((projectedCAPR * 0.4) / 1000)}
                      onMouseEnter={setHoveredMetric}
                      onMouseLeave={() => setHoveredMetric(null)}
                      hoveredMetric={hoveredMetric}
                      metricId="accessoires"
                    />
                  )}
                  {dailyViewType === 'pratelier' && (
                    <MetricCard
                      title="PR Atelier"
                      value={Math.round((caPR * 0.47) / 1000)}
                      target={Math.round((caPRTarget * 0.47) / 1000)}
                      unit="K€"
                      showDetails={true}
                      monthProgress={monthProgress}
                      projection={Math.round(((caPR * 0.47) / (caPRTarget * 0.47)) * 100)}
                      projectedValue={Math.round((projectedCAPR * 0.47) / 1000)}
                      onMouseEnter={setHoveredMetric}
                      onMouseLeave={() => setHoveredMetric(null)}
                      hoveredMetric={hoveredMetric}
                      metricId="pratelier"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails par service */}
          <div className="mt-8">
            <Card>
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-900">{t('synthesis.serviceDetails')}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setViewType('canet')}
                  className={`px-4 py-2 text-base font-semibold rounded-md transition-colors ${
                    viewType === 'canet' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  CA APV
                </button>
                <button
                  onClick={() => setViewType('hours')}
                  className={`px-4 py-2 text-base font-semibold rounded-md transition-colors ${
                    viewType === 'hours' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  HT
                </button>
                <button
                  onClick={() => setViewType('capr')}
                  className={`px-4 py-2 text-base font-semibold rounded-md transition-colors ${
                    viewType === 'capr' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  CA PR
                </button>
              </div>
            </div>
            <CardContent className="px-0 sm:px-4 bg-white">
              <ServiceTable
                data={mockData.departments}
                showNet={false}
                monthProgress={monthProgress}
                viewType={viewType}
                setViewType={setViewType}
              />
            </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <FinancialView data={mockData.departments} />
      )}

      {/* Modal pour le rapport par email */}
      <EmailReportModal
        isOpen={showEmailReportModal}
        onClose={() => setShowEmailReportModal(false)}
        reportData={emailReportData}
      />
    </div>
  );
}

export default Synthesis;