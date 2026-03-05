import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { FrontAuthWrapper } from './FrontAuthWrapper';

/**
 * Front login – for providers and customers only.
 * Admin and staff must use /admin/login.
 */
const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success && result.user) {
      const role = typeof result.user.role === 'string'
        ? result.user.role
        : (result.user.role?.name || 'customer');

      if (role === 'admin' || role === 'staff') {
        logout();
        setError(t('home:adminUseAdminLogin', 'Use Admin Login for admin or staff accounts.'));
        return;
      }

      if (role === 'customer') {
        navigate('/customer');
      } else {
        navigate('/staff');
      }
    } else {
      setError(result.message || t('nav:loginFailed', 'Login failed'));
    }
  };

  return (
    <FrontAuthWrapper>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {t('nav:login')}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
        {t('home:providerLogin')}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={t('common:email', 'Email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          autoComplete="email"
        />
        <TextField
          fullWidth
          label={t('common:password', 'Password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? t('common:loading', 'Loading...') : t('nav:login')}
        </Button>
        <Typography variant="body2" align="center" color="text.secondary">
          {t('nav:noAccount', "Don't have an account?")}{' '}
          <Link to="/register" style={{ color: 'inherit', fontWeight: 600 }}>
            {t('nav:register')}
          </Link>
        </Typography>
      </Box>
    </FrontAuthWrapper>
  );
};

export default Login;
