import React, { useState, useEffect } from 'react';
import TicketForm from '../components/Help/TicketForm';
import TicketList from '../components/Help/TicketList';
import LoadingState from '../components/common/LoadingState';
import { useTranslation } from 'react-i18next';

export default function Help() {
  const [tickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // Remove loading state to show content immediately
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <TicketForm />
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Centre d'aide</h2>
            <div className="prose prose-blue">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-700">contact@auto-dashboard.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">8h-18h du lundi au vendredi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TicketList tickets={tickets} />
    </div>
  );
}