import React from 'react';
import { SiteSelector } from '../components/UI/SiteSelector';

const Hours: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Hours</h1>
        <SiteSelector />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Hours Overview</h2>
          <p className="text-gray-600">Hours data and analytics will be displayed here.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Time Tracking</h2>
          <p className="text-gray-600">Time tracking metrics and reports will be shown here.</p>
        </div>
      </div>
    </div>
  );
};

export default Hours;