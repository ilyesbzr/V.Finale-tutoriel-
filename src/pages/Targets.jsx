import React, { useState, useEffect, useRef } from 'react';
import SiteSelector from '../components/UI/SiteSelector';
import MonthSelector from '../components/UI/MonthSelector';
import YearSelector from '../components/UI/YearSelector';
import Button from '../components/UI/Button';
import { getMonthWorkingDays } from '../utils/dateCalculations';
import RevenueHistoryPopup from '../components/UI/RevenueHistoryPopup';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatNumber } from '../utils/formatters';

// Import optimized components
import BudgetSection from '../components/UI/BudgetSection';
import PotentialSection from '../components/UI/PotentialSection';
import TargetSection from '../components/UI/TargetSection';
import SalesTargetsSection from '../components/Sales/SalesTargetsSection';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';

function Targets() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSite, setSelectedSite] = useState('RO');
  const [isEditing, setIsEditing] = useState(false);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const contentRef = useRef(null);
  
  // State for productivity targets
  const [productivityTargets, setProductivityTargets] = useState([
    { service: 'Mécanique', target: 1.10 },
    { service: 'Service Rapide', target: 1.12 },
    { service: 'Techniciens', target: 1.05 },
    { service: 'Carrosserie', target: 1.15 }
  ]);

  // State for budget
  const [budgetData, setBudgetData] = useState({
    totalHours: 1488,
    hecHours: 1041,
    revenue: 392248
  });

  // State for potential
  const [potentialData, setPotentialData] = useState({
    total: { hours: 95, updatedHours: 90 },
    mechanical: { hours: 35, updatedHours: 33 },
    quickService: { hours: 28, updatedHours: 27 },
    bodywork: { hours: 32, updatedHours: 30 }
  });
  
  // States for potential locking
  const [isPotentialLocked, setIsPotentialLocked] = useState(false);
  const [lockedPotentialData, setLockedPotentialData] = useState(null);

  // State for targets
  const [targetData, setTargetData] = useState({
    mechanical: { totalHours: 739, hecHours: 517, revenue: 162679, revenuePerHour: 220 },
    quickService: { totalHours: 546, hecHours: 382, revenue: 144569, revenuePerHour: 265 },
    bodywork: { totalHours: 203, hecHours: 142, revenue: 85000, revenuePerHour: 419 }
  });

  // State for product families
  const [selectedFamiliesMechanical, setSelectedFamiliesMechanical] = useState([
    'tires', 'shockAbsorbers', 'wipers', 'brakePads', 'batteries', 'discs'
  ]);

  const [selectedFamiliesQuickService, setSelectedFamiliesQuickService] = useState([
    'tires', 'shockAbsorbers', 'wipers', 'brakePads', 'batteries', 'discs'
  ]);

  const [selectedFamiliesBodywork, setSelectedFamiliesBodywork] = useState([
    'windshields'
  ]);

  const [familyTargets, setFamilyTargets] = useState({
    mechanical: {
      tires: 20, shockAbsorbers: 10, wipers: 28, brakePads: 18, batteries: 9, discs: 8
    },
    quickService: {
      tires: 50, shockAbsorbers: 10, wipers: 186, brakePads: 40, batteries: 10, discs: 15
    },
    bodywork: {
      windshields: 15
    }
  });

  // Simulated historical data for different years
  const historicalData = {
    2024: {
      targetData: {
        mechanical: { totalHours: 720, hecHours: 504, revenue: 158000, revenuePerHour: 219 },
        quickService: { totalHours: 530, hecHours: 371, revenue: 140000, revenuePerHour: 264 },
        bodywork: { totalHours: 195, hecHours: 136, revenue: 82000, revenuePerHour: 420 }
      },
      budgetData: {
        totalHours: 1445,
        hecHours: 1011,
        revenue: 380000
      },
      familyTargets: {
        mechanical: {
          tires: 18, shockAbsorbers: 8, wipers: 25, brakePads: 16, batteries: 8, discs: 7
        },
        quickService: {
          tires: 45, shockAbsorbers: 9, wipers: 175, brakePads: 38, batteries: 9, discs: 14
        },
        bodywork: {
          windshields: 12
        }
      }
    },
    2025: {
      targetData: {
        mechanical: { totalHours: 739, hecHours: 517, revenue: 162679, revenuePerHour: 220 },
        quickService: { totalHours: 546, hecHours: 382, revenue: 144569, revenuePerHour: 265 },
        bodywork: { totalHours: 203, hecHours: 142, revenue: 85000, revenuePerHour: 419 }
      },
      budgetData: {
        totalHours: 1488,
        hecHours: 1041,
        revenue: 392248
      },
      familyTargets: {
        mechanical: {
          tires: 20, shockAbsorbers: 10, wipers: 28, brakePads: 18, batteries: 9, discs: 8
        },
        quickService: {
          tires: 50, shockAbsorbers: 10, wipers: 186, brakePads: 40, batteries: 10, discs: 15
        },
        bodywork: {
          windshields: 15
        }
      }
    }
  };

  // Load data based on selected year
  useEffect(() => {
    if (historicalData[selectedYear]) {
      setTargetData(historicalData[selectedYear].targetData);
      setBudgetData(historicalData[selectedYear].budgetData);
      setFamilyTargets(historicalData[selectedYear].familyTargets);
    }
  }, [selectedYear]);

  // Scroll to top when tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // Load potential lock state from localStorage
  useEffect(() => {
    const savedLockState = localStorage.getItem('potentialLockState');
    const savedLockedData = localStorage.getItem('lockedPotentialData');
    
    if (savedLockState) {
      setIsPotentialLocked(JSON.parse(savedLockState));
    }
    
    if (savedLockedData) {
      setLockedPotentialData(JSON.parse(savedLockedData));
    }
  }, []);

  // Update localStorage when lock state changes
  useEffect(() => {
    localStorage.setItem('potentialLockState', JSON.stringify(isPotentialLocked));
    
    if (lockedPotentialData) {
      localStorage.setItem('lockedPotentialData', JSON.stringify(lockedPotentialData));
    }
  }, [isPotentialLocked, lockedPotentialData]);

  // Event handlers
  const handleBudgetChange = (field, value) => {
    setBudgetData(prev => ({
      ...prev,
      [field]: Number(value) || 0
    }));
  };

  const handlePotentialChange = (dept, field, value) => {
    setPotentialData(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [field]: Number(value) || 0
      }
    }));
  };

  const handleTargetChange = (dept, field, value, customHandler) => {
    if (customHandler) {
      customHandler(dept, value);
    } else {
      setTargetData(prev => ({
        ...prev,
        [dept]: {
          ...prev[dept],
          [field]: Number(value) || 0
        }
      }));
    }
  };

  const handleFamilyTargetChange = (dept, family, value) => {
    setFamilyTargets(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [family]: Number(value) || 0
      }
    }));
  };

  const handleShowHistory = (department) => {
    setSelectedDepartment(department);
    setShowHistoryPopup(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCANetChange = (dept, value) => {
    const grossRevenue = Math.round(value / 0.7);
    setTargetData(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        revenue: grossRevenue
      }
    }));
  };

  const handleCAPerHECChange = (dept, value) => {
    const newRevenue = Math.round(value * targetData[dept].hecHours);
    setTargetData(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        revenue: newRevenue
      }
    }));
  };

  const handleCAPerHourChange = (dept, value) => {
    const newRevenue = Math.round(value * targetData[dept].totalHours);
    setTargetData(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        revenue: newRevenue
      }
    }));
  };

  const handleCAPerHTChange = (dept, value) => {
    const newRevenue = Math.round(value * targetData[dept].totalHours);
    setTargetData(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        revenue: newRevenue
      }
    }));
  };

  const handleLockPotential = () => {
    if (!isPotentialLocked) {
      // Save current values
      const dataToLock = {...potentialData};
      setLockedPotentialData(dataToLock);
      localStorage.setItem('lockedPotentialData', JSON.stringify(dataToLock));
    }
    const newLockState = !isPotentialLocked;
    setIsPotentialLocked(newLockState);
    localStorage.setItem('potentialLockState', JSON.stringify(newLockState));
  };

  const handleResetPotential = () => {
    if (lockedPotentialData) {
      setPotentialData(lockedPotentialData);
    }
  };

  const workingDays = getMonthWorkingDays(selectedDate);
  
  // Get formatted month name for titles
  const formattedMonth = format(selectedDate, 'MMMM', { locale: fr });

  // Define field configurations for target sections
  const targetFields = {
    totalHours: { 
      label: 'HT', 
      format: 'hours' 
    },
    caNet: { 
      label: 'CA APV', 
      format: 'currency',
      getValue: (data) => Math.round(data.revenue * 0.7),
      onChange: handleCANetChange
    },
    caPerHT: { 
      label: 'CA APV/HT', 
      format: 'currency',
      getValue: (data) => data.totalHours ? Math.round(data.revenue / data.totalHours) : 0,
      onChange: handleCAPerHTChange
    }
  };

  return (
    <div className="p-6">
      <div ref={contentRef} className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <MonthSelector 
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            />
            <YearSelector
              selectedYear={selectedYear}
              onChange={setSelectedYear}
            />
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <p className="text-sm text-gray-600">
                {workingDays} jours ouvrés
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SiteSelector
            selectedSite={selectedSite}
            onChange={setSelectedSite}
          />
          {isEditing ? (
            <div className="space-x-2">
              <Button onClick={handleSave} variant="primary">
                Enregistrer
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="secondary">
                Annuler
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="primary">
              Modifier
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Budget */}
        <BudgetSection
          title={`Budget - ${formattedMonth} ${selectedYear}`}
          budgetData={budgetData}
          isEditing={isEditing}
          onBudgetChange={handleBudgetChange}
        />

        {/* Potential */}
        <PotentialSection
          title={`Potentiel mensuel d'heures par service - ${formattedMonth} ${selectedYear}`}
          potentialData={potentialData}
          isPotentialLocked={isPotentialLocked}
          isEditing={isEditing}
          onPotentialChange={handlePotentialChange}
          onLockPotential={handleLockPotential}
          onResetPotential={handleResetPotential}
        />

        {/* Targets */}
        <TargetSection
          title={`Objectifs APV - ${formattedMonth} ${selectedYear}`}
          fields={targetFields}
          data={targetData}
          isEditing={isEditing}
          onFieldChange={handleTargetChange}
          showHistoryButton={true}
          onHistoryClick={handleShowHistory}
        />

        {/* Objectifs PR */}
        <Card>
          <CardHeader title={`Objectifs PR - ${formattedMonth} ${selectedYear}`} />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-600">CA PR Atelier</span>
                  <div className="text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={Math.round((targetData.mechanical.revenue + targetData.quickService.revenue + targetData.bodywork.revenue))}
                        onChange={(e) => {
                          const newTotal = Number(e.target.value) || 0;
                          const currentTotal = targetData.mechanical.revenue + targetData.quickService.revenue + targetData.bodywork.revenue;
                          const ratio = currentTotal > 0 ? newTotal / currentTotal : 1;
                          
                          setTargetData(prev => ({
                            mechanical: { ...prev.mechanical, revenue: Math.round(prev.mechanical.revenue * ratio) },
                            quickService: { ...prev.quickService, revenue: Math.round(prev.quickService.revenue * ratio) },
                            bodywork: { ...prev.bodywork, revenue: Math.round(prev.bodywork.revenue * ratio) }
                          }));
                        }}
                        className="w-32 text-right text-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-900">
                        <span className="text-xl">{formatNumber(Math.round((targetData.mechanical.revenue + targetData.quickService.revenue + targetData.bodywork.revenue)))}€</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-600">CA - PR comptoir</span>
                  <div className="text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={Math.round((targetData.mechanical.revenue + targetData.quickService.revenue + targetData.bodywork.revenue) * 0.6)}
                        onChange={(e) => {
                          const newPRComptoir = Number(e.target.value) || 0;
                          const currentTotal = targetData.mechanical.revenue + targetData.quickService.revenue + targetData.bodywork.revenue;
                          const newTotal = Math.round(newPRComptoir / 0.6);
                          const ratio = currentTotal > 0 ? newTotal / currentTotal : 1;
                          
                          setTargetData(prev => ({
                            mechanical: { ...prev.mechanical, revenue: Math.round(prev.mechanical.revenue * ratio) },
                            quickService: { ...prev.quickService, revenue: Math.round(prev.quickService.revenue * ratio) },
                            bodywork: { ...prev.bodywork, revenue: Math.round(prev.bodywork.revenue * ratio) }
                          }));
                        }}
                        className="w-32 text-right text-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-900">
                        <span className="text-xl">{formatNumber(Math.round((targetData.mechanical.revenue + targetData.quickService.revenue + targetData.bodywork.revenue) * 0.6))}€</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-600">CA - Accessoires</span>
                  <div className="text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={Math.round((targetData.mechanical.revenue + targetData.quickService.revenue + targetData.bodywork.revenue) * 0.2)}
                        onChange={(e) => {
                          const newAccessoires = Number(e.target.value) || 0;
                          const currentTotal = targetData.mechanical.revenue + targetData.quickService.revenue + targetData.bodywork.revenue;
                          const newTotal = Math.round(newAccessoires / 0.2);
                          const ratio = currentTotal > 0 ? newTotal / currentTotal : 1;
                          
                          setTargetData(prev => ({
                            mechanical: { ...prev.mechanical, revenue: Math.round(prev.mechanical.revenue * ratio) },
                            quickService: { ...prev.quickService, revenue: Math.round(prev.quickService.revenue * ratio) },
                            bodywork: { ...prev.bodywork, revenue: Math.round(prev.bodywork.revenue * ratio) }
                          }));
                        }}
                        className="w-32 text-right text-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-900">
                        <span className="text-xl">{formatNumber(Math.round((targetData.mechanical.revenue + targetData.quickService.revenue + targetData.bodywork.revenue) * 0.2))}€</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Objectifs CA par service */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-600">CA Mécanique</span>
                  <div className="text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={targetData.mechanical.revenue}
                        onChange={(e) => handleTargetChange('mechanical', 'revenue', e.target.value)}
                        className="w-32 text-right text-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-900">
                        <span className="text-xl">{formatNumber(targetData.mechanical.revenue)}€</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-600">CA Service Rapide</span>
                  <div className="text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={targetData.quickService.revenue}
                        onChange={(e) => handleTargetChange('quickService', 'revenue', e.target.value)}
                        className="w-32 text-right text-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-900">
                        <span className="text-xl">{formatNumber(targetData.quickService.revenue)}€</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-600">CA Carrosserie</span>
                  <div className="text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={targetData.bodywork.revenue}
                        onChange={(e) => handleTargetChange('bodywork', 'revenue', e.target.value)}
                        className="w-32 text-right text-xl rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-900">
                        <span className="text-xl">{formatNumber(targetData.bodywork.revenue)}€</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Targets */}
        <Card>
          <CardHeader title={`Ventes additionnelles - ${formattedMonth} ${selectedYear}`} />
          <CardContent>
            <div className="space-y-8">
              {/* Mechanical */}
              <SalesTargetsSection
                department="Mécanique"
                selectedFamilies={selectedFamiliesMechanical}
                onUpdateFamilies={setSelectedFamiliesMechanical}
                familyTargets={familyTargets.mechanical}
                onFamilyTargetChange={(family, value) => handleFamilyTargetChange('mechanical', family, value)}
                isEditing={isEditing}
              />

              {/* Quick Service */}
              <SalesTargetsSection
                department="Service Rapide"
                selectedFamilies={selectedFamiliesQuickService}
                onUpdateFamilies={setSelectedFamiliesQuickService}
                familyTargets={familyTargets.quickService}
                onFamilyTargetChange={(family, value) => handleFamilyTargetChange('quickService', family, value)}
                isEditing={isEditing}
              />

              {/* Bodywork */}
              <SalesTargetsSection
                department="Carrosserie"
                selectedFamilies={selectedFamiliesBodywork}
                onUpdateFamilies={setSelectedFamiliesBodywork}
                familyTargets={familyTargets.bodywork}
                onFamilyTargetChange={(family, value) => handleFamilyTargetChange('bodywork', family, value)}
                isEditing={isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <RevenueHistoryPopup
        isOpen={showHistoryPopup}
        onClose={() => setShowHistoryPopup(false)}
        department={selectedDepartment}
      />
    </div>
  );
}

export default Targets;