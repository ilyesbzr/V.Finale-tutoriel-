import React, { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function EmailReportButton({ onClick, className = '' }) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleClick = async () => {
    setIsGenerating(true);
    try {
      await onClick();
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={isGenerating}
      className={`flex items-center gap-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={t('common.generateEmailReport', 'Générer un rapport pour email')}
    >
      <EnvelopeIcon className="h-5 w-5" />
      <span className="sr-only md:not-sr-only md:inline-block text-sm font-medium">
        {isGenerating ? t('common.generating', 'Génération...') : t('common.emailReport', 'Rapport email')}
      </span>
    </button>
  );
}