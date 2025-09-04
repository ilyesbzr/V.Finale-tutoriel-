import React from 'react';
import { Card, CardHeader, CardContent } from './Card';
import MetricsCard from './MetricsCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber } from '../../utils/formatters';

export default function VideoCheckMetrics({ metrics }) {
  const pieData = [
    { name: 'Réalisés', value: metrics.completed },
    { name: 'Restants', value: metrics.entries - metrics.completed }
  ];

  const COLORS = ['#2563eb', '#e5e7eb'];

  return (
    <Card>
      <CardHeader title="VideoCheck" />
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <MetricsCard
            title="Taux de réalisation"
            value={metrics.completionRate}
            target={70}
            unit="%"
            progress={Math.round((metrics.completionRate / 70) * 100)}
          />
          <MetricsCard
            title="CA identifié"
            value={metrics.identifiedRevenue}
            target={metrics.target}
            unit="€"
            progress={Math.round((metrics.identifiedRevenue / metrics.target) * 100)}
          />
          <MetricsCard
            title="CA / Vidéo"
            value={metrics.revenuePerVideo}
            target={300}
            unit="€"
            progress={Math.round((metrics.revenuePerVideo / 300) * 100)}
          />
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Entrées</h3>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.completed} / {metrics.entries}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                vidéos réalisées
              </p>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}