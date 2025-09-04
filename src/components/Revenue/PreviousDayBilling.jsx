import React from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import { formatNumber } from '../../utils/formatters';

export default function PreviousDayBilling({ data }) {
  const billingData = [
    {
      name: 'Mécanique',
      value: data.mechanical.previousDayBilling,
      color: '#2563eb'
    },
    {
      name: 'Service Rapide',
      value: data.quickService.previousDayBilling, 
      color: '#16a34a'
    },
    {
      name: 'Carrosserie',
      value: data.bodywork.previousDayBilling,
      color: '#9333ea'
    }
  ];

  const total = billingData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader title="Facturation J-1" />
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {/* Total */}
          <div className="flex flex-col items-center">
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
                  stroke="#4f46e5"
                  strokeWidth="10"
                  strokeDasharray="283 283"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold">{formatNumber(total)}h</span>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600">Total HT</p>
          </div>

          {/* Services */}
          {billingData.map((dept) => (
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
  );
}