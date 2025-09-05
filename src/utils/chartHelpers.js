import { CLIENT_TYPES } from '../data/chartConfigs';

export function generateClientTypeData(viewType) {
  const clients = CLIENT_TYPES[viewType];
  const total = clients.reduce((sum, client) => sum + client.base, 0);
  
  return clients.map(client => ({
    name: client.name,
    value: client.base,
    percentage: Math.round((client.base / total) * 100),
    color: client.color
  }));
}

export function generateServiceData(data) {
  const total = data.mechanical.revenue + data.quickService.revenue + data.bodywork.revenue;
  
  return [
    {
      name: 'Mécanique',
      value: data.mechanical.revenue,
      percentage: Math.round((data.mechanical.revenue / total) * 100)
    },
    {
      name: 'Service Rapide', 
      value: data.quickService.revenue,
      percentage: Math.round((data.quickService.revenue / total) * 100)
    },
    {
      name: 'Carrosserie',
      value: data.bodywork.revenue, 
      percentage: Math.round((data.bodywork.revenue / total) * 100)
    }
  ].filter(item => item.value > 0);
}