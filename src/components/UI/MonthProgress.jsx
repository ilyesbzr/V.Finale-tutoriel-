import React from 'react';
import { format, subDays, isAfter, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getMonthWorkingDays, getCurrentMonthProgress, getElapsedWorkingDays, isWeekend, getLastWorkingDay, isFirstWorkingDayOfMonth, isHoliday } from '../../utils/dateCalculations';
import { useTranslation } from 'react-i18next';

export default function MonthProgress({ date }) {
  const { t } = useTranslation();
  
  // Calculer le nombre total de jours ouvrés dans le mois
  const workingDays = getMonthWorkingDays(date);
  
  // Calculer le pourcentage de progression du mois
  const progress = getCurrentMonthProgress(date);
  
  // Nouvelle logique pour déterminer la date d'analyse
  const getAnalysisDate = () => {
    const today = new Date();
    
    // Pour les dates passées: analyser la date exacte sélectionnée
    if (isBefore(date, today)) {
      return date;
    }
    
    // Pour aujourd'hui ou les dates futures: analyser le dernier jour ouvré
    return getLastWorkingDay(date);
  };
  
  // Helper function to check if a date is before another
  function isBefore(date1, date2) {
    return !isAfter(date1, date2) && !isSameDay(date1, date2);
  }
  
  // Obtenir la date d'analyse
  const analysisDate = getAnalysisDate();
  
  // Initialiser les variables pour la date d'affichage et les jours écoulés
  let displayDate;
  let elapsedWorkingDays;
  
  // Logique pour déterminer la date d'affichage et les jours écoulés
  // Maintenir la logique existante pour les cas spéciaux
  const isFirstDaysOfMonth = date.getDate() <= 2 && date.getDate() > 0;
  const isFirstWorkingDay = isFirstWorkingDayOfMonth(date);
  
  if (isFirstDaysOfMonth || isFirstWorkingDay) {
    // Pour les premiers jours du mois ou le premier jour ouvré, on affiche le mois précédent
    displayDate = subDays(new Date(date.getFullYear(), date.getMonth(), 1), 1);
    // Pour le mois précédent à 100%, on affiche le nombre total de jours ouvrés
    elapsedWorkingDays = getMonthWorkingDays(displayDate);
  } else if (isWeekend(date)) {
    // Si c'est un weekend, utiliser le dernier jour ouvré pour l'affichage
    displayDate = getLastWorkingDay(date);
    elapsedWorkingDays = getElapsedWorkingDays(displayDate);
  } else {
    // Sinon, utiliser la date telle quelle
    displayDate = date;
    elapsedWorkingDays = getElapsedWorkingDays(displayDate);
  }

  // Obtenir le nombre total de jours ouvrés pour le mois affiché
  const totalWorkingDays = getMonthWorkingDays(displayDate);
  
  // Formater la date d'analyse avec le nom du jour
  const formattedAnalysisDate = format(analysisDate, 'EEEE dd MMMM yyyy', { locale: fr });
  
  // Capitaliser la première lettre (convention française)
  const capitalizedAnalysisDate = formattedAnalysisDate.charAt(0).toUpperCase() + formattedAnalysisDate.slice(1);

  // Rendu du composant
  return (
    <div className="card-modern px-6 py-4 text-sm w-full sm:min-w-[360px]">
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center">
        {/* Affichage de la date d'analyse - centré */}
        <div className="text-gray-900 mb-2 sm:mb-0 text-base text-center w-full">
          {t('synthesis.analyzedDay', 'Jour analysé')} : {capitalizedAnalysisDate}
        </div>
      </div>
      
      {/* Barre de progression visuelle */}
      <div className="mt-3 relative overflow-hidden h-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full shadow-sm transition-all duration-1000 ease-out relative overflow-hidden" 
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>
      
      {/* Affichage des jours ouvrés */}
      <div className="mt-3 text-gray-700 text-sm flex justify-between items-center font-medium">
        <span className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full shadow-sm"></div>
          {elapsedWorkingDays} / {totalWorkingDays} {t('common.workingDays', 'jours ouvrés dans le mois')}
        </span>
        <span className="text-xs text-blue-700 font-semibold bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1 rounded-full border border-blue-200 shadow-sm ml-4">
          {progress}% {t('common.monthElapsed', 'du mois écoulé')}
        </span>
      </div>
    </div>
  );
}