import React, { useState, useEffect, useRef } from 'react';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import SalesCard from '../components/Sales/SalesCard';
import SalesTargets from '../components/Sales/SalesTargets';
import { mockData } from '../data/mockData';
import PrintButton from '../components/UI/PrintButton';
import EmailReportButton from '../components/UI/EmailReportButton';
import PrintableSummary from '../components/Dashboard/PrintableSummary';
import CCSDetailsView from '../components/Sales/CCSDetailsView';
import { useTranslation } from 'react-i18next';
import { UsersIcon } from '@heroicons/react/24/outline';
import { generateEmailReport } from '../utils/reportGenerator';
import EmailReportModal from '../components/UI/EmailReportModal';

export default function Crescendo() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSite, setSelectedSite] = useState('RO');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeView, setActiveView] = useState('global');
  const [emailReportData, setEmailReportData] = useState(null);
  const [showEmailReportModal, setShowEmailReportModal] = useState(false);

  // État pour le type de période
  const [periodType, setPeriodType] = useState('monthly');
  const contentRef = useRef(null);
  const { t } = useTranslation();

  // Nombre de collaborateurs par service
  const staffCounts = {
    mechanical: 2,
    quickService: 3,
    bodywork: 2
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateEmailReport = async () => {
    try {
      const reportData = await generateEmailReport(mockData, selectedDate, selectedSite);
      setEmailReportData(reportData);
      setShowEmailReportModal(true);
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      alert('Une erreur est survenue lors de la génération du rapport.');
    }
  };

  // Scroll to top when tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [activeTab, activeView]);

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
              onClick={() => setActiveTab('overview')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${activeTab === 'overview'
                ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
                }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </span>
              <span className="text-xl font-semibold">{t('crescendo.sales')}</span>
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('targets')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${activeTab === 'targets'
                ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
                }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="text-xl font-semibold">{t('crescendo.targets')}</span>
              {activeTab === 'targets' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="px-4 py-3 border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex justify-between items-center min-w-max">
            <h3 className="text-2xl font-semibold text-gray-900">
              {activeView === 'global' ? 'Ventes additionnelles par service' :
                activeView === 'targets' ? 'Suivi des objectifs par CCS' :
                  'Entrées + Chiffre d\'affaires par CCS'}
            </h3>
            <div className="inline-flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1.5 shadow-lg border border-gray-300">
              <button
                onClick={() => setActiveView('global')}
                className={`relative px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ease-in-out transform ${activeView === 'global'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-opacity-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                  }`}
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="text-base font-bold">Ventes par service</span>
                </span>
                {activeView === 'global' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl opacity-20 animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setActiveView('targets')}
                className={`relative px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ease-in-out transform ${activeView === 'targets'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-opacity-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                  }`}
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-base font-bold">Suivi des objectifs par CCS</span>
                </span>
                {activeView === 'targets' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl opacity-20 animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setActiveView('distribution')}
                className={`relative px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ease-in-out transform ${activeView === 'distribution'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 ring-opacity-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/70 hover:scale-102 hover:shadow-md'
                  }`}
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-base font-bold">Entrées + CA par CCS</span>
                </span>
                {activeView === 'distribution' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl opacity-20 animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 no-print">
        {activeTab === 'overview' ? (
          activeView === 'global' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SalesCard
                title={t('dashboard.mechanical')}
                data={mockData.sales.mechanical}
                staffCount={staffCounts.mechanical}
              />
              <SalesCard
                title={t('dashboard.quickService')}
                data={mockData.sales.quickService}
                staffCount={staffCounts.quickService}
              />
              <SalesCard
                title={t('dashboard.bodywork')}
                data={mockData.sales.bodywork}
                staffCount={staffCounts.bodywork}
              />
            </div>
          ) : activeView === 'targets' ? (
            <CCSDetailsView
              data={mockData.sales}
              viewMode="targets"
              periodType={periodType}
              setPeriodType={setPeriodType}
            />
          ) : (
            <CCSDetailsView
              data={mockData.sales}
              viewMode="entries-ca"
              periodType={periodType}
              setPeriodType={setPeriodType}
            />
          )
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium text-gray-900">Objectifs Mécanique</h3>
                <div className="flex items-center bg-indigo-50 px-2 py-0.5 rounded-full">
                  <UsersIcon className="h-3.5 w-3.5 text-indigo-600 mr-1" />
                  <span className="text-xs font-medium text-indigo-700">{staffCounts.mechanical}</span>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries({
                  'Pneus': mockData.sales.mechanical.tires.target,
                  'Amortisseurs': mockData.sales.mechanical.shockAbsorbers.target,
                  'Balais': mockData.sales.mechanical.wipers.target,
                  'Plaquettes': mockData.sales.mechanical.brakePads.target,
                  'Batteries': mockData.sales.mechanical.batteries.target,
                  'Disques': mockData.sales.mechanical.discs ? mockData.sales.mechanical.discs.target : 0,
                  'Pare-brise': mockData.sales.mechanical.windshields ? mockData.sales.mechanical.windshields.target : 0
                }).map(([name, value]) => (
                  <div key={name} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-gray-800">{name}</span>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900 w-12 text-right">
                          {value}
                        </span>
                        <span className="text-xs text-gray-500 ml-2 w-32 text-left">
                          - {Math.round(value / staffCounts.mechanical)} par collaborateur
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium text-gray-900">Objectifs Service Rapide</h3>
                <div className="flex items-center bg-indigo-50 px-2 py-0.5 rounded-full">
                  <UsersIcon className="h-3.5 w-3.5 text-indigo-600 mr-1" />
                  <span className="text-xs font-medium text-indigo-700">{staffCounts.quickService}</span>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries({
                  'Pneus': mockData.sales.quickService.tires.target,
                  'Amortisseurs': mockData.sales.quickService.shockAbsorbers.target,
                  'Balais': mockData.sales.quickService.wipers.target,
                  'Plaquettes': mockData.sales.quickService.brakePads.target,
                  'Batteries': mockData.sales.quickService.batteries.target,
                  'Disques': mockData.sales.quickService.discs ? mockData.sales.quickService.discs.target : 0,
                  'Pare-brise': mockData.sales.quickService.windshields ? mockData.sales.quickService.windshields.target : 0
                }).map(([name, value]) => (
                  <div key={name} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-gray-800">{name}</span>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900 w-12 text-right">
                          {value}
                        </span>
                        <span className="text-xs text-gray-500 ml-2 w-32 text-left">
                          - {Math.round(value / staffCounts.quickService)} par collaborateur
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium text-gray-900">Objectifs Carrosserie</h3>
                <div className="flex items-center bg-indigo-50 px-2 py-0.5 rounded-full">
                  <UsersIcon className="h-3.5 w-3.5 text-indigo-600 mr-1" />
                  <span className="text-xs font-medium text-indigo-700">{staffCounts.bodywork}</span>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries({
                  'Pneus': mockData.sales.bodywork.tires ? mockData.sales.bodywork.tires.target : 0,
                  'Amortisseurs': mockData.sales.bodywork.shockAbsorbers ? mockData.sales.bodywork.shockAbsorbers.target : 0,
                  'Balais': mockData.sales.bodywork.wipers ? mockData.sales.bodywork.wipers.target : 0,
                  'Plaquettes': mockData.sales.bodywork.brakePads ? mockData.sales.bodywork.brakePads.target : 0,
                  'Batteries': mockData.sales.bodywork.batteries ? mockData.sales.bodywork.batteries.target : 0,
                  'Disques': mockData.sales.bodywork.discs ? mockData.sales.bodywork.discs.target : 0,
                  'Pare-brise': mockData.sales.bodywork.windshields ? mockData.sales.bodywork.windshields.target : 15
                }).map(([name, value]) => (
                  <div key={name} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-gray-800">{name}</span>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900 w-12 text-right">
                          {value}
                        </span>
                        {value > 0 && (
                          <span className="text-xs text-gray-500 ml-2 w-32 text-left">
                            - {Math.round(value / staffCounts.bodywork)} par collaborateur
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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