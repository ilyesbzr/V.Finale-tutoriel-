import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SiteSelectorProps {
  selectedSite: string;
  onSiteChange: (site: string) => void;
  sites?: string[];
}

export const SiteSelector: React.FC<SiteSelectorProps> = ({
  selectedSite,
  onSiteChange,
  sites = ['Site 1', 'Site 2', 'Site 3', 'Groupe']
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mr-3">
        {t('common.concession')} :
      </label>
      <div className="relative inline-block">
        <select
          value={selectedSite}
          onChange={(e) => onSiteChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[120px]"
        >
          {sites.map((site) => (
            <option key={site} value={site}>
              {site}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};