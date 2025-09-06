import React from 'react';
import { Card, CardHeader, CardContent } from './Card';
import MetricsCard from './MetricsCard';
import CircularProgress from './CircularProgress';

export default function DepartmentMetrics({ department, metrics }) {
  return (
    <Card>
      <CardHeader title={department} />
      <CardContent>
        {/* Graphiques circulaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center h-44">
            <CircularProgress
              value={metrics.hoursSold}
              target={metrics.hoursTarget}
              color="#2563eb"
              unit="h"
              size="lg"
            />
            <p className="mt-3 text-sm font-medium text-gray-500">Heures vendues</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center h-44">
            <CircularProgress
              value={metrics.revenue}
              target={metrics.revenueTarget}
              color="#16a34a"
              unit="€"
              size="lg"
            />
            <p className="mt-3 text-sm font-medium text-gray-500">Chiffre d'affaires</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center h-44">
            <CircularProgress
              value={metrics.hoursSold}
              target={metrics.hoursTarget}
              color="#9333ea"
              unit="€/h"
              size="lg"
            />
            <p className="mt-3 text-sm font-medium text-gray-500">CA/H</p>
          </div>
        </div>

        {/* Cartes de métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricsCard
            title="Heures vendues"
            value={metrics.hoursSold}
            target={metrics.hoursTarget}
            unit="h"
            progress={metrics.progress}
            previousDayBilling={metrics.previousDayBilling}
          />
          <MetricsCard
            title="Chiffre d'affaires"
            value={metrics.revenue}
            target={metrics.revenueTarget}
            unit="€"
            progress={metrics.revenueProgress}
          />
        </div>
      </CardContent>
    </Card>
  );
}