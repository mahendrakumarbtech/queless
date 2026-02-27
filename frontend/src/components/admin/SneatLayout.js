import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePublicSettings } from '../../context/PublicSettingsContext';
import getGreetingMessage from '../../utils/greetingHandler';
import { loadAdminThemeAsync, unloadAdminTheme } from './admin-theme-loader';
import './SneatLayout.css';

const menuItems = [
  { text: 'Dashboard', icon: 'bx bx-home', path: '/admin' },
  {
    text: 'Role & Permission',
    icon: 'bx bx-lock-alt',
    path: '/admin/roles',
  },
  {
    text: 'Users',
    icon: 'bx bx-user',
    path: '/admin/users',
    children: [
      { text: 'Staff', path: '/admin/users/staff' },
      { text: 'Provider', path: '/admin/users/provider' },
      { text: 'Customer', path: '/admin/users/customer' },
    ],
  },
  { text: 'Providers', icon: 'bx bx-building', path: '/admin/providers' },
  { text: 'Queues', icon: 'bx bx-list-ul', path: '/admin/queues' },
  { text: 'Settings', icon: 'bx bx-cog', path: '/admin/settings' },
];

const AdminLayoutLoader = () => (
  <div className="admin-theme-loader-wrap">
    <div className="admin-theme-loader-spinner" aria-hidden="true" />
    <p className="admin-theme-loader-text">Loading...</p>
  </div>
);

const SneatLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { websiteName, sidebarLogoUrl } = usePublicSettings();

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
            <a
              href="#"
              className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
              onClick={(e) => { e.preventDefault(); setSidebarOpen(!sidebarOpen); }}
              aria-label="Toggle menu"
            >
              <i className="bx bx-chevron-left bx-sm align-middle"></i>
            </a>
          </div>

          <div className="menu-inner-shadow"></div>

          <ul className="menu-inner py-1">
            {menuItems.map((item) => (
              <li key={item.path || item.text} className={`menu-item ${item.children ? 'menu-item-sub menu-sub-open' : ''}`}>
                {item.children ? (
                  <>
                    <a
                      href="#"
                      className="menu-link menu-toggle"
                      onClick={(e) => { e.preventDefault(); }}
                      aria-expanded="true"
                    >
                      <i className={`menu-icon tf-icons ${item.icon}`}></i>
                      <div data-i18n={item.text}>{item.text}</div>
                      <i className="menu-arrow tf-icons bx bx-chevron-down"></i>
                    </a>
                    <ul className="menu-sub">
                      <li className="menu-item">
                        <NavLink to={item.path} className="menu-link" onClick={closeSidebar}>
                          <div data-i18n="All">All</div>
                        </NavLink>
                      </li>
                      {item.children.map((sub) => (
                        <li key={sub.path} className="menu-item">
                          <NavLink to={sub.path} className="menu-link" onClick={closeSidebar}>
                            <div data-i18n={sub.text}>{sub.text}</div>
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
                    <div data-i18n={item.text}>{item.text}</div>
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
              <a
                className="nav-item nav-link px-0 me-xl-4"
                href="#"
                onClick={(e) => { e.preventDefault(); setSidebarOpen(!sidebarOpen); }}
                aria-label="Toggle sidebar"
              >
                <i className="bx bx-menu bx-sm"></i>
              </a>
            </div>

            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
              {getGreetingMessage(user?.name?.split(' ')[0] || user?.name || 'Admin')}
              <ul className="navbar-nav flex-row align-items-center ms-auto">
                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <a
                    className="nav-link dropdown-toggle hide-arrow"
                    href="#"
                    data-bs-toggle="dropdown"
                    aria-label="Profile menu"
                  >
                    <div className="avatar avatar-online">
                      <span className="avatar-initial rounded-circle bg-label-primary">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="#">
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
                            <small className="text-muted">Admin</small>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li><div className="dropdown-divider"></div></li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="bx bx-user me-2"></i>
                        <span className="align-middle">My Profile</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="bx bx-cog me-2"></i>
                        <span className="align-middle">Settings</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <span className="d-flex align-items-center align-middle">
                          <i className="bx bx-credit-card me-2 flex-shrink-0"></i>
                          <span className="flex-grow-1 align-middle ms-1">Billing</span>
                          <span className="badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                        </span>
                      </a>
                    </li>
                    <li><div className="dropdown-divider"></div></li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={handleLogout}>
                        <i className="bx bx-power-off me-2"></i>
                        <span className="align-middle">Log Out</span>
                      </a>
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
                  <a href="#" className="footer-link fw-medium">{websiteName}</a>
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
          aria-label="Close menu"
        />
      </div>
    </div>
  );
};

export default SneatLayout;
