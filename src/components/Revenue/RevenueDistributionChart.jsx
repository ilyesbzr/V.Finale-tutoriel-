import React from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber } from '../../utils/formatters';
import { CHART_COLORS, CHART_CONFIGS } from '../../data/chartConfigs';
import { generateClientTypeData, generateServiceData } from '../../utils/chartHelpers';

export default function RevenueDistributionChart({ data, clientTypeView, onClientTypeViewChange, getClientTypeChartData }) {
  const serviceData = generateServiceData(data);
  const clientData = getClientTypeChartData ? getClientTypeChartData() : [];
  const pieData = clientTypeView === 'clientType' ? clientData : serviceData;
  const colors = clientTypeView === 'clientType' ? CHART_COLORS.clientPR : CHART_COLORS.service;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm">{formatNumber(data.value)}€</p>
          <p className="text-sm font-medium text-gray-600">{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
      >
        {`${pieData[index].percentage}%`}
      </text>
    );
  };

  return (
    <Card>
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {clientTypeView === 'clientType' ? 'Répartition par type de client' : 'Répartition par service'}
          </h3>
        </div>
      </div>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={CHART_CONFIGS.pie.innerRadius}
                outerRadius={CHART_CONFIGS.pie.outerRadius}
                paddingAngle={CHART_CONFIGS.pie.paddingAngle}
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
                animationBegin={0}
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {pieData.map((item, index) => (
            <div key={item.name} className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: colors[index] }}
                />
                 <span className="text-lg font-semibold text-gray-900">{item.name}</span>
              </div>
             <div className="text-lg font-medium text-gray-600 mt-1">{formatNumber(item.value)}€</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}