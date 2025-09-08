import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SITES } from '../../utils/constants/metrics';
import { useTranslation } from 'react-i18next';
import { User } from '../../types';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserMenu({ isOpen, onClose }: UserMenuProps): JSX.Element | null {
  const { user } = useState<{ user: User } | null>(null);
  const { role } = useState<string>('user');
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleLogout = async (): Promise<void> => {
    try {
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fonction pour formater le rôle
  const formatRole = (role: string): string => {
    switch (role) {
      case 'administrator': return 'Administrateur';
      case 'director': return 'Directeur';
      case 'manager': return 'Manager';
      case 'user': return 'Utilisateur';
      default: return 'Utilisateur';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{formatRole(role)}</p>
        <p className="text-sm text-gray-600">Ilyes Bouizraine</p>
        <p className="text-sm text-gray-500">{user?.user?.email}</p>
      </div>
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-500 uppercase">{t('userMenu.accessibleSites')}</p>
        <div className="mt-1 space-y-1">
          <p className="text-sm text-gray-700">{SITES.RO}</p>
          <p className="text-sm text-gray-700">{SITES.EU}</p>
          <p className="text-sm text-gray-700">{SITES.MTD}</p>
          <p className="text-sm text-gray-700">{SITES.ST}</p>
        </div>
      </div>
      <div className="py-1">
        <button
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {t('userMenu.profile')}
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {t('userMenu.logout')}
        </button>
      </div>
    </div>
  );
}