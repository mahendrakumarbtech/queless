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
  const { websiteName } = usePublicSettings();
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

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          {websiteName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
              <Button color="inherit" component={Link} to="/login">
                {t('nav:login')}
              </Button>
              <Button color="inherit" component={Link} to="/register">
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
