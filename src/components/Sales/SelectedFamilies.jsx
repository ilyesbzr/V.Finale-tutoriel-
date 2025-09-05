import React from 'react';

export default function SelectedFamilies({ selectedFamilies, onUpdate, isEditing }) {
  const allFamilies = [
    'tires',
    'shockAbsorbers', 
    'wipers',
    'brakePads',
    'batteries',
    'windshields',
    'discs'
  ];

  const handleToggleFamily = (family) => {
    if (selectedFamilies.includes(family)) {
      onUpdate(selectedFamilies.filter(f => f !== family));
    } else {
      onUpdate([...selectedFamilies, family]);
    }
  };

  const getFamilyLabel = (family) => {
    const translations = {
      'tires': 'Pneus',
      'shockAbsorbers': 'Amortisseurs',
      'wipers': 'Balais',
      'brakePads': 'Plaquettes',
      'batteries': 'Batteries',
      'windshields': 'Pare-brise',
      'discs': 'Disques'
    };
    return translations[family] || family;
  };

  if (isEditing) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {allFamilies.map((family) => (
          <div
            key={family}
            onClick={() => handleToggleFamily(family)}
            className={`
              p-4 rounded-lg cursor-pointer transition-colors text-center
              ${selectedFamilies.includes(family) 
                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'}
            `}
          >
            <span className="text-sm font-medium">{getFamilyLabel(family)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {selectedFamilies.map((family) => (
        <div key={family} className="bg-indigo-50 p-4 rounded-lg text-center">
          <span className="text-sm font-medium text-indigo-700">{getFamilyLabel(family)}</span>
        </div>
      ))}
    </div>
  );
}