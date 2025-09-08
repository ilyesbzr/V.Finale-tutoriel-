import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: string;
  changeLanguage: (newLanguage: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps): JSX.Element {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<string>('fr');

  const changeLanguage = (newLanguage: string): void => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}