import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import moment from 'moment';
import config from '../../config/config';

const API_URL = config.API_URL;

const BookQueue = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shiftId: '',
    date: moment().format('YYYY-MM-DD'),
    paymentAmount: 0
  });
  const [error, setError] = useState('');

  const { data: provider } = useQuery(
    ['provider', providerId],
    async () => {
      const response = await axios.get(`${API_URL}/providers/${providerId}`);
      return response.data.data;
    }
  );

  const bookMutation = useMutation(
    async (data) => {
      const response = await axios.post(`${API_URL}/customer/book`, {
        ...data,
        providerId
      });
      return response.data;
    },
    {
      onSuccess: () => {
        navigate('/customer');
      },
      onError: (error) => {
        setError(error.response?.data?.message || 'Booking failed');
      }
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    bookMutation.mutate(formData);
  };

  if (!provider) {
    return <Container>Loading...</Container>;
  }

  const availableShifts = provider.schedule?.flatMap(day =>
    day.shifts
      .filter(shift => shift.isActive)
      .map(shift => ({
        id: `${day.day}-${shift.name}`,
        label: `${day.day} - ${shift.name} (${shift.startTime} - ${shift.endTime})`
      }))
  ) || [];

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Book Queue
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            {provider.name} - {provider.providerType}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: moment().format('YYYY-MM-DD') }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Shift</InputLabel>
              <Select
                name="shiftId"
                value={formData.shiftId}
                onChange={handleChange}
                label="Shift"
                required
              >
                {availableShifts.map((shift) => (
                  <MenuItem key={shift.id} value={shift.id}>
                    {shift.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {provider.settings?.paymentRequired && (
              <TextField
                fullWidth
                label="Payment Amount"
                name="paymentAmount"
                type="number"
                value={formData.paymentAmount}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={bookMutation.isLoading}
            >
              {bookMutation.isLoading ? 'Booking...' : 'Book Queue'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BookQueue;
