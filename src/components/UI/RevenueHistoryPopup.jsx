import React from 'react';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatters';

export default function RevenueHistoryPopup({ isOpen, onClose, department }) {
  // Mock data for the last 6 months
  const getHistoricalData = () => {
    const currentDate = new Date();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      const caHT = Math.round(Math.random() * (350 - 250) + 250); // Random value between 250 and 350
      const caHEC = Math.round(caHT * 1.3); // CA/HEC is typically higher than CA/HT
      
      data.push({
        month: format(date, 'MMMM yyyy', { locale: fr }),
        caHT,
        caHEC
      });
    }

    // Calculate averages
    const averageHT = Math.round(data.reduce((acc, curr) => acc + curr.caHT, 0) / data.length);
    const averageHEC = Math.round(data.reduce((acc, curr) => acc + curr.caHEC, 0) / data.length);
    
    return { data, averageHT, averageHEC };
  };

  const { data, averageHT, averageHEC } = getHistoricalData();

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Historique CA/H - {department}
                </h3>
                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mois
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CA NET/HEC
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.map((month) => (
                        <tr key={month.month}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {month.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {formatCurrency(month.caHEC)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-medium">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Moyenne des 6 derniers mois
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(averageHEC)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}