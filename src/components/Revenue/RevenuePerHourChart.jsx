import React from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../utils/formatters';

export default function RevenuePerHourChart({ data }) {
  // Calculer le CA/H pour chaque service
  const chartData = [
    {
      name: 'Mécanique',
      value: data.mechanical.hoursSold ? Math.round(data.mechanical.revenue / data.mechanical.hoursSold) : 0,
      target: 220
    },
    {
      name: 'Service Rapide', 
      value: data.quickService.hoursSold ? Math.round(data.quickService.revenue / data.quickService.hoursSold) : 0,
      target: 265
    },
    {
      name: 'Carrosserie',
      value: data.bodywork.hoursSold ? Math.round(data.bodywork.revenue / data.bodywork.hoursSold) : 0,
      target: 419
    }
  ];

  return (
    <Card>
      <CardHeader title="CA/H par service" />
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${formatNumber(value)}€`} />
              <Tooltip formatter={(value) => [`${formatNumber(value)}€/h`, 'CA/H']} />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}