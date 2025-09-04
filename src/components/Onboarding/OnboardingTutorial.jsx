import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import WelcomeModal from './WelcomeModal';
import FeatureHighlight from './FeatureHighlight';

const tutorialSteps = [
  {
    id: 'welcome',
    title: '👋 Bienvenue sur AutoDashboard',
    description: 'Votre tableau de bord pour la gestion après-vente automobile. Découvrons ensemble les fonctionnalités principales en 2 minutes.',
    highlight: null,
    action: null
  },
  {
    id: 'synthesis',
    title: '📊 Synthèse - Vue d\'ensemble',
    description: 'Votre point de départ quotidien. Visualisez instantanément vos KPI principaux : CA, heures facturées, et avancement par rapport aux objectifs.',
    highlight: '[href="/synthesis"]',
    action: '/synthesis'
  },
  {
    id: 'targets',
    title: '🎯 Objectifs du mois',
    description: 'Définissez et ajustez vos objectifs mensuels : budget, potentiel d\'heures, objectifs par service et ventes additionnelles.',
    highlight: '[href="/targets"]',
    action: '/targets'
  },
  {
    id: 'revenue',
    title: '💰 Chiffre d\'affaires',
    description: 'Suivez votre progression CA avec des graphiques détaillés, comparatifs annuels et répartition par service.',
    highlight: '[href="/revenue"]',
    action: '/revenue'
  },
  {
    id: 'hours',
    title: '⏰ Gestion des heures',
    description: 'Monitorer vos heures facturées, potentiel de facturation et dossiers en cours par service.',
    highlight: '[href="/hours"]',
    action: '/hours'
  },
  {
    id: 'crescendo',
    title: '🛒 Ventes additionnelles',
    description: 'Suivez vos ventes de pièces et accessoires avec des objectifs par famille de produits et par conseiller.',
    highlight: '[href="/crescendo"]',
    action: '/crescendo'
  },
  {
    id: 'productivity',
    title: '📈 Rentabilité',
    description: 'Analysez la productivité de vos équipes avec le suivi individuel des techniciens et mécaniciens.',
    highlight: '[href="/productivity"]',
    action: '/productivity'
  },
  {
    id: 'complete',
    title: '✅ Prêt à commencer !',
    description: 'Vous maîtrisez maintenant les bases d\'AutoDashboard. Explorez les autres onglets pour découvrir toutes les fonctionnalités.',
    highlight: null,
    action: null
  }
];

export default function OnboardingTutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();

  const currentStepData = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  // Highlight the current element
  useEffect(() => {
    if (currentStepData.highlight) {
      const element = document.querySelector(currentStepData.highlight);
      if (element) {
        element.classList.add('tutorial-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Cleanup previous highlights
    return () => {
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    };
  }, [currentStep]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      if (currentStepData.action) {
        navigate(currentStepData.action);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevStep = tutorialSteps[currentStep - 1];
      if (prevStep.action) {
        navigate(prevStep.action);
      }
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Marquer le tutoriel comme terminé
    localStorage.setItem('onboarding_completed', 'true');
    if (onComplete) {
      onComplete();
    }
  };

  const handleWelcomeStart = () => {
    setShowWelcome(false);
    // Naviguer vers la synthèse pour commencer le tutoriel
    navigate('/synthesis');
  };

  const handleWelcomeSkip = () => {
    setShowWelcome(false);
    handleComplete();
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    const step = tutorialSteps[stepIndex];
    if (step.action) {
      navigate(step.action);
    }
  };

  if (!isVisible) return null;

  // Afficher d'abord le modal de bienvenue
  if (showWelcome) {
    return <WelcomeModal onStart={handleWelcomeStart} onSkip={handleWelcomeSkip} />;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300" />
      
      {/* Tutorial Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto animate-scale-in border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
                  <div className="flex items-center gap-2 text-blue-100">
                    <span className="text-sm font-medium">Étape {currentStep + 1} sur {tutorialSteps.length}</span>
                    <div className="flex-1 bg-blue-400/30 rounded-full h-2 ml-4">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-blue-100 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Fonctionnalités pour l'étape de bienvenue */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <FeatureHighlight
                  title="Synthèse temps réel"
                  description="Vue d'ensemble de vos KPI"
                  icon="📊"
                  color="blue"
                />
                <FeatureHighlight
                  title="Objectifs mensuels"
                  description="Configuration et suivi"
                  icon="🎯"
                  color="green"
                />
                <FeatureHighlight
                  title="Suivi CA & heures"
                  description="Analyse détaillée"
                  icon="💰"
                  color="purple"
                />
                <FeatureHighlight
                  title="Ventes additionnelles"
                  description="Crescendo par produit"
                  icon="🛒"
                  color="orange"
                />
              </div>
            )}

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {currentStepData.description}
            </p>

            {/* Step indicators */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-2">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? 'bg-blue-600 scale-125' 
                        : index < currentStep 
                          ? 'bg-green-500 hover:scale-110' 
                          : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={isFirstStep}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isFirstStep 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
                Précédent
              </button>

              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Passer le tutoriel
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {isLastStep ? (
                  <>
                    <CheckIcon className="h-5 w-5" />
                    Commencer
                  </>
                ) : (
                  <>
                    Suivant
                    <ChevronRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}