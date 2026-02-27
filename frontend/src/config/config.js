// Frontend Configuration – set REACT_APP_API_URL in .env (restart npm start after change)
// Fallback 5010 matches typical backend PORT; use .env to point to another port
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = BASE_URL + '/api';
const config = {
  BASE_URL,
  API_URL,

  // Image upload (settings: favicon, logos)
  IMAGE_UPLOAD_ACCEPT: 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
  DEFAULT_IMAGE_PLACEHOLDER:
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192"%3E%3Crect fill="%23f0f0f0" width="192" height="192"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3ENo image%3C/text%3E%3C/svg%3E',

  // Settings dropdowns – key => label (no search). For date/time/datetime, key is format string.
  SETTINGS_DROPDOWNS: {
    currency_position: {
      '': 'Select',
      before: 'Before (e.g. $100)',
      after: 'After (e.g. 100 USD)',
    },
    date_format: {
      '': 'Select',
      'YYYY-MM-DD': 'YYYY-MM-DD',
      'DD/MM/YYYY': 'DD/MM/YYYY',
      'DD-MM-YYYY': 'DD-MM-YYYY',
      'MM/DD/YYYY': 'MM/DD/YYYY',
      'D MMM YYYY': 'D MMM YYYY',
      'MMM D, YYYY': 'MMM D, YYYY',
      'MMMM D, YYYY': 'MMMM D, YYYY',
    },
    time_format: {
      '': 'Select',
      'HH:mm': 'HH:mm (24h)',
      'HH:mm:ss': 'HH:mm:ss (24h)',
      'h:mm A': 'h:mm A (12h)',
      'h:mm:ss A': 'h:mm:ss A (12h)',
    },
    datetime_format: {
      '': 'Select',
      'YYYY-MM-DD HH:mm': 'YYYY-MM-DD HH:mm',
      'DD/MM/YYYY HH:mm': 'DD/MM/YYYY HH:mm',
      'DD/MM/YYYY h:mm A': 'DD/MM/YYYY h:mm A',
      'D MMM YYYY HH:mm': 'D MMM YYYY HH:mm',
      'D MMM YYYY h:mm A': 'D MMM YYYY h:mm A',
    },
  },
};

export default config;
