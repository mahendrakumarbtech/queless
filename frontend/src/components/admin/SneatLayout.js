import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { usePublicSettings } from '../../context/PublicSettingsContext';
import getGreetingMessage from '../../utils/greetingHandler';
import LanguageSwitcher from '../LanguageSwitcher';
import { loadAdminThemeAsync, unloadAdminTheme } from './admin-theme-loader';
import './SneatLayout.css';

const getMenuItems = (t) => [
  { text: t('menu:dashboard'), icon: 'bx bx-home', path: '/admin' },
  {
    text: t('menu:rolePermission'),
    icon: 'bx bx-lock-alt',
    path: '/admin/roles',
  },
  {
    text: t('menu:users'),
    icon: 'bx bx-user',
    path: '/admin/users',
    children: [
      { text: t('menu:staff'), path: '/admin/users/staff' },
      { text: t('menu:provider'), path: '/admin/users/provider' },
      { text: t('menu:customer'), path: '/admin/users/customer' },
    ],
  },
  { text: t('menu:providers'), icon: 'bx bx-building', path: '/admin/providers' },
  { text: t('menu:queues'), icon: 'bx bx-list-ul', path: '/admin/queues' },
  { text: t('menu:settings'), icon: 'bx bx-cog', path: '/admin/settings' },
];

const AdminLayoutLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="admin-theme-loader-wrap">
      <div className="admin-theme-loader-spinner" aria-hidden="true" />
      <p className="admin-theme-loader-text">{t('common:loading')}</p>
    </div>
  );
};

const SneatLayout = ({ children }) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { websiteName, sidebarLogoUrl } = usePublicSettings();
  const menuItems = getMenuItems(t);

  useEffect(() => {
    let cancelled = false;
    loadAdminThemeAsync().then(() => {
      if (!cancelled) setThemeReady(true);
    });
    return () => {
      cancelled = true;
      unloadAdminTheme();
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/admin/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  if (!themeReady) {
    return <AdminLayoutLoader />;
  }

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className={`layout-container ${sidebarOpen ? 'layout-menu-expanded' : ''}`}>
        {/* Sidebar - theme HTML structure */}
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
          <div className="app-brand demo">
            <Link to="/admin" className="app-brand-link" aria-label={`${websiteName} home`}>
              {sidebarLogoUrl ? (
                <span className="app-brand-logo demo">
                  <img src={sidebarLogoUrl} alt={websiteName} aria-label={`${websiteName} logo`} />
                </span>
              ) : (
                <span className="app-brand-text demo menu-text fw-bold">{websiteName}</span>
              )}
            </Link>
            <button
              type="button"
              className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={t('aria:toggleMenu')}
            >
              <i className="bx bx-chevron-left bx-sm align-middle"></i>
            </button>
          </div>

          <div className="menu-inner-shadow"></div>

          <ul className="menu-inner py-1">
            {menuItems.map((item) => (
              <li key={item.path || item.text} className={`menu-item ${item.children ? 'menu-item-sub menu-sub-open' : ''}`}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="menu-link menu-toggle"
                      onClick={() => {}}
                      aria-expanded="true"
                    >
                      <i className={`menu-icon tf-icons ${item.icon}`}></i>
                      <div>{item.text}</div>
                      <i className="menu-arrow tf-icons bx bx-chevron-down"></i>
                    </button>
                    <ul className="menu-sub">
                      <li className="menu-item">
                        <NavLink to={item.path} className="menu-link" onClick={closeSidebar}>
                          <div>{t('menu:all')}</div>
                        </NavLink>
                      </li>
                      {item.children.map((sub) => (
                        <li key={sub.path} className="menu-item">
                          <NavLink to={sub.path} className="menu-link" onClick={closeSidebar}>
                            <div>{sub.text}</div>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className="menu-link"
                    onClick={closeSidebar}
                    aria-label={item.text}
                  >
                    <i className={`menu-icon tf-icons ${item.icon}`}></i>
                    <div>{item.text}</div>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <div className="layout-page">
          {/* Navbar - theme HTML structure */}
          <nav
            className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
            id="layout-navbar"
          >
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <button
                type="button"
                className="nav-item nav-link px-0 me-xl-4"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={t('aria:toggleSidebar')}
              >
                <i className="bx bx-menu bx-sm"></i>
              </button>
            </div>

            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
              {getGreetingMessage(user?.name?.split(' ')[0] || user?.name || 'Admin')}
              <ul className="navbar-nav flex-row align-items-center ms-auto">
                <LanguageSwitcher />
                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <button
                    type="button"
                    className="nav-link dropdown-toggle hide-arrow"
                    data-bs-toggle="dropdown"
                    aria-label={t('aria:profileMenu')}
                  >
                    <div className="avatar avatar-online">
                      <span className="avatar-initial rounded-circle bg-label-primary">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button type="button" className="dropdown-item">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar avatar-online">
                              <span className="avatar-initial rounded-circle bg-label-primary">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <span className="fw-medium d-block">{user?.name || 'Admin'}</span>
                            <small className="text-muted">{t('common:admin')}</small>
                          </div>
                        </div>
                      </button>
                    </li>
                    <li><div className="dropdown-divider"></div></li>
                    <li>
                      <button type="button" className="dropdown-item">
                        <i className="bx bx-user me-2"></i>
                        <span className="align-middle">{t('menu:myProfile')}</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" className="dropdown-item">
                        <i className="bx bx-cog me-2"></i>
                        <span className="align-middle">{t('menu:settings')}</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" className="dropdown-item">
                        <span className="d-flex align-items-center align-middle">
                          <i className="bx bx-credit-card me-2 flex-shrink-0"></i>
                          <span className="flex-grow-1 align-middle ms-1">{t('menu:billing')}</span>
                          <span className="badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                        </span>
                      </button>
                    </li>
                    <li><div className="dropdown-divider"></div></li>
                    <li>
                      <button type="button" className="dropdown-item" onClick={handleLogout}>
                        <i className="bx bx-power-off me-2"></i>
                        <span className="align-middle">{t('menu:logOut')}</span>
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>

          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              {children || <Outlet />}
            </div>

            <footer className="content-footer footer bg-footer-theme">
              <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                <div className="mb-2 mb-md-0">
                  © {new Date().getFullYear()}, made with <span className="text-danger">❤️</span> by{' '}
                  <Link to="/admin" className="footer-link fw-medium">{websiteName}</Link>
                </div>
              </div>
            </footer>
          </div>
        </div>

        {/* Theme: overlay to close menu on mobile */}
        <div
          className="layout-overlay layout-menu-toggle"
          onClick={closeSidebar}
          onKeyDown={(e) => e.key === 'Enter' && closeSidebar()}
          role="button"
          tabIndex={0}
          aria-label={t('aria:closeMenu')}
        />
      </div>
    </div>
  );
};

export default SneatLayout;
