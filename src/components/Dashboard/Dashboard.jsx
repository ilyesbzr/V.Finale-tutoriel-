import React, { useState } from 'react';
import DateSelector from '../UI/DateSelector';
import FacturationCharts from './FacturationCharts';
import DepartmentMetrics from './DepartmentMetrics';
import SalesMetrics from './SalesMetrics';
import { mockData } from '../../data/mockData';

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="p-6">
      <div className="mb-6">
        <DateSelector 
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
      
      <div className="space-y-8">
        <FacturationCharts selectedDate={selectedDate} />
        
        <DepartmentMetrics 
          department="Mécanique" 
          metrics={mockData.departments.mechanical} 
        />
        <SalesMetrics 
          department="Mécanique"
          sales={mockData.sales.mechanical}
        />
        
        <DepartmentMetrics 
          department="Carrosserie" 
          metrics={mockData.departments.bodywork} 
        />
        
        <DepartmentMetrics 
          department="Service Rapide" 
          metrics={mockData.departments.quickService} 
        />
        <SalesMetrics 
          department="Service Rapide"
          sales={mockData.sales.quickService}
        />
      </div>
    </div>
  );
}

export default Dashboard;