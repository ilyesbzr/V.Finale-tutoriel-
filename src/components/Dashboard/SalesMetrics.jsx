import React from 'react';
import { Card, CardHeader, CardContent } from './Card';

export default function SalesMetrics({ department, sales }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title={`Ventes ${department}`} />
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <SalesItem 
              title="Pneus"
              target={sales.tires.target}
              actual={sales.tires.actual}
              delta={sales.tires.delta}
            />
            <SalesItem 
              title="Amortisseurs"
              target={sales.shockAbsorbers.target}
              actual={sales.shockAbsorbers.actual}
              delta={sales.shockAbsorbers.delta}
            />
            <SalesItem 
              title="Balais"
              target={sales.wipers.target}
              actual={sales.wipers.actual}
              delta={sales.wipers.delta}
            />
            <SalesItem 
              title="Plaquettes"
              target={sales.brakePads.target}
              actual={sales.brakePads.actual}
              delta={sales.brakePads.delta}
            />
            <SalesItem 
              title="Batteries"
              target={sales.batteries.target}
              actual={sales.batteries.actual}
              delta={sales.batteries.delta}
            />
            <SalesItem 
              title="Pare-brise"
              target={sales.windshields.target}
              actual={sales.windshields.actual}
              delta={sales.windshields.delta}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Autres ventes" />
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CountItem title="Filtres à huile" count={sales.oilFilters.count} />
            <CountItem title="Additifs" count={sales.additives.count} />
            <CountItem title="Disques" count={sales.discs.count} />
            <CountItem title="Stérilisation Clim" count={sales.acSterilization.count} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SalesItem({ title, target, actual, delta }) {
  const deltaColor = delta >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <div className="mt-2 space-y-1">
        <p className="text-sm text-gray-600">Objectif: {target}</p>
        <p className="text-sm text-gray-900">Réalisé: {actual}</p>
        <p className={`text-sm ${deltaColor}`}>
          Delta: {delta >= 0 ? '+' : ''}{delta}
        </p>
      </div>
    </div>
  );
}

function CountItem({ title, count }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{count}</p>
    </div>
  );
}