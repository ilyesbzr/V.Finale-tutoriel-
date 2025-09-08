import React from 'react';
import { Card, CardHeader, CardContent } from '../Dashboard/Card';
import { formatNumber, formatCurrency } from '../../utils/formatters';

interface FieldConfig {
  label: string;
  format: string;
  getValue?: (data: any) => number;
  onChange?: (dept: string, value: string) => void;
  min?: number;
  step?: number;
}

interface TargetSectionProps {
  title: string;
  fields: Record<string, FieldConfig>;
  data: Record<string, any>;
  isEditing: boolean;
  onFieldChange: (dept: string, field: string, value: string, customHandler?: (dept: string, value: string) => void) => void;
  showHistoryButton?: boolean;
  onHistoryClick?: ((department: string) => void) | null;
  totalRow?: boolean;
}

/**
 * Reusable component for target sections (Budget, Objectives, etc.)
 */
export default function TargetSection({ 
  title, 
  fields, 
  data, 
  isEditing, 
  onFieldChange,
  showHistoryButton = false,
  onHistoryClick = null,
  totalRow = true
}: TargetSectionProps): JSX.Element {
  // Calculate totals for the bottom row
  const calculateTotals = (): Record<string, number> => {
    const totals: Record<string, number> = {};
    
    Object.keys(fields).forEach(fieldKey => {
      totals[fieldKey] = Object.values(data).reduce((sum: number, dept: any) => {
        return sum + (dept[fieldKey] || 0);
      }, 0);
    });
    
    return totals;
  };

  // Format value based on field type
  const formatValue = (value: number, format: string): string => {
    if (format === 'currency') return formatCurrency(value);
    if (format === 'hours') return `${formatNumber(value)}h`;
    if (format === 'percentage') return `${value}%`;
    return formatNumber(value);
  };

  const totals = totalRow ? calculateTotals() : null;

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Service column */}
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <span className="text-base">Service</span>
                </th>
                
                {/* Field columns */}
                {Object.entries(fields).map(([fieldKey, field]) => (
                  <th key={fieldKey} scope="col" className="px-6 py-3 text-center text-base font-medium text-gray-500 uppercase tracking-wider">
                    {field.label}
                  </th>
                ))}
                
                {/* History column if needed */}
                {showHistoryButton && (
                  <th scope="col" className="px-6 py-3 text-center text-base font-medium text-gray-500 uppercase tracking-wider">
                    Historique
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Data rows */}
              {Object.entries(data).map(([deptKey, deptData]) => (
                <tr key={deptKey} className="hover:bg-gray-50">
                  {/* Department name */}
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                    {deptKey === 'mechanical' ? 'Mécanique' :
                     deptKey === 'quickService' ? 'Service Rapide' :
                     'Carrosserie'}
                  </td>
                  
                  {/* Field values */}
                  {Object.entries(fields).map(([fieldKey, field]) => {
                    const value = field.getValue ? field.getValue(deptData) : deptData[fieldKey];
                    
                    return (
                      <td key={fieldKey} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {isEditing ? (
                          <div className="flex justify-center">
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => onFieldChange(deptKey, fieldKey, e.target.value, field.onChange)}
                              className="w-24 text-center text-base rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              min={field.min || 0}
                              step={field.step || 1}
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="text-lg">{formatValue(value, field.format)}</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                  
                  {/* History button */}
                  {showHistoryButton && onHistoryClick && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => onHistoryClick(deptKey === 'mechanical' ? 'Mécanique' :
                                                     deptKey === 'quickService' ? 'Service Rapide' :
                                                     'Carrosserie')}
                        className="inline-flex items-center p-1 text-gray-400 hover:text-gray-500"
                        title="Voir l'historique"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              
              {/* Totals row */}
              {totalRow && totals && (
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                    Global
                  </td>
                  
                  {/* Total values */}
                  {Object.entries(fields).map(([fieldKey, field]) => (
                    <td key={fieldKey} className="px-6 py-4 whitespace-nowrap text-center text-base text-gray-900">
                      <span className="text-lg">{formatValue(totals[fieldKey], field.format)}</span>
                    </td>
                  ))}
                  
                  {/* Empty cell for history column */}
                  {showHistoryButton && (
                    <td className="px-6 py-4 whitespace-nowrap text-center text-base">
                      {onHistoryClick && (
                        <button
                          onClick={() => onHistoryClick('Global')}
                          className="inline-flex items-center p-1 text-gray-400 hover:text-gray-500"
                          title="Voir l'historique"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}