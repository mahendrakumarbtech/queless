import React from 'react';
import { Link } from 'react-router-dom';
import './page-auth.css';

/**
 * Wrapper for admin auth pages (login, forgot password).
 * Design from theme: /Applications/node/theme/react-sneat-bootstrap-admin-template
 */
export const AdminAuthWrapper = ({ children }) => {
  return (
    <div className="container-xxl light-style">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <Link to="/admin/login" className="app-brand-link gap-2" aria-label="Admin Login">
                  <span className="app-brand-logo demo">
                    <img src="/assets/img/sneat.svg" alt="QueLess" />
                  </span>
                  <span className="app-brand-text demo text-body fw-bold">QueLess Admin</span>
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
