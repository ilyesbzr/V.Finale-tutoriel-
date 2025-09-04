// Configuration centralisée pour tous les graphiques
export const CHART_COLORS = {
  service: ['#2563eb', '#16a34a', '#9333ea'],
  clientAPV: ['#2563eb', '#16a34a', '#9333ea'],
  clientPR: ['#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'],
  years: ['#1e3a8a', '#3b82f6', '#93c5fd']
};

export const CHART_CONFIGS = {
  pie: {
    innerRadius: 80,
    outerRadius: 120,
    paddingAngle: 5
  },
  bar: {
    margin: { top: 20, right: 30, left: 20, bottom: 60 },
    barGap: 10,
    barCategoryGap: 40,
    barSize: 60
  }
};

export const CLIENT_TYPES = {
  apv: [
    { name: 'Client', base: 450, color: '#2563eb' },
    { name: 'Garantie', base: 280, color: '#16a34a' },
    { name: 'Interne', base: 180, color: '#9333ea' }
  ],
  pr: [
    { name: 'Employé', base: 320, color: '#f59e0b' },
    { name: 'Confrère', base: 280, color: '#10b981' },
    { name: 'Cession', base: 180, color: '#8b5cf6' },
    { name: 'MRA', base: 150, color: '#ef4444' },
    { name: 'Partic.', base: 120, color: '#06b6d4' }
  ]
};