import React from 'react';
import { formatNumber, formatCurrency } from '../../utils/formatters';

export default function PrintableSummary({ data }) {
  // Calcul des totaux
  const totalHoursSold = data.mechanical.hoursSold + data.quickService.hoursSold + data.bodywork.hoursSold;
  const totalHoursTarget = data.mechanical.hoursTarget + data.quickService.hoursTarget + data.bodywork.hoursTarget;
  const totalRevenue = data.mechanical.revenue + data.quickService.revenue + data.bodywork.revenue;
  const totalRevenueTarget = data.mechanical.revenueTarget + data.quickService.revenueTarget + data.bodywork.revenueTarget;

  // Données pour le tableau de bord
  const dashboardData = [
    {
      service: 'Mécanique',
      hoursTarget: data.mechanical.hoursTarget,
      hoursSold: data.mechanical.hoursSold,
      hoursPercent: Math.round((data.mechanical.hoursSold / data.mechanical.hoursTarget) * 100),
      previousDayBilling: data.mechanical.previousDayBilling,
      revenue: data.mechanical.revenue,
      revenueTarget: data.mechanical.revenueTarget,
      revenuePercent: Math.round((data.mechanical.revenue / data.mechanical.revenueTarget) * 100),
      revenuePerHour: data.mechanical.hoursSold ? Math.round(data.mechanical.revenue / data.mechanical.hoursSold) : 0
    },
    {
      service: 'Service Rapide',
      hoursTarget: data.quickService.hoursTarget,
      hoursSold: data.quickService.hoursSold,
      hoursPercent: Math.round((data.quickService.hoursSold / data.quickService.hoursTarget) * 100),
      previousDayBilling: data.quickService.previousDayBilling,
      revenue: data.quickService.revenue,
      revenueTarget: data.quickService.revenueTarget,
      revenuePercent: Math.round((data.quickService.revenue / data.quickService.revenueTarget) * 100),
      revenuePerHour: data.quickService.hoursSold ? Math.round(data.quickService.revenue / data.quickService.hoursSold) : 0
    },
    {
      service: 'Carrosserie',
      hoursTarget: data.bodywork.hoursTarget,
      hoursSold: data.bodywork.hoursSold,
      hoursPercent: Math.round((data.bodywork.hoursSold / data.bodywork.hoursTarget) * 100),
      previousDayBilling: data.bodywork.previousDayBilling,
      revenue: data.bodywork.revenue,
      revenueTarget: data.bodywork.revenueTarget,
      revenuePercent: Math.round((data.bodywork.revenue / data.bodywork.revenueTarget) * 100),
      revenuePerHour: data.bodywork.hoursSold ? Math.round(data.bodywork.revenue / data.bodywork.hoursSold) : 0
    },
    {
      service: 'TOTAL',
      hoursTarget: totalHoursTarget,
      hoursSold: totalHoursSold,
      hoursPercent: Math.round((totalHoursSold / totalHoursTarget) * 100),
      previousDayBilling: data.mechanical.previousDayBilling + data.quickService.previousDayBilling + data.bodywork.previousDayBilling,
      revenue: totalRevenue,
      revenueTarget: totalRevenueTarget,
      revenuePercent: Math.round((totalRevenue / totalRevenueTarget) * 100),
      revenuePerHour: totalHoursSold ? Math.round(totalRevenue / totalHoursSold) : 0
    }
  ];

  // Données VideoCheck mockées (à remplacer par les vraies données)
  const videoCheckData = {
    targetRevenue: 25000,
    entries: 165,
    completed: 76,
    identifiedRevenue: 27994.22,
    actualRevenue: 19372.11,
    completionRate: 77,
    revenuePerVideo: 254.90
  };

  // Données Crescendo
  const crescendoData = {
    mechanical: {
      tires: { target: 20, actual: 23 },
      shockAbsorbers: { target: 10, actual: 4 },
      wipers: { target: 28, actual: 29 },
      brakePads: { target: 18, actual: 7 },
      batteries: { target: 9, actual: 12 }
    },
    quickService: {
      tires: { target: 50, actual: 34 },
      batteries: { target: 10, actual: 7 },
      wipers: { target: 186, actual: 128 },
      brakePads: { target: 40, actual: 24 },
      shockAbsorbers: { target: 10, actual: 18 }
    }
  };

  return (
    <div className="print-summary space-y-8">
      {/* Tableau de bord journalier */}
      <div className="print-keep-together">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Tableau de bord journalier</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4 bg-gray-50">SERVICE</th>
                <th className="text-right py-2 px-4 bg-gray-50">OBJECTIF HEURES</th>
                <th className="text-right py-2 px-4 bg-gray-50">HEURES VENDUES</th>
                <th className="text-right py-2 px-4 bg-gray-50">AVANCEMENT HEURES</th>
                <th className="text-right py-2 px-4 bg-gray-50">FACT. J-1</th>
                <th className="text-right py-2 px-4 bg-gray-50">OBJECTIF CA</th>
                <th className="text-right py-2 px-4 bg-gray-50">CA RÉALISÉ</th>
                <th className="text-right py-2 px-4 bg-gray-50">AVANCEMENT CA</th>
                <th className="text-right py-2 px-4 bg-gray-50">CA/H</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.map((row) => (
                <tr key={row.service} className={row.service === 'TOTAL' ? 'font-bold bg-gray-50' : ''}>
                  <td className="py-2 px-4 border-b">{row.service}</td>
                  <td className="py-2 px-4 border-b text-right">{formatNumber(row.hoursTarget)}h</td>
                  <td className="py-2 px-4 border-b text-right">{formatNumber(row.hoursSold)}h</td>
                  <td className="py-2 px-4 border-b text-right">{row.hoursPercent}%</td>
                  <td className="py-2 px-4 border-b text-right">{formatNumber(row.previousDayBilling)}h</td>
                  <td className="py-2 px-4 border-b text-right">{formatNumber(row.revenueTarget)}€</td>
                  <td className="py-2 px-4 border-b text-right">{formatNumber(row.revenue)}€</td>
                  <td className="py-2 px-4 border-b text-right">{row.revenuePercent}%</td>
                  <td className="py-2 px-4 border-b text-right">{formatNumber(row.revenuePerHour)}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VideoCheck */}
      <div className="print-keep-together">
        <h2 className="text-lg font-medium text-gray-900 mb-4">VideoCheck</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4 bg-gray-50">OBJECTIF CA</th>
                <th className="text-right py-2 px-4 bg-gray-50">ENTRÉES</th>
                <th className="text-right py-2 px-4 bg-gray-50">RÉALISÉ</th>
                <th className="text-right py-2 px-4 bg-gray-50">CA TOTAL IDENTIFIÉ</th>
                <th className="text-right py-2 px-4 bg-gray-50">CA RÉALISÉ</th>
                <th className="text-right py-2 px-4 bg-gray-50">CA / VIDÉO</th>
                <th className="text-right py-2 px-4 bg-gray-50">% RÉALISATION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">{formatCurrency(videoCheckData.targetRevenue)}</td>
                <td className="py-2 px-4 border-b text-right">{videoCheckData.entries}</td>
                <td className="py-2 px-4 border-b text-right">{videoCheckData.completed}</td>
                <td className="py-2 px-4 border-b text-right">{formatCurrency(videoCheckData.identifiedRevenue)}</td>
                <td className="py-2 px-4 border-b text-right">{formatCurrency(videoCheckData.actualRevenue)}</td>
                <td className="py-2 px-4 border-b text-right">{formatCurrency(videoCheckData.revenuePerVideo)}</td>
                <td className="py-2 px-4 border-b text-right">{videoCheckData.completionRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Crescendo */}
      <div className="print-keep-together">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Crescendo</h2>
        <div className="grid grid-cols-2 gap-8">
          {/* Mécanique */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-3">Mécanique</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 bg-gray-50">PRODUIT</th>
                    <th className="text-right py-2 px-4 bg-gray-50">OBJECTIFS</th>
                    <th className="text-right py-2 px-4 bg-gray-50">RÉALISÉ</th>
                    <th className="text-right py-2 px-4 bg-gray-50">AVANCEMENT</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(crescendoData.mechanical).map(([product, data]) => (
                    <tr key={product}>
                      <td className="py-2 px-4 border-b">
                        {product === 'tires' ? 'Pneus' :
                         product === 'shockAbsorbers' ? 'Amortisseurs' :
                         product === 'wipers' ? 'Balais' :
                         product === 'brakePads' ? 'Plaquettes' :
                         'Batteries'}
                      </td>
                      <td className="py-2 px-4 border-b text-right">{data.target}</td>
                      <td className="py-2 px-4 border-b text-right">{data.actual}</td>
                      <td className="py-2 px-4 border-b text-right">
                        {Math.round((data.actual / data.target) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Service Rapide */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-3">Service Rapide</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 bg-gray-50">PRODUIT</th>
                    <th className="text-right py-2 px-4 bg-gray-50">OBJECTIFS</th>
                    <th className="text-right py-2 px-4 bg-gray-50">RÉALISÉ</th>
                    <th className="text-right py-2 px-4 bg-gray-50">AVANCEMENT</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(crescendoData.quickService).map(([product, data]) => (
                    <tr key={product}>
                      <td className="py-2 px-4 border-b">
                        {product === 'tires' ? 'Pneus' :
                         product === 'shockAbsorbers' ? 'Amortisseurs' :
                         product === 'wipers' ? 'Balais' :
                         product === 'brakePads' ? 'Plaquettes' :
                         'Batteries'}
                      </td>
                      <td className="py-2 px-4 border-b text-right">{data.target}</td>
                      <td className="py-2 px-4 border-b text-right">{data.actual}</td>
                      <td className="py-2 px-4 border-b text-right">
                        {Math.round((data.actual / data.target) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}