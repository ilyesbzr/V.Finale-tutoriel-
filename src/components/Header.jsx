import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ExcelUploadButton from './ExcelUpload/ExcelUploadButton';
import UserMenu from './UI/UserMenu';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

function Header({ onMobileMenuToggle }) {
  const { user } = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const { t } = useTranslation();
  
  // Obtenir la première lettre de l'email en majuscule
  const userInitial = user?.email ? user.email[0].toUpperCase() : 'U';

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pages où le bouton d'import doit être affiché
  const showImportButton = [
    '/synthesis',
    '/hours',
    '/revenue',
    '/crescendo',
    '/entries',
    '/videocheck',
    '/productivity'
  ].includes(location.pathname);

  return (
    <header className="header-modern">
      <div className="px-6 sm:px-8 lg:px-10 py-5 flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-3 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:scale-105"
            onClick={onMobileMenuToggle}
          >
            <span className="sr-only">{t('common.open')}</span>
            <Bars3Icon className="h-7 w-7" />
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 ml-3 md:ml-0 heading-modern">
            {t('dashboard.title', 'Gestion Après-Vente Automobile')}
          </h1>
        </div>
        <div className="flex items-center gap-6">
          {showImportButton && <ExcelUploadButton />}
          <TutorialButton />
        </div>
      </div>
    </header>
  );
}

function TutorialButton() {
  const { t } = useTranslation();
  
  const handleRestartTutorial = (e) => {
    e.preventDefault();
    localStorage.removeItem('onboarding_completed');
    // Déclencher un événement personnalisé pour redémarrer le tutoriel
    window.dispatchEvent(new CustomEvent('restartTutorial'));
  };

  return (
    <button
      type="button"
      onClick={handleRestartTutorial}
      className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
      title="Relancer le tutoriel"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="sr-only md:not-sr-only md:inline-block text-sm font-medium">
        Tutoriel
      </span>
    </button>
  );
}

export default Header;