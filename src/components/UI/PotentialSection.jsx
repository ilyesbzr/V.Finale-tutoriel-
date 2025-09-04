import React from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import { formatNumber } from '../../utils/formatters';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

export default function PotentialSection({
  title,
  potentialData,
  isPotentialLocked,
  isEditing,
  onPotentialChange,
  onLockPotential,
  onResetPotential
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="text-base">Service</span>
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center justify-center gap-2">
                  <span className="text-base">Potentiel d'heures en début de mois</span>
                  <button
                    onClick={onLockPotential}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      isPotentialLocked 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={isPotentialLocked ? "Déverrouiller les valeurs" : "Verrouiller les valeurs de début de mois"}
                  >
                    {isPotentialLocked ? (
                      <>
                        <LockClosedIcon className="h-3 w-3" />
                        <span>Figé</span>
                      </>
                    ) : (
                      <>
                        <LockOpenIcon className="h-3 w-3" />
                        <span>Figer</span>
                      </>
                    )}
                  </button>
                  {isPotentialLocked && isEditing && (
                    <button
                      onClick={onResetPotential}
                      className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-medium transition-colors"
                      title="Réinitialiser aux valeurs figées"
                    >
                      Réinitialiser
                    </button>
                  )}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="text-base">Potentiel d'heures actualisé</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(potentialData)
                .filter(([dept]) => dept !== 'total')
                .map(([dept, data]) => (
                <tr key={dept}>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                    {dept === 'mechanical' ? 'Mécanique' :
                     dept === 'quickService' ? 'Service Rapide' :
                     'Carrosserie'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {isEditing && !isPotentialLocked ? (
                      <div className="flex justify-center">
                        <input
                          type="number"
                          value={data.hours}
                          onChange={(e) => onPotentialChange(dept, 'hours', e.target.value)}
                          className="w-24 text-center text-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    ) : (
                      <div className={`text-center ${isPotentialLocked ? 'bg-green-50 px-2 py-1 rounded' : ''}`}>
                        <span className="text-xl">{formatNumber(data.hours)}h</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {isEditing ? (
                      <div className="flex justify-center">
                        <input
                          type="number"
                          value={data.updatedHours}
                          onChange={(e) => onPotentialChange(dept, 'updatedHours', e.target.value)}
                          className="w-24 text-center text-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-xl">{formatNumber(data.updatedHours)}h</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                  Global
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {isEditing && !isPotentialLocked ? (
                    <div className="flex justify-center">
                      <input
                        type="number"
                        value={potentialData.total.hours}
                        onChange={(e) => onPotentialChange('total', 'hours', e.target.value)}
                        className="w-24 text-center text-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  ) : (
                    <div className={`text-center ${isPotentialLocked ? 'bg-green-50 px-2 py-1 rounded' : ''}`}>
                      <span className="text-xl">{formatNumber(potentialData.total.hours)}h</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {isEditing ? (
                    <div className="flex justify-center">
                      <input
                        type="number"
                        value={potentialData.total.updatedHours}
                        onChange={(e) => onPotentialChange('total', 'updatedHours', e.target.value)}
                        className="w-24 text-center text-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-xl">{formatNumber(potentialData.total.updatedHours)}h</span>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {isPotentialLocked && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-bold text-lg">Valeurs de début de mois figées.</span> <span className="text-lg">Ces valeurs serviront de référence pour le potentiel d'heures en début de mois.</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}