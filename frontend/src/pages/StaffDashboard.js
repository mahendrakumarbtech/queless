import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';
import config from '../config/config';

const API_URL = config.API_URL;

const StaffDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedShift, setSelectedShift] = useState('');
  const [assignDialog, setAssignDialog] = useState(false);
  const [assignForm, setAssignForm] = useState({
    customerId: '',
    shiftId: '',
    paymentAmount: 0
  });

  const { data: currentShift } = useQuery(
    ['currentShift', user?.providerId, selectedShift, selectedDate],
    async () => {
      if (!user?.providerId || !selectedShift) return [];
      const response = await axios.get(
        `${API_URL}/staff/current-shift?providerId=${user.providerId}&shiftId=${selectedShift}&date=${selectedDate}`
      );
      return response.data.data;
    },
    { enabled: !!user?.providerId && !!selectedShift, refetchInterval: 3000 }
  );

  const assignMutation = useMutation(
    async (data) => {
      const response = await axios.post(`${API_URL}/staff/assign`, {
        ...data,
        providerId: user.providerId,
        date: selectedDate
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['currentShift', user?.providerId]);
        setAssignDialog(false);
        setAssignForm({ customerId: '', shiftId: '', paymentAmount: 0 });
      }
    }
  );

  const reinsertMutation = useMutation(
    async (queueId) => {
      const response = await axios.put(`${API_URL}/staff/reinsert/${queueId}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['currentShift', user?.providerId]);
      }
    }
  );

  const handleAssign = () => {
    assignMutation.mutate(assignForm);
  };

  const handleReinsert = (queueId) => {
    if (window.confirm('Reinsert this customer in the queue?')) {
      reinsertMutation.mutate(queueId);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Staff Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Welcome, {user?.name}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Shift ID"
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            placeholder="e.g., monday-morning"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setAssignDialog(true)}
            sx={{ height: '56px' }}
          >
            Assign Number
          </Button>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Shift Queue
          </Typography>
          {currentShift && currentShift.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Queue #</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentShift.map((queue) => (
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
                        {queue.status === 'completed' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleReinsert(queue._id)}
                          >
                            Reinsert
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No queues for selected shift</Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Queue Number</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Customer ID"
            value={assignForm.customerId}
            onChange={(e) => setAssignForm({ ...assignForm, customerId: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Shift ID"
            value={assignForm.shiftId}
            onChange={(e) => setAssignForm({ ...assignForm, shiftId: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Payment Amount"
            type="number"
            value={assignForm.paymentAmount}
            onChange={(e) => setAssignForm({ ...assignForm, paymentAmount: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
          <Button onClick={handleAssign} variant="contained" disabled={assignMutation.isLoading}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffDashboard;
