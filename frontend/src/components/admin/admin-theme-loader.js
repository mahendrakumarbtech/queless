/**
 * Loads Sneat theme assets (CSS/fonts) when admin layout mounts.
 * Theme files are copied from /Applications/node/theme (public/assets).
 * Remove all on unmount so main app is unaffected.
 */
const THEME_LINK_ID = 'sneat-admin-theme';

const themeStyles = [
  { href: 'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap', id: 'sneat-fonts' },
  { href: '/assets/vendor/fonts/boxicons.css', id: 'sneat-boxicons' },
  { href: '/assets/vendor/css/core.css', id: 'sneat-core' },
  { href: '/assets/vendor/css/theme-default.css', id: 'sneat-theme-default' },
  { href: '/assets/css/demo.css', id: 'sneat-demo' },
  { href: '/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css', id: 'sneat-perfect-scrollbar' },
];

const htmlClasses = ['light-style', 'layout-menu-fixed', 'layout-content-navbar', 'layout-compact'];

export function loadAdminTheme() {
  const fragment = document.createDocumentFragment();
  themeStyles.forEach(({ href, id }) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = id;
    link.setAttribute('data-sneat-admin', THEME_LINK_ID);
    fragment.appendChild(link);
  });
  document.head.appendChild(fragment);

  const html = document.documentElement;
  htmlClasses.forEach((c) => html.classList.add(c));
  html.setAttribute('dir', 'ltr');
  html.setAttribute('data-theme', 'theme-default');
}

export function unloadAdminTheme() {
  document.querySelectorAll(`link[data-sneat-admin="${THEME_LINK_ID}"]`).forEach((el) => el.remove());
  const html = document.documentElement;
  htmlClasses.forEach((c) => html.classList.remove(c));
  html.removeAttribute('dir');
  html.removeAttribute('data-theme');
}
