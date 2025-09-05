import React from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function PrintButton({ onClick }) {
  const { t } = useTranslation();
  
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
      title={t('common.print', 'Imprimer le résumé')}
    >
      <PrinterIcon className="h-5 w-5" />
      <span className="sr-only md:not-sr-only md:inline-block text-sm font-medium">
        {t('common.print', 'Imprimer')}
      </span>
    </button>
  );
}