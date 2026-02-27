# Sneat Bootstrap Admin Template Integration

Sneat Bootstrap 5 admin template has been integrated into the admin panel.

## Installation

Run the following command to install required dependencies:

```bash
cd frontend
npm install
```

This will install:
- `bootstrap@5.3.2` - Bootstrap 5 CSS framework
- `react-bootstrap@2.9.1` - React Bootstrap components
- `bootstrap-icons@1.11.1` - Bootstrap Icons

## What's Changed

### 1. New Admin Layout
- **File**: `src/components/admin/SneatLayout.js`
- Modern Sneat-style sidebar navigation
- Responsive mobile menu
- Bootstrap 5 based design

### 2. Updated Admin Pages
All admin pages now use Bootstrap components:
- `src/pages/admin/AdminDashboard.js` - Dashboard with Bootstrap cards
- `src/pages/admin/Users.js` - Users table with Bootstrap
- `src/pages/admin/Providers.js` - Providers grid with Bootstrap cards
- `src/pages/admin/Queues.js` - Queues table with Bootstrap
- `src/pages/admin/Settings.js` - Settings forms with Bootstrap

### 3. Styling
- **File**: `src/components/admin/SneatLayout.css`
- Custom Sneat-inspired styles
- Bootstrap 5 color scheme
- Responsive design

### 4. Bootstrap Integration
- Bootstrap CSS imported in `src/index.js`
- Bootstrap Icons imported in `src/index.js`
- Bootstrap JS added to `public/index.html` for dropdowns

## Features

✅ Modern sidebar navigation
✅ Responsive mobile menu
✅ Bootstrap 5 components
✅ Bootstrap Icons
✅ Clean, professional design
✅ Mobile-first responsive layout

## Usage

After installing dependencies, the admin panel at `/admin` will automatically use the Sneat Bootstrap template.

## Notes

- The main app (non-admin routes) still uses Material-UI
- Only admin routes (`/admin/*`) use Bootstrap/Sneat template
- All existing functionality is preserved
