# Database Seeders

This directory contains database seeders for populating initial data in the QueLess application.

## Available Seeders

### 1. Admin Seeder (`adminSeeder.js`)
Creates a default admin user:
- **Email**: admin@queless.com
- **Password**: admin123
- **Role**: admin

⚠️ **Important**: Change the password after first login!

### 2. Settings Seeder (`settingsSeeder.js`)
Creates default system settings:
- System name
- Support email
- Notification settings
- Queue configuration
- Booking settings

### 3. Sample Data Seeder (`sampleDataSeeder.js`)
Creates sample data for testing:
- Sample provider (Doctor)
- Sample provider user
- Sample customer
- Sample staff member

## Usage

### Run All Seeders
```bash
npm run seed
```

This will:
- Create admin user
- Seed default settings
- (Sample data is commented out by default)

### Run Individual Seeders

**Admin User Only:**
```bash
npm run seed:admin
```

**Settings Only:**
```bash
npm run seed:settings
```

**Sample Data Only:**
```bash
npm run seed:sample
```

## Notes

- Seeders are **idempotent** - they won't create duplicates if data already exists
- Admin seeder checks if admin already exists before creating
- Settings seeder updates existing settings if values differ
- Make sure MongoDB is running before executing seeders
- Update `.env` file with correct `MONGODB_URI` before running

## Environment Variables Required

```env
MONGODB_URI=mongodb://localhost:27017/queless
```

## Default Login Credentials

After running seeders, you can login with:

- **Admin**: admin@queless.com / admin123
- **Provider** (if sample data seeded): doctor@queless.com / doctor123
- **Customer** (if sample data seeded): customer@queless.com / customer123
- **Staff** (if sample data seeded): staff@queless.com / staff123

⚠️ **Security Warning**: These are default credentials. Change them immediately in production!
