import React, { useState }  from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon,
  ClockIcon,
  DocumentCheckIcon,
  ChartPieIcon,
  ShoppingCartIcon,
  AdjustmentsHorizontalIcon,
  QuestionMarkCircleIcon,
  CalendarIcon,
  PresentationChartLineIcon,
  ClipboardDocumentCheckIcon,
  ChartBarSquareIcon,
  FilmIcon,
  CogIcon,
  TruckIcon,
  HandRaisedIcon,
  BanknotesIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

function Sidebar() {
  const location = useLocation();
  const { user } = useState();
  const { role, loading } = useState();
  const { t } = useTranslation();
  
  const isActive = (path) => location.pathname === path ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white';

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-80">
        <div className="flex flex-col h-0 flex-1 sidebar-modern">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4 mb-8">
              <div className="text-center">
                <span className="text-white text-2xl font-bold tracking-tight">AutoDashboard</span>
                <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">

              <Link
                to="/targets"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/targets')} ${location.pathname === '/targets' ? 'active' : ''}`}
              >
                <AdjustmentsHorizontalIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                {t('navigation.targets')}
              </Link>
              
                <Link
                  to="/synthesis"
                  className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/synthesis')} ${location.pathname === '/synthesis' ? 'active' : ''}`}
                >
                  <PresentationChartLineIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                  Synthèse
                </Link>

              <Link
                to="/revenue"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/revenue')} ${location.pathname === '/revenue' ? 'active' : ''}`}
              >
                <ChartBarIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                {t('navigation.revenue')}
              </Link>

              <Link
                to="/hours"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/hours')} ${location.pathname === '/hours' ? 'active' : ''}`}
              >
                <ClockIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                {t('navigation.hours')}
              </Link>

              <Link
                to="/crescendo"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/crescendo')} ${location.pathname === '/crescendo' ? 'active' : ''}`}
              >
                <ShoppingCartIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                {t('navigation.crescendo')}
              </Link>

              <Link
                to="/productivity"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/productivity')} ${location.pathname === '/productivity' ? 'active' : ''}`}
              >
                <ChartPieIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                Rentabilité
              </Link>

              <Link
                to="/entries"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/entries')} ${location.pathname === '/entries' ? 'active' : ''}`}
              >
                <DocumentCheckIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                {t('navigation.entries')}
              </Link>

              <Link
                to="/quality"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/quality')} ${location.pathname === '/quality' ? 'active' : ''}`}
              >
                <ClipboardDocumentCheckIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                {t('navigation.quality')}
              </Link>

              <Link
                to="/parts"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/parts')} ${location.pathname === '/parts' ? 'active' : ''}`}
              >
                <WrenchScrewdriverIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                Pièces
              </Link>

              <Link
                to="/rent"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/rent')} ${location.pathname === '/rent' ? 'active' : ''}`}
              >
                <TruckIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                Rent
              </Link>

              <Link
                to="/commercial-gestures"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/commercial-gestures')} ${location.pathname === '/commercial-gestures' ? 'active' : ''}`}
              >
                <HandRaisedIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                Gestes commerciaux
              </Link>
            </nav>
            
            {/* Section séparée pour Tutoriels et Aide en bas */}
            <div className="mt-auto px-2 space-y-1 border-t border-blue-800 pt-4">

              <Link
                to="/tutoriels-video"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/tutoriels-video')} ${location.pathname === '/tutoriels-video' ? 'active' : ''}`}
              >
                <FilmIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                {t('navigation.tutorials')}
              </Link>

              <Link
                to="/help"
                className={`sidebar-item group flex items-center px-4 py-3 text-base font-medium ${isActive('/help')} ${location.pathname === '/help' ? 'active' : ''}`}
              >
                <QuestionMarkCircleIcon className="mr-3 h-7 w-7 transition-transform duration-200 group-hover:scale-110" />
                {t('navigation.help')}
              </Link>
            </div>
            
            {/* Enhanced Footer */}
            <div className="px-4 py-6">
              <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                <div className="text-center">
                  <div className="text-xs text-gray-300 font-medium">Version 2.1.0</div>
                  <div className="text-xs text-gray-400 mt-1">© 2025 AutoDashboard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;