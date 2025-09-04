import React from 'react';

export default function SiteCheckboxGroup({ sites, selectedSites, onChange }) {
  const handleChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    onChange(selectedOptions);
  };

  return (
    <select
      multiple
      value={selectedSites}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      size={3}
    >
      {sites.map(site => (
        <option key={site.id} value={site.id}>
          {site.name}
        </option>
      ))}
    </select>
  );
}