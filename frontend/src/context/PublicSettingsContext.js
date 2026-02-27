import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config/config';

const PublicSettingsContext = createContext(null);

const defaultName = 'QueLess';
const defaultTagline = 'Smart Queue Management System';

function fullUrl(value) {
  if (!value || typeof value !== 'string') return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  const base = config.BASE_URL || '';
  return base + (value.startsWith('/') ? value : '/' + value);
}

export function PublicSettingsProvider({ children }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPublic = React.useCallback(() => {
    setLoading(true);
    return fetch(config.API_URL + '/settings/public')
      .then(res => res.ok ? res.json() : { success: false })
      .then(json => {
        if (json.success && json.data) setData(json.data);
      })
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPublic();
  }, [fetchPublic]);

  const websiteName = data.website_name || defaultName;
  const websiteTagline = data.website_tagline || defaultTagline;
  const faviconIcon = data.favicon_icon || '';
  const websiteLogo = data.website_logo || '';
  const websiteWhiteLogo = data.website_white_logo || '';

  const value = {
    loading,
    websiteName,
    websiteTagline,
    faviconIcon: fullUrl(faviconIcon),
    websiteLogo: fullUrl(websiteLogo),
    websiteWhiteLogo: fullUrl(websiteWhiteLogo),
    // Dark sidebar: use white logo, fallback to main logo
    sidebarLogoUrl: fullUrl(websiteLogo),
    // Light areas (login, navbar): use website_logo
    headerLogoUrl: fullUrl(websiteLogo),
    refetchPublicSettings: fetchPublic,
  };

  return (
    <PublicSettingsContext.Provider value={value}>
      {children}
    </PublicSettingsContext.Provider>
  );
}

export function usePublicSettings() {
  const ctx = useContext(PublicSettingsContext);
  return ctx || {
    loading: false,
    websiteName: defaultName,
    websiteTagline: defaultTagline,
    faviconIcon: '',
    websiteLogo: '',
    websiteWhiteLogo: '',
    sidebarLogoUrl: '',
    headerLogoUrl: '',
    refetchPublicSettings: () => Promise.resolve(),
  };
}
