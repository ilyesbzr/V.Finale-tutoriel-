import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  ChartBarIcon,
  ClockIcon,
  DocumentCheckIcon,
  ChartPieIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  AdjustmentsHorizontalIcon,
  QuestionMarkCircleIcon,
  CalendarIcon,
  PresentationChartLineIcon,
  ClipboardDocumentCheckIcon,
  BanknotesIcon,
  ChartBarSquareIcon,
  FilmIcon,
  CogIcon,
  TruckIcon,
  HandRaisedIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function MobileSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useState();
  const { role, loading } = useState();
  const { t } = useTranslation();

  const isActive = (path) => location.pathname === path ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="relative flex flex-col w-72 max-w-xs h-full overflow-y-auto" style={{background: 'linear-gradient(180deg, #1e3a8a 0%, #1e293b 100%)'}}>
        <div className="flex items-center justify-between p-4 border-b border-blue-800">
          <span className="text-white text-xl font-bold">AutoDashboard</span>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 flex-1 px-2 space-y-1">

          <Link
            to="/rent"
                className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/rent')}`}
            onClick={onClose}
          >
                <TruckIcon className="mr-3 h-7 w-7" />
            Rent
          </Link>

          <Link
            to="/commercial-gestures"
                className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/commercial-gestures')}`}
            onClick={onClose}
          >
                <HandRaisedIcon className="mr-3 h-7 w-7" />
            Gestes commerciaux
          </Link>

          <Link
            to="/revenue"
                className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/revenue')}`}
            onClick={onClose}
          >
                <ChartBarIcon className="mr-3 h-7 w-7" />
            {t('navigation.revenue')}
          </Link>

          <Link
            to="/hours"
                className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/hours')}`}
            onClick={onClose}
          >
                <ClockIcon className="mr-3 h-7 w-7" />
            {t('navigation.hours')}
          </Link>

          <Link
            to="/crescendo"
                className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/crescendo')}`}
            onClick={onClose}
          >
                <ShoppingCartIcon className="mr-3 h-7 w-7" />
            {t('navigation.crescendo')}
          </Link>

          <Link
            to="/productivity"
                className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/productivity')}`}
            onClick={onClose}
          >
                <ChartPieIcon className="mr-3 h-7 w-7" />
            Rentabilité
          </Link>

          <Link
            to="/entries"
                className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/entries')}`}
            onClick={onClose}
          >
                <DocumentCheckIcon className="mr-3 h-7 w-7" />
            {t('navigation.entries')}
          </Link>

          <Link
            to="/quality"
                className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/quality')}`}
            onClick={onClose}
          >
                <ClipboardDocumentCheckIcon className="mr-3 h-7 w-7" />
            {t('navigation.quality')}
          </Link>

          {/* Section séparée pour Tutoriels et Aide en bas */}
          <div className="border-t border-blue-800 pt-4 mt-4">
            <Link
              to="/tutoriels-video"
              className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/tutoriels-video')}`}
              onClick={onClose}
            >
              <FilmIcon className="mr-3 h-7 w-7" />
              {t('navigation.tutorials')}
            </Link>
          <Link
            to="/parts"
            className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/parts')}`}
            onClick={onClose}
          >
            <WrenchScrewdriverIcon className="mr-3 h-7 w-7" />
            Pièces
          </Link>


            <Link
              to="/help"
              className={`group flex items-center px-2 py-3 text-lg font-medium rounded-md ${isActive('/help')}`}
              onClick={onClose}
            >
              <QuestionMarkCircleIcon className="mr-3 h-7 w-7" />
              {t('navigation.help')}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}