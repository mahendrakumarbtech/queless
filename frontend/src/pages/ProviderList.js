import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config/config';

const API_URL = config.API_URL;

const ProviderList = () => {
  const [searchParams] = useSearchParams();
  const providerType = searchParams.get('type') || '';
  const { isAuthenticated } = useAuth();

  const { data: providers } = useQuery(
    ['providers', providerType],
    async () => {
      const response = await axios.get(
        `${API_URL}/customer/providers${providerType ? `?providerType=${providerType}` : ''}`
      );
      return response.data.data;
    }
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Providers
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Select a provider to book your queue
      </Typography>

      {providers && providers.length > 0 ? (
        <Grid container spacing={3}>
          {providers.map((provider) => (
            <Grid item xs={12} sm={6} md={4} key={provider._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {provider.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {provider.providerType}
                  </Typography>
                  {provider.address && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {provider.address.city}, {provider.address.state}
                    </Typography>
                  )}
                  {isAuthenticated ? (
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to={`/book/${provider._id}`}
                      sx={{ mt: 2 }}
                    >
                      Book Queue
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      to="/login"
                      sx={{ mt: 2 }}
                    >
                      Login to Book
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No providers found</Typography>
      )}
    </Container>
  );
};

export default ProviderList;
