import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePublicSettings } from '../../context/PublicSettingsContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { websiteName, websiteTagline } = usePublicSettings();

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
