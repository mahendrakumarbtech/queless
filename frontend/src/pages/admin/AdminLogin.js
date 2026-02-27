import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePublicSettings } from '../../context/PublicSettingsContext';
import { AdminAuthWrapper } from './auth/AdminAuthWrapper';

const AdminLogin = () => {
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
        <p className="text-center text-muted">Redirecting...</p>
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
      setError(result.message || 'Login failed');
    }
  };

  return (
    <AdminAuthWrapper>
      <h4 className="mb-2">Welcome to {websiteName} Admin! 👋</h4>
      <p className="mb-4">Please sign-in to your account and start the adventure</p>

      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          {error}
        </div>
      )}

      <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email or Username</label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={email}
            onChange={handleChange}
            name="email"
            placeholder="Enter your email or username"
            autoFocus
          />
        </div>
        <div className="mb-3 form-password-toggle">
          <div className="d-flex justify-content-between">
            <label className="form-label" htmlFor="password">Password</label>
            <Link to="/admin/forgot_password">
              <small>Forgot Password?</small>
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
            <label className="form-check-label" htmlFor="remember-me"> Remember Me </label>
          </div>
        </div>
        <div className="mb-3">
          <button
            type="submit"
            className="btn btn-primary d-grid w-100"
            disabled={loading}
            aria-label="Sign in"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>

      <p className="text-center">
        <span>Not admin? </span>
        <Link to="/login" className="registration-link">
          <span>Login as user</span>
        </Link>
      </p>
    </AdminAuthWrapper>
  );
};

export default AdminLogin;
