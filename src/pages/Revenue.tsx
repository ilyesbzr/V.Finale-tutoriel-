import React, { useState, useEffect, useRef } from 'react';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import RevenueDetails from '../components/Revenue/RevenueDetails';
import RevenueDistributionChart from '../components/Revenue/RevenueDistributionChart';
import RevenuePerHourChart from '../components/Revenue/RevenuePerHourChart';
import PreviousDayBilling from '../components/Revenue/PreviousDayBilling';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import { mockData } from '../data/mockData';
import { formatNumber } from '../utils/formatters';
import PrintableSummary from '../components/Dashboard/PrintableSummary';
import EmailReportButton from '../components/UI/EmailReportButton';
import { generateEmailReport } from '../utils/reportGenerator';
import EmailReportModal from '../components/UI/EmailReportModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, ScatterChart, Scatter, LineChart, Line } from 'recharts';
import { generateClientTypeData } from '../utils/chartHelpers';
import { MockData, Department } from '../types';

interface RevenuePerHourTargets {
  global: number;
  mechanical: number;
  quickService: number;
  bodywork: number;
}

interface ChartDataItem {
  name: string;
  [year: number]: number;
}

interface MonthlyDetailData {
  month: string;
  monthIndex: number;
  2023: number;
  2024: number;
  2025: number | null;
}

interface ReportData {
  text: string;
  html: string;
  subject: string;
}

export default function Revenue(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSite, setSelectedSite] = useState<string>('RO');
  const [activeTab, setActiveTab] = useState<'progress' | 'targets' | 'comparatifs'>('progress');
  const [emailReportData, setEmailReportData] = useState<ReportData | null>(null);
  const [showEmailReportModal, setShowEmailReportModal] = useState<boolean>(false);
  const [clientTypeView, setClientTypeView] = useState<'service' | 'clientType'>('service');
  const [viewType, setViewType] = useState<'canet' | 'hours' | 'capr' | 'pr'>('canet');
  const [comparatifsViewType, setComparatifsViewType] = useState<'caapv' | 'capr'>('caapv');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [periodType, setPeriodType] = useState<'monthly' | 'yearly'>('monthly');
  const [chartType, setChartType] = useState<'bar' | 'monthly'>('bar');
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [activeTab]);

  // Utiliser directement les objectifs définis dans l'onglet Objectifs
  const targets = {
    mechanical: mockData.departments.mechanical.revenueTarget,
    quickService: mockData.departments.quickService.revenueTarget,
    bodywork: mockData.departments.bodywork.revenueTarget
  };
  
  const data = {
    departments: {
      mechanical: { ...mockData.departments.mechanical, revenueTarget: targets.mechanical },
      quickService: { ...mockData.departments.quickService, revenueTarget: targets.quickService },
      bodywork: { ...mockData.departments.bodywork, revenueTarget: targets.bodywork }
    }
  };

  // État pour la vue sélectionnée
  const totalTarget = targets.mechanical + targets.quickService + targets.bodywork;

  // Objectifs CA/H par service
  const revenuePerHourTargets: RevenuePerHourTargets = {
    global: 300,
    mechanical: 220,
    quickService: 265,
    bodywork: 419
  };

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

  const getClientTypeChartData = () => generateClientTypeData(viewType === 'pr' ? 'pr' : 'apv');

  // Fonction pour obtenir les données filtrées du graphique
  const getFilteredChartData = (): ChartDataItem[] => {
    if (comparatifsViewType === 'capr') {
      // Données pour CA PR avec tous les services
      const baseData: Record<string, { base: number; variation: number }> = {
        mechanical: { base: 650, variation: 0.1 },
        quickService: { base: 720, variation: 0.15 },
        bodywork: { base: 290, variation: 0.08 },
        magasin: { base: 180, variation: 0.12 },
        usineVO: { base: 220, variation: 0.09 },
        serviceVN: { base: 340, variation: 0.14 },
        serviceVO: { base: 280, variation: 0.11 }
      };

      const currentMonth = getCurrentMonth();
      const seasonalFactor = periodType === 'monthly' ? getSeasonalFactor(currentMonth) : 1.0;
      
      return [
        {
          name: 'Mécanique',
          [selectedYear - 2]: Math.round(baseData.mechanical.base * (periodType === 'yearly' ? 12 : 1) * 1.8 * seasonalFactor * getYearFactor(selectedYear - 2)),
          [selectedYear - 1]: Math.round(baseData.mechanical.base * (periodType === 'yearly' ? 12 : 1) * 1.3 * seasonalFactor * getYearFactor(selectedYear - 1)),
          [selectedYear]: Math.round(baseData.mechanical.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
        },
        {
          name: 'Service Rapide',
          [selectedYear - 2]: Math.round(baseData.quickService.base * (periodType === 'yearly' ? 12 : 1) * 1.2 * seasonalFactor * getYearFactor(selectedYear - 2)),
          [selectedYear - 1]: Math.round(baseData.quickService.base * (periodType === 'yearly' ? 12 : 1) * 1.3 * seasonalFactor * getYearFactor(selectedYear - 1)),
          [selectedYear]: Math.round(baseData.quickService.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
        },
        {
          name: 'Carrosserie',
          [selectedYear - 2]: Math.round(baseData.bodywork.base * (periodType === 'yearly' ? 12 : 1) * 1.4 * seasonalFactor * getYearFactor(selectedYear - 2)),
          [selectedYear - 1]: Math.round(baseData.bodywork.base * (periodType === 'yearly' ? 12 : 1) * 1.3 * seasonalFactor * getYearFactor(selectedYear - 1)),
          [selectedYear]: Math.round(baseData.bodywork.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
        },
        {
          name: 'Magasin',
          [selectedYear - 2]: Math.round(baseData.magasin.base * (periodType === 'yearly' ? 12 : 1) * 1.6 * seasonalFactor * getYearFactor(selectedYear - 2)),
          [selectedYear - 1]: Math.round(baseData.magasin.base * (periodType === 'yearly' ? 12 : 1) * 1.4 * seasonalFactor * getYearFactor(selectedYear - 1)),
          [selectedYear]: Math.round(baseData.magasin.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
        },
        {
          name: 'Usine VO',
          [selectedYear - 2]: Math.round(baseData.usineVO.base * (periodType === 'yearly' ? 12 : 1) * 1.5 * seasonalFactor * getYearFactor(selectedYear - 2)),
          [selectedYear - 1]: Math.round(baseData.usineVO.base * (periodType === 'yearly' ? 12 : 1) * 1.2 * seasonalFactor * getYearFactor(selectedYear - 1)),
          [selectedYear]: Math.round(baseData.usineVO.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
        },
        {
          name: 'Service VN',
          [selectedYear - 2]: Math.round(baseData.serviceVN.base * (periodType === 'yearly' ? 12 : 1) * 1.7 * seasonalFactor * getYearFactor(selectedYear - 2)),
          [selectedYear - 1]: Math.round(baseData.serviceVN.base * (periodType === 'yearly' ? 12 : 1) * 1.4 * seasonalFactor * getYearFactor(selectedYear - 1)),
          [selectedYear]: Math.round(baseData.serviceVN.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
        },
        {
          name: 'Service VO',
          [selectedYear - 2]: Math.round(baseData.serviceVO.base * (periodType === 'yearly' ? 12 : 1) * 1.3 * seasonalFactor * getYearFactor(selectedYear - 2)),
          [selectedYear - 1]: Math.round(baseData.serviceVO.base * (periodType === 'yearly' ? 12 : 1) * 1.1 * seasonalFactor * getYearFactor(selectedYear - 1)),
          [selectedYear]: Math.round(baseData.serviceVO.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
        }
      ];
    } else {
      // Données pour CA APV (services originaux seulement)
      const baseData: Record<string, { base: number; variation: number }> = {
        mechanical: { base: 650, variation: 0.1 },
        quickService: { base: 720, variation: 0.15 },
        bodywork: { base: 290, variation: 0.08 }
      };

      const currentMonth = getCurrentMonth();
      const seasonalFactor = periodType === 'monthly' ? getSeasonalFactor(currentMonth) : 1.0;
      
      return [
        {
          name: 'Mécanique',
          [selectedYear - 2]: Math.round(baseData.mechanical.base * (periodType === 'yearly' ? 12 : 1) * 1.8 * seasonalFactor * getYearFactor(selectedYear - 2)),
          [selectedYear - 1]: Math.round(baseData.mechanical.base * (periodType === 'yearly' ? 12 : 1) * 1.3 * seasonalFactor * getYearFactor(selectedYear - 1)),
          [selectedYear]: Math.round(baseData.mechanical.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
        },
        {
          name: 'Service Rapide',
          [selectedYear - 2]: Math.round(baseData.quickService.base * (periodType === 'yearly' ? 12 : 1) * 1.2 * seasonalFactor * getYearFactor(selectedYear - 2)),
          [selectedYear - 1]: Math.round(baseData.quickService.base * (periodType === 'yearly' ? 12 : 1) * 1.3 * seasonalFactor * getYearFactor(selectedYear - 1)),
          [selectedYear]: Math.round(baseData.quickService.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
        },
        {
          name: 'Carrosserie',
          [selectedYear - 2]: Math.round(baseData.bodywork.base * (periodType === 'yearly' ? 12 : 1) * 1.4 * seasonalFactor * getYearFactor(selectedYear - 2)),
          [selectedYear - 1]: Math.round(baseData.bodywork.base * (periodType === 'yearly' ? 12 : 1) * 1.3 * seasonalFactor * getYearFactor(selectedYear - 1)),
          [selectedYear]: Math.round(baseData.bodywork.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
        }
      ];
    }
  };

  // Fonction pour obtenir le facteur saisonnier
  const getSeasonalFactor = (month: string): number => {
    const seasonalFactors: Record<string, number> = {
      '01': 0.9, '02': 0.95, '03': 1.1, '04': 1.0, '05': 1.05, '06': 1.0,
      '07': 0.8, '08': 0.7, '09': 1.15, '10': 1.2, '11': 1.1, '12': 0.95
    };
    return seasonalFactors[month] || 1.0;
  };

  // Obtenir le mois en cours
  const getCurrentMonth = (): string => {
    const currentDate = new Date();
    return String(currentDate.getMonth() + 1).padStart(2, '0');
  };

  // Fonction pour obtenir le facteur d'année (évolution dans le temps)
  const getYearFactor = (year: number): number => {
    // Facteur d'évolution basé sur l'année (croissance/décroissance)
    const baseYear = 2025;
    const yearDiff = year - baseYear;
    
    // Simulation d'une croissance de 3% par an
    return Math.pow(1.03, yearDiff);
  };

  // Fonction pour obtenir les données mensuelles détaillées (nuages de points)
  const getMonthlyDetailData = (): MonthlyDetailData[] => {
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
      'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    
    const data: MonthlyDetailData[] = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-based (0 = janvier, 7 = août)
    const currentYear = currentDate.getFullYear();
    
    months.forEach((month, index) => {
      // Pour 2025, s'arrêter au mois précédent le mois en cours
      const shouldInclude2025 = selectedYear !== currentYear || index < currentMonth;
      
      // Facteur saisonnier
      const seasonalFactor = getSeasonalFactor(String(index + 1).padStart(2, '0'));
      
      // Données pour chaque année
      const baseValue = 650; // Valeur de base pour le CA NET
      
      data.push({
        month,
        monthIndex: index + 1,
        2023: Math.round(baseValue * 0.85 * seasonalFactor * getYearFactor(2023)),
        2024: Math.round(baseValue * 0.92 * seasonalFactor * getYearFactor(2024)),
        2025: shouldInclude2025 ? Math.round(baseValue * seasonalFactor * getYearFactor(2025)) : null
      });
    });
    
    return data;
  };

  // Fonction pour obtenir le nom du mois
  const getMonthName = (monthNumber: string): string => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[parseInt(monthNumber) - 1];
  };

  // Calculate total revenue and target for widgets
  const totalRevenue = Object.values(data.departments).reduce((sum, dept) => sum + dept.revenue, 0);
  const totalRevenueTarget = Object.values(data.departments).reduce((sum, dept) => sum + dept.revenueTarget, 0);

  return (
    <div className="p-4 sm:p-6">
      <div ref={contentRef} className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <DateSelector 
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <EmailReportButton onClick={handleGenerateEmailReport} />
          <SiteSelector
            selectedSite={selectedSite}
            onChange={setSelectedSite}
          />
        </div>
      </div>

      {/* Onglets */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex justify-center">
          <nav className="inline-flex bg-gray-100 rounded-xl p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('progress')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'progress'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Avancement</span>
              {activeTab === 'progress' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('targets')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'targets'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Objectifs</span>
              {activeTab === 'targets' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('comparatifs')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'comparatifs'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Comparatifs</span>
              {activeTab === 'comparatifs' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      <div className="space-y-6 no-print">
        {activeTab === 'progress' ? (
          <>
            <RevenueDetails data={data.departments} viewType={viewType} setViewType={setViewType} />
            <PreviousDayBilling data={data.departments} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueDistributionChart 
                data={data.departments} 
                clientTypeView="service"
                onClientTypeViewChange={null}
                getClientTypeChartData={getClientTypeChartData}
              />
              <RevenueDistributionChart 
                data={data.departments} 
                clientTypeView="clientType"
                onClientTypeViewChange={null}
                getClientTypeChartData={getClientTypeChartData}
              />
            </div>
          </>
        ) : activeTab === 'targets' ? (
          <div className="space-y-6">
            {/* Objectifs CA APV du mois */}
            <Card>
              <CardHeader title="Objectifs CA APV du mois" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Global</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(Math.round(totalRevenueTarget * 0.7))}€
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Mécanique</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(Math.round(targets.mechanical * 0.7))}€
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Service Rapide</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(Math.round(targets.quickService * 0.7))}€
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Carrosserie</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(Math.round(targets.bodywork * 0.7))}€
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Objectifs CA PR du mois */}
            <Card>
              <CardHeader title="Objectifs CA PR du mois" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Global</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(totalRevenueTarget)}€
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Mécanique</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(targets.mechanical)}€
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Service Rapide</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(targets.quickService)}€
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Carrosserie</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(targets.bodywork)}€
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Objectifs CA/HT par service */}
            <Card>
              <CardHeader title="Objectifs CA/HT par service" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Global</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(revenuePerHourTargets.global)}€/h
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Mécanique</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(revenuePerHourTargets.mechanical)}€/h
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Service Rapide</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(revenuePerHourTargets.quickService)}€/h
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Carrosserie</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatNumber(revenuePerHourTargets.bodywork)}€/h
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : activeTab === 'comparatifs' ? (
          // Onglet Comparatifs
          <div className="space-y-6">
          <div className="flex justify-start items-center mb-6">
            <div className="flex items-center">
              <div className="inline-flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1.5 shadow-lg border border-gray-300 min-w-[280px]">
                <button
                  onClick={() => setComparatifsViewType('caapv')}
                  className={`relative px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out transform ${
                    comparatifsViewType === 'caapv'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-opacity-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-base font-bold">CA APV</span>
                  </span>
                  {comparatifsViewType === 'caapv' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl opacity-20 animate-pulse"></div>
                  )}
                </button>
                <button
                  onClick={() => setComparatifsViewType('capr')}
                  className={`relative px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out transform ${
                    comparatifsViewType === 'capr'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105 ring-2 ring-purple-300 ring-opacity-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-base font-bold">CA PR</span>
                  </span>
                  {comparatifsViewType === 'capr' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl opacity-20 animate-pulse"></div>
                  )}
                </button>
              </div>
            </div>
          </div>

            {/* Graphique de comparaison par département et année */}
            <Card>
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900"></h3>
                </div>
              </div>
              <CardContent>
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">Période</span>
                      {chartType === 'bar' ? (
                        <select
                          value={periodType}
                          onChange={(e) => setPeriodType(e.target.value as 'monthly' | 'yearly')}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="monthly">Mensuel</option>
                          <option value="yearly">Annuel</option>
                        </select>
                      ) : (
                        <span className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                          Annuel
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">Vue</span>
                      <select
                        value={chartType}
                        onChange={(e) => {
                          setChartType(e.target.value as 'bar' | 'monthly');
                          if (e.target.value === 'monthly') {
                            setPeriodType('yearly');
                          }
                        }}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="bar">Comparaison</option>
                        <option value="monthly">Détail par mois</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Année</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${comparatifsViewType === 'caapv' ? 'bg-blue-900' : 'bg-purple-900'}`}></div>
                      <span className="text-sm">{chartType === 'monthly' ? '2023' : selectedYear - 2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${comparatifsViewType === 'caapv' ? 'bg-blue-600' : 'bg-purple-600'}`}></div>
                      <span className="text-sm">{chartType === 'monthly' ? '2024' : selectedYear - 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${comparatifsViewType === 'caapv' ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                      <span className="text-sm">{chartType === 'monthly' ? '2025' : selectedYear}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 text-center">
                  <h4 className="text-sm font-medium text-gray-700">
                    {chartType === 'bar' 
                      ? `Comparaison ${periodType === 'monthly' ? 'mensuelle' : 'annuelle'} - ${comparatifsViewType === 'caapv' ? 'CA APV' : 'CA PR'}`
                      : `Évolution mensuelle - ${comparatifsViewType === 'caapv' ? 'CA APV' : 'CA PR'}`}
                  </h4>
                </div>
                
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                      <BarChart
                        data={getFilteredChartData()}
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
                          tickFormatter={(value: number) => `${value}K`}
                          domain={[0, 1200]}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${formatNumber(value * (comparatifsViewType === 'caapv' ? 0.7 : 0.8))}K€`, name]}
                        />
                        <Legend />
                        <Bar dataKey={selectedYear - 2} name={`${selectedYear - 2}`} fill={comparatifsViewType === 'caapv' ? "#1e3a8a" : "#7c2d92"} barSize={60}>
                          <LabelList
                            dataKey={selectedYear - 2}
                            position="top"
                            formatter={(value: number) => `${formatNumber(value * (comparatifsViewType === 'caapv' ? 0.7 : 0.8))}K€`}
                            style={{ fontSize: '12px', fill: comparatifsViewType === 'caapv' ? '#1e3a8a' : '#7c2d92', fontWeight: 'bold' }}
                          />
                        </Bar>
                        <Bar dataKey={selectedYear - 1} name={`${selectedYear - 1}`} fill={comparatifsViewType === 'caapv' ? "#3b82f6" : "#a855f7"} barSize={60}>
                          <LabelList
                            dataKey={selectedYear - 1}
                            position="top"
                            formatter={(value: number) => `${formatNumber(value * (comparatifsViewType === 'caapv' ? 0.7 : 0.8))}K€`}
                            style={{ fontSize: '12px', fill: comparatifsViewType === 'caapv' ? '#3b82f6' : '#9333ea', fontWeight: 'bold' }}
                          />
                        </Bar>
                        <Bar dataKey={selectedYear} name={`${selectedYear}`} fill={comparatifsViewType === 'caapv' ? "#93c5fd" : "#c4b5fd"} barSize={60}>
                          <LabelList
                            dataKey={selectedYear}
                            position="top"
                            formatter={(value: number) => `${formatNumber(value * (comparatifsViewType === 'caapv' ? 0.7 : 0.8))}K€`}
                            style={{ fontSize: '12px', fill: comparatifsViewType === 'caapv' ? '#93c5fd' : '#a855f7', fontWeight: 'bold' }}
                          />
                        </Bar>
                      </BarChart>
                    ) : (
                      <LineChart
                        data={getMonthlyDetailData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
                        <XAxis 
                          dataKey="month"
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={{ stroke: '#d1d5db' }}
                          tickLine={{ stroke: '#d1d5db' }}
                        />
                        <YAxis 
                          tickFormatter={(value: number) => `${value}K€`}
                          domain={[0, 'auto']}
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={{ stroke: '#d1d5db' }}
                          tickLine={{ stroke: '#d1d5db' }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${formatNumber(value)}K€`, name]}
                          labelFormatter={(label: string) => `Mois: ${label}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                          }}
                          labelStyle={{ color: '#374151', fontWeight: '600' }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }}
                          iconType="line"
                        />
                        <Line
                          type="monotone"
                          dataKey="2023" 
                          name="2023" 
                          stroke={comparatifsViewType === 'caapv' ? "#1e3a8a" : "#9333ea"}
                          strokeWidth={3}
                          dot={{ r: 5, fill: comparatifsViewType === 'caapv' ? "#1e3a8a" : "#9333ea", strokeWidth: 2, stroke: "#ffffff" }}
                          activeDot={{ r: 7, fill: comparatifsViewType === 'caapv' ? "#1e3a8a" : "#9333ea", strokeWidth: 2, stroke: "#ffffff" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="2024" 
                          name="2024" 
                          stroke={comparatifsViewType === 'caapv' ? "#3b82f6" : "#9333ea"}
                          strokeWidth={3}
                          dot={{ r: 5, fill: comparatifsViewType === 'caapv' ? "#3b82f6" : "#9333ea", strokeWidth: 2, stroke: "#ffffff" }}
                          activeDot={{ r: 7, fill: comparatifsViewType === 'caapv' ? "#3b82f6" : "#9333ea", strokeWidth: 2, stroke: "#ffffff" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="2025" 
                          name="2025" 
                          stroke={comparatifsViewType === 'caapv' ? "#93c5fd" : "#a855f7"}
                          strokeWidth={3}
                          dot={{ r: 5, fill: comparatifsViewType === 'caapv' ? "#93c5fd" : "#a855f7", strokeWidth: 2, stroke: "#ffffff" }}
                          activeDot={{ r: 7, fill: comparatifsViewType === 'caapv' ? "#93c5fd" : "#a855f7", strokeWidth: 2, stroke: "#ffffff" }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
                
                {/* Titre dynamique et affichage des valeurs en dessous du graphique */}
                <div className="mt-6 mb-4 text-center">
                </div>
                
                {/* Affichage conditionnel selon le type de graphique */}
                {chartType === 'bar' ? (
                  // Comparaison mois en cours : affichage par service
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {getFilteredChartData().map((item, index) => {
                      // Ajuster les valeurs selon le type sélectionné (CA APV ou CA PR)
                      const adjustmentFactor = comparatifsViewType === 'caapv' ? 0.7 : 0.8;
                      const adjustedItem = {
                        ...item,
                        [selectedYear - 2]: Math.round(item[selectedYear - 2] * adjustmentFactor),
                        [selectedYear - 1]: Math.round(item[selectedYear - 1] * adjustmentFactor),
                        [selectedYear]: Math.round(item[selectedYear] * adjustmentFactor)
                      };
                      
                      return (
                      <div key={item.name} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">{item.name}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{selectedYear - 2}:</span>
                            <span className={`text-sm font-semibold ${comparatifsViewType === 'caapv' ? 'text-blue-900' : 'text-purple-900'}`}>{formatNumber(adjustedItem[selectedYear - 2])}K€</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{selectedYear - 1}:</span>
                            <span className={`text-sm font-semibold ${comparatifsViewType === 'caapv' ? 'text-blue-600' : 'text-purple-600'}`}>{formatNumber(adjustedItem[selectedYear - 1])}K€</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{selectedYear}:</span>
                            <span className={`text-sm font-semibold ${comparatifsViewType === 'caapv' ? 'text-blue-400' : 'text-purple-400'}`}>{formatNumber(adjustedItem[selectedYear])}K€</span>
                          </div>
                          
                          {/* Indicateur visuel de progression */}
                          <div className="mt-3 pt-2 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">Évolution:</span>
                              <span className={`text-xs font-medium ${
                                adjustedItem[selectedYear] > adjustedItem[selectedYear - 1] ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {adjustedItem[selectedYear] > adjustedItem[selectedYear - 1] ? '+' : ''}{Math.round(((adjustedItem[selectedYear] - adjustedItem[selectedYear - 1]) / adjustedItem[selectedYear - 1]) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  adjustedItem[selectedYear] > adjustedItem[selectedYear - 1] ? 'bg-green-500' : 'bg-red-500'
                                }`}
                                style={{ 
                                  width: `${Math.min(Math.abs(((adjustedItem[selectedYear] - adjustedItem[selectedYear - 1]) / adjustedItem[selectedYear - 1]) * 100), 100)}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  // Détail par mois : affichage mensuel
                  <div className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {getMonthlyDetailData().map((month, index) => {
                        // Ajuster les valeurs selon le type sélectionné (CA APV ou CA PR)
                        const adjustmentFactor = comparatifsViewType === 'caapv' ? 0.7 : 0.8;
                        const adjustedMonth = {
                          ...month,
                          2023: Math.round(month[2023] * adjustmentFactor),
                          2024: Math.round(month[2024] * adjustmentFactor),
                          2025: month[2025] ? Math.round(month[2025] * adjustmentFactor) : null
                        };
                        
                        return (
                        <div key={month.month} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <h5 className="text-sm font-medium text-gray-800 mb-3 text-center">{month.month}</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">2023:</span>
                              <span className={`text-sm font-semibold ${comparatifsViewType === 'caapv' ? 'text-blue-900' : 'text-purple-900'}`}>{formatNumber(adjustedMonth[2023])}K€</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">2024:</span>
                              <span className={`text-sm font-semibold ${comparatifsViewType === 'caapv' ? 'text-blue-600' : 'text-purple-600'}`}>{formatNumber(adjustedMonth[2024])}K€</span>
                            </div>
                            {adjustedMonth[2025] && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">2025:</span>
                                <span className={`text-sm font-semibold ${comparatifsViewType === 'caapv' ? 'text-blue-400' : 'text-purple-400'}`}>{formatNumber(adjustedMonth[2025])}K€</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Indicateur visuel de progression */}
                          {adjustedMonth[2025] && (
                            <div className="mt-3 pt-2 border-t border-gray-100">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500">Évolution:</span>
                                <span className={`text-xs font-medium ${
                                  adjustedMonth[2025] > adjustedMonth[2024] ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {adjustedMonth[2025] > adjustedMonth[2024] ? '+' : ''}{Math.round(((adjustedMonth[2025] - adjustedMonth[2024]) / adjustedMonth[2024]) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    adjustedMonth[2025] > adjustedMonth[2024] ? 'bg-green-500' : 'bg-red-500'
                                  }`}
                                  style={{ 
                                    width: `${Math.min(Math.abs(((adjustedMonth[2025] - adjustedMonth[2024]) / adjustedMonth[2024]) * 100), 100)}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>

      <div className="hidden print:block">
        <PrintableSummary data={mockData.departments} />
      </div>

      {/* Modal pour le rapport par email */}
      <EmailReportModal
        isOpen={showEmailReportModal}
        onClose={() => setShowEmailReportModal(false)}
        reportData={emailReportData}
      />
    </div>
  );
}