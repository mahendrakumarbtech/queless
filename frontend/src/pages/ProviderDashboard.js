import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Button, TextField, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';
import config from '../config/config';

const API_URL = config.API_URL;

const ProviderDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedShift, setSelectedShift] = useState('');
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [schedule, setSchedule] = useState([]);

  const { data: provider } = useQuery(
    'provider',
    async () => {
      if (!user?.providerId) return null;
      const response = await axios.get(`${API_URL}/provider/${user.providerId}`);
      return response.data.data;
    },
    { enabled: !!user?.providerId }
  );

  const { data: customers } = useQuery(
    ['customers', user?.providerId, selectedDate],
    async () => {
      if (!user?.providerId) return [];
      const response = await axios.get(
        `${API_URL}/provider/${user.providerId}/customers?date=${selectedDate}`
      );
      return response.data.data;
    },
    { enabled: !!user?.providerId, refetchInterval: 5000 }
  );

  const { data: currentQueue } = useQuery(
    ['current', user?.providerId, selectedShift, selectedDate],
    async () => {
      if (!user?.providerId || !selectedShift) return null;
      const response = await axios.get(
        `${API_URL}/provider/${user.providerId}/current?shiftId=${selectedShift}&date=${selectedDate}`
      );
      return response.data.data;
    },
    { enabled: !!user?.providerId && !!selectedShift, refetchInterval: 3000 }
  );

  const callNextMutation = useMutation(
    async () => {
      const response = await axios.post(
        `${API_URL}/provider/${user.providerId}/next`,
        { shiftId: selectedShift, date: selectedDate }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['current', user?.providerId]);
        queryClient.invalidateQueries(['customers', user?.providerId]);
      }
    }
  );

  const updateScheduleMutation = useMutation(
    async (newSchedule) => {
      const response = await axios.put(
        `${API_URL}/provider/${user.providerId}/schedule`,
        { schedule: newSchedule }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('provider');
        setScheduleDialog(false);
      }
    }
  );

  useEffect(() => {
    if (provider?.schedule) {
      setSchedule(provider.schedule);
    }
  }, [provider]);

  const handleCallNext = () => {
    if (!selectedShift) {
      alert('Please select a shift');
      return;
    }
    callNextMutation.mutate();
  };

  const handleSaveSchedule = () => {
    updateScheduleMutation.mutate(schedule);
  };

  if (!provider) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Provider Dashboard
        </Typography>
        <Card>
          <CardContent>
            <Typography>Please create your provider profile first.</Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Provider Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        {provider.name} - {provider.providerType}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Shift</InputLabel>
            <Select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              label="Shift"
            >
              {provider.schedule?.flatMap(day =>
                day.shifts
                  .filter(shift => shift.isActive)
                  .map(shift => (
                    <MenuItem key={`${day.day}-${shift.name}`} value={`${day.day}-${shift.name}`}>
                      {day.day} - {shift.name} ({shift.startTime} - {shift.endTime})
                    </MenuItem>
                  ))
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Number
              </Typography>
              {currentQueue ? (
                <Box>
                  <Typography variant="h3" color="primary" gutterBottom>
                    #{currentQueue.queueNumber}
                  </Typography>
                  <Typography variant="body1">
                    Customer: {currentQueue.customerId?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: {currentQueue.customerId?.phone}
                  </Typography>
                </Box>
              ) : (
                <Typography>No current number</Typography>
              )}
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleCallNext}
                disabled={!selectedShift || callNextMutation.isLoading}
              >
                Call Next
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Schedule</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setScheduleDialog(true)}
                >
                  Edit Schedule
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Manage your working days and shifts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's Customers
          </Typography>
          {customers && customers.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Queue #</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((queue) => (
                    <TableRow key={queue._id}>
                      <TableCell>
                        <Typography variant="h6" color="primary">
                          #{queue.queueNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>{queue.customerId?.name}</TableCell>
                      <TableCell>{queue.customerId?.phone}</TableCell>
                      <TableCell>
                        <Chip
                          label={queue.status}
                          color={queue.status === 'current' ? 'info' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {queue.calledAt
                          ? moment(queue.calledAt).format('HH:mm')
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No customers for selected date</Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={scheduleDialog} onClose={() => setScheduleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Schedule</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure your working days and shifts
          </Typography>
          {/* Schedule editor would go here - simplified for now */}
          <Typography>Schedule editor UI (to be implemented)</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveSchedule} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProviderDashboard;
