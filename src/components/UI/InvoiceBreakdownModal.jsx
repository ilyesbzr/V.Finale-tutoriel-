import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

export default function InvoiceBreakdownModal({ isOpen, onClose, data, title }) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const total = data.client + data.warranty + data.transfer;
  
  const pieData = [
    { name: t('entries.client'), value: data.client, color: '#2563eb' },
    { name: t('entries.warranty'), value: data.warranty, color: '#16a34a' },
    { name: t('entries.transfer'), value: data.transfer, color: '#9333ea' }
  ];

  const getPercentage = (value) => {
    return Math.round((value / total) * 100);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm">{data.value} {t('entries.invoices')}</p>
          <p className="text-sm font-medium text-gray-600">{getPercentage(data.value)}%</p>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, percent }) => {
    // Calculate radius for label positioning
    const radius = outerRadius * 1.1;
    
    // Calculate label position
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const x = cx + radius * cos;
    const y = cy + radius * sin;
    
    // Calculate percentage
    const percentage = (percent * 100).toFixed(0);

    // Only show label if percentage is greater than 3%
    if (percentage < 3) return null;

    // Calculate background dimensions
    const padding = 4;
    const backgroundWidth = percentage.length * 8 + padding * 2;
    const backgroundHeight = 16 + padding * 2;

    return (
      <g>
        {/* Background rectangle */}
        <rect
          x={x - backgroundWidth / 2}
          y={y - backgroundHeight / 2}
          width={backgroundWidth}
          height={backgroundHeight}
          fill="white"
          rx={4}
          ry={4}
        />
        {/* Percentage text */}
        <text
          x={x}
          y={y}
          fill="#1e293b"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={13}
          fontWeight="600"
        >
          {`${percentage}%`}
        </text>
      </g>
    );
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Pie Chart */}
            <div className="h-72 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span className="text-sm font-medium">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-3">
              {pieData.map((item) => (
                <div 
                  key={item.name}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-gray-900">{item.value}</span>
                      <span className="ml-2 text-sm text-gray-500">({getPercentage(item.value)}%)</span>
                    </div>
                  </div>
                  <div className="mt-2 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                      <div
                        style={{ 
                          width: `${getPercentage(item.value)}%`,
                          backgroundColor: item.color
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-900">{t('common.total')}</span>
                  <span className="text-lg font-semibold text-blue-900">{total} {t('entries.invoices')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}