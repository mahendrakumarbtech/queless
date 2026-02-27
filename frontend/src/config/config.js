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
};

export default config;
