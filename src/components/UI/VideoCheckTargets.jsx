import React from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import { formatCurrency } from '../../utils/formatters';

export default function VideoCheckTargets({ 
  title, 
  targets, 
  isEditing, 
  onTargetChange 
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Taux de réalisation</span>
              <div className="text-right">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={targets.completionRate}
                      onChange={(e) => onTargetChange('completionRate', e.target.value)}
                      className="w-20 text-right rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                ) : (
                  <span className="text-lg font-semibold text-gray-900">
                    {targets.completionRate}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Objectif CA</span>
              <div className="text-right">
                {isEditing ? (
                  <input
                    type="number"
                    value={targets.revenue}
                    onChange={(e) => onTargetChange('revenue', e.target.value)}
                    className="w-32 text-right rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    min="0"
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(targets.revenue)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}