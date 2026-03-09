import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import { usePublicSettings } from '../../../context/PublicSettingsContext';

/**
 * Wrapper for front auth pages (login, register).
 * Keeps layout consistent with the main site; no admin theme or links.
 */
export const FrontAuthWrapper = ({ children }) => {
  const { websiteName, websiteLogo } = usePublicSettings();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="sm">
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            mb: 3,
            textDecoration: 'none',
            color: 'primary.main',
          }}
        >
          {websiteLogo ? (
            <img src={websiteLogo} alt={websiteName} style={{ maxHeight: 40, objectFit: 'contain' }} />
          ) : null}
          <Typography variant="h5" fontWeight="bold">
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
