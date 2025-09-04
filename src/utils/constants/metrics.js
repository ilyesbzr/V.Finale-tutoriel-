export const DEPARTMENTS = {
  MECHANICAL: 'mechanical',
  QUICK_SERVICE: 'quickService',
  BODYWORK: 'bodywork'
};

export const DEPARTMENT_LABELS = {
  [DEPARTMENTS.MECHANICAL]: 'Mécanique',
  [DEPARTMENTS.QUICK_SERVICE]: 'Service Rapide',
  [DEPARTMENTS.BODYWORK]: 'Carrosserie'
};

export const SITES = {
  RO: 'Site 1',
  EU: 'Site 2',
  MTD: 'Site 3',
  ST: 'Groupe'
};

export const CHART_COLORS = {
  PRIMARY: '#2563eb',
  SECONDARY: '#16a34a',
  TERTIARY: '#9333ea',
  NEUTRAL: '#94a3b8'
};

// Seuils pour les indicateurs de progression
export const PROGRESS_THRESHOLDS = {
  DANGER: 75,  // Rouge en dessous de 75%
  WARNING: 90, // Orange entre 75% et 90%
  SUCCESS: 90  // Vert au-dessus de 90%
};

// Couleurs pour les différents états de progression
export const PROGRESS_COLORS = {
  TEXT: {
    DANGER: 'text-red-600',
    WARNING: 'text-orange-600',
    SUCCESS: 'text-green-600'
  },
  BG: {
    DANGER: 'bg-red-500',
    WARNING: 'bg-orange-500',
    SUCCESS: 'bg-green-500'
  }
};