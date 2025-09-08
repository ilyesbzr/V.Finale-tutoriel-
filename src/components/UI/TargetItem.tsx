import React from 'react';
import { formatNumber } from '../../utils/formatters';

interface TargetItemProps {
  label: string;
  value: number;
  unit?: string;
}

export default function TargetItem({ label, value, unit = '' }: TargetItemProps): JSX.Element {
  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
      <h4 className="text-sm font-medium text-gray-900 mb-4">{label}</h4>
      <p className="text-2xl font-semibold text-gray-900">
        {formatNumber(value)}{unit}
      </p>
    </div>
  );
}