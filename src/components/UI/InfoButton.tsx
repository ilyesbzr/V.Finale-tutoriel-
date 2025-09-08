import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface InfoButtonProps {
  onClick: () => void;
}

export default function InfoButton({ onClick }: InfoButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center p-1 text-gray-400 hover:text-gray-500"
      title="Voir l'historique"
    >
      <InformationCircleIcon className="h-5 w-5" />
    </button>
  );
}