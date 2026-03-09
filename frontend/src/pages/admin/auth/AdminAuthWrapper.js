import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePublicSettings } from '../../../context/PublicSettingsContext';
import { loadAdminThemeAsync, unloadAdminTheme } from '../../../components/admin/admin-theme-loader';
import './page-auth.css';

const AuthPageLoader = () => (
  <div className="auth-page-theme-loader">
    <div className="auth-page-theme-spinner" aria-hidden="true" />
  </div>
);

/**
 * Wrapper for admin auth pages (login, forgot password).
 * Loads admin theme so design matches dashboard; constrains logo size.
 */
export const AdminAuthWrapper = ({ children }) => {
  const { websiteName, headerLogoUrl } = usePublicSettings();
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadAdminThemeAsync().then(() => {
      if (!cancelled) setThemeReady(true);
    });
    return () => {
      cancelled = true;
      unloadAdminTheme();
    };
  }, []);

  if (!themeReady) {
    return <AuthPageLoader />;
  }

  return (
    <div className="container-xxl light-style">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center auth-page-brand auth-page-brand-vertical">
                <Link to="/admin/login" className="app-brand-link" aria-label="Admin Login">
                  <span className="app-brand-logo demo">
                    <img src={headerLogoUrl} alt={websiteName} aria-label={`${websiteName} logo`} />
                  </span>
                  <span className="app-brand-text demo text-body fw-bold mt-2">{websiteName}</span>
                </Link>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
