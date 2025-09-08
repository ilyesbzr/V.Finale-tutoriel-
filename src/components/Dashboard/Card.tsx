import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 animate-fade-in ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title }) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 bg-white">
      <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 bg-white ${className}`}>
      {children}
    </div>
  );
}