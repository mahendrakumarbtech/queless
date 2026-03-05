import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { FrontAuthWrapper } from './FrontAuthWrapper';

const providerTypes = [
  { value: 'doctor', label: 'Doctor' },
  { value: 'ration_shop', label: 'Ration Shop' },
  { value: 'bank', label: 'Bank' },
  { value: 'ca', label: 'CA' },
  { value: 'aadhaar_center', label: 'Aadhaar Center' },
  { value: 'school_college', label: 'School/College' },
  { value: 'library', label: 'Library' },
];

/**
 * Front registration – only Customer and Provider.
 * Admin and staff are created from admin panel only.
 */
const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
    providerType: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.role === 'provider' && !formData.providerType) {
      setError(t('common:selectProviderType', 'Please select provider type'));
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      const role = formData.role;
      if (role === 'customer') {
        navigate('/customer');
      } else {
        navigate('/staff');
      }
    } else {
      setError(result.message || t('nav:loginFailed', 'Registration failed'));
    }
  };

  return (
    <FrontAuthWrapper>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {t('nav:register')}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
        {t('home:signUp')}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={t('common:name', 'Name')}
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label={t('common:email', 'Email')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label={t('common:phone', 'Phone')}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label={t('common:password', 'Password')}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
          inputProps={{ minLength: 6 }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('common:role', 'Role')}</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            label={t('common:role', 'Role')}
          >
            <MenuItem value="customer">{t('menu:customer', 'Customer')}</MenuItem>
            <MenuItem value="provider">{t('menu:provider', 'Provider')}</MenuItem>
          </Select>
        </FormControl>
        {formData.role === 'provider' && (
          <FormControl fullWidth margin="normal" required>
            <InputLabel>{t('common:providerType', 'Provider Type')}</InputLabel>
            <Select
              name="providerType"
              value={formData.providerType}
              onChange={handleChange}
              label={t('common:providerType', 'Provider Type')}
            >
              {providerTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? t('common:loading', 'Loading...') : t('nav:register')}
        </Button>
        <Typography variant="body2" align="center" color="text.secondary">
          {t('nav:alreadyHaveAccount', 'Already have an account?')}{' '}
          <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
            {t('nav:login')}
          </Link>
        </Typography>
      </Box>
    </FrontAuthWrapper>
  );
};

export default Register;
