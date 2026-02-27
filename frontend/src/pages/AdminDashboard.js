import React from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Paper } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import config from '../config/config';

const API_URL = config.API_URL;

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: dashboardStats } = useQuery(
    'adminDashboard',
    async () => {
      const response = await axios.get(`${API_URL}/admin/dashboard`);
      return response.data.data;
    },
    { refetchInterval: 30000 }
  );

  const { data: users } = useQuery(
    'adminUsers',
    async () => {
      const response = await axios.get(`${API_URL}/admin/users`);
      return response.data.data;
    }
  );

  const { data: providers } = useQuery(
    'adminProviders',
    async () => {
      const response = await axios.get(`${API_URL}/admin/providers`);
      return response.data.data;
    }
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Welcome, {user?.name}
      </Typography>

      {dashboardStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {dashboardStats.totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Providers
                </Typography>
                <Typography variant="h4">
                  {dashboardStats.totalProviders}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Active Queues
                </Typography>
                <Typography variant="h4">
                  {dashboardStats.activeQueues}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Completed Queues
                </Typography>
                <Typography variant="h4">
                  {dashboardStats.completedQueues}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Users
              </Typography>
              {users && users.length > 0 ? (
                <Box>
                  {users.slice(0, 5).map((userItem) => {
                    // Normalize role to string
                    const userRole = typeof userItem.role === 'string'
                      ? userItem.role
                      : (userItem.role?.name || 'customer');
                    return (
                      <Box key={userItem._id} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
                        <Typography variant="body1">{userItem.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userItem.email} - {userRole}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography>No users found</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Providers
              </Typography>
              {providers && providers.length > 0 ? (
                <Box>
                  {providers.slice(0, 5).map((provider) => (
                    <Box key={provider._id} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
                      <Typography variant="body1">{provider.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {provider.providerType}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography>No providers found</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
