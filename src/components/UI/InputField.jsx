import React from 'react';

export default function InputField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  error
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}