import React, { useState } from 'react';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import { formatNumber } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, LineChart, Line } from 'recharts';

export default function Rent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSite, setSelectedSite] = useState('RO');
  const [isEditing, setIsEditing] = useState(false);
  
  // État pour les données CA client loisir par année et par mois
  const [caClientLoisirData, setCaClientLoisirData] = useState({
    2023: {
      janvier: 24300, fevrier: 17500, mars: 21200, avril: 21700, mai: 21600, juin: 17000,
      juillet: 13000, aout: 10000, septembre: 16000, octobre: 18000, novembre: 15000, decembre: 14000
    },
    2024: {
      janvier: 25300, fevrier: 18500, mars: 22200, avril: 22700, mai: 22600, juin: 18000,
      juillet: 14000, aout: 11000, septembre: 17000, octobre: 19000, novembre: 16000, decembre: 15000
    },
    2025: {
      janvier: 26300, fevrier: 19500, mars: 23200, avril: 23700, mai: 23600, juin: 19000,
      juillet: 15000, aout: 12000, septembre: 18000, octobre: 20000, novembre: 17000, decembre: 16000
    }
  });

  // Données pour CA Rent client versus N-1
  const caRentData = [
    { name: 'juin 2024', value: 6000 },
    { name: 'juin 2025', value: 10100 }
  ];

  // Données pour frais remise en état RENT mois versus N-1
  const fraisRentData = [
    { name: 'juin 2024', value: 795 },
    { name: 'juin 2025', value: 555 }
  ];

  // Préparer les données pour le graphique CA client loisir
  const prepareCAClientLoisirData = () => {
    const months = [
      'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
      'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
    ];
    
    const monthKeys = [
      'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'
    ];

    // Obtenir le mois en cours (0-based, donc août = 7)
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    
    // Limiter les données jusqu'au mois en cours pour 2025
    return months.map((month, index) => {
      const monthKey = monthKeys[index];
      
      // Pour 2025, ne pas afficher les données après le mois en cours
      const show2025 = index <= currentMonthIndex;
      
      return {
        month,
        2023: caClientLoisirData[2023][monthKey],
        2024: caClientLoisirData[2024][monthKey],
        2025: show2025 ? caClientLoisirData[2025][monthKey] : null
      };
    });
  };

  const handleValueChange = (year, monthKey, value) => {
    setCaClientLoisirData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [monthKey]: Number(value) || 0
      }
    }));
  };

  // Fonction pour obtenir les données CA Rent du mois en cours
  const getCurrentMonthRentData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('fr-FR', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const previousYear = currentYear - 1;
    
    // Simuler des données basées sur le mois en cours
    const baseValue = 6000 + (currentDate.getMonth() * 400); // Variation selon le mois
    
    return [
      { name: `${currentMonth} ${previousYear}`, value: Math.round(baseValue * 0.9) },
      { name: `${currentMonth} ${currentYear}`, value: baseValue }
    ];
  };

  // Fonction pour obtenir les données frais du mois en cours
  const getCurrentMonthFraisData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('fr-FR', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const previousYear = currentYear - 1;
    
    // Simuler des données basées sur le mois en cours (tendance à la baisse)
    const baseValue = 800 - (currentDate.getMonth() * 20); // Diminution selon le mois
    
    return [
      { name: `${currentMonth} ${previousYear}`, value: Math.round(baseValue * 1.2) },
      { name: `${currentMonth} ${currentYear}`, value: baseValue }
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

      <div className="space-y-6">
        {/* Widgets du haut - maintenant sur toute la largeur */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Widget 1: CA Rent client versus N-1 */}
          <Card>
            <CardHeader title="CA Rent client versus N-1" />
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={getCurrentMonthRentData()} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    barSize={80}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 14 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value / 1000}K€`} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${formatNumber(value)}€`, 'CA Rent']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      <LabelList 
                        dataKey="value"
                        position="top"
                        formatter={(value) => `${value / 1000}K€`}
                        style={{ fontSize: '14px', fill: '#3b82f6', fontWeight: 'bold' }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Widget 2: Frais remise en état RENT mois versus N-1 */}
          <Card>
            <CardHeader title="Frais remise en état RENT mois versus N-1" />
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={getCurrentMonthFraisData()} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    barSize={80}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 14 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}€`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}€`, 'Frais']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="#6b7280" radius={[4, 4, 0, 0]}>
                      <LabelList 
                        dataKey="value"
                        position="top"
                        formatter={(value) => `${value}€`}
                        style={{ fontSize: '14px', fill: '#6b7280', fontWeight: 'bold' }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grand graphique CA client loisir versus N-1 */}
        <Card>
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-900">CA client loisir versus N-1</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                isEditing ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {isEditing ? 'Terminer' : 'Modifier'}
            </button>
          </div>
          <CardContent>
            <div className="mb-4 text-center">
              <p className="text-sm text-orange-500">À saisir manuellement</p>
            </div>
            
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareCAClientLoisirData()}
                  margin={{ top: 40, right: 40, left: 40, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
                  <XAxis 
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${formatNumber(value)}€`}
                    domain={[0, 'auto']}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickLine={{ stroke: '#d1d5db' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${formatNumber(value)}€`, name]}
                    labelFormatter={(label) => `Mois: ${label}`}
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
                    stroke="#1e3a8a"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 5, fill: "#1e3a8a", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: 7, fill: "#1e3a8a", strokeWidth: 2, stroke: "#ffffff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="2024" 
                    name="2024" 
                    stroke="#3b82f6"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: 7, fill: "#3b82f6", strokeWidth: 2, stroke: "#ffffff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="2025" 
                    name="2025" 
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: 7, fill: "#3b82f6", strokeWidth: 2, stroke: "#ffffff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Interface de saisie manuelle */}
            {isEditing && (
              <div className="mt-6">
                <div className="space-y-6">
                  {/* Saisie pour 2023 */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Données 2023</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(caClientLoisirData[2023]).map(([monthKey, value]) => {
                        const monthNames = {
                          janvier: 'Janvier', fevrier: 'Février', mars: 'Mars', avril: 'Avril',
                          mai: 'Mai', juin: 'Juin', juillet: 'Juillet', aout: 'Août',
                          septembre: 'Septembre', octobre: 'Octobre', novembre: 'Novembre', decembre: 'Décembre'
                        };
                        
                        return (
                          <div key={monthKey} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h5 className="text-sm font-medium text-gray-800 mb-3 text-center">{monthNames[monthKey]}</h5>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => handleValueChange(2023, monthKey, e.target.value)}
                              className="w-full text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder="0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Saisie pour 2024 */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Données 2024</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(caClientLoisirData[2024]).map(([monthKey, value]) => {
                        const monthNames = {
                          janvier: 'Janvier', fevrier: 'Février', mars: 'Mars', avril: 'Avril',
                          mai: 'Mai', juin: 'Juin', juillet: 'Juillet', aout: 'Août',
                          septembre: 'Septembre', octobre: 'Octobre', novembre: 'Novembre', decembre: 'Décembre'
                        };
                        
                        return (
                          <div key={monthKey} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h5 className="text-sm font-medium text-gray-800 mb-3 text-center">{monthNames[monthKey]}</h5>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => handleValueChange(2024, monthKey, e.target.value)}
                              className="w-full text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder="0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Saisie pour 2025 */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Données 2025</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(caClientLoisirData[2025]).map(([monthKey, value]) => {
                        const monthNames = {
                          janvier: 'Janvier', fevrier: 'Février', mars: 'Mars', avril: 'Avril',
                          mai: 'Mai', juin: 'Juin', juillet: 'Juillet', aout: 'Août',
                          septembre: 'Septembre', octobre: 'Octobre', novembre: 'Novembre', decembre: 'Décembre'
                        };
                        
                        return (
                          <div key={monthKey} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h5 className="text-sm font-medium text-gray-800 mb-3 text-center">{monthNames[monthKey]}</h5>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => handleValueChange(2025, monthKey, e.target.value)}
                              className="w-full text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder="0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}