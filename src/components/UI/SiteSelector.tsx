import React from 'react';
import { ChevronDownIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { SITES } from '../../utils/constants/metrics';
import { useTranslation } from 'react-i18next';

interface Site {
  id: string;
  name: string;
}

interface SiteSelectorProps {
  selectedSite: string;
  onChange: (site: string) => void;
}

const sites: Site[] = [
  { id: 'RO', name: SITES.RO },
  { id: 'EU', name: SITES.EU },
  { id: 'MTD', name: SITES.MTD },
  { id: 'ST', name: SITES.ST }
];

export default function SiteSelector({ selectedSite, onChange }: SiteSelectorProps): JSX.Element {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center space-x-3">
      <label htmlFor="site" className="text-base font-semibold text-gray-700 hidden sm:inline flex items-center gap-2">
        {t('common.site', 'Concession')} :
      </label>
      <div className="relative">
        <select
          id="site"
          value={selectedSite}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-base font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md min-w-[140px]"
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}