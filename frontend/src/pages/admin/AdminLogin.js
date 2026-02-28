import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { usePublicSettings } from '../../context/PublicSettingsContext';
import { AdminAuthWrapper } from './auth/AdminAuthWrapper';

const AdminLogin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isAuthenticated, loading: authLoading } = useAuth();
  const { websiteName } = usePublicSettings();
  const navigate = useNavigate();

  // If already logged in as admin or staff (admin panel roles), go to admin dashboard
  const isAdminPanelRole = (r) => r === 'admin' || r === 'staff';
  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && user) {
      const role = typeof user.role === 'string' ? user.role : (user.role?.name || '');
      if (isAdminPanelRole(role)) {
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const role = user ? (typeof user.role === 'string' ? user.role : (user.role?.name || '')) : '';
  if (authLoading || (isAuthenticated && isAdminPanelRole(role))) {
    return (
      <AdminAuthWrapper>
        <p className="text-center text-muted">{t('adminAuth:redirecting')}</p>
      </AdminAuthWrapper>
    );
  }

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'rememberMe') setRememberMe(checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const role = typeof user.role === 'string' ? user.role : (user.role?.name || 'customer');
        if (isAdminPanelRole(role)) {
          navigate('/admin');
          return;
        }
        switch (role) {
          case 'provider':
            navigate('/provider');
            break;
          default:
            navigate('/customer');
        }
      } else {
        navigate('/admin');
      }
    } else {
      setError(result.message || t('adminAuth:login.loginFailed'));
    }
  };

  return (
    <AdminAuthWrapper>
      <h4 className="mb-2">{t('adminAuth:login.title', { websiteName })}</h4>
      <p className="mb-4">{t('adminAuth:login.subtitle')}</p>

      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          {error}
        </div>
      )}

      <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">{t('adminAuth:login.emailOrUsername')}</label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={email}
            onChange={handleChange}
            name="email"
            placeholder={t('adminAuth:login.emailOrUsernamePlaceholder')}
            autoFocus
          />
        </div>
        <div className="mb-3 form-password-toggle">
          <div className="d-flex justify-content-between">
            <label className="form-label" htmlFor="password">{t('adminAuth:login.password')}</label>
            <Link to="/admin/forgot_password">
              <small>{t('adminAuth:login.forgotPassword')}</small>
            </Link>
          </div>
          <div className="input-group input-group-merge">
            <input
              type="password"
              autoComplete="current-password"
              id="password"
              value={password}
              onChange={handleChange}
              className="form-control"
              name="password"
              placeholder="············"
              aria-describedby="password"
            />
            <span className="input-group-text cursor-pointer"><i className="bi bi-eye"></i></span>
          </div>
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember-me"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="remember-me"> {t('adminAuth:login.rememberMe')} </label>
          </div>
        </div>
        <div className="mb-3">
          <button
            type="submit"
            className="btn btn-primary d-grid w-100"
            disabled={loading}
            aria-label={t('adminAuth:login.signIn')}
          >
            {loading ? t('adminAuth:login.signingIn') : t('adminAuth:login.signIn')}
          </button>
        </div>
      </form>

      <p className="text-center">
        <span>{t('adminAuth:login.notAdmin')} </span>
        <Link to="/login" className="registration-link">
          <span>{t('adminAuth:login.loginAsUser')}</span>
        </Link>
      </p>
    </AdminAuthWrapper>
  );
};

export default AdminLogin;
