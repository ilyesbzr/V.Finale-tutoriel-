import React, { useState } from 'react';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import { formatNumber } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { useTranslation } from 'react-i18next';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface DetailDataItem {
  family: string;
  revenue: number;
  percentage: number;
}

interface EvolutionDataItem {
  name: string;
  2023: number;
  2024: number;
  2025: number;
  evolution: string;
}

interface MarginData {
  monthComparison: Array<{ name: string; value: number }>;
  serviceDistribution: ChartDataItem[];
  savPrVo: ChartDataItem[];
  vnAdm: ChartDataItem[];
}

export default function Parts(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSite, setSelectedSite] = useState<string>('RO');
  const [activeTab, setActiveTab] = useState<'overview' | 'detail' | 'margin'>('overview');
  const [periodType, setPeriodType] = useState<'monthly' | 'yearly'>('monthly');
  const { t } = useTranslation();

  // Données pour la vue d'ensemble (graphiques en barres)
  const overviewData = {
    quantities: [
      { name: 'Outils atelier', value: 156, color: '#22c55e' },
      { name: 'Vente PR autres marques', value: 234, color: '#a855f7' },
      { name: 'Lifestyle / Acc', value: 89, color: '#f97316' },
      { name: 'Roues et jantes', value: 67, color: '#ef4444' },
      { name: 'PR hors marque', value: 345, color: '#06b6d4' },
      { name: 'Balais d\'essuie-glace', value: 456, color: '#8b5cf6' },
      { name: 'Lubrifiant', value: 123, color: '#f59e0b' },
      { name: 'Pneus', value: 45, color: '#10b981' },
      { name: 'Batteries', value: 78, color: '#3b82f6' },
      { name: 'Pare-brise', value: 0, color: '#6b7280' }
    ],
    revenue: [
      { name: 'Outils atelier', value: 48400, color: '#22c55e' },
      { name: 'Vente PR autres marques', value: 19800, color: '#a855f7' },
      { name: 'Lifestyle / Acc', value: 12800, color: '#f97316' },
      { name: 'Roues et jantes', value: 9600, color: '#ef4444' },
      { name: 'PR hors marque', value: 7400, color: '#06b6d4' },
      { name: 'Balais d\'essuie-glace', value: 6800, color: '#8b5cf6' },
      { name: 'Lubrifiant', value: 5600, color: '#f59e0b' },
      { name: 'Pneus', value: 15600, color: '#10b981' },
      { name: 'Batteries', value: 9800, color: '#3b82f6' },
      { name: 'Pare-brise', value: 4600, color: '#6b7280' }
    ]
  };

  // Calculer les totaux
  const totalQuantity = overviewData.quantities.reduce((sum, item) => sum + item.value, 0);
  const totalRevenue = overviewData.revenue.reduce((sum, item) => sum + item.value, 0);

  // Données pour la vue détail (tableau avec barres de progression)
  const detailData: DetailDataItem[] = [
    { family: 'Outils atelier', revenue: 46000, percentage: 38 },
    { family: 'Vente PR autres marques', revenue: 19000, percentage: 16 },
    { family: 'Lifestyle / Acc', revenue: 12000, percentage: 10 },
    { family: 'Roues et jantes', revenue: 9000, percentage: 7 },
    { family: 'PR hors marque', revenue: 7000, percentage: 6 },
    { family: 'Access Veh', revenue: 6000, percentage: 5 },
    { family: 'Lubrifiant', revenue: 5000, percentage: 4 },
    { family: 'Pneus', revenue: 14000, percentage: 12 },
    { family: 'Huiles', revenue: 8500, percentage: 7 },
    { family: 'Pièces', revenue: 3720, percentage: 3 }
  ];

  // Données pour la vue marge et cession
  const marginData: MarginData = {
    monthComparison: [
      { name: 'juin 2024', value: 142110 },
      { name: 'juin 2025', value: 174220 }
    ],
    serviceDistribution: [
      { name: 'Carrosserie Strasbourg', value: 13.79, color: '#ef4444' },
      { name: 'Carrosserie Obernai', value: 8.27, color: '#f97316' },
      { name: 'M2-Magasin Obernai', value: 3.09, color: '#06b6d4' },
      { name: 'Service Direct', value: 22.36, color: '#ec4899' },
      { name: 'Méca Strasbourg', value: 19.58, color: '#6b7280' },
      { name: 'Méca Obernai', value: 17.70, color: '#3b82f6' }
    ],
    savPrVo: [
      { name: 'ATC GESTE COMMERCIAL ATELIER', value: 31.12, color: '#6b7280' },
      { name: 'CONSOMMABLES VO', value: 4.06, color: '#22c55e' },
      { name: 'FOURNITURE ATELIER', value: 5.6, color: '#f97316' },
      { name: 'LOC ENTRETIEN VEHICULATION', value: 0.78, color: '#ef4444' },
      { name: 'VO REMISE EN ETAT VO', value: 1.47, color: '#8b5cf6' },
      { name: 'ATC TECHNICIEN REMISE EN ETAT VO', value: 4.31, color: '#a855f7' }
    ],
    vnAdm: [
      { name: 'MME ACCESSOIRES VN', value: 4.06, color: '#06b6d4' },
      { name: 'PO2 ADMINISTRATIVE DIRECTION', value: 2.22, color: '#3b82f6' },
      { name: 'FOURNITURE PREPARATION', value: 5.33, color: '#22c55e' },
      { name: 'CONSOMMABLES VN', value: 0.63, color: '#10b981' },
      { name: 'BMW ENTRETIEN VO', value: 3.65, color: '#8b5cf6' },
      { name: 'BMW PREPARATION VN', value: 0.47, color: '#a855f7' },
      { name: 'BMW ACCESSOIRES VN', value: 8.19, color: '#ec4899' },
      { name: 'BMW ACCESSOIRES VN', value: 2.45, color: '#f59e0b' }
    ]
  };

  // Données d'évolution par famille (pour la vue détail)
  const evolutionData: EvolutionDataItem[] = [
    {
      name: 'Outils atelier',
      2023: 24541,
      2024: 27717,
      2025: 29400,
      evolution: '+8%'
    },
    {
      name: 'Vente PR autres marques',
      2023: 10214,
      2024: 11105,
      2025: 12040,
      evolution: '+8%'
    },
    {
      name: 'Lifestyle / Acc',
      2023: 6413,
      2024: 6573,
      2025: 7560,
      evolution: '+8%'
    },
    {
      name: 'Roues et jantes',
      2023: 4810,
      2024: 5230,
      2025: 5670,
      evolution: '+8%'
    },
    {
      name: 'PR hors marque',
      2023: 3741,
      2024: 4067,
      2025: 4410,
      evolution: '+8%'
    },
    {
      name: 'Access Veh',
      2023: 3207,
      2024: 3486,
      2025: 3780,
      evolution: '+8%'
    },
    {
      name: 'Lubrifiant',
      2023: 2672,
      2024: 2905,
      2025: 3150,
      evolution: '+8%'
    },
    {
      name: 'Pneus',
      2023: 7482,
      2024: 8135,
      2025: 8820,
      evolution: '+8%'
    },
    {
      name: 'Huiles',
      2023: 4543,
      2024: 4939,
      2025: 5355,
      evolution: '+8%'
    },
    {
      name: 'Pièces',
      2023: 1988,
      2024: 2162,
      2025: 2344,
      evolution: '+8%'
    }
  ];

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

      {/* Onglets - Style identique aux autres pages */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex justify-center">
          <nav className="inline-flex bg-gray-100 rounded-xl p-1 shadow-sm border border-gray-200">
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
              <span className="text-xl font-semibold">Vue d'ensemble</span>
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('detail')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'detail'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Détail</span>
              {activeTab === 'detail' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('margin')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'margin'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Marge et Cession</span>
              {activeTab === 'margin' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' ? (
        // Vue d'ensemble - Image 1
        <div className="space-y-6">
          {/* Widgets de synthèse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="text-blue-600 mr-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total pièces vendues</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(totalQuantity)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="text-green-600 mr-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">CA total pièces</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(totalRevenue)} €</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques en barres */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Nombre de pièces vendues par famille" />
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={overviewData.quantities}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        <LabelList 
                          dataKey="value"
                          position="top"
                          style={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        {overviewData.quantities.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="CA par famille" />
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={overviewData.revenue}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis tickFormatter={(value: number) => `${value/1000}K€`} />
                      <Tooltip formatter={(value: number) => [`${formatNumber(value)}€`, 'CA']} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        <LabelList 
                          dataKey="value"
                          position="top"
                          formatter={(value: number) => `${Math.round(value/1000)}K€`}
                          style={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        {overviewData.revenue.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : activeTab === 'detail' ? (
        // Vue détail - Images 2 et 3
        <div className="space-y-6">
          {/* Tableau de répartition par famille - Style identique aux tableaux Objectifs */}
          <Card>
            <CardHeader title="Répartition par famille de pièces" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                        Famille de pièces
                      </th>
                      <th className="px-6 py-3 text-center text-base font-medium text-gray-500 uppercase tracking-wider">
                        Chiffre d'affaires
                      </th>
                      <th className="px-6 py-3 text-center text-base font-medium text-gray-500 uppercase tracking-wider">
                        Part du total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detailData.map((item, index) => (
                      <tr key={item.family} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-base text-left font-medium text-gray-900">
                          {item.family}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-base text-gray-900">
                          {formatNumber(item.revenue)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <span className="text-base font-medium text-gray-900 mr-2">
                              {item.percentage}%
                            </span>
                            <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Graphique d'évolution par famille de pièces */}
          <Card>
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-900">Évolution par famille de pièces</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Période</span>
                    <select
                      value={periodType}
                      onChange={(e) => setPeriodType(e.target.value as 'monthly' | 'yearly')}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="monthly">Mensuel</option>
                      <option value="yearly">Annuel</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Année</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-900 rounded"></div>
                      <span className="text-sm">2023</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span className="text-sm">2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-400 rounded"></div>
                      <span className="text-sm">2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardContent>
              <div className="mb-4 text-center">
                <h4 className="text-sm font-medium text-gray-700">
                  {periodType === 'monthly' ? 'Comparaison mensuelle' : 'Comparaison annuelle'}
                </h4>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={evolutionData.map(item => ({
                      ...item,
                      2023: periodType === 'yearly' ? item[2023] * 12 : item[2023],
                      2024: periodType === 'yearly' ? item[2024] * 12 : item[2024],
                      2025: periodType === 'yearly' ? item[2025] * 12 : item[2025]
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 13 }}
                    />
                    <YAxis tickFormatter={(value: number) => `${value/1000}K€`} />
                    <Tooltip formatter={(value: number, name: string) => [`${formatNumber(value)}€`, name]} />
                    <Legend />
                    <Bar dataKey="2023" name="2023" fill="#1e3a8a" />
                    <Bar dataKey="2024" name="2024" fill="#3b82f6" />
                    <Bar dataKey="2025" name="2025" fill="#93c5fd" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Détails d'évolution en grille */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-6">
                {evolutionData.map((item) => (
                  <div key={item.name} className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-base font-medium text-gray-700 mb-4 text-center">{item.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">2023:</span>
                        <span className="text-sm font-semibold text-blue-900">{formatNumber(periodType === 'yearly' ? item[2023] * 12 : item[2023])} €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">2024:</span>
                        <span className="text-sm font-semibold text-blue-600">{formatNumber(periodType === 'yearly' ? item[2024] * 12 : item[2024])} €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">2025:</span>
                        <span className="text-sm font-semibold text-blue-400">{formatNumber(periodType === 'yearly' ? item[2025] * 12 : item[2025])} €</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Évolution:</span>
                          <span className="text-xs font-medium text-green-600">{item.evolution}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Vue Marge et Cession - Image 4
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique de comparaison mensuelle - En haut à gauche */}
            <Card>
              <CardHeader title="Marge achat par Mois VS N-1" />
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={marginData.monthComparison}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value: number) => `${value/1000}K`} />
                      <Tooltip formatter={(value: number) => [`${formatNumber(value)}€`, 'Marge']} />
                      <Bar dataKey="value" fill="#6b7280" radius={[4, 4, 0, 0]}>
                        <LabelList 
                          dataKey="value"
                          position="top"
                          formatter={(value: number) => `${Math.round(value/1000)}K€`}
                          style={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Provenance Marge achat par Service - En haut à droite */}
            <Card>
              <CardHeader title="Provenance Marge achat par Service" />
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marginData.serviceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        label={({ value, name }: any) => `${value}%`}
                        labelLine={false}
                      >
                        {marginData.serviceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }: any) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
                                <p className="font-medium text-gray-900">{data.name}</p>
                                <p className="text-sm text-gray-600">Montant: {data.value}K€</p>
                                <p className="text-sm text-gray-600">Part: {data.value}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value: string, entry: any) => (
                          <span style={{ color: entry.color, fontSize: '11px' }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Montant Cession SAV/PR/VO - En bas à gauche */}
            <Card>
              <CardHeader title="Montant Cession SAV/PR/VO" />
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marginData.savPrVo}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        label={({ value }: any) => `${value}K`}
                        labelLine={false}
                      >
                        {marginData.savPrVo.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }: any) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
                                <p className="font-medium text-gray-900">{data.name}</p>
                                <p className="text-sm text-gray-600">Montant: {data.value}K€</p>
                                <p className="text-sm text-gray-600">Part: {Math.round((data.value / marginData.savPrVo.reduce((sum, item) => sum + item.value, 0)) * 100)}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value: string, entry: any) => (
                          <span style={{ color: entry.color, fontSize: '11px' }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Montant Cession VN / ADM - En bas à droite */}
            <Card>
              <CardHeader title="Montant Cession VN / ADM" />
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marginData.vnAdm}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        label={({ value }: any) => `${value}K`}
                        labelLine={false}
                      >
                        {marginData.vnAdm.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }: any) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
                                <p className="font-medium text-gray-900">{data.name}</p>
                                <p className="text-sm text-gray-600">Montant: {data.value}K€</p>
                                <p className="text-sm text-gray-600">Part: {Math.round((data.value / marginData.vnAdm.reduce((sum, item) => sum + item.value, 0)) * 100)}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value: string, entry: any) => (
                          <span style={{ color: entry.color, fontSize: '11px' }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}