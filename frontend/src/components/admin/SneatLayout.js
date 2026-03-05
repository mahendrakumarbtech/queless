import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { usePublicSettings } from '../../context/PublicSettingsContext';
import LanguageSwitcher from '../front/LanguageSwitcher';
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
  const location = useLocation();
  const pathname = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenuPath, setExpandedMenuPath] = useState(null);
  const [themeReady, setThemeReady] = useState(false);
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin-theme-mode');
      if (stored === 'dark' || stored === 'light' || stored === 'system') return stored;
      return 'system';
    }
    return 'system';
  });
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  );
  const navigate = useNavigate();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemDark);
  const { adminUser, logoutAdmin } = useAuth();
  const { websiteName, sidebarLogoUrl } = usePublicSettings();
  const menuItems = getMenuItems(t);

  const isMenuOpen = (item) => {
    if (!item.children) return false;
    return expandedMenuPath === item.path || (expandedMenuPath === null && pathname.startsWith(item.path));
  };

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

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const effective = themeMode === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : themeMode;
      root.setAttribute('data-bs-theme', effective);
    };
    apply();
    if (typeof localStorage !== 'undefined') localStorage.setItem('admin-theme-mode', themeMode);
    if (themeMode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => {
        apply();
        setSystemDark(mq.matches);
      };
      setSystemDark(mq.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, [themeMode]);

  const handleLogout = (e) => {
    e.preventDefault();
    logoutAdmin();
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
              <li key={item.path || item.text} className={`menu-item ${item.children ? 'menu-item-sub' : ''} ${isMenuOpen(item) ? 'open' : ''}`}>
                {item.children ? (
                  <>
                    <a
                      href={`#menu-${(item.path || item.text).replace(/\//g, '-')}`}
                      className="menu-link menu-toggle"
                      onClick={(e) => {
                        e.preventDefault();
                        setExpandedMenuPath((prev) => (prev === item.path ? null : item.path));
                      }}
                      aria-expanded={isMenuOpen(item)}
                      role="button"
                    >
                      <i className={`menu-icon tf-icons ${item.icon}`}></i>
                      <div>{item.text}</div>
                    </a>
                    <ul className="menu-sub">
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

            <div className="navbar-nav-right d-flex align-items-center w-100" id="navbar-collapse">
              {/* Search – commented out for now
              <div className="navbar-search-wrapper navbar-search-wrapper-detached search-input-wrapper col-12 col-lg-5 col-xl-4 me-0 me-lg-4 flex-grow-1 admin-navbar-search">
                <div className="input-group input-group-merge search-bar">
                  <span className="input-group-text"><i className="bx bx-search"></i></span>
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder={t('nav:searchPlaceholder')}
                    aria-label={t('nav:searchPlaceholder')}
                  />
                </div>
              </div>
              */}
              <ul className="navbar-nav flex-row align-items-center ms-auto">
                <li className="nav-item dropdown dropdown-notifications">
                  <button
                    type="button"
                    className="nav-link dropdown-toggle hide-arrow position-relative"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label={t('nav:notifications')}
                  >
                    <i className="bx bx-bell bx-sm"></i>
                    <span className="badge rounded-pill bg-danger badge-dot position-absolute border border-white top-0 end-0 mt-1 me-1"></span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end py-0">
                    <li className="dropdown-menu-header border-bottom d-flex align-items-center justify-content-between px-3 py-2">
                      <span className="fw-semibold">{t('nav:notification')}</span>
                      <span className="badge rounded-pill bg-label-primary">0</span>
                    </li>
                    <li className="dropdown-notifications-list scrollable-container">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item list-group-item-action dropdown-notifications-item py-3">
                          <small className="text-muted">{t('nav:noNotifications')}</small>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown-menu-footer border-top">
                      <button type="button" className="dropdown-item fw-medium py-2 text-center">
                        {t('nav:viewAllNotifications')}
                      </button>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <button
                    type="button"
                    className="nav-link dropdown-toggle hide-arrow"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label={t('nav:themeMode')}
                    title={t('nav:themeMode')}
                  >
                    <i className={`bx bx-sm ${isDark ? 'bx-moon' : 'bx-sun'}`}></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-theme">
                    <li>
                      <button
                        type="button"
                        className={`dropdown-item ${themeMode === 'light' ? 'active' : ''}`}
                        onClick={() => setThemeMode('light')}
                      >
                        <i className="bx bx-sun me-2"></i>
                        <span>{t('nav:light')}</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className={`dropdown-item ${themeMode === 'dark' ? 'active' : ''}`}
                        onClick={() => setThemeMode('dark')}
                      >
                        <i className="bx bx-moon me-2"></i>
                        <span>{t('nav:dark')}</span>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className={`dropdown-item ${themeMode === 'system' ? 'active' : ''}`}
                        onClick={() => setThemeMode('system')}
                      >
                        <i className="bx bx-desktop me-2"></i>
                        <span>{t('nav:system')}</span>
                      </button>
                    </li>
                  </ul>
                </li>
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
                        {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
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
                                {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <span className="fw-medium d-block">{adminUser?.name || 'Admin'}</span>
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
