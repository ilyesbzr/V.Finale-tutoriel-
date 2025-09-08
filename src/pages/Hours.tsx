import React, { useState, useEffect, useRef } from 'react';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import { formatNumber } from '../utils/formatters';
import { getCurrentMonthProgress } from '../utils/dateCalculations';
import { calculateProjection, calculateProjectedValue } from '../utils/helpers/progressHelpers';
import { PROGRESS_THRESHOLDS } from '../utils/constants/metrics';
import { mockData } from '../data/mockData';
import PrintButton from '../components/UI/PrintButton';
import EmailReportButton from '../components/UI/EmailReportButton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useDateContext } from '../contexts/DateContext';

interface BillingProgressData {
  name: string;
  actual: number;
  target: number;
  projection: string;
  objectifJour: string;
  remaining: string;
  percentage: number;
}

interface DossierData {
  or: string;
  client: string;
}

interface DossiersEnCoursData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface ModalData {
  service: string;
  dossiers: DossierData[];
}

export default function Hours(): JSX.Element {
  const { selectedDate, updateDate } = useDateContext();
  const [selectedSite, setSelectedSite] = useState<string>('RO');
  const [activeTab, setActiveTab] = useState<'avancement' | 'objectifs'>('avancement');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('previous');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [animatedValues, setAnimatedValues] = useState<{
    distributionValues: number[];
  }>({
    distributionValues: [0, 0, 0]
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const { t } = useTranslation();
  
  // Fonction pour afficher la popup des dossiers
  const handleShowDossiers = (item: DossiersEnCoursData): void => {
    // Générer des noms de clients français réalistes
    const generateClientNames = (count: number): DossierData[] => {
      const prenoms = ['Sophie', 'Pierre', 'Marie', 'Jean', 'Anne', 'Paul', 'Claire', 'Michel', 'Isabelle', 'David', 'Catherine', 'Philippe', 'Nathalie', 'Alain', 'Sylvie', 'François', 'Martine', 'Bernard', 'Monique', 'Daniel', 'Nicole', 'Christian', 'Françoise', 'Patrick', 'Chantal', 'André', 'Brigitte', 'Jacques', 'Véronique', 'Laurent', 'Sandrine', 'Thierry', 'Valérie', 'Olivier', 'Corinne', 'Stéphane', 'Céline', 'Pascal', 'Karine', 'Frédéric'];
      const noms = ['MARTIN', 'BERNARD', 'THOMAS', 'PETIT', 'ROBERT', 'RICHARD', 'DURAND', 'DUBOIS', 'MOREAU', 'LAURENT', 'SIMON', 'MICHEL', 'LEFEBVRE', 'LEROY', 'ROUX', 'DAVID', 'BERTRAND', 'MOREL', 'FOURNIER', 'GIRARD', 'BONNET', 'DUPONT', 'LAMBERT', 'FONTAINE', 'ROUSSEAU', 'VINCENT', 'MULLER', 'LEFEVRE', 'FAURE', 'ANDRE', 'MERCIER', 'BLANC', 'GUERIN', 'BOYER', 'GARNIER', 'CHEVALIER', 'FRANCOIS', 'LEGRAND', 'GAUTHIER', 'GARCIA'];
      
      const clients: DossierData[] = [];
      for (let i = 0; i < count; i++) {
        const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
        const nom = noms[Math.floor(Math.random() * noms.length)];
        const orNumber = String(i + 1).padStart(3, '0');
        clients.push({
          or: `OR-2025-${orNumber}`,
          client: `${nom} ${prenom}`
        });
      }
      return clients;
    };

    const dossiersByService: Record<string, DossierData[]> = {
      'GLOBAL': generateClientNames(87),
      'Mécanique': generateClientNames(40),
      'Service Rapide': generateClientNames(25),
      'Carrosserie': generateClientNames(22)
    };
    
    setModalData({
      service: item.name,
      dossiers: dossiersByService[item.name] || []
    });
    setShowModal(true);
  };
  
  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Animation effect for distribution values
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        distributionValues: distributionData.map(item => item.value)
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Objectifs pour chaque service
  const targets = {
    mechanical: 735,
    quickService: 546,
    bodywork: 203
  };
  
  // Données pour l'affichage
  const data = {
    mechanical: {
      hoursSold: 59,
      hoursTarget: targets.mechanical,
      progress: Math.round((59 / targets.mechanical) * 100),
      previousDayBilling: 15.40,
      dailyStaff: 5
    },
    quickService: {
      hoursSold: 109,
      hoursTarget: targets.quickService,
      progress: Math.round((109 / targets.quickService) * 100),
      previousDayBilling: 27.90,
      dailyStaff: 3
    },
    bodywork: {
      hoursSold: 32,
      hoursTarget: targets.bodywork,
      progress: Math.round((32 / targets.bodywork) * 100),
      previousDayBilling: 8.20,
      dailyStaff: 4
    }
  };
  
  // Calcul des totaux
  const totalHoursSold = data.mechanical.hoursSold + data.quickService.hoursSold + data.bodywork.hoursSold;
  const totalHoursTarget = data.mechanical.hoursTarget + data.quickService.hoursTarget + data.bodywork.hoursTarget;
  const totalRevenue = mockData.departments.mechanical.revenue + mockData.departments.quickService.revenue + mockData.departments.bodywork.revenue;
  
  // Obtenir la progression du mois actuel
  const monthProgress = getCurrentMonthProgress(new Date());
  
  // Calcul des projections
  const hoursProjection = calculateProjection(totalHoursSold, totalHoursTarget, monthProgress);
  
  // Calcul des valeurs projetées
  const projectedHours = calculateProjectedValue(totalHoursSold, monthProgress);
  
  // Calcul des restes à faire
  const hoursRemaining = totalHoursTarget - totalHoursSold;
  
  // Calcul des objectifs du jour
  const daysInMonth = 21; // Nombre de jours ouvrés dans le mois
  const dailyHoursTarget = Math.round(hoursRemaining / Math.max(1, daysInMonth - Math.round(daysInMonth * monthProgress / 100)));
  
  // Données pour l'effectif présent
  const staffData = [
    { service: 'Mécanique', presence: 5, potential: 35 },
    { service: 'Service Rapide', presence: 3, potential: 21 },
    { service: 'Carrosserie', presence: 4, potential: 28 },
    { service: 'Total :', presence: 12, potential: 84 }
  ];

  // Données pour le potentiel de facturation
  const potentialData = {
    total: { potential: 77, realized: 38, delay: 39 },
    mechanical: { potential: 32, realized: 16, delay: 16 },
    quickService: { potential: 21, realized: 13, delay: 8 },
    bodywork: { potential: 25, realized: 10, delay: 15 }
  };

  // Données pour la répartition des heures facturées
  const distributionData = [
    { name: 'Mécanique', value: 60, percentage: 30, color: '#2563eb' },
    { name: 'Service Rapide', value: 110, percentage: 55, color: '#16a34a' },
    { name: 'Carrosserie', value: 30, percentage: 15, color: '#9333ea' }
  ];

  // Données pour les heures en cours
  const dossiersEnCoursData: DossiersEnCoursData[] = [
    { name: 'GLOBAL', value: 87, percentage: 100, color: '#3b82f6' },
    { name: 'Mécanique', value: 40, percentage: 46, color: '#3b82f6' },
    { name: 'Service Rapide', value: 25, percentage: 29, color: '#22c55e' },
    { name: 'Carrosserie', value: 22, percentage: 25, color: '#a855f7' }
  ];

  // Données pour le graphique de potentiel de facturation
  const potentialChartData = [
    {
      name: 'Total',
      potential: 77,
      realized: 38,
      delay: 39
    },
    {
      name: 'Mécanique',
      potential: 32,
      realized: 16,
      delay: 16
    },
    {
      name: 'Service Rapide',
      potential: 21,
      realized: 13,
      delay: 8
    },
    {
      name: 'Carrosserie',
      potential: 25,
      realized: 10,
      delay: 15
    }
  ];

  const COLORS = ['#2563eb', '#16a34a', '#9333ea'];

  // Facturation J-1 data
  const j1Data = [
    { name: 'Total HT', value: 52, color: '#4f46e5' },
    { name: 'Mécanique', value: 15, color: '#3b82f6' },
    { name: 'Service Rapide', value: 28, color: '#22c55e' },
    { name: 'Carrosserie', value: 8, color: '#a855f7' }
  ];

  // Avancement des heures facturées
  const billingProgressData: BillingProgressData[] = [
    {
      name: 'Total HT',
      actual: 200,
      target: 1488,
      projection: '30% → 444h',
      objectifJour: '56h',
      remaining: '1288h',
      percentage: 13
    },
    {
      name: 'Mécanique',
      actual: 59,
      target: 735,
      projection: '19% → 131h',
      objectifJour: '45h',
      remaining: '676h',
      percentage: 8
    },
    {
      name: 'Service Rapide',
      actual: 109,
      target: 546,
      projection: '44% → 242h',
      objectifJour: '29h',
      remaining: '437h',
      percentage: 20
    },
    {
      name: 'Carrosserie',
      actual: 32,
      target: 203,
      projection: '35% → 71h',
      objectifJour: '11h',
      remaining: '171h',
      percentage: 16
    }
  ];

  const getProgressTextColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">
            {formatNumber(payload[0].value)}h ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const handleGenerateEmailReport = (): void => {
    // Logic for generating email report
    console.log('Generating email report...');
  };

  const TargetsCard = ({ title, data }: { title: string; data: any }) => {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <div className="space-y-4">
            {billingProgressData.map((item) => (
            <div key={item.name} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1">
                  <span className="text-xl font-semibold text-gray-900">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-gray-900">
                    {formatNumber(item.actual)}h
                  </span>
                  <span className="ml-2 text-sm text-gray-500 font-medium">
                    / {formatNumber(item.target)}h
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${getProgressTextColor(item.percentage)}`}>
                  {t('common.projection')} : {item.projection}
                </span>
                <span className="text-sm font-semibold text-gray-600">
                  {item.percentage}% de l'objectif
                </span>
              </div>
              
              <div className="relative pt-2">
                <div className="progress-modern h-4">
                  <div
                    className={`progress-fill-modern h-full ${getProgressBarColor(item.percentage).includes('green') ? 'progress-fill-success' : getProgressBarColor(item.percentage).includes('yellow') ? 'progress-fill-warning' : 'progress-fill-error'}`}
                    style={{ 
                      width: isVisible ? `${Math.min(item.percentage, 100)}%` : '0%',
                    }}
                  />
                </div>
                
                <div className="flex justify-between mt-4">
                  <span className="text-md text-gray-600 font-medium">
                    {t('hours.dailyTarget')} : {item.objectifJour}
                  </span>
                  <span className="text-md text-gray-600 font-medium">
                    {t('hours.remainingToTarget')} : {item.remaining}
                  </span>
                </div>
              </div>
            </div>
            ))}
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    {key === 'mechanical' ? 'Mécanique' :
                     key === 'quickService' ? 'Service Rapide' :
                     'Carrosserie'}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatNumber(value as number)}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const dossiersByService: Record<string, DossierData[]> = {
    'GLOBAL': [
      { or: 'OR-2025-001', client: 'MARTIN Sophie' },
      { or: 'OR-2025-002', client: 'DUBOIS Pierre' },
      { or: 'OR-2025-003', client: 'BERNARD Marie' },
      { or: 'OR-2025-004', client: 'MOREAU Jean' },
      { or: 'OR-2025-005', client: 'PETIT Anne' }
    ],
    'Mécanique': [
      { or: 'OR-2025-001', client: 'MARTIN Sophie' },
      { or: 'OR-2025-006', client: 'GARCIA Luis' },
      { or: 'OR-2025-007', client: 'RODRIGUEZ Maria' }
    ],
    'Service Rapide': [
      { or: 'OR-2025-002', client: 'DUBOIS Pierre' },
      { or: 'OR-2025-008', client: 'WILSON John' },
      { or: 'OR-2025-009', client: 'BROWN Sarah' }
    ],
    'Carrosserie': [
      { or: 'OR-2025-003', client: 'BERNARD Marie' },
      { or: 'OR-2025-010', client: 'DAVIS Michael' }
    ]
  };

  return (
    <div className="relative">
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <DateSelector />
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
              onClick={() => setActiveTab('avancement')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'avancement'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Avancement</span>
              {activeTab === 'avancement' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('objectifs')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'objectifs'
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
              {activeTab === 'objectifs' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'avancement' ? (
        <div className="space-y-6">
          {/* Avancement des heures facturées */}
          <Card>
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-900">Avancement des heures facturées</h3>
            </div>
            <CardContent>
              <div className="space-y-6">
                {billingProgressData.map((item) => (
                  <div key={item.name} className="metric-card-modern p-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex-1">
                        <span className="text-2xl font-semibold text-gray-900">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatNumber(item.actual)}h
                        </span>
                        <span className="ml-2 text-lg text-gray-500 font-medium">
                          / {formatNumber(item.target)}h
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-lg font-medium ${getProgressTextColor(item.percentage)}`}>
                        {t('common.projection')} : {item.projection}
                      </span>
                      <span className="text-lg font-semibold text-gray-600">
                        {item.percentage}% de l'objectif
                      </span>
                    </div>
                    
                    <div className="relative pt-2">
                      <div className="progress-modern h-4">
                        <div
                          className={`progress-fill-modern h-full ${getProgressBarColor(item.percentage).includes('green') ? 'progress-fill-success' : getProgressBarColor(item.percentage).includes('yellow') ? 'progress-fill-warning' : 'progress-fill-error'}`}
                          style={{ 
                            width: isVisible ? `${Math.min(item.percentage, 100)}%` : '0%',
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <span className="text-md text-gray-600 font-medium">
                          {t('hours.dailyTarget')} : {item.objectifJour}
                        </span>
                        <span className="text-md text-gray-600 font-medium">
                          {t('hours.remainingToTarget')} : {item.remaining}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Facturation J-1 */}
          <Card>
            <CardHeader title="Facturation J-1" />
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {j1Data.map((dept, index) => (
                  <div key={dept.name} className="flex flex-col items-center">
                    <div className="w-24 h-24 relative">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={dept.color}
                          strokeWidth="10"
                          strokeDasharray={`${Math.min((dept.value / 60) * 283, 283)} 283`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-semibold">{formatNumber(dept.value)}h</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-600">{dept.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition des heures facturées */}
            <Card>
              <CardHeader title="Répartition des heures facturées" />
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
                          const RADIAN = Math.PI / 180;
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <text
                              x={x}
                              y={y}
                              fill="white"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize={14}
                            >
                              {`${distributionData[index].percentage}%`}
                            </text>
                          );
                        }}
                        labelLine={false}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  {distributionData.map((item, index) => (
                    <div key={item.name} className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{formatNumber(animatedValues.distributionValues?.[index] || 0)}h</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Heures en cours */}
            <Card className="relative">
              <CardHeader title="Dossiers en cours" />
              <CardContent>
                <div className="space-y-4">
                  {dossiersEnCoursData.map((item, index) => (
                    <div 
                      key={item.name} 
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 relative"
                      onClick={() => {
                        handleShowDossiers(item);
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-base font-medium text-gray-900">{item.name}</span>
                        <span className="text-lg font-semibold text-gray-900">{formatNumber(item.value)} dossiers</span>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ 
                              width: isVisible ? `${Math.min(item.percentage, 100)}%` : '0%',
                              backgroundColor: item.color
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{item.percentage}% Dossiers en cours</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              {/* Modal pour les dossiers en cours - positionnée sur la carte */}
              {showModal && modalData && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[90%] overflow-hidden m-4">
                    {/* Header avec gradient */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          📋 Dossiers en cours
                        </h3>
                        <button
                          onClick={() => setShowModal(false)}
                          className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/20 transition-all duration-200"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-blue-100 text-sm mt-1">{modalData.service}</p>
                    </div>
                    
                    {/* Contenu avec scroll */}
                    <div className="p-6 overflow-y-auto max-h-[350px] bg-gradient-to-b from-gray-50 to-white">
                      <div className="space-y-3">
                        {modalData.dossiers.map((dossier, index) => (
                          <div key={dossier.or} className="bg-white p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-base font-semibold text-blue-600">{dossier.or}</p>
                                <p className="text-base text-gray-700">{dossier.client}</p>
                              </div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{modalData.dossiers.length} dossier(s)</span>
                        <button 
                          onClick={() => setShowModal(false)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Objectifs HT APV du mois */}
          <Card>
            <CardHeader title="Objectifs HT APV du mois" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Global</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatNumber(totalHoursTarget)}h
                    </span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Mécanique</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatNumber(targets.mechanical)}h
                    </span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Service Rapide</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatNumber(targets.quickService)}h
                    </span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Carrosserie</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatNumber(targets.bodywork)}h
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

    </div>
    </div>
  );
}