import React from 'react';
import { formatNumber } from '../../utils/formatters';

interface CustomLabelProps {
  x?: number;
  y?: number;
  value?: number;
  fill?: string;
  dataKey?: string;
  unit?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  type?: 'revenue' | 'hours';
}

export function CustomLabel({ x, y, value, fill, dataKey, unit = '' }: CustomLabelProps): JSX.Element | null {
  if (x === undefined || y === undefined || value === undefined) return null;
  
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

export function CustomTooltip({ active, payload, type = 'revenue' }: CustomTooltipProps): JSX.Element | null {
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