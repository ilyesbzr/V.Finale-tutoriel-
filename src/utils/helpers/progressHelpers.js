import { PROGRESS_THRESHOLDS, PROGRESS_COLORS } from '../constants/metrics';
import { getMonthWorkingDays, getElapsedWorkingDays } from '../dateCalculations';

/**
 * Détermine la couleur du texte en fonction de la valeur de progression
 * @param {number} value - Valeur de progression (en pourcentage)
 * @returns {string} - Classe CSS pour la couleur du texte
 */
export function getProgressTextColor(value) {
  if (value >= PROGRESS_THRESHOLDS.SUCCESS) return PROGRESS_COLORS.TEXT.SUCCESS;
  if (value >= PROGRESS_THRESHOLDS.DANGER) return PROGRESS_COLORS.TEXT.WARNING;
  return PROGRESS_COLORS.TEXT.DANGER;
}

/**
 * Détermine la couleur de fond en fonction de la valeur de progression
 * @param {number} value - Valeur de progression (en pourcentage)
 * @returns {string} - Classe CSS pour la couleur de fond
 */
export function getProgressBgColor(value) {
  if (value >= PROGRESS_THRESHOLDS.SUCCESS) return PROGRESS_COLORS.BG.SUCCESS;
  if (value >= PROGRESS_THRESHOLDS.DANGER) return PROGRESS_COLORS.BG.WARNING;
  return PROGRESS_COLORS.BG.DANGER;
}

/**
 * Calcule la progression en pourcentage
 * @param {number} actual - Valeur actuelle
 * @param {number} target - Valeur cible
 * @returns {number} - Pourcentage de progression
 */
export function calculateProgress(actual, target) {
  if (!target) return 0;
  return Math.round((actual / target) * 100);
}

/**
 * Calcule la projection en fonction du rythme actuel
 * @param {number} actual - Valeur actuelle
 * @param {number} target - Valeur cible
 * @param {number} monthProgress - Progression du mois (0-100)
 * @param {Date} [date=new Date()] - Date de référence pour le calcul
 * @returns {number} - Pourcentage de projection
 */
export function calculateProjection(actual, target, monthProgress, date = new Date()) {
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
 * @param {number} actual - Valeur actuelle
 * @param {number} monthProgress - Progression du mois (0-100)
 * @param {Date} [date=new Date()] - Date de référence pour le calcul
 * @returns {number} - Valeur projetée
 */
export function calculateProjectedValue(actual, monthProgress, date = new Date()) {
  // Utiliser les jours ouvrés pour un calcul plus précis
  const totalWorkingDays = getMonthWorkingDays(date);
  const elapsedWorkingDays = getElapsedWorkingDays(date);
  
  if (elapsedWorkingDays === 0) return actual;
  
  // Calculer la valeur projetée basée sur les jours ouvrés
  return Math.round((actual / elapsedWorkingDays) * totalWorkingDays);
}

/**
 * Calcule le reste à faire pour atteindre une projection à 100%
 * @param {number} actual - Valeur actuelle
 * @param {number} target - Valeur cible
 * @param {number} monthProgress - Progression du mois (0-100)
 * @param {Date} [date=new Date()] - Date de référence pour le calcul
 * @returns {number} - Reste à faire pour atteindre la projection
 */
export function calculateRemaining(actual, target, monthProgress, date = new Date()) {
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
 * @param {number} realizationPercentage - Pourcentage de réalisation
 * @param {number} monthProgress - Progression du mois (0-100)
 * @returns {number} - Ratio de tendance (en pourcentage)
 */
export function calculateTrendRatio(realizationPercentage, monthProgress) {
  if (!monthProgress) return 100; // Éviter division par zéro
  return (realizationPercentage / monthProgress) * 100;
}

/**
 * Détermine la couleur du texte en fonction du ratio de tendance
 * @param {number} realizationPercentage - Pourcentage de réalisation
 * @param {number} monthProgress - Progression du mois (0-100)
 * @returns {string} - Classe CSS pour la couleur du texte
 */
export function getTrendTextColor(realizationPercentage, monthProgress) {
  const ratio = calculateTrendRatio(realizationPercentage, monthProgress);
  if (ratio >= 90) return 'text-green-600';
  if (ratio >= 75) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Détermine la couleur de fond en fonction du ratio de tendance
 * @param {number} realizationPercentage - Pourcentage de réalisation
 * @param {number} monthProgress - Progression du mois (0-100)
 * @returns {string} - Classe CSS pour la couleur de fond
 */
export function getTrendBgColor(realizationPercentage, monthProgress) {
  const ratio = calculateTrendRatio(realizationPercentage, monthProgress);
  if (ratio >= 90) return 'bg-green-500';
  if (ratio >= 75) return 'bg-orange-500';
  return 'bg-red-500';
}