import React, { useState, useEffect, useRef } from 'react';
import DateSelector from '../components/UI/DateSelector';
import SiteSelector from '../components/UI/SiteSelector';
import Alert from '../components/UI/Alert';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import Button from '../components/UI/Button';
import { PlusIcon, PencilIcon, TrashIcon, ChartBarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const INITIAL_BRAND_DATA = {
  surveys: { value: 17 },
  recommendation: { target: 88, value: 76.5 },
  mobility: { target: 60, value: 0 },
  recontact: { target: 70, value: 25 }
};

// Default indicator templates
const DEFAULT_INDICATORS = [
  { 
    id: 'recommendation',
    label: 'Taux de recommandation',
    description: 'NPS',
    icon: '👍',
    bgColor: 'bg-blue-50/50 border-blue-200/50',
    target: 88
  },
  { 
    id: 'mobility',
    label: 'Solution de mobilité',
    description: "Proposition d'une solution de mobilité",
    icon: '🚗',
    bgColor: 'bg-indigo-50/50 border-indigo-200/50',
    target: 60
  },
  { 
    id: 'recontact',
    label: 'Suivi client',
    description: 'Contact après travaux',
    icon: '📞',
    bgColor: 'bg-purple-50/50 border-purple-200/50',
    target: 70
  }
];

export default function Quality() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSite, setSelectedSite] = useState('RO');
  const [activeTab, setActiveTab] = useState('indicators'); // 'indicators', 'monthly', 'surveys'
  const [selectedYear, setSelectedYear] = useState(2025);
  const [monthlyResults, setMonthlyResults] = useState({
    'Peugeot': {
      janvier: { surveys: 12, recommendation: 78, mobility: 45, recontact: 67 },
      fevrier: { surveys: 15, recommendation: 82, mobility: 52, recontact: 71 },
      mars: { surveys: 18, recommendation: 85, mobility: 58, recontact: 74 },
      avril: { surveys: 14, recommendation: 79, mobility: 48, recontact: 69 }
    }
  });

  // Préparer les données pour le graphique mensuel
  const prepareMonthlyChartData = () => {
    const months = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet'];
    const monthNames = {
      janvier: 'Jan', fevrier: 'Fév', mars: 'Mar', avril: 'Avr',
      mai: 'Mai', juin: 'Jun', juillet: 'Jul'
    };
    
    return months.map(month => {
      const dataPoint = { month: monthNames[month] };
      
      Object.keys(monthlyResults).forEach(brand => {
        dataPoint[`${brand}_surveys`] = monthlyResults[brand][month]?.surveys || 0;
      });
      
      return dataPoint;
    });
  };

  const [newIndicator, setNewIndicator] = useState({
    id: '',
    label: '',
    description: '',
    icon: '📊',
    bgColor: 'bg-blue-50/50 border-blue-200/50',
    target: 80
  });

  const [brandQualityData, setBrandQualityData] = useState({
    'Peugeot': { 
      ...INITIAL_BRAND_DATA,
      indicators: [
        ...DEFAULT_INDICATORS
      ]
    },
    'Citroën': { 
      ...INITIAL_BRAND_DATA,
      indicators: [
        ...DEFAULT_INDICATORS
      ]
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingBrandName, setEditingBrandName] = useState(null);
  const [tempBrandName, setTempBrandName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showIndicatorModal, setShowIndicatorModal] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState(null);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const editNameInputRef = useRef(null);

  const [surveys, setSurveys] = useState([]);
  const [indicators, setIndicators] = useState([
    { name: 'Satisfaction générale' },
    { name: 'Qualité du service' },
    { name: 'Temps d\'attente' },
    { name: 'Recommandation' }
  ]);
  const [surveysByCCS, setSurveysByCCS] = useState([
    {
      id: 1,
      employee: 'Jean Dupont',
      surveysReceived: 15,
      results: {
        'Satisfaction générale': 4.2,
        'Qualité du service': 4.5,
        'Temps d\'attente': 3.8,
        'Recommandation': 4.1
      }
    },
    {
      id: 2,
      employee: 'Marie Martin',
      surveysReceived: 12,
      results: {
        'Satisfaction générale': 4.0,
        'Qualité du service': 4.3,
        'Temps d\'attente': 3.9,
        'Recommandation': 4.0
      }
    }
  ]);
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [newSurvey, setNewSurvey] = useState({
    employee: '',
    month: '',
    year: new Date().getFullYear(),
    surveysReceived: 0,
    results: {}
  });
  const [isEditingSurveys, setIsEditingSurveys] = useState(false);
  const [showAddCollaboratorForm, setShowAddCollaboratorForm] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    surveysReceived: 0
  });

  useEffect(() => {
    if (editingBrandName && editNameInputRef.current) {
      editNameInputRef.current.focus();
    }
  }, [editingBrandName]);

  const handleAddBrand = () => {
    if (!newBrandName.trim()) {
      setError(t('quality.brandNameRequired'));
      return;
    }

    if (brandQualityData[newBrandName]) {
      setError(t('quality.brandExists'));
      return;
    }

    setBrandQualityData(prev => ({
      ...prev,
      [newBrandName]: { 
        ...INITIAL_BRAND_DATA,
        indicators: [...DEFAULT_INDICATORS]
      }
    }));
    setNewBrandName('');
    setShowBrandModal(false);
    setSuccess(t('quality.brandAdded'));
  };

  const handleRemoveBrand = (brandName) => {
    if (window.confirm(t('quality.confirmBrandDelete', { brand: brandName }))) {
      const newData = { ...brandQualityData };
      delete newData[brandName];
      setBrandQualityData(newData);
      setSuccess(t('quality.brandDeleted', { brand: brandName }));
    }
  };

  const handleStartEditingBrandName = (brandName) => {
    if (!isEditing) return;
    setEditingBrandName(brandName);
    setTempBrandName(brandName);
  };

  const handleBrandNameChange = (e) => {
    setTempBrandName(e.target.value);
  };

  const handleBrandNameSubmit = (e, shouldSave = true) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!shouldSave) {
      setEditingBrandName(null);
      setTempBrandName('');
      return;
    }

    if (!tempBrandName.trim()) {
      setError(t('quality.brandNameRequired'));
      return;
    }

    if (tempBrandName !== editingBrandName && brandQualityData[tempBrandName]) {
      setError(t('quality.brandExists'));
      return;
    }

    const newData = { ...brandQualityData };
    const currentData = newData[editingBrandName];
    delete newData[editingBrandName];
    newData[tempBrandName] = currentData;
    
    setBrandQualityData(newData);
    setEditingBrandName(null);
    setTempBrandName('');
    setSuccess(t('quality.brandNameUpdated'));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleBrandNameSubmit(null, false);
    }
  };

  const handleValueChange = (brand, indicator, newValue) => {
    setBrandQualityData(prev => ({
      ...prev,
      [brand]: {
        ...prev[brand],
        [indicator]: {
          ...prev[brand][indicator],
          value: Number(newValue) || 0
        }
      }
    }));
  };

  const handleIndicatorValueChange = (brand, indicatorId, newValue) => {
    setBrandQualityData(prev => {
      const updatedBrand = { ...prev[brand] };
      const indicatorIndex = updatedBrand.indicators.findIndex(ind => ind.id === indicatorId);
      
      if (indicatorIndex !== -1) {
        const updatedIndicators = [...updatedBrand.indicators];
        updatedIndicators[indicatorIndex] = {
          ...updatedIndicators[indicatorIndex],
          value: Number(newValue) || 0
        };
        updatedBrand.indicators = updatedIndicators;
      }
      
      return {
        ...prev,
        [brand]: updatedBrand
      };
    });
  };

  const handleSave = () => {
    setSuccess(t('quality.dataUpdated'));
    setIsEditing(false);
    setEditingBrandName(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const getStatusColor = (value, target) => {
    const percentage = (value / 100) * 100;
    if (percentage >= target) return 'bg-green-50 border-green-200 shadow-green-100';
    if (percentage >= 80 && percentage < 90) return 'bg-orange-50 border-orange-200 shadow-orange-100';
    return 'bg-red-50 border-red-200 shadow-red-100';
  };

  const getProgressColor = (value, target) => {
    const percentage = (value / 100) * 100;
    if (percentage >= target) return '#22c55e';
    if (percentage >= 80 && percentage < 90) return '#f97316';
    return '#ef4444';
  };

  const handleAddIndicator = () => {
    if (!currentBrand) return;
    
    setNewIndicator({
      id: '',
      label: '',
      description: '',
      icon: '📊',
      bgColor: 'bg-blue-50/50 border-blue-200/50',
      target: 80
    });
    
    setEditingIndicator(null);
    setShowIndicatorModal(true);
  };

  const handleEditIndicator = (brand, indicator) => {
    if (!isEditing) return;
    
    setCurrentBrand(brand);
    setEditingIndicator(indicator);
    setNewIndicator({
      ...indicator
    });
    
    setShowIndicatorModal(true);
  };

  const handleRemoveIndicator = (brand, indicatorId) => {
    if (window.confirm(t('quality.confirmIndicatorDelete'))) {
      setBrandQualityData(prev => {
        const updatedBrand = { ...prev[brand] };
        updatedBrand.indicators = updatedBrand.indicators.filter(ind => ind.id !== indicatorId);
        
        return {
          ...prev,
          [brand]: updatedBrand
        };
      });
      
      setSuccess(t('quality.indicatorDeleted'));
    }
  };

  const handleSaveIndicator = () => {
    if (!currentBrand) return;
    
    if (!newIndicator.label.trim()) {
      setError(t('quality.indicatorNameRequired'));
      return;
    }
    
    if (!newIndicator.id.trim()) {
      // Generate ID from label if not provided
      newIndicator.id = newIndicator.label.toLowerCase().replace(/\s+/g, '_');
    }
    
    setBrandQualityData(prev => {
      const updatedBrand = { ...prev[currentBrand] };
      
      if (editingIndicator) {
        // Update existing indicator
        const indicatorIndex = updatedBrand.indicators.findIndex(ind => ind.id === editingIndicator.id);
        if (indicatorIndex !== -1) {
          const updatedIndicators = [...updatedBrand.indicators];
          updatedIndicators[indicatorIndex] = {
            ...newIndicator,
            value: updatedIndicators[indicatorIndex].value || 0
          };
          updatedBrand.indicators = updatedIndicators;
        }
      } else {
        // Add new indicator
        updatedBrand.indicators = [
          ...updatedBrand.indicators || [],
          {
            ...newIndicator,
            value: 0
          }
        ];
      }
      
      return {
        ...prev,
        [currentBrand]: updatedBrand
      };
    });
    
    setShowIndicatorModal(false);
    setSuccess(editingIndicator ? t('quality.indicatorUpdated') : t('quality.indicatorAdded'));
  };

  const ICON_OPTIONS = ['📊', '👍', '🚗', '📞', '⭐', '🔍', '📈', '🛠️', '🏆', '✅'];
  const COLOR_OPTIONS = [
    { name: t('common.colors.blue'), value: 'bg-blue-50/50 border-blue-200/50' },
    { name: t('common.colors.indigo'), value: 'bg-indigo-50/50 border-indigo-200/50' },
    { name: t('common.colors.purple'), value: 'bg-purple-50/50 border-purple-200/50' },
    { name: t('common.colors.rose'), value: 'bg-rose-50/50 border-rose-200/50' },
    { name: t('common.colors.green'), value: 'bg-green-50/50 border-green-200/50' },
    { name: t('common.colors.yellow'), value: 'bg-yellow-50/50 border-yellow-200/50' },
    { name: t('common.colors.orange'), value: 'bg-orange-50/50 border-orange-200/50' },
    { name: t('common.colors.red'), value: 'bg-red-50/50 border-red-200/50' },
    { name: t('common.colors.cyan'), value: 'bg-cyan-50/50 border-cyan-200/50' },
    { name: t('common.colors.teal'), value: 'bg-teal-50/50 border-teal-200/50' }
  ];

  // Données simulées pour l'historique qualité
  const historyData = {
    'Peugeot': {
      janvier: { surveys: 12, recommendation: 78, mobility: 45, recontact: 67 },
      fevrier: { surveys: 15, recommendation: 82, mobility: 52, recontact: 71 },
      mars: { surveys: 18, recommendation: 85, mobility: 58, recontact: 74 },
      avril: { surveys: 14, recommendation: 79, mobility: 48, recontact: 69 },
      mai: { surveys: 16, recommendation: 83, mobility: 55, recontact: 72 },
      juin: { surveys: 13, recommendation: 77, mobility: 43, recontact: 65 },
      juillet: { surveys: 17, recommendation: 81, mobility: 51, recontact: 70 },
      aout: { surveys: 19, recommendation: 84, mobility: 57, recontact: 73 }
    },
    'Citroën': {
      janvier: { surveys: 8, recommendation: 75, mobility: 42, recontact: 63 },
      fevrier: { surveys: 11, recommendation: 79, mobility: 49, recontact: 68 },
      mars: { surveys: 14, recommendation: 82, mobility: 55, recontact: 71 },
      avril: { surveys: 10, recommendation: 76, mobility: 45, recontact: 66 },
      mai: { surveys: 12, recommendation: 80, mobility: 52, recontact: 69 },
      juin: { surveys: 9, recommendation: 74, mobility: 40, recontact: 62 },
      juillet: { surveys: 13, recommendation: 78, mobility: 48, recontact: 67 },
      aout: { surveys: 15, recommendation: 81, mobility: 54, recontact: 70 }
    }
  };

  // Préparer les données pour le graphique d'historique
  const prepareHistoryData = () => {
    const months = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout'];
    const monthNames = {
      janvier: 'Jan', fevrier: 'Fév', mars: 'Mar', avril: 'Avr',
      mai: 'Mai', juin: 'Jun', juillet: 'Jul', aout: 'Aoû'
    };
    
    return months.map(month => {
      const dataPoint = { 
        month: monthNames[month],
        fullMonth: month
      };
      
      Object.keys(brandQualityData).forEach(brand => {
        dataPoint[brand] = historyData[brand]?.[month]?.surveys || 0;
        dataPoint[`${brand}_details`] = historyData[brand]?.[month] || {};
      });
      
      return dataPoint;
    });
  };

  // Composant tooltip personnalisé pour l'historique
  const CustomHistoryTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalSurveys = Object.keys(brandQualityData).reduce((sum, brand) => sum + (data[brand] || 0), 0);
      
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <h3 className="text-base font-semibold text-gray-900 mb-3">{label}</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total enquêtes :</span>
              <span className="text-sm font-bold text-gray-900">{totalSurveys}</span>
            </div>
            {Object.keys(brandQualityData).map((brand, index) => {
              const brandData = data[`${brand}_details`];
              const brandColor = index === 0 ? '#2563eb' : '#16a34a';
              
              return (
                <div key={brand} className="border-t border-gray-100 pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: brandColor }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">{brand}</span>
                  </div>
                  <div className="ml-5 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Enquêtes :</span>
                      <span className="text-xs font-medium">{data[brand]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Recommandation :</span>
                      <span className="text-xs font-medium">{brandData.recommendation}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Mobilité :</span>
                      <span className="text-xs font-medium">{brandData.mobility}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Recontact :</span>
                      <span className="text-xs font-medium">{brandData.recontact}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleMonthlyResultChange = (brand, month, field, value) => {
    setMonthlyResults(prev => ({
      ...prev,
      [brand]: {
        ...prev[brand],
        [month]: {
          ...prev[brand][month],
          [field]: Number(value) || 0
        }
      }
    }));
  };

  const handleSurveyFieldChange = (field, value) => {
    if (editingSurvey) {
      setSurveys(surveys.map(survey => 
        survey.id === editingSurvey.id ? { ...survey, [field]: value } : survey
      ));
    } else {
      setNewSurvey(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCollaboratorChange = (surveyId, newName) => {
    setSurveys(surveys.map(survey => 
      survey.id === surveyId ? { ...survey, collaborator: newName } : survey
    ));
  };

  const handleSurveysReceivedChange = (surveyId, newCount) => {
    setSurveys(surveys.map(survey => 
      survey.id === surveyId ? { ...survey, surveysReceived: parseInt(newCount) || 0 } : survey
    ));
  };

  const handleSurveyResultChange = (field, value) => {
    if (editingSurvey) {
      setSurveys(surveys.map(survey => 
        survey.id === editingSurvey.id 
          ? { ...survey, results: { ...survey.results, [field]: Number(value) || 0 } }
          : survey
      ));
    } else {
      setNewSurvey(prev => ({
        ...prev,
        results: {
          ...prev.results,
          [field]: Number(value) || 0
        }
      }));
    }
  };

  // Fonction pour ajouter un collaborateur
  const handleAddCollaborator = () => {
    if (!newCollaborator.name.trim()) {
      alert('Veuillez saisir un nom de collaborateur');
      return;
    }

    const newId = Math.max(...surveysByCCS.map(s => s.id)) + 1;
    
    // Créer les résultats basés sur les indicateurs actuels
    const newResults = {};
    indicators.forEach(indicator => {
      newResults[indicator.name] = Math.floor(Math.random() * 5) + 1; // Note aléatoire entre 1 et 5
    });

    const newSurvey = {
      id: newId,
      employee: newCollaborator.name,
      surveysReceived: newCollaborator.surveysReceived,
      results: newResults
    };

    setSurveysByCCS(prev => [...prev, newSurvey]);
    setNewCollaborator({ name: '', surveysReceived: 0 });
    setShowAddCollaboratorForm(false);
  };

  // Fonction pour supprimer un collaborateur
  const handleDeleteCollaborator = (surveyId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce collaborateur ?')) {
      setSurveysByCCS(prev => prev.filter(survey => survey.id !== surveyId));
    }
  };

  // Mettre à jour les résultats des enquêtes existantes avec les nouveaux indicateurs
  const updateSurveysWithNewIndicators = () => {
    setSurveys(prevSurveys => 
      prevSurveys.map(survey => ({
        ...survey,
        results: indicators.reduce((acc, indicator) => {
          acc[indicator.name] = survey.results[indicator.name] || 0;
          return acc;
        }, {})
      }))
    );
  };

  // Mettre à jour les enquêtes quand les indicateurs changent
  React.useEffect(() => {
    updateSurveysWithNewIndicators();
  }, [indicators]);

  return (
    <div className="p-6 bg-gray-50">
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      {success && <Alert type="success" className="mb-4">{success}</Alert>}

      <div className="mb-6 flex justify-between items-center">
        <DateSelector 
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
        <div className="flex items-center gap-4">
          <SiteSelector
            selectedSite={selectedSite}
            onChange={setSelectedSite}
          />
          {isEditing && (
            <Button 
              onClick={() => setShowBrandModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              {t('quality.addBrand')}
            </Button>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex justify-center">
          <nav className="inline-flex bg-gray-100 rounded-xl p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('indicators')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'indicators'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Indicateurs</span>
              {activeTab === 'indicators' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'history'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Historique</span>
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('surveys')}
              className={`relative px-10 py-5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform overflow-hidden ${
                activeTab === 'surveys'
                  ? 'bg-white text-blue-700 shadow-md scale-105 ring-2 ring-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-102'
              }`}
            >
              <span className="relative z-10">
                <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span className="text-xl font-semibold">Enquêtes par CCS</span>
              {activeTab === 'surveys' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Bouton Modifier pour la vue Indicateurs qualité */}
      {activeTab === 'indicators' && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isEditing ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {isEditing ? 'Terminer' : 'Modifier'}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {activeTab === 'indicators' && (
          <Card>
            <CardHeader title="Indicateurs qualité" />
            <>
            {Object.entries(brandQualityData).map(([brand, data]) => (
              <Card key={brand} className="overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
                  {editingBrandName === brand ? (
                    <form 
                      onSubmit={(e) => handleBrandNameSubmit(e, true)} 
                      className="flex-1 mr-4"
                    >
                      <input
                        ref={editNameInputRef}
                        type="text"
                        value={tempBrandName}
                        onChange={handleBrandNameChange}
                        onKeyDown={handleKeyDown}
                        onBlur={(e) => {
                          setTimeout(() => {
                            if (editingBrandName) {
                              handleBrandNameSubmit(null, true);
                            }
                          }, 100);
                        }}
                        className="w-full px-3 py-2 text-lg font-medium text-gray-900 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
                      />
                    </form>
                  ) : (
                    <div 
                      className={`flex items-center justify-center w-full ${isEditing ? 'cursor-pointer hover:text-indigo-600' : ''}`}
                      onClick={() => handleStartEditingBrandName(brand)}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 text-center">{t('quality.quality')} {brand}</h3>
                      {isEditing && <PencilIcon className="h-4 w-4 text-gray-500 ml-2" />}
                    </div>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveBrand(brand)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title={t('quality.deleteBrand')}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-blue-700">{t('quality.surveysReceived')}:</span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={data.surveys.value}
                            onChange={(e) => handleValueChange(brand, 'surveys', e.target.value)}
                            className="w-20 px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg font-semibold bg-white"
                            min="0"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-blue-800">{data.surveys.value}</span>
                        )}
                      </div>
                    </div>
                    
                    {isEditing && (
                      <Button 
                        onClick={() => {
                          setCurrentBrand(brand);
                          handleAddIndicator();
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                        size="sm"
                      >
                        <PlusIcon className="h-4 w-4" />
                        {t('quality.addIndicator')}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.indicators && data.indicators.map((indicator) => {
                      const value = indicator.value || 0;
                      const target = indicator.target || 80;
                      const color = getProgressColor(value, target);
                      
                      return (
                        <div 
                          key={indicator.id} 
                          className={`rounded-xl p-6 border shadow-sm ${indicator.bgColor} h-[280px] flex flex-col relative transition-all duration-300 hover:shadow-md`}
                        >
                          {isEditing && (
                            <div className="absolute top-3 right-3 flex gap-2">
                              <button
                                onClick={() => handleEditIndicator(brand, indicator)}
                                className="p-1.5 rounded-full bg-white/70 hover:bg-white text-gray-600 hover:text-indigo-600 transition-colors shadow-sm"
                                title={t('quality.editIndicator')}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveIndicator(brand, indicator.id)}
                                className="p-1.5 rounded-full bg-white/70 hover:bg-white text-gray-600 hover:text-red-600 transition-colors shadow-sm"
                                title={t('quality.deleteIndicator')}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          
                          <div className="flex-none">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-2xl">
                                {indicator.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{indicator.label}</h3>
                                <p className="text-sm text-gray-600">{indicator.description}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 flex items-center">
                            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                              <div className="w-32 h-32 relative">
                                <CircularProgressbar
                                  value={value}
                                  maxValue={100}
                                  text={isEditing ? '' : `${value}%`}
                                  styles={buildStyles({
                                    pathColor: color,
                                    textColor: '#1e293b',
                                    trailColor: '#e2e8f0',
                                    textSize: '22px',
                                    pathTransitionDuration: 0.5
                                  })}
                                />
                                {isEditing && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <input
                                      type="number"
                                      value={value}
                                      onChange={(e) => handleIndicatorValueChange(brand, indicator.id, e.target.value)}
                                      className="w-16 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="text-center md:text-right">
                                <div className="text-sm font-medium text-gray-500">
                                  {t('common.target')}
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                  {target}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
          </Card>
        )}

        {activeTab === 'history' && (
          <Card>
            <CardHeader title="Historique qualité" />
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prepareHistoryData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: 'Nombre d\'enquêtes', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      content={<CustomHistoryTooltip />}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="line"
                    />
                    {Object.keys(brandQualityData).map((brand, index) => (
                      <Line
                        key={brand}
                        type="monotone"
                        dataKey={brand}
                        name={brand}
                        stroke={index === 0 ? '#2563eb' : '#16a34a'}
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#2563eb", strokeWidth: 2, stroke: "#ffffff" }}
                        activeDot={{ r: 7, fill: "#2563eb", strokeWidth: 2, stroke: "#ffffff" }}
                        animationBegin={0}
                        animationDuration={1000}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'surveys' && (
          <Card>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-900">Enquêtes qualité par CCS</h3>
              <div className="flex gap-2">
                {isEditingSurveys && (
                  <Button
                    onClick={() => setShowAddCollaboratorForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Ajouter un collaborateur
                  </Button>
                )}
                <Button
                  onClick={() => setIsEditingSurveys(!isEditingSurveys)}
                  className={isEditingSurveys ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                >
                  {isEditingSurveys ? 'Terminer' : 'Modifier'}
                </Button>
              </div>
            </div>

            {/* Formulaire d'ajout de collaborateur */}
            {showAddCollaboratorForm && (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-900 mb-4">Ajouter un nouveau collaborateur</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du collaborateur
                    </label>
                    <input
                      type="text"
                      value={newCollaborator.name}
                      onChange={(e) => setNewCollaborator(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du collaborateur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre d'enquêtes reçues
                    </label>
                    <input
                      type="number"
                      value={newCollaborator.surveysReceived}
                      onChange={(e) => setNewCollaborator(prev => ({ ...prev, surveysReceived: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      onClick={handleAddCollaborator}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Ajouter
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAddCollaboratorForm(false);
                        setNewCollaborator({ name: '', surveysReceived: 0 });
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Total : {surveysByCCS.reduce((sum, survey) => sum + survey.surveysReceived, 0)} enquêtes
              </div>
              <div className="space-y-6">
                {surveysByCCS.map((survey) => (
                  <div key={survey.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {isEditingSurveys ? (
                          <input
                            type="text"
                            value={survey.employee}
                            onChange={(e) => {
                              setSurveysByCCS(prev => prev.map(s => 
                                s.id === survey.id ? { ...s, employee: e.target.value } : s
                              ));
                            }}
                            className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                          />
                        ) : (
                          <h4 className="text-lg font-semibold text-gray-900">{survey.employee}</h4>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{survey.surveysReceived}</div>
                        <div className="text-sm text-gray-600">
                          {isEditingSurveys ? (
                            <span>
                              <input
                                type="number"
                                value={survey.surveysReceived}
                                onChange={(e) => {
                                  setSurveysByCCS(prev => prev.map(s => 
                                    s.id === survey.id ? { ...s, surveysReceived: parseInt(e.target.value) || 0 } : s
                                  ));
                                }}
                                className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                              />
                              {' '}enquêtes reçues
                            </span>
                          ) : (
                            `${survey.surveysReceived} enquêtes reçues`
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(survey.results).map(([criterion, score]) => (
                        <div key={criterion} className="text-center">
                          <div className="text-sm font-medium text-gray-700 mb-1">{criterion}</div>
                          <div className={`text-lg font-bold ${
                            score >= 4.0 ? 'text-green-600' :
                            score >= 3.5 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {score}/5
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                score >= 4.0 ? 'bg-green-500' :
                                score >= 3.5 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${(score / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Bouton de suppression en mode édition */}
                    {isEditingSurveys && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={() => handleDeleteCollaborator(survey.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'monthly' && (
          <Card>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Résultats par mois et par marque</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Année :</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
            </div>
            <CardContent>
              {/* Graphique d'évolution mensuelle */}
              <div className="mb-8">
                <h4 className="text-base font-medium text-gray-900 mb-4">Évolution du nombre d'enquêtes reçues</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={prepareMonthlyChartData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="month"
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      {Object.keys(monthlyResults).map((brand, index) => (
                        <Line
                          key={brand}
                          type="monotone"
                          dataKey={`${brand}_surveys`}
                          name={brand}
                          stroke={index === 0 ? '#2563eb' : '#16a34a'}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Évolution annuelle des enquêtes qualité par marque</p>
                </div>
              </div>

              {/* Tableaux par marque */}
              <div className="space-y-8">
                {Object.entries(monthlyResults).map(([brand, brandData]) => (
                  <div key={brand}>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">{brand}</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mois
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Enquêtes reçues
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Taux de recommandation (%)
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Solution de mobilité (%)
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Suivi client (%)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Object.entries(brandData).map(([month, monthData]) => {
                            const monthNames = {
                              janvier: 'Janvier', fevrier: 'Février', mars: 'Mars', avril: 'Avril',
                              mai: 'Mai', juin: 'Juin', juillet: 'Juillet', aout: 'Août',
                              septembre: 'Septembre', octobre: 'Octobre', novembre: 'Novembre', decembre: 'Décembre'
                            };
                            
                            return (
                              <tr key={month} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {monthNames[month]}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={monthData.surveys}
                                      onChange={(e) => handleMonthlyResultChange(brand, month, 'surveys', e.target.value)}
                                      className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                      min="0"
                                    />
                                  ) : (
                                    <span className="text-sm text-gray-900">{monthData.surveys}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={monthData.recommendation}
                                      onChange={(e) => handleMonthlyResultChange(brand, month, 'recommendation', e.target.value)}
                                      className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                    />
                                  ) : (
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      monthData.recommendation >= 85 ? 'bg-green-100 text-green-800' :
                                      monthData.recommendation >= 75 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {monthData.recommendation}%
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={monthData.mobility}
                                      onChange={(e) => handleMonthlyResultChange(brand, month, 'mobility', e.target.value)}
                                      className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                    />
                                  ) : (
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      monthData.mobility >= 60 ? 'bg-green-100 text-green-800' :
                                      monthData.mobility >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {monthData.mobility}%
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={monthData.recontact}
                                      onChange={(e) => handleMonthlyResultChange(brand, month, 'recontact', e.target.value)}
                                      className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                    />
                                  ) : (
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      monthData.recontact >= 70 ? 'bg-green-100 text-green-800' :
                                      monthData.recontact >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {monthData.recontact}%
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal pour ajouter une marque */}
      {showBrandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('quality.addBrand')}</h3>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder={t('quality.brandNamePlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowBrandModal(false);
                  setNewBrandName('');
                }}
                variant="secondary"
              >
                {t('common.cancel')}
              </Button>
              <Button onClick={handleAddBrand}>
                {t('common.add')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour ajouter/modifier un indicateur */}
      {showIndicatorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingIndicator ? t('quality.editIndicator') : t('quality.addIndicator')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('quality.indicatorName')}
                </label>
                <input
                  type="text"
                  value={newIndicator.label}
                  onChange={(e) => setNewIndicator(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('quality.indicatorDescription')}
                </label>
                <input
                  type="text"
                  value={newIndicator.description}
                  onChange={(e) => setNewIndicator(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('quality.indicatorIcon')}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewIndicator(prev => ({ ...prev, icon }))}
                      className={`p-2 text-2xl border rounded-md hover:bg-gray-50 ${
                        newIndicator.icon === icon ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('quality.indicatorColor')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_OPTIONS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setNewIndicator(prev => ({ ...prev, bgColor: color.value }))}
                      className={`p-3 text-sm border rounded-md hover:bg-gray-50 ${
                        newIndicator.bgColor === color.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                      } ${color.value}`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('quality.indicatorTarget')} (%)
                </label>
                <input
                  type="number"
                  value={newIndicator.target}
                  onChange={(e) => setNewIndicator(prev => ({ ...prev, target: Number(e.target.value) || 80 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowIndicatorModal(false);
                  setEditingIndicator(null);
                }}
                variant="secondary"
              >
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSaveIndicator}>
                {editingIndicator ? t('common.update') : t('common.add')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour ajouter/modifier une enquête */}
      {showSurveyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingSurvey ? 'Modifier l\'enquête' : 'Ajouter une enquête'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
                <input
                  type="text"
                  value={editingSurvey ? editingSurvey.employee : newSurvey.employee}
                  onChange={(e) => handleSurveyFieldChange('employee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mois</label>
                  <select
                    value={editingSurvey ? editingSurvey.month : newSurvey.month}
                    onChange={(e) => handleSurveyFieldChange('month', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Sélectionner un mois</option>
                    <option value="janvier">Janvier</option>
                    <option value="fevrier">Février</option>
                    <option value="mars">Mars</option>
                    <option value="avril">Avril</option>
                    <option value="mai">Mai</option>
                    <option value="juin">Juin</option>
                    <option value="juillet">Juillet</option>
                    <option value="aout">Août</option>
                    <option value="septembre">Septembre</option>
                    <option value="octobre">Octobre</option>
                    <option value="novembre">Novembre</option>
                    <option value="decembre">Décembre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                  <input
                    type="number"
                    value={editingSurvey ? editingSurvey.year : newSurvey.year}
                    onChange={(e) => handleSurveyFieldChange('year', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enquêtes reçues</label>
                <input
                  type="number"
                  value={editingSurvey ? editingSurvey.surveysReceived : newSurvey.surveysReceived}
                  onChange={(e) => handleSurveyFieldChange('surveysReceived', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Résultats par critère (note sur 5)</label>
                <div className="space-y-3">
                  {['Satisfaction générale', 'Qualité du service', 'Temps d\'attente', 'Recommandation'].map(criterion => (
                    <div key={criterion} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{criterion}</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editingSurvey ? (editingSurvey.results[criterion] || 0) : (newSurvey.results[criterion] || 0)}
                        onChange={(e) => handleSurveyResultChange(criterion, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowSurveyForm(false);
                  setEditingSurvey(null);
                  setNewSurvey({
                    employee: '',
                    month: '',
                    year: new Date().getFullYear(),
                    surveysReceived: 0,
                    results: {}
                  });
                }}
                variant="secondary"
              >
                Annuler
              </Button>
              <Button onClick={() => {
                // Logique de sauvegarde ici
                setShowSurveyForm(false);
                setEditingSurvey(null);
              }}>
                {editingSurvey ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}