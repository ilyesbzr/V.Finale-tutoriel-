import React from 'react';
import { 
  BarChart3, 
  Clock, 
  ShoppingCart, 
  TrendingUp, 
  FileText, 
  Target,
  DollarSign,
  Wrench,
  Car,
  HelpCircle,
  Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const menuItems = [
  { id: 'dashboard', label: 'sidebar.dashboard', icon: BarChart3 },
  { id: 'targets', label: 'sidebar.targets', icon: Target },
  { id: 'synthesis', label: 'sidebar.synthesis', icon: FileText },
  { id: 'revenue', label: 'sidebar.revenue', icon: DollarSign },
  { id: 'hours', label: 'sidebar.hours', icon: Clock },
  { id: 'sales', label: 'sidebar.sales', icon: ShoppingCart },
  { id: 'productivity', label: 'sidebar.productivity', icon: TrendingUp },
  { id: 'billing', label: 'sidebar.billing', icon: FileText },
  { id: 'quality', label: 'sidebar.quality', icon: Target },
  { id: 'parts', label: 'sidebar.parts', icon: Wrench },
  { id: 'rent', label: 'sidebar.rent', icon: Car },
  { id: 'crescendo', label: 'sidebar.crescendo', icon: TrendingUp },
  { id: 'entries', label: 'sidebar.entries', icon: ShoppingCart },
  { id: 'gestures', label: 'sidebar.gestures', icon: Target },
  { id: 'tutorials', label: 'sidebar.tutorials', icon: HelpCircle },
  { id: 'help', label: 'sidebar.help', icon: HelpCircle },
  { id: 'admin', label: 'sidebar.admin', icon: Settings },
];

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-84 lg:fixed lg:inset-y-0 bg-gradient-to-b from-blue-800 to-slate-800 shadow-2xl">
      <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-blue-400">Auto</span>
            <span className="text-white">Dashboard</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`group w-full flex items-center px-4 py-3 text-xl font-medium rounded-xl transition-all duration-300 ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform translate-x-1'
                  : 'text-blue-100 hover:bg-blue-700/50 hover:text-white hover:transform hover:translate-x-1'
              }`}
            >
              <item.icon className="h-9 w-9 mr-4" />
              <span className="truncate">{t(item.label)}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};