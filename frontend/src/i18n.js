import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Module-wise locale files – one file per module per language.
// To add a new module (e.g. settings): create en/settings.json & hi/settings.json,
// import them here, add to resources.en / resources.hi, and add 'settings' to ns array.
// In components use t('settings:keyName').
import enCommon from './locales/en/common.json';
import enMenu from './locales/en/menu.json';
import enRoles from './locales/en/roles.json';
import enNav from './locales/en/nav.json';
import enLanguage from './locales/en/language.json';
import enAria from './locales/en/aria.json';
import enAdminDashboard from './locales/en/adminDashboard.json';
import enAdminUsers from './locales/en/adminUsers.json';
import enAdminProviders from './locales/en/adminProviders.json';
import enAdminQueues from './locales/en/adminQueues.json';
import enAdminSettings from './locales/en/adminSettings.json';
import enAdminAuth from './locales/en/adminAuth.json';

import hiCommon from './locales/hi/common.json';
import hiMenu from './locales/hi/menu.json';
import hiRoles from './locales/hi/roles.json';
import hiNav from './locales/hi/nav.json';
import hiLanguage from './locales/hi/language.json';
import hiAria from './locales/hi/aria.json';
import hiAdminDashboard from './locales/hi/adminDashboard.json';
import hiAdminUsers from './locales/hi/adminUsers.json';
import hiAdminProviders from './locales/hi/adminProviders.json';
import hiAdminQueues from './locales/hi/adminQueues.json';
import hiAdminSettings from './locales/hi/adminSettings.json';
import hiAdminAuth from './locales/hi/adminAuth.json';

const resources = {
  en: {
    common: enCommon,
    menu: enMenu,
    roles: enRoles,
    nav: enNav,
    language: enLanguage,
    aria: enAria,
    adminDashboard: enAdminDashboard,
    adminUsers: enAdminUsers,
    adminProviders: enAdminProviders,
    adminQueues: enAdminQueues,
    adminSettings: enAdminSettings,
    adminAuth: enAdminAuth,
  },
  hi: {
    common: hiCommon,
    menu: hiMenu,
    roles: hiRoles,
    nav: hiNav,
    language: hiLanguage,
    aria: hiAria,
    adminDashboard: hiAdminDashboard,
    adminUsers: hiAdminUsers,
    adminProviders: hiAdminProviders,
    adminQueues: hiAdminQueues,
    adminSettings: hiAdminSettings,
    adminAuth: hiAdminAuth,
  },
};

const savedLang = typeof window !== 'undefined' && localStorage.getItem('queless_lang');

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang || 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: [
    'common',
    'menu',
    'roles',
    'nav',
    'language',
    'aria',
    'adminDashboard',
    'adminUsers',
    'adminProviders',
    'adminQueues',
    'adminSettings',
    'adminAuth',
  ],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
