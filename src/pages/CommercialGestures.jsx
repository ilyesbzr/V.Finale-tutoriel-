import React, { useState, useEffect } from 'react';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import { formatNumber, formatCurrency } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { HandRaisedIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function CommercialGestures() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSite, setSelectedSite] = useState('RO');
  const [activeTab, setActiveTab] = useState('gestures');
  const [selectedMonth, setSelectedMonth] = useState('01'); // Janvier par défaut
  const [selectedYear, setSelectedYear] = useState(2025); // 2025 par défaut
  const [periodType, setPeriodType] = useState('monthly'); // 'monthly' ou 'yearly'
  const [selectedType, setSelectedType] = useState('all');

  // Données simulées pour les gestes commerciaux
  const gesturesData = [
    {
      id: 'GC001',
      type: 'Remise',
      reason: 'Client fidèle',
      amount: 150,
      customer: 'MARTIN Sophie',
      advisor: 'DUBOIS Pierre',
      date: '2025-01-15',
      status: 'Approuvé',
      invoice: 'F2025-0156'
    },
    {
      id: 'GC002',
      type: 'Avoir',
      reason: 'Défaut pièce',
      amount: 89,
      customer: 'GARCIA Maria',
      advisor: 'BERNARD Thomas',
      date: '2025-01-14',
      status: 'En attente',
      invoice: 'F2025-0145'
    },
    {
      id: 'GC003',
      type: 'Geste',
      reason: 'Retard livraison',
      amount: 45,
      customer: 'LOPEZ Carlos',
      advisor: 'MARTIN Sophie',
      date: '2025-01-13',
      status: 'Approuvé',
      invoice: 'F2025-0134'
    },
    {
      id: 'GC004',
      type: 'Remise',
      reason: 'Négociation commerciale',
      amount: 200,
      customer: 'PETIT Julie',
      advisor: 'ROBERT Camille',
      date: '2025-01-12',
      status: 'Refusé',
      invoice: 'F2025-0128'
    },
    {
      id: 'GC005',
      type: 'Avoir',
      reason: 'Malfaçon réparation',
      amount: 320,
      customer: 'MOREAU Lucas',
      advisor: 'DUBOIS Pierre',
      date: '2025-01-11',
      status: 'Approuvé',
      invoice: 'F2025-0119'
    }
  ];

  // Données simulées pour les malfaçons
  const malfaconsData = [
    {
      id: 'MF001',
      type: 'Réparation défaillante',
      description: 'Fuite huile après vidange',
      cost: 180,
      technician: 'CHAGNAUD Elliot',
      customer: 'BERNARD Thomas',
      date: '2025-01-14',
      status: 'Résolu',
      correctionCost: 0
    },
    {
      id: 'MF002',
      type: 'Pièce défectueuse',
      description: 'Plaquettes de frein défaillantes',
      cost: 250,
      technician: 'EYCHENNE Thibault',
      customer: 'MARTIN Claire',
      date: '2025-01-13',
      status: 'En cours',
      correctionCost: 120
    },
    {
      id: 'MF003',
      type: 'Erreur diagnostic',
      description: 'Mauvais diagnostic panne moteur',
      cost: 450,
      technician: 'DUPONT Jean',
      customer: 'GARCIA Antonio',
      date: '2025-01-10',
      status: 'Résolu',
      correctionCost: 200
    }
  ];

  // Calcul des statistiques
  const totalGestures = gesturesData.length;
  const totalGesturesAmount = gesturesData.reduce((sum, g) => sum + g.amount, 0);
  const approvedGestures = gesturesData.filter(g => g.status === 'Approuvé').length;
  const pendingGestures = gesturesData.filter(g => g.status === 'En attente').length;

  const totalMalfacons = malfaconsData.length;
  const totalMalfaconsCost = malfaconsData.reduce((sum, m) => sum + m.cost, 0);
  const totalCorrectionCost = malfaconsData.reduce((sum, m) => sum + m.correctionCost, 0);
  const resolvedMalfacons = malfaconsData.filter(m => m.status === 'Résolu').length;

  // Données pour les graphiques
  const gesturesByType = [
    { type: 'Remise', count: gesturesData.filter(g => g.type === 'Remise').length, amount: gesturesData.filter(g => g.type === 'Remise').reduce((sum, g) => sum + g.amount, 0) },
    { type: 'Avoir', count: gesturesData.filter(g => g.type === 'Avoir').length, amount: gesturesData.filter(g => g.type === 'Avoir').reduce((sum, g) => sum + g.amount, 0) },
    { type: 'Geste', count: gesturesData.filter(g => g.type === 'Geste').length, amount: gesturesData.filter(g => g.type === 'Geste').reduce((sum, g) => sum + g.amount, 0) }
  ];

  const malfaconsByType = [
    { type: 'Réparation défaillante', count: malfaconsData.filter(m => m.type === 'Réparation défaillante').length, cost: malfaconsData.filter(m => m.type === 'Réparation défaillante').reduce((sum, m) => sum + m.cost, 0) },
    { type: 'Pièce défectueuse', count: malfaconsData.filter(m => m.type === 'Pièce défectueuse').length, cost: malfaconsData.filter(m => m.type === 'Pièce défectueuse').reduce((sum, m) => sum + m.cost, 0) },
    { type: 'Erreur diagnostic', count: malfaconsData.filter(m => m.type === 'Erreur diagnostic').length, cost: malfaconsData.filter(m => m.type === 'Erreur diagnostic').reduce((sum, m) => sum + m.cost, 0) }
  ];

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Refusé': return 'bg-red-100 text-red-800';
      case 'Résolu': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approuvé':
      case 'Résolu':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'En attente':
      case 'En cours':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'Refusé':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  // Fonction pour obtenir le nom du mois
  const getMonthName = (monthNumber) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[parseInt(monthNumber) - 1];
  };

  // Fonction pour obtenir le facteur saisonnier
  const getSeasonalFactor = (month) => {
    const seasonalFactors = {
      '01': 0.9, '02': 0.95, '03': 1.1, '04': 1.0, '05': 1.05, '06': 1.0,
      '07': 0.8, '08': 0.7, '09': 1.15, '10': 1.2, '11': 1.1, '12': 0.95
    };
    return seasonalFactors[month] || 1.0;
  };

  // Obtenir le mois en cours
  const getCurrentMonth = () => {
    const currentDate = new Date();
    return String(currentDate.getMonth() + 1).padStart(2, '0');
  };

  // Fonction pour obtenir le facteur d'année (évolution dans le temps)
  const getYearFactor = (year) => {
    const baseYear = 2025;
    const yearDiff = year - baseYear;
    // Simulation d'une croissance de 3% par an pour les gestes, décroissance pour les malfaçons
    return Math.pow(1.03, yearDiff);
  };

  // Fonction pour obtenir les données des gestes commerciaux
  const getGesturesChartData = () => {
    const baseData = {
      gestesCommerciaux: { base: 2400, variation: 0.12 } // Total des gestes commerciaux
    };

    const currentMonth = getCurrentMonth();
    const seasonalFactor = periodType === 'monthly' ? getSeasonalFactor(currentMonth) : 1.0;
    
    return [
      {
        name: 'Gestes commerciaux',
        [selectedYear - 2]: Math.round(baseData.gestesCommerciaux.base * (periodType === 'yearly' ? 12 : 1) * 1.8 * seasonalFactor * getYearFactor(selectedYear - 2)),
        [selectedYear - 1]: Math.round(baseData.gestesCommerciaux.base * (periodType === 'yearly' ? 12 : 1) * 1.3 * seasonalFactor * getYearFactor(selectedYear - 1)),
        [selectedYear]: Math.round(baseData.gestesCommerciaux.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * getYearFactor(selectedYear))
      }
    ];
  };

  // Fonction pour obtenir les données des malfaçons
  const getMalfaconsChartData = () => {
    const baseData = {
      malfacons: { base: 5500, variation: 0.12 } // Total des malfaçons
    };

    const currentMonth = getCurrentMonth();
    const seasonalFactor = periodType === 'monthly' ? getSeasonalFactor(currentMonth) : 1.0;
    // Pour les malfaçons, on veut une tendance à la baisse (facteur inversé)
    const malfaconYearFactor = (year) => Math.pow(0.97, year - 2025); // Décroissance de 3% par an
    
    return [
      {
        name: 'Malfaçons',
        [selectedYear - 2]: Math.round(baseData.malfacons.base * (periodType === 'yearly' ? 12 : 1) * 1.8 * seasonalFactor * malfaconYearFactor(selectedYear - 2)),
        [selectedYear - 1]: Math.round(baseData.malfacons.base * (periodType === 'yearly' ? 12 : 1) * 1.3 * seasonalFactor * malfaconYearFactor(selectedYear - 1)),
        [selectedYear]: Math.round(baseData.malfacons.base * (periodType === 'yearly' ? 12 : 1) * seasonalFactor * malfaconYearFactor(selectedYear))
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

        <div className="space-y-6">
          {/* Contrôles de période */}
          <Card>
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Période</span>
                    <select
                      value={periodType}
                      onChange={(e) => setPeriodType(e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="monthly">Mensuel</option>
                      <option value="yearly">Annuel</option>
                    </select>
                  </div>
                </div>
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
          </Card>

          {/* Impact financier */}
          <Card>
            <CardHeader title="Impact financier global" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 p-6 rounded-lg">
                  <div className="flex flex-col items-center justify-center text-center">
                    <HandRaisedIcon className="h-8 w-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Gestes commerciaux</p>
                      <p className="text-2xl font-semibold text-red-900">{formatCurrency(totalGesturesAmount)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex flex-col items-center justify-center text-center">
                    <ExclamationTriangleIcon className="h-8 w-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Coût malfaçons</p>
                      <p className="text-2xl font-semibold text-orange-900">{formatCurrency(totalCorrectionCost)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-col items-center justify-center text-center">
                    <XCircleIcon className="h-8 w-8 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Impact total</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(totalGesturesAmount + totalCorrectionCost)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graphiques comparatifs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique Gestes commerciaux */}
            <Card>
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Évolution des gestes commerciaux</h3>
              </div>
              <CardContent>
                <div className="mb-4 text-center">
                  <h4 className="text-sm font-medium text-gray-700">
                    {periodType === 'monthly' 
                      ? `Comparaison ${getMonthName(getCurrentMonth())}`
                      : `Comparaison annuelle`}
                  </h4>
                </div>
                
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getGesturesChartData()}
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
                        tickFormatter={(value) => `${formatNumber(value)}€`}
                        domain={[0, 'auto']}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${formatNumber(value)}€`, name]}
                        labelFormatter={(label) => label}
                      />
                      <Bar dataKey={selectedYear - 2} name={selectedYear - 2} fill="#1e3a8a" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear - 2}
                          position="top"
                          formatter={(value) => `${formatNumber(value)}€`}
                          style={{ fontSize: '12px', fill: '#1e3a8a', fontWeight: 'bold' }}
                        />
                      </Bar>
                      <Bar dataKey={selectedYear - 1} name={selectedYear - 1} fill="#3b82f6" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear - 1}
                          position="top"
                          formatter={(value) => `${formatNumber(value)}€`}
                          style={{ fontSize: '12px', fill: '#3b82f6', fontWeight: 'bold' }}
                        />
                      </Bar>
                      <Bar dataKey={selectedYear} name={selectedYear} fill="#93c5fd" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear}
                          position="top"
                          formatter={(value) => `${formatNumber(value)}€`}
                          style={{ fontSize: '12px', fill: '#93c5fd', fontWeight: 'bold' }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Valeurs détaillées pour gestes commerciaux */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  {getGesturesChartData().map((item, index) => (
                    <div key={item.name} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">{item.name}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear - 2}:</span>
                          <span className="text-sm font-semibold text-blue-900">{formatNumber(item[selectedYear - 2])}€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear - 1}:</span>
                          <span className="text-sm font-semibold text-blue-600">{formatNumber(item[selectedYear - 1])}€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear}:</span>
                          <span className="text-sm font-semibold text-blue-400">{formatNumber(item[selectedYear])}€</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Graphique Malfaçons */}
            <Card>
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Évolution des malfaçons</h3>
              </div>
              <CardContent>
                <div className="mb-4 text-center">
                  <h4 className="text-sm font-medium text-gray-700">
                    {periodType === 'monthly' 
                      ? `Comparaison ${getMonthName(getCurrentMonth())}`
                      : `Comparaison annuelle`}
                  </h4>
                </div>
                
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getMalfaconsChartData()}
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
                        tickFormatter={(value) => `${formatNumber(value)}€`}
                        domain={[0, 'auto']}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${formatNumber(value)}€`, name]}
                        labelFormatter={(label) => label}
                      />
                      <Bar dataKey={selectedYear - 2} name={selectedYear - 2} fill="#dc2626" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear - 2}
                          position="top"
                          formatter={(value) => `${formatNumber(value)}€`}
                          style={{ fontSize: '12px', fill: '#dc2626', fontWeight: 'bold' }}
                        />
                      </Bar>
                      <Bar dataKey={selectedYear - 1} name={selectedYear - 1} fill="#ef4444" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear - 1}
                          position="top"
                          formatter={(value) => `${formatNumber(value)}€`}
                          style={{ fontSize: '12px', fill: '#ef4444', fontWeight: 'bold' }}
                        />
                      </Bar>
                      <Bar dataKey={selectedYear} name={selectedYear} fill="#fca5a5" barSize={60}>
                        <LabelList 
                          dataKey={selectedYear}
                          position="top"
                          formatter={(value) => `${formatNumber(value)}€`}
                          style={{ fontSize: '12px', fill: '#fca5a5', fontWeight: 'bold' }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Valeurs détaillées pour malfaçons */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  {getMalfaconsChartData().map((item, index) => (
                    <div key={item.name} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">{item.name}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear - 2}:</span>
                          <span className="text-sm font-semibold text-red-900">{formatNumber(item[selectedYear - 2])}€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear - 1}:</span>
                          <span className="text-sm font-semibold text-red-600">{formatNumber(item[selectedYear - 1])}€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{selectedYear}:</span>
                          <span className="text-sm font-semibold text-red-400">{formatNumber(item[selectedYear])}€</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}