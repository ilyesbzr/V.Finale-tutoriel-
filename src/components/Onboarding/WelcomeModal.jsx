import React from 'react';
import { CheckIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function WelcomeModal({ onStart, onSkip }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto animate-scale-in">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-2xl text-center">
          <div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Bienvenue sur AutoDashboard !</h1>
            <p className="text-blue-100">Votre solution complète de gestion après-vente automobile</p>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Découvrez votre nouveau tableau de bord
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous avons préparé un tutoriel rapide de <strong>2 minutes</strong> pour vous présenter 
              les fonctionnalités essentielles et vous aider à démarrer efficacement.
            </p>
          </div>

          {/* Fonctionnalités clés */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">📊</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Synthèse temps réel</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🎯</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Objectifs mensuels</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">💰</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Suivi CA & heures</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🛒</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Ventes additionnelles</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onStart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <PlayIcon className="h-5 w-5" />
              Commencer le tutoriel
            </button>
            <button
              onClick={onSkip}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Passer
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Vous pourrez relancer ce tutoriel à tout moment depuis l'icône d'aide dans l'en-tête
          </p>
        </div>
      </div>
    </div>
  );
}