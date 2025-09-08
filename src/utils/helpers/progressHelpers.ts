import { PROGRESS_THRESHOLDS, PROGRESS_COLORS } from '../constants/metrics';
import { getMonthWorkingDays, getElapsedWorkingDays } from '../dateCalculations';

/**
 * Détermine la couleur du texte en fonction de la valeur de progression
 */
export function getProgressTextColor(value: number): string {
  if (value >= PROGRESS_THRESHOLDS.SUCCESS) return PROGRESS_COLORS.TEXT.SUCCESS;
  if (value >= PROGRESS_THRESHOLDS.DANGER) return PROGRESS_COLORS.TEXT.WARNING;
  return PROGRESS_COLORS.TEXT.DANGER;
}

/**
 * Détermine la couleur de fond en fonction de la valeur de progression
 */
export function getProgressBgColor(value: number): string {
  if (value >= PROGRESS_THRESHOLDS.SUCCESS) return PROGRESS_COLORS.BG.SUCCESS;
  if (value >= PROGRESS_THRESHOLDS.DANGER) return PROGRESS_COLORS.BG.WARNING;
  return PROGRESS_COLORS.BG.DANGER;
}

/**
 * Calcule la progression en pourcentage
 */
export function calculateProgress(actual: number, target: number): number {
  if (!target) return 0;
  return Math.round((actual / target) * 100);
}

/**
 * Calcule la projection en fonction du rythme actuel
 */
export function calculateProjection(
  actual: number, 
  target: number, 
  monthProgress: number, 
  date: Date = new Date()
): number {
  if (!target || !monthProgress) return 0;
  
  // Utiliser les jours ouvrés pour un calcul plus précis
  const totalWorkingDays = getMonthWorkingDays(date);
  const elapsedWorkingDays = getElapsedWorkingDays(date);
  
  if (elapsedWorkingDays === 0) return 0;
  
  // Calculer la valeur projetée basée sur les jours ouvrés
  const projectedValue = (actual / elapsedWorkingDays) * totalWorkingDays;
  
  // Calculer le pourcentage de projection par rapport à l'objectif
  return Math.round((projectedValue / target) * 100);
}

/**
 * Calcule la valeur projetée en fin de mois
 */
export function calculateProjectedValue(
  actual: number, 
  monthProgress: number, 
  date: Date = new Date()
): number {
  // Utiliser les jours ouvrés pour un calcul plus précis
  const totalWorkingDays = getMonthWorkingDays(date);
  const elapsedWorkingDays = getElapsedWorkingDays(date);
  
  if (elapsedWorkingDays === 0) return actual;
  
  // Calculer la valeur projetée basée sur les jours ouvrés
  return Math.round((actual / elapsedWorkingDays) * totalWorkingDays);
}

/**
 * Calcule le reste à faire pour atteindre une projection à 100%
 */
export function calculateRemaining(
  actual: number, 
  target: number, 
  monthProgress: number, 
  date: Date = new Date()
): number {
  // Obtenir le nombre total de jours ouvrés dans le mois
  const totalWorkingDays = getMonthWorkingDays(date);
  
  // Obtenir le nombre de jours ouvrés écoulés
  const elapsedWorkingDays = getElapsedWorkingDays(date);
  
  if (elapsedWorkingDays === 0) return 0;
  
  // Nouvelle formule: (Objectif total * Jours écoulés / Jours totaux) - Valeur réalisée
  const expectedValue = (target * elapsedWorkingDays) / totalWorkingDays;
  const remaining = Math.max(0, expectedValue - actual);
  
  return Math.round(remaining);
}

/**
 * Calcule le ratio de tendance (réalisation vs progression du mois)
 */
export function calculateTrendRatio(realizationPercentage: number, monthProgress: number): number {
  if (!monthProgress) return 100; // Éviter division par zéro
  return (realizationPercentage / monthProgress) * 100;
}

/**
 * Détermine la couleur du texte en fonction du ratio de tendance
 */
export function getTrendTextColor(realizationPercentage: number, monthProgress: number): string {
  const ratio = calculateTrendRatio(realizationPercentage, monthProgress);
  if (ratio >= 90) return 'text-green-600';
  if (ratio >= 75) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Détermine la couleur de fond en fonction du ratio de tendance
 */
export function getTrendBgColor(realizationPercentage: number, monthProgress: number): string {
  const ratio = calculateTrendRatio(realizationPercentage, monthProgress);
  if (ratio >= 90) return 'bg-green-500';
  if (ratio >= 75) return 'bg-orange-500';
  return 'bg-red-500';
}