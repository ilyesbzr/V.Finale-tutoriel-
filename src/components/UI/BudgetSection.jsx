import React from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import { formatNumber } from '../../utils/formatters';

export default function BudgetSection({ 
  title, 
  budgetData, 
  isEditing, 
  onBudgetChange 
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Heures totales</span>
              <div className="text-right">
                {isEditing ? (
                  <input
                    type="number"
                    value={budgetData.totalHours}
                    onChange={(e) => onBudgetChange('totalHours', e.target.value)}
                    className="w-24 text-right rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-900">
                    <span className="text-xl">{formatNumber(budgetData.totalHours)}h</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">CA net</span>
              <div className="text-right">
                {isEditing ? (
                  <input
                    type="number"
                    value={budgetData.revenue}
                    onChange={(e) => onBudgetChange('revenue', e.target.value)}
                    className="w-24 text-right rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-900">
                    <span className="text-xl">{formatNumber(budgetData.revenue)}€</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">CA/H</span>
              <div className="text-right">
                <span className="text-lg font-semibold text-gray-900">
                  <span className="text-xl">{formatNumber(budgetData.totalHours ? Math.round(budgetData.revenue / budgetData.totalHours) : 0)}€/h</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}