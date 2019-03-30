import i18n from 'i18next';
import {reactI18nextModule} from 'react-i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector)
  .use(XHR)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    ns: [
      'translations',
      'landing',
    ],
    defaultNS: 'translations',
    react: {wait: true},
    keySeparator: false,
  });

export default i18n;
