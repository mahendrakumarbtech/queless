import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import { usePublicSettings } from '../../../context/PublicSettingsContext';

/**
 * Wrapper for front auth pages (login, register).
 * Keeps layout consistent with the main site; no admin theme or links.
 */
export const FrontAuthWrapper = ({ children }) => {
  const { websiteName } = usePublicSettings();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            fontWeight="bold"
            sx={{ color: 'primary.main', textDecoration: 'none' }}
          >
            {websiteName}
          </Typography>
        </Box>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};
