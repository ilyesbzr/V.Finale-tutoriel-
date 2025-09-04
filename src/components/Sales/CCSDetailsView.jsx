import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { formatNumber } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';
import { ChartPieIcon, ChartBarIcon, XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const productLabels = {
  wipers: 'crescendo.products.wipers',
  brake_pads: 'crescendo.products.brakePads',
  discs: 'crescendo.products.discs',
  batteries: 'crescendo.products.batteries',
  shock_absorbers: 'crescendo.products.shockAbsorbers',
  tires: 'crescendo.products.tires',
  windshields: 'crescendo.products.windshields'
};

// Mock data for employees - replace with real data from your backend
const employeesByDepartment = {
  mechanical: [
    { id: 1, name: 'CHAGNAUD Elliot' },
    { id: 2, name: 'EYCHENNE Thibault' }
  ],
  quickService: [
    { id: 3, name: 'CHAGNAUD Elliot' },
    { id: 4, name: 'DE JESUS David' },
    { id: 5, name: 'MARTIN Sophie' }
  ],
  bodywork: [
    { id: 6, name: 'DUPONT Jean' },
    { id: 7, name: 'MARTIN Pierre' }
  ]
};

// Mock data for employee sales - replace with real data
const employeeSales = {
  1: { wipers: 12, brake_pads: 3, discs: 4, batteries: 5, shock_absorbers: 2, tires: 8, windshields: 0 },
  2: { wipers: 17, brake_pads: 4, discs: 4, batteries: 7, shock_absorbers: 2, tires: 15, windshields: 0 },
  3: { wipers: 65, brake_pads: 12, discs: 8, batteries: 3, shock_absorbers: 10, tires: 18, windshields: 0 },
  4: { wipers: 63, brake_pads: 12, discs: 7, batteries: 4, shock_absorbers: 8, tires: 16, windshields: 0 },
  5: { wipers: 58, brake_pads: 16, discs: 5, batteries: 3, shock_absorbers: 0, tires: 0, windshields: 0 },
  6: { wipers: 0, brake_pads: 0, discs: 0, batteries: 0, shock_absorbers: 0, tires: 0, windshields: 4 },
  7: { wipers: 0, brake_pads: 0, discs: 0, batteries: 0, shock_absorbers: 0, tires: 0, windshields: 4 }
};

// Objectifs par service
const departmentTargets = {
  mechanical: {
    tires: 40,
    shock_absorbers: 10,
    wipers: 28,
    brake_pads: 18,
    batteries: 9,
    discs: 8,
    windshields: 0
  },
  quickService: {
    tires: 50,
    shock_absorbers: 10,
    wipers: 186,
    brake_pads: 40,
    batteries: 10,
    discs: 15,
    windshields: 0
  },
  bodywork: {
    tires: 0,
    shock_absorbers: 0,
    wipers: 0,
    brake_pads: 0,
    batteries: 0,
    discs: 0,
    windshields: 15
  }
};

const COLORS = [
  '#2563eb', // blue-600
  '#16a34a', // green-600
  '#9333ea', // purple-600
  '#ea580c', // orange-600
  '#0891b2', // cyan-600
  '#4f46e5', // indigo-600
  '#be185d'  // pink-700
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
        <p className="text-sm font-medium mb-1">{data.name}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Réalisé:</span> {data.value}/{data.totalDepartmentSales} ventes
          </p>
          <p className="text-sm">
            <span className="font-medium">Pourcentage:</span> {data.percentage}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Tooltip pour le graphique d'objectifs
const TargetTooltip = ({ active, payload, t }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    // Calculer l'objectif du jour
    const currentDate = new Date();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const currentDay = currentDate.getDate();
    const daysRemaining = Math.max(1, lastDayOfMonth - currentDay);
    const remainingToTarget = Math.max(0, data.target - data.actual);
    
    // Arrondir au supérieur pour l'objectif du jour
    const dailyTargetRaw = remainingToTarget / daysRemaining;
    const dailyTarget = Math.ceil(dailyTargetRaw);
    
    // Calculer le prorata des objectifs
    const monthProgress = Math.round((currentDay / lastDayOfMonth) * 100);
    const proratedTarget = Math.round(data.target * (monthProgress / 100));
    const proratedDiff = data.actual - proratedTarget;
    
    // Déterminer la couleur en fonction du prorata
    let bgColor = "bg-amber-50";
    let borderColor = "border-amber-200";
    let textColor = "text-amber-700";
    
    if (proratedTarget === 0) {
      bgColor = "bg-gray-50";
      borderColor = "border-gray-200";
      textColor = "text-gray-700";
    } else if (data.actual >= proratedTarget) {
      bgColor = "bg-green-50";
      borderColor = "border-green-200";
      textColor = "text-green-700";
    } else if (data.actual < proratedTarget * 0.75) {
      bgColor = "bg-red-50";
      borderColor = "border-red-200";
      textColor = "text-red-700";
    }
    
    return (
      <div className={`${bgColor} p-4 border ${borderColor} shadow-lg rounded-lg max-w-xs`}>
        <h3 className="text-base font-semibold text-gray-900 mb-2">{data.name}</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Réalisé :</span>
            <span className="text-sm font-medium text-gray-900">{data.actual}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Objectif :</span>
            <span className="text-sm font-medium text-gray-900">{data.target}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Prorata :</span>
            <span className={`text-sm font-medium ${textColor}`}>
              {proratedDiff >= 0 ? '+' : ''}{proratedDiff}
            </span>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avancement global :</span>
              <span className={`text-sm font-bold ${textColor}`}>{data.percentage}%</span>
            </div>
            
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${textColor.replace('text', 'bg')}`}
                style={{ width: `${Math.min(data.percentage, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">À réaliser :</span>
            <span className="text-sm font-medium text-gray-900">{remainingToTarget} sur {daysRemaining} jours</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Objectif du jour :</span>
            <span className="text-sm font-medium text-gray-900">{dailyTarget}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Fonction pour calculer le facteur d'évolution par année
const getYearFactor = (year) => {
  const baseYear = 2025;
  const yearDiff = year - baseYear;
  // Croissance de 3% par an
  return Math.pow(1.03, yearDiff);
};

const DepartmentTable = ({ title, employees, selectedProduct, onSelectProduct, departmentKey, t, viewMode, departmentTargets, onSelectEmployee, selectedEmployee, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, periodType, setPeriodType }) => {
  // Get all product keys
  const productKeys = Object.keys(productLabels);
  
  // Calculate total sales for each product
  const productTotals = {};
  productKeys.forEach(key => {
    productTotals[key] = employees.reduce((sum, emp) => sum + (employeeSales[emp.id][key] || 0), 0);
  });
  
  // Calculate total sales for all products
  const totalSales = productKeys.reduce((sum, key) => sum + productTotals[key], 0);

  // Obtenir le mois en cours
  const getCurrentMonth = () => {
    const currentDate = new Date();
    return String(currentDate.getMonth() + 1).padStart(2, '0');
  };

  // Calculer le prorata des objectifs en fonction de la progression du mois
  const currentDate = new Date();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const currentDay = currentDate.getDate();
  const monthProgress = Math.round((currentDay / lastDayOfMonth) * 100);
  
  // Get color based on percentage relative to prorated target
  const getBarColor = (actual, target) => {
    const proratedTarget = Math.round(target * (monthProgress / 100));
    if (proratedTarget === 0) return '#94a3b8'; // gray-400 for zero targets
    
    const proratedPercentage = Math.round((actual / proratedTarget) * 100);
    
    if (proratedPercentage >= 100) return '#22c55e'; // green-600
    if (proratedPercentage >= 75) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };
  
  // Get background color based on percentage relative to prorated target
  const getBgColor = (actual, target) => {
    const proratedTarget = Math.round(target * (monthProgress / 100));
    if (proratedTarget === 0) return 'bg-gray-50';
    
    const proratedPercentage = Math.round((actual / proratedTarget) * 100);
    
    if (proratedPercentage >= 100) return 'bg-green-50';
    if (proratedPercentage >= 75) return 'bg-amber-50';
    return 'bg-red-50';
  };
  
  // Get text color based on percentage relative to prorated target
  const getTextColor = (actual, target) => {
    const proratedTarget = Math.round(target * (monthProgress / 100));
    if (proratedTarget === 0) return 'text-gray-700';
    
    const proratedPercentage = Math.round((actual / proratedTarget) * 100);
    
    if (proratedPercentage >= 100) return 'text-green-700';
    if (proratedPercentage >= 75) return 'text-amber-700';
    return 'text-red-700';
  };

  // Calculate individual employee targets
  const calculateEmployeeTargets = () => {
    const targets = {};
    
    employees.forEach(emp => {
      targets[emp.id] = {};
      
      productKeys.forEach(key => {
        const departmentTarget = departmentTargets[departmentKey][key] || 0;
        targets[emp.id][key] = Math.round(departmentTarget / employees.length);
      });
      
      // Calculate total target for this employee
      targets[emp.id].total = productKeys.reduce((sum, key) => sum + targets[emp.id][key], 0);
    });
    
    return targets;
  };
  
  const employeeTargets = calculateEmployeeTargets();

  // Prepare pie chart data for distribution view
  const preparePieData = () => {
    if (!selectedProduct) return [];
    
    // Calculate total sales for the selected product
    const totalProductSales = selectedProduct === 'total' 
      ? totalSales
      : productTotals[selectedProduct] || 0;
    
    // Create pie data for each employee
    return employees
      .filter(emp => {
        const sales = selectedProduct === 'total'
          ? productKeys.reduce((sum, key) => sum + (employeeSales[emp.id][key] || 0), 0)
          : employeeSales[emp.id][selectedProduct] || 0;
        return sales > 0;
      })
      .map(emp => {
        const sales = selectedProduct === 'total'
          ? productKeys.reduce((sum, key) => sum + (employeeSales[emp.id][key] || 0), 0)
          : employeeSales[emp.id][selectedProduct] || 0;
        
        const percentage = totalProductSales > 0 
          ? Math.round((sales / totalProductSales) * 100) 
          : 0;
        
        return {
          name: emp.name,
          value: sales,
          totalDepartmentSales: totalProductSales,
          percentage
        };
      });
  };
  
  const pieData = preparePieData();

  // Get chart title based on selection
  const chartTitle = selectedProduct === 'total'
    ? t('crescendo.totalSalesByCCS')
    : selectedProduct 
      ? t('crescendo.productSalesByCCS', { product: t(productLabels[selectedProduct]) }) 
      : t('crescendo.salesDistributionByCCS');

  // Préparer les données pour le graphique d'objectifs d'un employé
  const prepareEmployeeTargetData = (employeeId) => {
    if (!employeeId) return [];
    
    // Calculer d'abord les totaux pour tous les produits
    let totalActual = 0;
    let totalTarget = 0;
    
    const productData = productKeys
      .filter(key => employeeTargets[employeeId][key] > 0) // Ne montrer que les produits avec un objectif
      .map(key => {
        const actual = employeeSales[employeeId][key] || 0;
        const target = employeeTargets[employeeId][key] || 0;
        const percentage = target > 0 ? Math.round((actual / target) * 100) : 0;
        
        totalActual += actual;
        totalTarget += target;
        
        return {
          id: key,
          name: t(productLabels[key]),
          actual,
          target,
          percentage
        };
      });
    
    // Ajouter la ligne de total au début du tableau
    const totalPercentage = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0;
    
    return [
      {
        id: 'total',
        name: 'TOTAL',
        actual: totalActual,
        target: totalTarget,
        percentage: totalPercentage
      },
      ...productData
    ];
  };

  // Trouver l'employé sélectionné
  const selectedEmployeeData = selectedEmployee ? 
    employees.find(emp => emp.id === selectedEmployee) : null;

  // Fonction pour obtenir le nom du mois
  const getMonthName = (monthNumber) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[parseInt(monthNumber) - 1];
  };

  // Fonction pour obtenir les données du graphique des entrées
  const getEntriesChartData = () => {
    return employees.map(emp => {
      const totalSales = productKeys.reduce((sum, key) => sum + (employeeSales[emp.id][key] || 0), 0);
      const baseEntries = totalSales * 2.5; // Ratio entrées/ventes
      
      // Multiplier par 12 pour la vue annuelle
      const multiplier = periodType === 'yearly' ? 12 : 1;
      
      return {
        name: emp.name.split(' ')[0], // Prénom seulement
        [selectedYear - 2]: Math.round(baseEntries * 0.85 * getYearFactor(selectedYear - 2) * multiplier),
        [selectedYear - 1]: Math.round(baseEntries * 0.92 * getYearFactor(selectedYear - 1) * multiplier),
        [selectedYear]: Math.round(baseEntries * getYearFactor(selectedYear) * multiplier)
      };
    });
  };

  // Fonction pour obtenir les données du graphique du CA
  const getCAChartData = () => {
    return employees.map(emp => {
      const totalSales = productKeys.reduce((sum, key) => sum + (employeeSales[emp.id][key] || 0), 0);
      const baseCA = totalSales * 150; // CA moyen par vente
      
      // Multiplier par 12 pour la vue annuelle
      const multiplier = periodType === 'yearly' ? 12 : 1;
      
      return {
        name: emp.name.split(' ')[0], // Prénom seulement
        [selectedYear - 2]: Math.round(baseCA * 0.85 * getYearFactor(selectedYear - 2) * multiplier),
        [selectedYear - 1]: Math.round(baseCA * 0.92 * getYearFactor(selectedYear - 1) * multiplier),
        [selectedYear]: Math.round(baseCA * getYearFactor(selectedYear) * multiplier)
      };
    });
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        {viewMode === 'targets' ? (
          // Vue Objectifs individuels
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    {t('crescendo.employee')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.total')}
                  </th>
                  {productKeys.map((key) => (
                    <th key={key} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t(productLabels[key])}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Encours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => {
                  // Calculate total sales for this employee
                  const totalSalesForEmployee = productKeys.reduce((sum, key) => sum + (employeeSales[employee.id][key] || 0), 0);
                  const totalTargetForEmployee = employeeTargets[employee.id].total;
                  const totalPercentage = totalTargetForEmployee > 0 ? Math.round((totalSalesForEmployee / totalTargetForEmployee) * 100) : 0;
                  
                  // Calculate prorated target and percentage
                  const proratedTotalTarget = Math.round(totalTargetForEmployee * (monthProgress / 100));
                  const proratedTotalPercentage = proratedTotalTarget > 0 ? Math.round((totalSalesForEmployee / proratedTotalTarget) * 100) : 0;
                  
                  return (
                   <React.Fragment key={employee.id}>
                    <tr 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedEmployee === employee.id ? 'bg-blue-50' : ''}`}
                      onClick={() => onSelectEmployee(departmentKey, employee.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-center ${getBgColor(totalSalesForEmployee, totalTargetForEmployee)}`}>
                        <div className="flex flex-col items-center">
                          <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-0.5 rounded-full text-sm font-medium ${getTextColor(totalSalesForEmployee, totalTargetForEmployee)}`}>
                            {totalSalesForEmployee}/{totalTargetForEmployee}
                          </span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${Math.min(proratedTotalPercentage, 100)}%`,
                                backgroundColor: getBarColor(totalSalesForEmployee, totalTargetForEmployee),
                                transition: 'width 0.5s ease-out'
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      {productKeys.map(key => {
                        const sales = employeeSales[employee.id][key] || 0;
                        const target = employeeTargets[employee.id][key] || 0;
                        const percentage = target > 0 ? Math.round((sales / target) * 100) : 0;
                        
                        // Calculate prorated target and percentage
                        const proratedTarget = Math.round(target * (monthProgress / 100));
                        const proratedPercentage = proratedTarget > 0 ? Math.round((sales / proratedTarget) * 100) : 0;
                        
                        return (
                          <td key={key} className={`px-6 py-4 whitespace-nowrap text-center ${target > 0 ? getBgColor(sales, target) : ''}`}>
                            <div className="flex flex-col items-center">
                              <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                target > 0 ? getTextColor(sales, target) : 'text-gray-800 bg-gray-100'
                              }`}>
                                {sales}/{target}
                              </span>
                              {target > 0 && (
                                <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                  <div 
                                    className="h-full rounded-full" 
                                    style={{ 
                                      width: `${Math.min(proratedPercentage, 100)}%`,
                                      backgroundColor: getBarColor(sales, target),
                                      transition: 'width 0.5s ease-out'
                                    }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      {/* Colonne Encours */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center">
                          <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            {Math.round(totalSalesForEmployee * 1.5 + Math.random() * 10)}
                          </span>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Graphique d'avancement pour l'employe selectionne - directement apres l'employe */}
                    {selectedEmployee === employee.id && (
                      <tr>
                        <td colSpan={productKeys.length + 2} className="px-0 py-0">
                          <div className="bg-white p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-medium text-gray-900">
                                Avancement de {employee.name}
                              </h4>
                              <button 
                                onClick={() => onSelectEmployee(departmentKey, null)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                            
                            <div className="h-72">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={prepareEmployeeTargetData(selectedEmployee)}
                                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis 
                                    dataKey="name" 
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    tick={{ fontSize: 11, fill: '#374151' }}
                                  />
                                  <YAxis tick={{ fontSize: 12, fill: '#374151' }} />
                                  <Tooltip content={props => <TargetTooltip {...props} t={t} />} />
                                  <Legend 
                                    iconType="rect"
                                    formatter={(value, entry) => {
                                      const color = value === 'Réalisé' ? '#3b82f6' : '#6b7280';
                                      return (
                                        <span style={{ color: color, fontWeight: '500' }}>
                                          {value}
                                        </span>
                                      );
                                    }}
                                    wrapperStyle={{
                                      '--recharts-legend-item-color': '#3b82f6'
                                    }}
                                  />
                                  <Bar dataKey="actual" name="Réalisé" radius={[4, 4, 0, 0]} barSize={40}>
                                    {prepareEmployeeTargetData(selectedEmployee).map((entry, index) => {
                                      // Calculer la couleur basée sur le prorata
                                      const proratedTarget = Math.round(entry.target * (monthProgress / 100));
                                      const proratedPercentage = proratedTarget > 0 ? Math.round((entry.actual / proratedTarget) * 100) : 0;
                                      
                                      let barColor = '#ef4444'; // rouge par défaut
                                      if (proratedTarget === 0) {
                                        barColor = '#94a3b8'; // gris pour les objectifs à 0
                                      } else if (proratedPercentage >= 100) {
                                        barColor = '#22c55e'; // vert
                                      } else if (proratedPercentage >= 75) {
                                        barColor = '#f59e0b'; // orange
                                      }
                                      
                                      return (
                                        <Cell key={`cell-${index}`} fill={barColor} />
                                      );
                                    })}
                                  </Bar>
                                  <Bar 
                                    dataKey="target" 
                                    name="Objectif" 
                                    fill="#d1d5db" 
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                   </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            {/* Graphiques comparatifs pour Entrées + CA par CCS */}
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
                          <div className="w-4 h-4 bg-blue-300 rounded"></div>
                          <span className="text-sm">{selectedYear}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique Nombre d'entrées par CCS */}
              <Card>
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Nombre d'entrées par CCS</h3>
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
                        data={getEntriesChartData()}
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
                          tickFormatter={(value) => formatNumber(value)}
                          domain={[0, 'auto']}
                        />
                        <Tooltip 
                          formatter={(value, name) => [formatNumber(value), name]}
                          labelFormatter={(label) => label}
                        />
                        <Bar dataKey={selectedYear - 2} name={selectedYear - 2} fill="#1e3a8a" barSize={60}>
                          <LabelList 
                            dataKey={selectedYear - 2}
                            position="top"
                            formatter={(value) => formatNumber(value)}
                            style={{ fontSize: '12px', fill: '#1e3a8a', fontWeight: 'bold' }}
                          />
                        </Bar>
                        <Bar dataKey={selectedYear - 1} name={selectedYear - 1} fill="#3b82f6" barSize={60}>
                          <LabelList 
                            dataKey={selectedYear - 1}
                            position="top"
                            formatter={(value) => formatNumber(value)}
                            style={{ fontSize: '12px', fill: '#3b82f6', fontWeight: 'bold' }}
                          />
                        </Bar>
                        <Bar dataKey={selectedYear} name={selectedYear} fill="#93c5fd" barSize={60}>
                          <LabelList 
                            dataKey={selectedYear}
                            position="top"
                            formatter={(value) => formatNumber(value)}
                            style={{ fontSize: '12px', fill: '#93c5fd', fontWeight: 'bold' }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Graphique CA par CCS */}
              <Card>
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Chiffre d'affaires par CCS</h3>
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
                        data={getCAChartData()}
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
                </CardContent>
              </Card>
            </div>
          </div>
          </>
        )}

        {/* Graphique en secteurs pour la répartition des ventes */}
        {viewMode === 'distribution' && selectedProduct && pieData.length > 0 && (
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-900 mb-4">{chartTitle}</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique en secteurs */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Répartition des ventes</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name.split(' ')[0]} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Graphique Nombre d'OR par CCS */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Nombre d'OR par CCS</h4>
                <div className="mb-4 text-center">
                  <h4 className="text-sm font-medium text-gray-700">
                    {periodType === 'yearly' 
                      ? `Comparaison annuelle`
                      : `Comparaison ${getMonthName(getCurrentMonth())}`}
                  </h4>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={employees.map(emp => {
                        // Simuler un nombre d'OR basé sur les ventes (1 OR pour 3-4 ventes en moyenne)
                        const totalSales = productKeys.reduce((sum, key) => sum + (employeeSales[emp.id][key] || 0), 0);
                        const orCount = Math.round(totalSales / 3.5);
                        return {
                          name: emp.name.split(' ')[0], // Prénom seulement
                          or: orCount,
                          fullName: emp.name
                        };
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
                        tickFormatter={(value) => formatNumber(value)}
                      />
                      <Tooltip 
                        formatter={(value) => [formatNumber(value), 'Nombre d\'OR']}
                        labelFormatter={(label, payload) => {
                          const data = payload?.[0]?.payload;
                          return data?.fullName || label;
                        }}
                      />
                      <Bar dataKey="or" name="Nombre d'OR" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default function CCSDetailsView({ data, viewMode = 'distribution', periodType = 'monthly', setPeriodType }) {
  // Maintain separate selected products for each department
  const [selectedProducts, setSelectedProducts] = useState({
    mechanical: null,
    quickService: null,
    bodywork: null
  });
  
  // État pour l'employé sélectionné (pour le graphique d'objectifs)
  const [selectedEmployees, setSelectedEmployees] = useState({
    mechanical: null,
    quickService: null,
    bodywork: null
  });
  
  // États pour la sélection de mois et année
  const [selectedMonth, setSelectedMonth] = useState('07'); // Juillet par défaut
  const [selectedYear, setSelectedYear] = useState(2025); // 2025 par défaut
  
  const { t } = useTranslation();

  const handleSelectProduct = (department, product) => {
    // Dans la vue "targets", on ne permet pas de sélectionner les produits
    if (viewMode === 'targets') return;
    
    setSelectedProducts(prev => ({
      ...prev,
      [department]: product
    }));
  };
  
  const handleSelectEmployee = (department, employeeId) => {
    setSelectedEmployees(prev => ({
      ...prev,
      [department]: prev[department] === employeeId ? null : employeeId
    }));
  };

  // Get all product keys
  const productKeys = Object.keys(productLabels);

  // Fonction pour obtenir les données du graphique des entrées
  const getEntriesChartData = () => {
    return employeesByDepartment.mechanical.map(emp => {
      const totalSales = productKeys.reduce((sum, key) => sum + (employeeSales[emp.id][key] || 0), 0);
      const baseEntries = totalSales * 2.5; // Ratio entrées/ventes
      
      return {
        name: emp.name.split(' ')[0], // Prénom seulement
        2023: Math.round(baseEntries * 0.85),
        2024: Math.round(baseEntries * 0.92),
        2025: Math.round(baseEntries)
      };
    });
  };

  // Fonction pour obtenir les données du graphique du CA
  const getCAChartData = () => {
    return employeesByDepartment.mechanical.map(emp => {
      const totalSales = productKeys.reduce((sum, key) => sum + (employeeSales[emp.id][key] || 0), 0);
      const baseCA = totalSales * 150; // CA moyen par vente
      
      return {
        name: emp.name.split(' ')[0], // Prénom seulement
        2023: Math.round(baseCA * 0.85),
        2024: Math.round(baseCA * 0.92),
        2025: Math.round(baseCA)
      };
    });
  };

  return (
    <div className="space-y-6">
      <DepartmentTable 
        title={t('dashboard.mechanical')} 
        employees={employeesByDepartment.mechanical}
        selectedProduct={selectedProducts.mechanical}
        onSelectProduct={handleSelectProduct}
        departmentKey="mechanical"
        t={t}
        viewMode={viewMode}
        departmentTargets={departmentTargets}
        onSelectEmployee={handleSelectEmployee}
        selectedEmployee={selectedEmployees.mechanical}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        periodType={periodType}
        setPeriodType={setPeriodType}
      />
      <DepartmentTable 
        title={t('dashboard.quickService')}
        employees={employeesByDepartment.quickService}
        selectedProduct={selectedProducts.quickService}
        onSelectProduct={handleSelectProduct}
        departmentKey="quickService"
        t={t}
        viewMode={viewMode}
        departmentTargets={departmentTargets}
        onSelectEmployee={handleSelectEmployee}
        selectedEmployee={selectedEmployees.quickService}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        periodType={periodType}
        setPeriodType={setPeriodType}
      />
      <DepartmentTable 
        title={t('dashboard.bodywork')}
        employees={employeesByDepartment.bodywork}
        selectedProduct={selectedProducts.bodywork}
        onSelectProduct={handleSelectProduct}
        departmentKey="bodywork"
        t={t}
        viewMode={viewMode}
        departmentTargets={departmentTargets}
        onSelectEmployee={handleSelectEmployee}
        selectedEmployee={selectedEmployees.bodywork}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        periodType={periodType}
        setPeriodType={setPeriodType}
      />
    </div>
  );
}