import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import moment from 'moment';
import config from '../../config/config';

const API_URL = config.API_URL;

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [currentNumbers, setCurrentNumbers] = useState({});

  const { data: myQueues } = useQuery(
    'myQueues',
    async () => {
      const response = await axios.get(`${API_URL}/customer/my-queues`);
      return response.data.data;
    },
    { refetchInterval: 5000 }
  );

  useEffect(() => {
    if (myQueues) {
      myQueues.forEach(async (queue) => {
        try {
          const response = await axios.get(
            `${API_URL}/customer/current/${queue.providerId._id}?shiftId=${queue.shiftId}&date=${moment(queue.date).format('YYYY-MM-DD')}`
          );
          if (response.data.data) {
            setCurrentNumbers(prev => ({
              ...prev,
              [queue._id]: response.data.data.queueNumber
            }));
          }
        } catch (error) {
          console.error('Error fetching current number:', error);
        }
      });
    }
  }, [myQueues]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'warning';
      case 'current':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Customer Dashboard
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          component={Link}
          to="/providers"
          sx={{ mb: 2 }}
        >
          Book New Queue
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            My Queues
          </Typography>
          {myQueues && myQueues.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Provider</TableCell>
                    <TableCell>Queue Number</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Current Number</TableCell>
                    <TableCell>Estimated Wait</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myQueues.map((queue) => (
                    <TableRow key={queue._id}>
                      <TableCell>{queue.providerId?.name}</TableCell>
                      <TableCell>
                        <Typography variant="h6" color="primary">
                          #{queue.queueNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {moment(queue.date).format('DD MMM YYYY')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={queue.status}
                          color={getStatusColor(queue.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {currentNumbers[queue._id] ? (
                          <Typography variant="h6" color="secondary">
                            #{currentNumbers[queue._id]}
                          </Typography>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {queue.status === 'waiting' && queue.estimatedWaitTime > 0
                          ? `${queue.estimatedWaitTime} minutes`
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No queues found. Book your first queue!</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CustomerDashboard;
