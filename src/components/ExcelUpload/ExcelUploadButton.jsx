import React from 'react';
import Button from '../UI/Button';
import { useTranslation } from 'react-i18next';

export default function ExcelUploadButton() {
  const { t } = useTranslation();

  const handleClick = () => {
    // Juste un bouton visuel pour la démo - aucune logique
    alert('Fonctionnalité d\'import disponible dans la version complète');
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        className="hidden sm:flex"
      >
        {t('excel.importExcel', 'Importer un fichier Excel')}
      </Button>
      <Button
        onClick={handleClick}
        className="sm:hidden"
      >
        {t('excel.import', 'Importer')}
      </Button>
    </div>
  );
}