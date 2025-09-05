import React from 'react';
import { formatNumber } from '../../utils/formatters';

export function CustomLabel({ x, y, value, fill, dataKey, unit = '' }) {
  const formattedValue = dataKey === 'Avancement' 
    ? `${value}%` 
    : `${formatNumber(value)}${unit}`;

  return (
    <text 
      x={x} 
      y={y} 
      dy={-10} 
      fill={fill} 
      fontSize={12} 
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {formattedValue}
    </text>
  );
}

export function CustomTooltip({ active, payload, type = 'revenue' }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
        <p className="text-sm font-medium">{data.name}</p>
        <p className="text-sm">
          {type === 'revenue' ? `${formatNumber(data.value)}€` : `${formatNumber(data.value)}h`}
        </p>
        <p className="text-sm font-medium text-gray-600">{data.percentage}%</p>
      </div>
    );
  }
  return null;
}