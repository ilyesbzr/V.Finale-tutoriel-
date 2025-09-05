import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`card-modern animate-fade-in ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title }) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}