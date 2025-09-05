import React from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import { formatNumber } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';
import { UsersIcon } from '@heroicons/react/24/outline';

export default function SalesTargets({ title, data, staffCount = 1 }) {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <div className="flex items-center mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
          <UsersIcon className="h-5 w-5 text-indigo-600 mr-2" />
          <span className="text-sm font-medium text-indigo-800">
            {staffCount} {staffCount > 1 ? 'collaborateurs' : 'collaborateur'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries({
            [t('crescendo.products.tires')]: data.tires.target,
            [t('crescendo.products.shockAbsorbers')]: data.shockAbsorbers.target,
            [t('crescendo.products.wipers')]: data.wipers.target,
            [t('crescendo.products.brakePads')]: data.brakePads.target,
            [t('crescendo.products.batteries')]: data.batteries.target,
            [t('crescendo.products.windshields')]: data.windshields.target
          }).map(([name, target]) => (
            <div key={name} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{name}</h4>
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatNumber(target)}
                  </p>
                  <p className="text-xs text-gray-500 ml-1">total</p>
                </div>
                
                {staffCount > 1 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></div>
                      <span className="text-sm font-medium text-indigo-700">
                        {formatNumber(Math.round(target / staffCount))}
                      </span>
                      <span className="text-xs text-gray-600 ml-1">/ collab.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}