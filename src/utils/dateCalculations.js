import { getDaysInMonth, isWeekend, isSameDay, addDays, subDays, startOfMonth, endOfMonth, getDay, isAfter } from 'date-fns';

// Re-export the isWeekend function from date-fns
export { isWeekend };

// Liste des jours fériés pour 2025
const HOLIDAYS_2025 = [
  new Date(2025, 0, 1),   // Premier de l'An
  new Date(2025, 3, 20),  // Dimanche de Pâques
  new Date(2025, 3, 21),  // Lundi de Pâques
  new Date(2025, 4, 1),   // Fête du travail
  new Date(2025, 4, 29),  // Ascension
  new Date(2025, 5, 8),   // Dimanche de Pentecôte
  new Date(2025, 5, 9),   // Lundi de Pentecôte
  new Date(2025, 6, 14),  // Fête Nationale
  new Date(2025, 7, 15),  // Assomption
  new Date(2025, 10, 1),  // Toussaint
  new Date(2025, 10, 11), // Armistice 1918
  new Date(2025, 11, 25)  // Noël
];

export function isHoliday(date) {
  return HOLIDAYS_2025.some(holiday => 
    date.getFullYear() === holiday.getFullYear() &&
    date.getMonth() === holiday.getMonth() &&
    date.getDate() === holiday.getDate()
  );
}

export function getHolidayName(date) {
  const holidayNames = {
    '01-01': 'Jour de l\'An',
    '05-01': 'Fête du Travail',
    '05-08': 'Victoire 1945',
    '07-14': 'Fête Nationale',
    '08-15': 'Assomption',
    '11-01': 'Toussaint',
    '11-11': 'Armistice 1918',
    '12-25': 'Noël'
  };

  const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return holidayNames[key];
}

export function getMonthWorkingDays(date) {
  const totalDays = getDaysInMonth(date);
  let workingDays = 0;
  
  for (let i = 1; i <= totalDays; i++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
    
    // Un jour est travaillé s'il n'est pas un weekend et n'est pas un jour férié
    if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
      workingDays++;
    }
  }
  
  return workingDays;
}

// Fonction pour obtenir le dernier jour ouvré avant une date
export function getLastWorkingDay(date) {
  let currentDate = new Date(date);
  
  // Reculer d'un jour jusqu'à trouver un jour ouvré
  do {
    currentDate = subDays(currentDate, 1);
  } while (isWeekend(currentDate) || isHoliday(currentDate));
  
  return currentDate;
}

// Fonction pour vérifier si c'est le premier jour ouvré du mois
export function isFirstWorkingDayOfMonth(date) {
  // Si ce n'est pas le premier mois de l'année, vérifier si c'est le premier jour ouvré
  if (date.getDate() > 1) {
    // Vérifier si tous les jours précédents sont des weekends ou des jours fériés
    for (let i = 1; i < date.getDate(); i++) {
      const prevDate = new Date(date.getFullYear(), date.getMonth(), i);
      if (!isWeekend(prevDate) && !isHoliday(prevDate)) {
        return false; // Il y a un jour ouvré avant cette date
      }
    }
    return true; // C'est le premier jour ouvré du mois
  }
  
  // Si c'est le premier jour du mois, vérifier s'il est ouvré
  return !isWeekend(date) && !isHoliday(date);
}

export function getElapsedWorkingDays(date) {
  // Nouvelle logique pour les dates passées
  const today = new Date();
  const isPastDate = !isAfter(date, today) && !isSameDay(date, today);
  
  // Pour les dates passées, on utilise la date exacte
  if (isPastDate) {
    const currentDay = date.getDate();
    let workingDays = 0;
    
    // Compter les jours travaillés jusqu'à la date sélectionnée (incluse)
    for (let i = 1; i <= currentDay; i++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
      
      if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
        workingDays++;
      }
    }
    
    return workingDays;
  }
  
  // Logique existante pour aujourd'hui et les dates futures
  // Vérifier si c'est le premier ou le deuxième jour du mois
  const isFirstDaysOfMonth = date.getDate() <= 2 && date.getDate() > 0;
  
  // Vérifier si c'est le premier jour ouvré du mois
  const isFirstWorkingDay = isFirstWorkingDayOfMonth(date);
  
  if (isFirstDaysOfMonth || isFirstWorkingDay) {
    // Pour les premiers jours du mois ou le premier jour ouvré, on affiche 100% du mois précédent
    const previousMonthDate = subDays(new Date(date.getFullYear(), date.getMonth(), 1), 1);
    // Retourner le nombre TOTAL de jours ouvrés du mois précédent, pas juste les jours écoulés
    return getMonthWorkingDays(previousMonthDate);
  }
  
  // Si c'est un weekend, utiliser le dernier jour ouvré
  let referenceDate = date;
  if (isWeekend(date)) {
    referenceDate = getLastWorkingDay(date);
  }
  
  const currentDay = referenceDate.getDate();
  let workingDays = 0;
  
  // Compter les jours travaillés jusqu'à la veille de la date sélectionnée (exclus le jour J)
  for (let i = 1; i < currentDay; i++) {
    const currentDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), i);
    
    // Compter uniquement les jours travaillés jusqu'à la date sélectionnée (exclus)
    if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
      workingDays++;
    }
  }
  
  return workingDays;
}

export function getCurrentMonthProgress(date) {
  // Nouvelle logique pour les dates passées
  const today = new Date();
  const isPastDate = !isAfter(date, today) && !isSameDay(date, today);
  
  // Pour les dates passées, on utilise la date exacte
  if (isPastDate) {
    const elapsedWorkingDays = getElapsedWorkingDays(date);
    const totalWorkingDays = getMonthWorkingDays(date);
    return Math.round((elapsedWorkingDays / totalWorkingDays) * 100);
  }
  
  // Logique existante pour aujourd'hui et les dates futures
  // Vérifier si c'est le premier ou le deuxième jour du mois
  const isFirstDaysOfMonth = date.getDate() <= 2 && date.getDate() > 0;
  
  // Vérifier si c'est le premier jour ouvré du mois
  const isFirstWorkingDay = isFirstWorkingDayOfMonth(date);
  
  if (isFirstDaysOfMonth || isFirstWorkingDay) {
    // Pour les premiers jours du mois ou le premier jour ouvré, on affiche 100% du mois précédent
    return 100;
  }
  
  // Si c'est un weekend, utiliser le dernier jour ouvré pour le calcul
  let referenceDate = date;
  if (isWeekend(date)) {
    referenceDate = getLastWorkingDay(date);
  }
  
  const elapsedWorkingDays = getElapsedWorkingDays(referenceDate);
  const totalWorkingDays = getMonthWorkingDays(referenceDate);
  
  return Math.round((elapsedWorkingDays / totalWorkingDays) * 100);
}