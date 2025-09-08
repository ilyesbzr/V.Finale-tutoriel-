import React from 'react';
import { SiteSelector } from '../components/UI/SiteSelector';

const Revenue: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Revenue</h1>
        <SiteSelector />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <p className="text-gray-600">Revenue data and analytics will be displayed here.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Trends</h2>
          <p className="text-gray-600">Revenue trends and forecasts will be shown here.</p>
        </div>
      </div>
    </div>
  );
};

export default Revenue;