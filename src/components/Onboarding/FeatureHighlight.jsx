import React from 'react';

export default function FeatureHighlight({ 
  title, 
  description, 
  icon, 
  color = 'blue',
  isActive = false 
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700'
  };

  const iconColorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600'
  };

  return (
    <div className={`
      flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300
      ${isActive ? 'scale-105 shadow-lg' : 'hover:scale-102'}
      ${colorClasses[color]}
    `}>
      <div className={`w-10 h-10 ${iconColorClasses[color]} rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-lg">{icon}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}