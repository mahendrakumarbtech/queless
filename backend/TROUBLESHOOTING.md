# Troubleshooting Login Issues

## Problem: "Server error" on login

If you're getting a server error when trying to login, follow these steps:

### Step 1: Check if Roles are Seeded

```bash
cd backend
npm run seed:roles
```

This creates the required roles (admin, provider, staff, customer) in the database.

### Step 2: Check if Admin User Exists and Has Role

```bash
npm run check:user
```

This will verify:
- Admin user exists
- Admin user has a role assigned
- Role exists in database
- Role can be populated

### Step 3: Seed Admin User (if needed)

```bash
npm run seed:admin
```

This creates the admin user with:
- Email: `admin@queless.com`
- Password: `admin123`

### Step 4: Run All Seeders (Recommended)

```bash
npm run seed
```

This runs all seeders in the correct order:
1. Roles seeder
2. Admin user seeder
3. Settings seeder

### Step 5: Check Backend Logs

Check your backend server console for detailed error messages. Common issues:

1. **MongoDB not running**
   - Start MongoDB: `mongod` or `brew services start mongodb-community`

2. **Database connection error**
   - Check `.env` file has correct `MONGODB_URI`
   - Default: `mongodb://localhost:27017/queless`

3. **JWT_SECRET missing**
   - Check `.env` file has `JWT_SECRET`
   - Default is set in `config/config.js` but should be in `.env` for production

### Step 6: Verify Database

Connect to MongoDB and check:

```javascript
// In MongoDB shell or Compass
use queless
db.users.findOne({ email: "admin@queless.com" })
db.roles.find()
```

The user should have a `role` field that references a role in the `roles` collection.

## Common Error Messages

### "User role not found"
- **Solution**: Run `npm run seed:roles` then `npm run seed:admin`

### "Invalid credentials"
- **Solution**: Check email/password. Default: `admin@queless.com` / `admin123`

### "Account is deactivated"
- **Solution**: Check user's `isActive` field in database

### "MongoDB connection error"
- **Solution**: Start MongoDB service

## Quick Fix Script

If nothing works, reset and reseed:

```bash
cd backend
# Drop database (CAUTION: This deletes all data!)
# Then run:
npm run seed
```

## Still Having Issues?

1. Check backend server is running on correct port (default: 5010)
2. Check frontend is pointing to correct API URL
3. Check browser console for network errors
4. Check backend console for detailed error logs
