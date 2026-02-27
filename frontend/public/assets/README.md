# Admin theme assets (Sneat)

These files are copied **as-is** from the theme reference:

`/Applications/node/theme/react-sneat-bootstrap-admin-template/public/assets/`

- **vendor/** – Core CSS (core.css, theme-default.css), JS (menu.js, helpers.js, bootstrap.js), fonts (boxicons), libs (perfect-scrollbar, etc.)
- **js/** – Theme scripts (main.js, config.js, etc.)
- **css/** – demo.css
- **img/** – Images (e.g. sneat.svg)

Do not edit these files. For admin customizations use:

- `src/components/admin/SneatLayout.css` (custom overrides)
- Any additional admin-specific CSS/JS you add under `src/` for admin.

Theme is loaded only on admin routes via `admin-theme-loader.js`.
