import React from 'react';

export default function TutorialTooltip({ 
  title, 
  description, 
  position = 'bottom',
  onNext,
  onPrevious,
  onSkip,
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep
}) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-4';
      case 'bottom':
        return 'top-full mt-4';
      case 'left':
        return 'right-full mr-4 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-4 top-1/2 transform -translate-y-1/2';
      default:
        return 'top-full mt-4';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-white border-l-transparent border-r-transparent border-b-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-white border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-white border-t-transparent border-b-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-white border-t-transparent border-b-transparent border-l-transparent';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-white border-l-transparent border-r-transparent border-t-transparent';
    }
  };

  return (
    <div className={`absolute ${getPositionClasses()} z-50`}>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-sm animate-fade-in">
        {/* Arrow */}
        <div className={`absolute w-0 h-0 border-8 ${getArrowClasses()}`}></div>
        
        {/* Content */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Étape {currentStep + 1} sur {totalSteps}</span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={isFirstStep}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isFirstStep 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            Précédent
          </button>

          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm"
          >
            Passer
          </button>

          <button
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md"
          >
            {isLastStep ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
}