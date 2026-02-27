import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePublicSettings } from '../context/PublicSettingsContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { websiteName, websiteTagline } = usePublicSettings();

  const providerTypes = [
    { type: 'doctor', label: 'Doctor' },
    { type: 'ration_shop', label: 'Ration Shop' },
    { type: 'bank', label: 'Bank' },
    { type: 'ca', label: 'CA' },
    { type: 'aadhaar_center', label: 'Aadhaar Center' },
    { type: 'school_college', label: 'School/College' },
    { type: 'library', label: 'Library' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {websiteName}
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {websiteTagline}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Book your slot, track your number, and manage queues efficiently
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {providerTypes.map((provider) => (
          <Grid item xs={6} sm={4} md={3} key={provider.type}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {provider.label}
                </Typography>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/providers?type=${provider.type}`}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  View Providers
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!isAuthenticated && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/login"
          >
            Login
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Home;
