import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../../public/locales/en/translation.json';
import deTranslation from '../../public/locales/de/translation.json';
import frTranslation from '../../public/locales/fr/translation.json';
import itTranslation from '../../public/locales/it/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'de', 'it', 'fr'],
    debug: true,
    resources: {
      en: { translation: enTranslation },
      de: { translation: deTranslation },
      fr: { translation: frTranslation },
      it: { translation: itTranslation },
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
