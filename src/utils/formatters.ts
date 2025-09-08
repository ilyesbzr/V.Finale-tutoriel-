export function formatNumber(value: number | string): string {
  if (typeof value !== 'number') return String(value);
  
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true
  }).format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(value);
}