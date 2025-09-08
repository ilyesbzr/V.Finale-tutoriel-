import React, { useState, useEffect, useRef } from 'react';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import Button from '../components/UI/Button';
import Alert from '../components/UI/Alert';
import { PROGRESS_THRESHOLDS } from '../utils/constants/metrics';
import { formatNumber } from '../utils/formatters';
import PrintButton from '../components/UI/PrintButton';
import { mockData } from '../data/mockData';
import { getCurrentMonthProgress } from '../utils/dateCalculations';
import { useTranslation } from 'react-i18next';
import { EmployeeData, BillingHistoryEntry } from '../types';

const JOB_TYPES = {
  MECHANIC: 'Mécanicien',
  QUICK_MECHANIC: 'Mécanicien rapide',
  TECHNICIAN: 'Technicien',
  BODYWORKER: 'Carrossier',
  TESTER: 'Essayeur',
  APPRENTICE: 'Apprenti'
} as const;

const SERVICE_COLORS: Record<string, string> = {
  'Mécanique': 'bg-green-50 border-green-200',
  'Service Rapide': 'bg-yellow-50 border-yellow-200',
  'Carrosserie': 'bg-gray-50 border-gray-200'
};

const SERVICE_HEADER_COLORS: Record<string, string> = {
  'Mécanique': 'bg-green-100 text-green-900',
  'Service Rapide': 'bg-yellow-100 text-yellow-900',
  'Carrosserie': 'bg-gray-100 text-gray-900'
};

interface PlanningData {
  departments: Array<{
    name: string;
    employees: Array<{
      id: number;
      name: string;
      attendance: Record<string, any>;
      isApprentice: boolean;
    }>;
  }>;
}

interface ServiceResult {
  service: string;
  target: number;
  actual: number;
  completion: number;
}

function Productivity(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSite, setSelectedSite] = useState<string>('RO');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<number | null>(null);
  const { t } = useTranslation();

  // Obtenir la progression du mois actuel
  const monthProgress = getCurrentMonthProgress(new Date());

  const [mechanics, setMechanics] = useState<EmployeeData[]>([]);

  useEffect(() => {
    const planningData: PlanningData = {
      departments: [
        {
          name: 'Mécanique',
          employees: [
            { id: 1, name: 'CHAGNAUD Elliot', attendance: {}, isApprentice: false },
            { id: 2, name: 'EYCHENNE Thibault', attendance: {}, isApprentice: true }
          ]
        },
        {
          name: 'Service Rapide',
          employees: [
            { id: 3, name: 'FARES Celina', attendance: {}, isApprentice: false },
            { id: 4, name: 'DE JESUS David', attendance: {}, isApprentice: true }
          ]
        },
        {
          name: 'Carrosserie',
          employees: [
            { id: 5, name: 'DUPONT Jean', attendance: {}, isApprentice: false },
            { id: 6, name: 'MARTIN Pierre', attendance: {}, isApprentice: false }
          ]
        }
      ]
    };

    const transformedMechanics: EmployeeData[] = planningData.departments.flatMap(dept => {
      const service = dept.name;

      return dept.employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        service,
        jobType: emp.isApprentice ? JOB_TYPES.APPRENTICE :
                service === 'Mécanique' ? JOB_TYPES.MECHANIC :
                service === 'Service Rapide' ? JOB_TYPES.QUICK_MECHANIC :
                JOB_TYPES.BODYWORKER,
        target: 35,
        daysPresent: 5,
        billingPotential: calculateBillingPotential(5),
        billedHours: Math.round(Math.random() * 10 + 25),
        hasOvertime: false,
        isEditingName: false,
        // Ajouter l'historique de facturation pour chaque mécanicien
        billingHistory: generateBillingHistory()
      }));
    });

    setMechanics(transformedMechanics);
  }, [t]);

  // Générer un historique de facturation fictif pour le mois en cours
  const generateBillingHistory = (): BillingHistoryEntry[] => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const history: BillingHistoryEntry[] = [];
    
    // Générer des données pour chaque jour du mois jusqu'à aujourd'hui
    for (let day = 1; day <= Math.min(daysInMonth, currentDate.getDate()); day++) {
      // Sauter les weekends (samedi et dimanche)
      const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      // Générer des heures facturées aléatoires entre 4 et 8 heures
      const hours = Math.round((4 + Math.random() * 4) * 10) / 10;
      
      history.push({
        date: new Date(currentYear, currentMonth, day),
        hours: hours,
        day: day
      });
    }
    
    return history;
  };

  const mechanicsByService: Record<string, EmployeeData[]> = {
    'Mécanique': mechanics.filter(m => m.service === 'Mécanique'),
    'Service Rapide': mechanics.filter(m => m.service === 'Service Rapide'),
    'Carrosserie': mechanics.filter(m => m.service === 'Carrosserie')
  };

  const serviceResults: ServiceResult[] = Object.entries(mechanicsByService).map(([service, serviceMechanics]) => {
    const totalTarget = serviceMechanics.reduce((sum, m) => sum + m.target, 0);
    const totalActual = serviceMechanics.reduce((sum, m) => sum + m.billedHours, 0);
    const completion = totalTarget ? Math.round((totalActual / totalTarget) * 100) : 0;

    return {
      service,
      target: totalTarget,
      actual: totalActual,
      completion
    };
  });

  const handleDaysChange = (mechanicId: number, newDays: string): void => {
    setMechanics(prevMechanics => 
      prevMechanics.map(mechanic => {
        if (mechanic.id === mechanicId) {
          const daysPresent = Math.max(0, parseFloat(parseFloat(newDays).toFixed(1)) || 0);
          return {
            ...mechanic,
            daysPresent,
            billingPotential: calculateBillingPotential(daysPresent)
          };
        }
        return mechanic;
      })
    );
  };

  const handleJobTypeChange = (mechanicId: number, newJobType: string): void => {
    setMechanics(prevMechanics =>
      prevMechanics.map(mechanic => {
        if (mechanic.id === mechanicId) {
          return {
            ...mechanic,
            jobType: newJobType
          };
        }
        return mechanic;
      })
    );
  };

  const handleTargetChange = (mechanicId: number, newTarget: string): void => {
    setMechanics(prevMechanics =>
      prevMechanics.map(mechanic => {
        if (mechanic.id === mechanicId) {
          return {
            ...mechanic,
            target: Math.max(0, parseFloat(newTarget) || 0)
          };
        }
        return mechanic;
      })
    );
  };

  const handleNameChange = (mechanicId: number, newName: string): void => {
    setMechanics(prevMechanics =>
      prevMechanics.map(mechanic => {
        if (mechanic.id === mechanicId) {
          return {
            ...mechanic,
            name: newName,
            isEditingName: false
          };
        }
        return mechanic;
      })
    );
  };

  const toggleNameEdit = (mechanicId: number): void => {
    if (!isEditing) return;
    
    setMechanics(prevMechanics =>
      prevMechanics.map(mechanic => {
        if (mechanic.id === mechanicId) {
          return {
            ...mechanic,
            isEditingName: !mechanic.isEditingName
          };
        }
        return {
          ...mechanic,
          isEditingName: false
        };
      })
    );
  };

  const handlePrint = (): void => {
    window.print();
  };

  // Get color based on productivity percentage
  const getProductivityColor = (percentage: number): string => {
    if (percentage >= PROGRESS_THRESHOLDS.SUCCESS) return 'bg-green-500';
    if (percentage >= PROGRESS_THRESHOLDS.DANGER) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get text color based on productivity percentage
  const getProductivityTextColor = (percentage: number): string => {
    if (percentage >= PROGRESS_THRESHOLDS.SUCCESS) return 'text-green-800';
    if (percentage >= PROGRESS_THRESHOLDS.DANGER) return 'text-yellow-800';
    return 'text-red-800';
  };

  // Calcul de la productivité au prorata du mois
  const calculateProratedProductivity = (billedHours: number, target: number): number => {
    if (!target || monthProgress === 0) return 0;
    const proratedTarget = target * (monthProgress / 100);
    return Math.round((billedHours / proratedTarget) * 100);
  };

  const renderServiceSection = (service: string, serviceMechanics: EmployeeData[]) => (
    <React.Fragment key={service}>
      <tr>
        <td
          colSpan={2} 
          className={`px-6 py-3 text-lg font-medium ${SERVICE_HEADER_COLORS[service]} sticky left-0 z-10`}
        >
          {service}
        </td>
        <td colSpan={5} className={SERVICE_HEADER_COLORS[service]}></td>
      </tr>
      {serviceMechanics.map((mechanic) => {
        const productivity = calculateProductivity(mechanic.billedHours, mechanic.target);
        const proratedProductivity = calculateProratedProductivity(mechanic.billedHours, mechanic.target);
        
        return (
          <tr key={mechanic.id} className={`${SERVICE_COLORS[service]} hover:bg-gray-50`}>
            <td className={`px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900 sticky left-0 z-10 ${SERVICE_COLORS[service]} border-r border-gray-200`}>
              {mechanic.isEditingName ? (
                <input
                  type="text"
                  value={mechanic.name}
                  onChange={(e) => handleNameChange(mechanic.id, e.target.value)}
                  onBlur={() => toggleNameEdit(mechanic.id)}
                  autoFocus
                  className="w-full border-b border-gray-300 focus:border-indigo-500 focus:ring-0 bg-transparent"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleNameEdit(mechanic.id)}
                    className={`text-left ${isEditing ? 'hover:text-indigo-600' : ''}`}
                    disabled={!isEditing}
                  >
                    {mechanic.name}
                  </button>
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-lg text-center text-gray-500">
              {isEditing ? (
                <select
                  value={mechanic.jobType}
                  onChange={(e) => handleJobTypeChange(mechanic.id, e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                >
                  {Object.values(JOB_TYPES).map(jobType => (
                    <option key={jobType} value={jobType}>
                      {jobType}
                    </option>
                  ))}
                </select>
              ) : (
                mechanic.jobType
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-lg text-center text-gray-500">
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={mechanic.daysPresent}
                  onChange={(e) => handleDaysChange(mechanic.id, e.target.value)}
                  className="w-20 mx-auto text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                />
              ) : (
                `${mechanic.daysPresent} ${t('common.days')}`
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-lg text-center text-gray-500">
              <span>{mechanic.billingPotential}h</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-lg text-center text-gray-500">
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={mechanic.target}
                  onChange={(e) => handleTargetChange(mechanic.id, e.target.value)}
                  className="w-20 mx-auto text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                />
              ) : (
                `${mechanic.target}h`
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-lg text-center text-gray-500">
              {mechanic.billedHours}h
            </td>
            {/* % Réalisation (objectif complet) */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
              <div className="flex flex-col items-center">
                <span className={`px-3 py-2 rounded-full text-lg font-bold ${
                  productivity >= PROGRESS_THRESHOLDS.SUCCESS ? 'bg-green-100 text-green-800' :
                  productivity >= PROGRESS_THRESHOLDS.DANGER ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {productivity}%
                </span>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full ${getProductivityColor(productivity)}`} 
                    style={{ 
                      width: `${Math.min(productivity, 100)}%`,
                      transition: 'width 0.5s ease-out'
                    }}
                  ></div>
                </div>
              </div>
            </td>
          </tr>
        );
      })}
      {serviceMechanics.length > 0 && (
        <tr className={`${SERVICE_HEADER_COLORS[service]} bg-opacity-50`}>
          <td colSpan={2} className="px-6 py-2 whitespace-nowrap text-lg font-medium sticky left-0 z-10 border-r border-gray-200">
            <span className="text-lg font-medium">Total {service}</span>
          </td>
          <td className="px-6 py-2 whitespace-nowrap text-lg text-center font-medium">
            {formatNumber(serviceMechanics.reduce((sum, m) => sum + m.daysPresent, 0))} jours
          </td>
          <td className="px-6 py-2 whitespace-nowrap text-lg text-center font-medium">
            {formatNumber(serviceMechanics.reduce((sum, m) => sum + m.billingPotential, 0))}h
          </td>
          <td className="px-6 py-2 whitespace-nowrap text-lg text-center font-medium">
            {formatNumber(serviceMechanics.reduce((sum, m) => sum + m.target, 0))}h
          </td>
          <td className="px-6 py-2 whitespace-nowrap text-lg text-center font-medium">
            {formatNumber(serviceMechanics.reduce((sum, m) => sum + m.billedHours, 0))}h
          </td>
          {/* Total pour % Réalisation */}
          <td className="px-6 py-2 whitespace-nowrap text-sm text-center">
            <div className="flex flex-col items-center">
              {(() => {
                const totalProductivity = calculateProductivity(
                  serviceMechanics.reduce((sum, m) => sum + m.billedHours, 0),
                  serviceMechanics.reduce((sum, m) => sum + m.target, 0)
                );
                return (
                  <>
                    <span className={`px-3 py-2 rounded-full text-lg font-bold ${
                      totalProductivity >= PROGRESS_THRESHOLDS.SUCCESS ? 'bg-green-100 text-green-800' :
                      totalProductivity >= PROGRESS_THRESHOLDS.DANGER ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {totalProductivity}%
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-full ${getProductivityColor(totalProductivity)}`} 
                        style={{ 
                          width: `${Math.min(totalProductivity, 100)}%`,
                          transition: 'width 0.5s ease-out'
                        }}
                      ></div>
                    </div>
                  </>
                );
              })()}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );

  return (
    <div className="p-4 sm:p-6">
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      {success && <Alert type="success" className="mb-4">{success}</Alert>}

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <DateSelector 
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <SiteSelector
            selectedSite={selectedSite}
            onChange={setSelectedSite}
          />
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? t('common.save') : t('common.edit')}
          </Button>
        </div>
      </div>

      <div className="space-y-6 no-print">
        <Card>
          <CardHeader title="Rentabilité par service" />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                      <span className="text-lg">{t('synthesis.service')}</span>
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase tracking-wider">
                      <span className="text-lg">{t('common.target')}</span>
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase tracking-wider">
                      <span className="text-lg">{t('common.actual')}</span>
                    </th>
                    <th className="px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase tracking-wider">
                      <span className="text-lg">Rentabilité</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceResults.map((result) => (
                    <tr key={result.service}>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                        {result.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-center text-gray-900">
                        {formatNumber(result.target)}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-center text-gray-900">
                        {formatNumber(result.actual)}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex flex-col items-center">
                          <span className={`px-3 py-2 rounded-full text-lg font-bold ${
                            result.completion >= PROGRESS_THRESHOLDS.SUCCESS ? 'bg-green-100 text-green-800' :
                            result.completion >= PROGRESS_THRESHOLDS.DANGER ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {result.completion}%
                          </span>
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                            <div 
                              className={`h-full ${getProductivityColor(result.completion)}`} 
                              style={{ 
                                width: `${Math.min(result.completion, 100)}%`,
                                transition: 'width 0.5s ease-out'
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Rentabilité des compagnons" />
          <CardContent className="px-0 sm:px-4">
            <div className="relative overflow-x-auto max-h-[600px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-20">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-30 border-r border-gray-200 min-w-[150px] sm:min-w-[200px]">
                      <span className="text-lg">{t('productivity.name')}</span>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase tracking-wider">
                      <span className="text-lg">{t('productivity.job')}</span>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase tracking-wider">
                      <span className="text-lg">{t('productivity.daysPresent')}</span>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase tracking-wider">
                      <span className="text-lg">{t('productivity.billingPotential')}</span>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase tracking-wider">
                      <span className="text-lg">Potentiel de facturation au prorata</span>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase tracking-wider">
                      <span className="text-lg">{t('productivity.billedHours')}</span>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase tracking-wider">
                      <span className="text-lg">Rentabilité mensuelle</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(mechanicsByService).map(([service, serviceMechanics], index) => (
                    <React.Fragment key={service}>
                      {index > 0 && (
                        <tr>
                          <td colSpan={8} className="h-4 bg-gray-100 border-t border-b border-gray-200"></td>
                        </tr>
                      )}
                      {renderServiceSection(service, serviceMechanics)}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function calculateProductivity(billedHours: number, target: number): number {
  if (!target) return 0;
  return Math.round((billedHours / target) * 100);
}

function calculateBillingPotential(daysPresent: number): number {
  return daysPresent * 7;
}

export default Productivity;