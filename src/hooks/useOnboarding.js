import { useState, useEffect } from 'react';

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si le tutoriel a déjà été complété
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    
    // Délai pour laisser l'application se charger
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Écouter les événements de redémarrage du tutoriel
  useEffect(() => {
    const handleRestartTutorial = () => {
      setShowOnboarding(true);
    };

    window.addEventListener('restartTutorial', handleRestartTutorial);
    return () => window.removeEventListener('restartTutorial', handleRestartTutorial);
  }, []);
  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboarding_completed', 'true');
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    isLoading,
    completeOnboarding,
    resetOnboarding
  };
}