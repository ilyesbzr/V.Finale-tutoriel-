import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SiteSelectorProps {
  selectedSite: string;
  onSiteChange: (site: string) => void;
  sites: string[];
}

export const SiteSelector: React.FC<SiteSelectorProps> = ({
  selectedSite,
  onSiteChange,
  sites
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[120px] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span>{selectedSite}</span>
        <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {sites.map((site) => (
            <button
              key={site}
              onClick={() => {
                onSiteChange(site);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg ${
                site === selectedSite ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
            >
              {site}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};