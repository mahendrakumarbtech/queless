/**
 * Loads Sneat theme assets when admin layout mounts; removes on unmount.
 * Theme CSS is injected only on admin so it doesn't break the main app layout.
 * We wait for CSS to load before showing layout (avoids FOUC).
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

function loadStyle(href, id) {
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = id;
    link.setAttribute('data-sneat-admin', THEME_LINK_ID);
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}

export function loadAdminTheme() {
  const html = document.documentElement;
  htmlClasses.forEach((c) => html.classList.add(c));
  html.setAttribute('dir', 'ltr');
  html.setAttribute('data-theme', 'theme-default');
  themeStyles.forEach(({ href, id }) => {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = id;
    link.setAttribute('data-sneat-admin', THEME_LINK_ID);
    document.head.appendChild(link);
  });
}

/** Returns Promise that resolves when theme CSS has loaded. Use this so layout doesn't show until ready. */
export function loadAdminThemeAsync() {
  const html = document.documentElement;
  htmlClasses.forEach((c) => html.classList.add(c));
  html.setAttribute('dir', 'ltr');
  html.setAttribute('data-theme', 'theme-default');

  const toLoad = themeStyles.filter(({ id }) => !document.getElementById(id));
  if (toLoad.length === 0) return Promise.resolve();

  return Promise.all(toLoad.map(({ href, id }) => loadStyle(href, id)));
}

export function unloadAdminTheme() {
  document.querySelectorAll(`link[data-sneat-admin="${THEME_LINK_ID}"]`).forEach((el) => el.remove());
  const html = document.documentElement;
  htmlClasses.forEach((c) => html.classList.remove(c));
  html.removeAttribute('dir');
  html.removeAttribute('data-theme');
}
