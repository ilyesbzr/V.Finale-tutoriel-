import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import { mockData } from '../data/mockData';
import { formatNumber, formatCurrency } from '../utils/formatters';
import { getCurrentMonthProgress } from '../utils/dateCalculations';
import Button from '../components/UI/Button';
import { PrinterIcon } from '@heroicons/react/24/outline';

export default function PrintView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSite, setSelectedSite] = useState('RO');
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState('synthesis');
  
  // Calculate month progress
  const monthProgress = getCurrentMonthProgress(new Date());
  
  // Calculate totals from mockData
  const totalHoursSold = mockData.departments.mechanical.hoursSold + 
                        mockData.departments.quickService.hoursSold + 
                        mockData.departments.bodywork.hoursSold;
  const totalHoursTarget = mockData.departments.mechanical.hoursTarget + 
                          mockData.departments.quickService.hoursTarget + 
                          mockData.departments.bodywork.hoursTarget;
  const totalRevenue = mockData.departments.mechanical.revenue + 
                      mockData.departments.quickService.revenue + 
                      mockData.departments.bodywork.revenue;
  const totalRevenueTarget = mockData.departments.mechanical.revenueTarget + 
                            mockData.departments.quickService.revenueTarget + 
                            mockData.departments.bodywork.revenueTarget;
  
  // Calculate progress percentages
  const hoursProgress = Math.round((totalHoursSold / totalHoursTarget) * 100);
  const revenueProgress = Math.round((totalRevenue / totalRevenueTarget) * 100);
  
  // Calculate revenue per hour
  const revenuePerHour = totalHoursSold ? Math.round(totalRevenue / totalHoursSold) : 0;
  
  // Calculate HEC hours (70% of total)
  const hecHours = {
    mechanical: Math.round(mockData.departments.mechanical.hoursSold * 0.7),
    quickService: Math.round(mockData.departments.quickService.hoursSold * 0.7),
    bodywork: Math.round(mockData.departments.bodywork.hoursSold * 0.7)
  };
  
  const totalHECHours = hecHours.mechanical + hecHours.quickService + hecHours.bodywork;
  
  // Calculate HEC targets (70% of total targets)
  const hecTargets = {
    mechanical: Math.round(mockData.departments.mechanical.hoursTarget * 0.7),
    quickService: Math.round(mockData.departments.quickService.hoursTarget * 0.7),
    bodywork: Math.round(mockData.departments.bodywork.hoursTarget * 0.7)
  };
  
  const totalHECTarget = hecTargets.mechanical + hecTargets.quickService + hecTargets.bodywork;
  
  // Calculate net revenue (70% of total)
  const netRevenue = {
    mechanical: Math.round(mockData.departments.mechanical.revenue * 0.7),
    quickService: Math.round(mockData.departments.quickService.revenue * 0.7),
    bodywork: Math.round(mockData.departments.bodywork.revenue * 0.7)
  };
  
  const totalNetRevenue = netRevenue.mechanical + netRevenue.quickService + netRevenue.bodywork;
  
  // Calculate net revenue targets (70% of total targets)
  const netRevenueTargets = {
    mechanical: Math.round(mockData.departments.mechanical.revenueTarget * 0.7),
    quickService: Math.round(mockData.departments.quickService.revenueTarget * 0.7),
    bodywork: Math.round(mockData.departments.bodywork.revenueTarget * 0.7)
  };
  
  const totalNetRevenueTarget = netRevenueTargets.mechanical + netRevenueTargets.quickService + netRevenueTargets.bodywork;
  
  // Calculate revenue per HEC hour
  const revenuePerHECHour = totalHECHours ? Math.round(totalRevenue / totalHECHours) : 0;
  
  // Calculate VideoCheck metrics
  const videoCheckData = mockData.videoCheck;
  
  // Calculate Crescendo metrics
  const crescendoData = {
    mechanical: mockData.sales.mechanical,
    quickService: mockData.sales.quickService,
    bodywork: mockData.sales.bodywork
  };

  // Productivity data
  const productivityData = {
    mechanical: [
      { id: 1, name: 'CHAGNAUD Elliot', daysPresent: 5, billingPotential: 35, target: 35, billedHours: 32 },
      { id: 2, name: 'EYCHENNE Thibault', daysPresent: 5, billingPotential: 35, target: 30, billedHours: 27 }
    ],
    quickService: [
      { id: 3, name: 'FARES Celina', daysPresent: 5, billingPotential: 35, target: 35, billedHours: 38 },
      { id: 4, name: 'DE JESUS David', daysPresent: 5, billingPotential: 35, target: 35, billedHours: 36 }
    ],
    bodywork: [
      { id: 5, name: 'DUPONT Jean', daysPresent: 5, billingPotential: 35, target: 35, billedHours: 30 },
      { id: 6, name: 'MARTIN Pierre', daysPresent: 5, billingPotential: 35, target: 35, billedHours: 32 }
    ]
  };

  // Calculate service results
  const serviceResults = Object.entries(productivityData).map(([service, mechanics]) => {
    const totalTarget = mechanics.reduce((sum, m) => sum + m.target, 0);
    const totalActual = mechanics.reduce((sum, m) => sum + m.billedHours, 0);
    const completion = totalTarget ? Math.round((totalActual / totalTarget) * 100) : 0;

    return {
      service: service === 'mechanical' ? 'Mécanique' : 
               service === 'quickService' ? 'Service Rapide' : 
               'Carrosserie',
      target: totalTarget,
      actual: totalActual,
      completion
    };
  });
  
  const handlePrint = () => {
    setShowFilters(false);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setShowFilters(true);
      }, 500);
    }, 100);
  };

  return (
    <div className="p-6">
      {showFilters && (
        <div className="mb-6 flex flex-col gap-4 no-print">
          <div className="flex justify-between items-center">
            <DateSelector 
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            />
            <div className="flex items-center gap-4">
              <Button 
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <PrinterIcon className="h-5 w-5" />
                Imprimer
              </Button>
              <SiteSelector
                selectedSite={selectedSite}
                onChange={setSelectedSite}
              />
            </div>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('synthesis')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'synthesis'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Synthèse
              </button>
              <button
                onClick={() => setActiveTab('global')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'global'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Global
              </button>
              <button
                onClick={() => setActiveTab('productivity')}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'productivity'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Productivité
              </button>
            </nav>
          </div>
        </div>
      )}

      {activeTab === 'synthesis' && (
        <div className="space-y-8 print-container">
          {/* En-tête du rapport */}
          <div className="text-center mb-6 print-header">
            <h1 className="text-2xl font-bold text-gray-900">Synthèse - {selectedSite}</h1>
            <p className="text-gray-600">
              {selectedDate.toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Tableau de synthèse */}
          <Card className="print-friendly">
            <CardHeader title="Tableau de bord synthétique" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Indicateur
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mécanique
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Rapide
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Carrosserie
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Heures vendues */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Heures vendues
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.hoursSold)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.hoursSold)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.hoursSold)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                        {formatNumber(totalHoursSold)}h
                      </td>
                    </tr>
                    
                    {/* Objectif heures */}
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Objectif heures
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.hoursTarget)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.hoursTarget)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.hoursTarget)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                        {formatNumber(totalHoursTarget)}h
                      </td>
                    </tr>
                    
                    {/* % Heures */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        % Heures
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.mechanical.hoursSold / mockData.departments.mechanical.hoursTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.quickService.hoursSold / mockData.departments.quickService.hoursTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.bodywork.hoursSold / mockData.departments.bodywork.hoursTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                        {hoursProgress}%
                      </td>
                    </tr>
                    
                    {/* CA réalisé */}
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        CA réalisé
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.revenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.revenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.revenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                        {formatNumber(totalRevenue)}€
                      </td>
                    </tr>
                    
                    {/* Objectif CA */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Objectif CA
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.revenueTarget)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.revenueTarget)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.revenueTarget)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                        {formatNumber(totalRevenueTarget)}€
                      </td>
                    </tr>
                    
                    {/* % CA */}
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        % CA
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.mechanical.revenue / mockData.departments.mechanical.revenueTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.quickService.revenue / mockData.departments.quickService.revenueTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.bodywork.revenue / mockData.departments.bodywork.revenueTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                        {revenueProgress}%
                      </td>
                    </tr>
                    
                    {/* CA/H */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        CA/H
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.revenuePerHour)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.revenuePerHour)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.revenuePerHour)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                        {formatNumber(revenuePerHour)}€
                      </td>
                    </tr>
                    
                    {/* Facturation J-1 */}
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Facturation J-1
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.previousDayBilling)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.previousDayBilling)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.previousDayBilling)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                        {formatNumber(
                          mockData.departments.mechanical.previousDayBilling +
                          mockData.departments.quickService.previousDayBilling +
                          mockData.departments.bodywork.previousDayBilling
                        )}h
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Tableau VideoCheck */}
          <Card className="print-friendly">
            <CardHeader title="VideoCheck" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectif CA
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entrées
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réalisé
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Réalisation
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CA Identifié
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CA Réalisé
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % CA
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CA/Vidéo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatNumber(videoCheckData.target)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {videoCheckData.entries}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {videoCheckData.completed}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {videoCheckData.completionRate}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(videoCheckData.identifiedRevenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(videoCheckData.actualRevenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((videoCheckData.actualRevenue / videoCheckData.target) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(videoCheckData.revenuePerVideo)}€
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Ventes additionnelles */}
          <Card className="print-friendly">
            <CardHeader title="Ventes Additionnelles" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mécanique */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">Mécanique</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produit
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Objectif
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Réalisé
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries({
                          'Pneus': crescendoData.mechanical.tires,
                          'Amortisseurs': crescendoData.mechanical.shockAbsorbers,
                          'Balais': crescendoData.mechanical.wipers,
                          'Plaquettes': crescendoData.mechanical.brakePads,
                          'Batteries': crescendoData.mechanical.batteries
                        }).map(([name, data]) => (
                          <tr key={name}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {data.target}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {data.actual}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {Math.round((data.actual / data.target) * 100)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Service Rapide */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">Service Rapide</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produit
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Objectif
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Réalisé
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries({
                          'Pneus': crescendoData.quickService.tires,
                          'Amortisseurs': crescendoData.quickService.shockAbsorbers,
                          'Balais': crescendoData.quickService.wipers,
                          'Plaquettes': crescendoData.quickService.brakePads,
                          'Batteries': crescendoData.quickService.batteries
                        }).map(([name, data]) => (
                          <tr key={name}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {data.target}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {data.actual}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {Math.round((data.actual / data.target) * 100)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pied de page */}
          <div className="text-center mt-8 text-sm text-gray-500 print-footer">
            <p>Document généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </div>
      )}

      {activeTab === 'global' && (
        <div className="space-y-8 print-container">
          {/* En-tête du rapport */}
          <div className="text-center mb-6 print-header">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord - {selectedSite}</h1>
            <p className="text-gray-600">
              {selectedDate.toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Tableau principal - Heures et CA */}
          <Card className="print-friendly">
            <CardHeader title="Synthèse Globale" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Heures Vendues
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectif Heures
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Heures
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        HEC
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectif HEC
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % HEC
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CA Total
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectif CA
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % CA
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CA/H
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Mécanique */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Mécanique
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.hoursSold)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.hoursTarget)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.mechanical.hoursSold / mockData.departments.mechanical.hoursTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(hecHours.mechanical)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(hecTargets.mechanical)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((hecHours.mechanical / hecTargets.mechanical) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.revenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.revenueTarget)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.mechanical.revenue / mockData.departments.mechanical.revenueTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.mechanical.revenuePerHour)}€
                      </td>
                    </tr>
                    
                    {/* Service Rapide */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Service Rapide
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.hoursSold)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.hoursTarget)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.quickService.hoursSold / mockData.departments.quickService.hoursTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(hecHours.quickService)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(hecTargets.quickService)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((hecHours.quickService / hecTargets.quickService) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.revenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.revenueTarget)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.quickService.revenue / mockData.departments.quickService.revenueTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.quickService.revenuePerHour)}€
                      </td>
                    </tr>
                    
                    {/* Carrosserie */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Carrosserie
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.hoursSold)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.hoursTarget)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.bodywork.hoursSold / mockData.departments.bodywork.hoursTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(hecHours.bodywork)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(hecTargets.bodywork)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((hecHours.bodywork / hecTargets.bodywork) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.revenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.revenueTarget)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((mockData.departments.bodywork.revenue / mockData.departments.bodywork.revenueTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(mockData.departments.bodywork.revenuePerHour)}€
                      </td>
                    </tr>
                    
                    {/* Total */}
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        TOTAL
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(totalHoursSold)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(totalHoursTarget)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {hoursProgress}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(totalHECHours)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(totalHECTarget)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((totalHECHours / totalHECTarget) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(totalRevenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(totalRevenueTarget)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {revenueProgress}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(revenuePerHour)}€
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Tableau VideoCheck */}
          <Card className="print-friendly">
            <CardHeader title="VideoCheck" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectif CA
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entrées
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réalisé
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Réalisation
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CA Identifié
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CA Réalisé
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % CA
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CA/Vidéo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatNumber(videoCheckData.target)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {videoCheckData.entries}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {videoCheckData.completed}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {videoCheckData.completionRate}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(videoCheckData.identifiedRevenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(videoCheckData.actualRevenue)}€
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((videoCheckData.actualRevenue / videoCheckData.target) * 100)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(videoCheckData.revenuePerVideo)}€
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Tableau Crescendo */}
          <Card className="print-friendly">
            <CardHeader title="Ventes Additionnelles" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mécanique */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">Mécanique</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produit
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Objectif
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Réalisé
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries({
                          'Pneus': crescendoData.mechanical.tires,
                          'Amortisseurs': crescendoData.mechanical.shockAbsorbers,
                          'Balais': crescendoData.mechanical.wipers,
                          'Plaquettes': crescendoData.mechanical.brakePads,
                          'Batteries': crescendoData.mechanical.batteries
                        }).map(([name, data]) => (
                          <tr key={name}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {data.target}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {data.actual}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {Math.round((data.actual / data.target) * 100)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Service Rapide */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">Service Rapide</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produit
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Objectif
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Réalisé
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries({
                          'Pneus': crescendoData.quickService.tires,
                          'Amortisseurs': crescendoData.quickService.shockAbsorbers,
                          'Balais': crescendoData.quickService.wipers,
                          'Plaquettes': crescendoData.quickService.brakePads,
                          'Batteries': crescendoData.quickService.batteries
                        }).map(([name, data]) => (
                          <tr key={name}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {data.target}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {data.actual}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {Math.round((data.actual / data.target) * 100)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pied de page */}
          <div className="text-center mt-8 text-sm text-gray-500 print-footer">
            <p>Document généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </div>
      )}

      {activeTab === 'productivity' && (
        <div className="space-y-8 print-container">
          {/* En-tête du rapport */}
          <div className="text-center mb-6 print-header">
            <h1 className="text-2xl font-bold text-gray-900">Rapport de Productivité - {selectedSite}</h1>
            <p className="text-gray-600">
              {selectedDate.toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Résultats par service */}
          <Card className="print-friendly">
            <CardHeader title="Résultats par service" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectifs
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réalisation
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Réalisation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {serviceResults.map((result) => (
                      <tr key={result.service}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.service}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatNumber(result.target)}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatNumber(result.actual)}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {result.completion}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        TOTAL
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(serviceResults.reduce((sum, r) => sum + r.target, 0))}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatNumber(serviceResults.reduce((sum, r) => sum + r.actual, 0))}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((serviceResults.reduce((sum, r) => sum + r.actual, 0) / serviceResults.reduce((sum, r) => sum + r.target, 0)) * 100)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Productivité par mécanicien - Mécanique */}
          <Card className="print-friendly">
            <CardHeader title="Productivité - Mécanique" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jours présence
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Potentiel
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectif
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réalisé
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productivityData.mechanical.map((mechanic) => (
                      <tr key={mechanic.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {mechanic.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.daysPresent}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.billingPotential}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.target}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.billedHours}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {Math.round((mechanic.billedHours / mechanic.target) * 100)}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Total Mécanique
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.mechanical.reduce((sum, m) => sum + m.daysPresent, 0)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.mechanical.reduce((sum, m) => sum + m.billingPotential, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.mechanical.reduce((sum, m) => sum + m.target, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.mechanical.reduce((sum, m) => sum + m.billedHours, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((productivityData.mechanical.reduce((sum, m) => sum + m.billedHours, 0) / 
                          productivityData.mechanical.reduce((sum, m) => sum + m.target, 0)) * 100)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Productivité par mécanicien - Service Rapide */}
          <Card className="print-friendly">
            <CardHeader title="Productivité - Service Rapide" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jours présence
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Potentiel
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectif
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réalisé
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productivityData.quickService.map((mechanic) => (
                      <tr key={mechanic.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {mechanic.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.daysPresent}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.billingPotential}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.target}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.billedHours}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {Math.round((mechanic.billedHours / mechanic.target) * 100)}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Total Service Rapide
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.quickService.reduce((sum, m) => sum + m.daysPresent, 0)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.quickService.reduce((sum, m) => sum + m.billingPotential, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.quickService.reduce((sum, m) => sum + m.target, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.quickService.reduce((sum, m) => sum + m.billedHours, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((productivityData.quickService.reduce((sum, m) => sum + m.billedHours, 0) / 
                          productivityData.quickService.reduce((sum, m) => sum + m.target, 0)) * 100)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Productivité par mécanicien - Carrosserie */}
          <Card className="print-friendly">
            <CardHeader title="Productivité - Carrosserie" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jours présence
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Potentiel
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectif
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réalisé
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productivityData.bodywork.map((mechanic) => (
                      <tr key={mechanic.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {mechanic.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.daysPresent}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.billingPotential}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.target}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {mechanic.billedHours}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                          {Math.round((mechanic.billedHours / mechanic.target) * 100)}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Total Carrosserie
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.bodywork.reduce((sum, m) => sum + m.daysPresent, 0)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.bodywork.reduce((sum, m) => sum + m.billingPotential, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.bodywork.reduce((sum, m) => sum + m.target, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.bodywork.reduce((sum, m) => sum + m.billedHours, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((productivityData.bodywork.reduce((sum, m) => sum + m.billedHours, 0) / 
                          productivityData.bodywork.reduce((sum, m) => sum + m.target, 0)) * 100)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Récapitulatif global de productivité */}
          <Card className="print-friendly">
            <CardHeader title="Récapitulatif Global de Productivité" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre de productif
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Potentiel total
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectif total
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réalisé total
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Productivité
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Mécanique
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.mechanical.length}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.mechanical.reduce((sum, m) => sum + m.billingPotential, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.mechanical.reduce((sum, m) => sum + m.target, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.mechanical.reduce((sum, m) => sum + m.billedHours, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((productivityData.mechanical.reduce((sum, m) => sum + m.billedHours, 0) / 
                          productivityData.mechanical.reduce((sum, m) => sum + m.target, 0)) * 100)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Service Rapide
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.quickService.length}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.quickService.reduce((sum, m) => sum + m.billingPotential, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.quickService.reduce((sum, m) => sum + m.target, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.quickService.reduce((sum, m) => sum + m.billedHours, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((productivityData.quickService.reduce((sum, m) => sum + m.billedHours, 0) / 
                          productivityData.quickService.reduce((sum, m) => sum + m.target, 0)) * 100)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        Carrosserie
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.bodywork.length}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.bodywork.reduce((sum, m) => sum + m.billingPotential, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.bodywork.reduce((sum, m) => sum + m.target, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {productivityData.bodywork.reduce((sum, m) => sum + m.billedHours, 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((productivityData.bodywork.reduce((sum, m) => sum + m.billedHours, 0) / 
                          productivityData.bodywork.reduce((sum, m) => sum + m.target, 0)) * 100)}%
                      </td>
                    </tr>
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        TOTAL
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Object.values(productivityData).reduce((sum, dept) => sum + dept.length, 0)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Object.values(productivityData).reduce((sum, dept) => 
                          sum + dept.reduce((deptSum, m) => deptSum + m.billingPotential, 0), 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Object.values(productivityData).reduce((sum, dept) => 
                          sum + dept.reduce((deptSum, m) => deptSum + m.target, 0), 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Object.values(productivityData).reduce((sum, dept) => 
                          sum + dept.reduce((deptSum, m) => deptSum + m.billedHours, 0), 0)}h
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {Math.round((Object.values(productivityData).reduce((sum, dept) => 
                          sum + dept.reduce((deptSum, m) => deptSum + m.billedHours, 0), 0) / 
                          Object.values(productivityData).reduce((sum, dept) => 
                          sum + dept.reduce((deptSum, m) => deptSum + m.target, 0), 0)) * 100)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pied de page */}
          <div className="text-center mt-8 text-sm text-gray-500 print-footer">
            <p>Document généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </div>
      )}
    </div>
  );
}