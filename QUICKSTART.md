# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn

## Setup Steps

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL (default: http://localhost:5000/api)
npm start
```

Frontend will run on `http://localhost:3000`

## First Steps

1. **Register as Admin** (optional - you can create admin user directly in database)
   - Go to `/register`
   - Register with role "admin" (you may need to modify registration to allow admin)

2. **Register as Provider**
   - Go to `/register`
   - Select role "Provider"
   - Choose provider type (Doctor, Bank, etc.)
   - After registration, create provider profile in dashboard
   - Set your schedule (working days and shifts)

3. **Register as Staff**
   - Go to `/register`
   - Select role "Staff"
   - Provider admin needs to assign you to a provider

4. **Register as Customer**
   - Go to `/register`
   - Select role "Customer"
   - Browse providers and book queues

## Provider Workflow

1. Register as provider
2. Create provider profile (name, address, etc.)
3. Set schedule (which days, which shifts)
4. View customers and call next numbers

## Customer Workflow

1. Register as customer
2. Browse providers on home page
3. Select a provider
4. Book a queue (select date and shift)
5. View your queue status and estimated wait time

## Staff Workflow

1. Register as staff (or get assigned by admin)
2. Get assigned to a provider
3. View current shift queue
4. Assign numbers to walk-in customers
5. Reinsert customers if needed

## Admin Workflow

1. Access admin dashboard
2. View all users, providers, and queues
3. Manage system settings
4. View dashboard statistics

## Notes

- All settings are stored in database
- Mobile-friendly design for all pages
- Real-time queue updates (auto-refresh every few seconds)
- JWT-based authentication
- Role-based access control

## Troubleshooting

- **MongoDB connection error**: Make sure MongoDB is running
- **Port already in use**: Change PORT in backend .env
- **CORS errors**: Check API URL in frontend .env
- **Authentication errors**: Check JWT_SECRET in backend .env
