import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
    providerType: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.role === 'provider' && !formData.providerType) {
      setError('Please select provider type');
      return;
    }

    const result = await register(formData);
    if (result.success) {
      const role = formData.role;
      switch (role) {
        case 'admin':
        case 'staff':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  const providerTypes = [
    { value: 'doctor', label: 'Doctor' },
    { value: 'ration_shop', label: 'Ration Shop' },
    { value: 'bank', label: 'Bank' },
    { value: 'ca', label: 'CA' },
    { value: 'aadhaar_center', label: 'Aadhaar Center' },
    { value: 'school_college', label: 'School/College' },
    { value: 'library', label: 'Library' }
  ];

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ minLength: 6 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="provider">Provider</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
          </FormControl>
          {formData.role === 'provider' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Provider Type</InputLabel>
              <Select
                name="providerType"
                value={formData.providerType}
                onChange={handleChange}
                label="Provider Type"
                required
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
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
