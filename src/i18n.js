import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './i18n/locales/en/translation.json';
import deTranslation from './i18n/locales/de/translation.json';
import itTranslation from './i18n/locales/it/translation.json';
import frTranslation from './i18n/locales/fr/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      de: {
        translation: deTranslation
      },
      it: {
        translation: itTranslation
      },
      fr: {
        translation: frTranslation
      }
    },
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;