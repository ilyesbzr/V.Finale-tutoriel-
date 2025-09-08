import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { menuItems } from './Sidebar';

interface MobileSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ currentPage, onPageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-blue-800 to-slate-800 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-700">
            <h1 className="text-2xl font-bold">
              <span className="text-blue-400">Auto</span>
              <span className="text-white">Dashboard</span>
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-lg font-medium rounded-xl transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform translate-x-1'
                    : 'text-blue-100 hover:bg-blue-700/50 hover:text-white hover:transform hover:translate-x-1'
                }`}
              >
                <item.icon className="h-7 w-7 mr-4" />
                {t(item.label)}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};