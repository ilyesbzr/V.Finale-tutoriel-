import React from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import SelectedFamilies from './SelectedFamilies';

export default function SalesTargetsSection({
  title,
  department,
  selectedFamilies,
  onUpdateFamilies,
  familyTargets,
  onFamilyTargetChange,
  isEditing,
  staffCount
}) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{department}</h3>
      <div className="mb-6">
        <SelectedFamilies
          selectedFamilies={selectedFamilies}
          onUpdate={onUpdateFamilies}
          isEditing={isEditing}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {selectedFamilies.map((family) => (
          <div key={family} className="flex flex-col items-center space-y-2">
            <div className="text-sm font-medium text-gray-600">
              {family === 'windshields' ? 'Pare-brise' : 
               family === 'tires' ? 'Pneus' :
               family === 'shockAbsorbers' ? 'Amortisseurs' :
               family === 'wipers' ? 'Balais' :
               family === 'brakePads' ? 'Plaquettes' :
               family === 'batteries' ? 'Batteries' :
               family === 'discs' ? 'Disques' : 
               family}
            </div>
            <div className="bg-white p-4 rounded-lg shadow w-full">
              {isEditing ? (
                <input
                  type="number"
                  value={familyTargets[family] || 0}
                  onChange={(e) => onFamilyTargetChange(family, e.target.value)}
                  className="w-full text-center text-2xl font-semibold rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-2xl font-semibold text-gray-900 text-center">
                  {familyTargets[family] || 0}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}