import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { usePublicSettings } from '../../context/PublicSettingsContext';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { websiteName, websiteLogo } = usePublicSettings();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  const userRole = user ? (typeof user.role === 'string' ? user.role : (user.role?.name || 'customer')) : null;
  const isFrontUser = userRole === 'provider' || userRole === 'customer';

  const getDashboardLink = () => {
    if (!isFrontUser) return null;
    if (userRole === 'customer') return '/customer';
    if (userRole === 'provider') return '/staff';
    return null;
  };

  const dashboardLink = getDashboardLink();

  const navLinks = [
    { label: t('nav:home'), to: '/' },
    { label: t('nav:features'), to: '/#features' },
    { label: t('nav:about'), to: '/#about' },
    { label: t('nav:contact'), to: '/#contact' },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: 'grey.900', borderBottom: '1px solid', borderColor: 'grey.200' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
          }}
        >
          {websiteLogo ? (
            <img src={websiteLogo} alt={websiteName} style={{ maxHeight: 36, objectFit: 'contain' }} />
          ) : null}
          <Typography variant="h6" fontWeight="700" component="span">
            {websiteName}
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
          {navLinks.map(({ label, to }) => (
            <Button key={to} color="inherit" component={Link} to={to} sx={{ color: 'grey.700', fontWeight: 500 }}>
              {label}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isFrontUser ? (
            <>
              {dashboardLink && (
                <Button color="inherit" component={Link} to={dashboardLink}>
                  {t('nav:dashboard')}
                </Button>
              )}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Typography>
                    {user?.name} ({typeof user?.role === 'string' ? user.role : (user?.role?.name || 'user')})
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>{t('nav:logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={{ color: 'grey.700', fontWeight: 600 }}>
                {t('nav:login')}
              </Button>
              <Button component={Link} to="/register" variant="contained" color="primary" sx={{ fontWeight: 600 }}>
                {t('nav:register')}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
