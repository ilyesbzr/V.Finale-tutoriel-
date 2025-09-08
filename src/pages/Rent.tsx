import React from 'react';
import { SiteSelector } from '../components/UI/SiteSelector';

const Rent: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Rent</h1>
        <SiteSelector />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Rental Overview</h2>
          <p className="text-gray-600">Rental data and analytics will be displayed here.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Rental Performance</h2>
          <p className="text-gray-600">Rental performance metrics will be shown here.</p>
        </div>
      </div>
    </div>
  );
};

export default Rent;