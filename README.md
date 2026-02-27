# QueLess - Queue Management System

A comprehensive MERN stack application for managing queues with support for multiple provider types, role-based access control, and mobile-friendly design.

## Features

### Provider Types
- Doctor
- Ration Shops
- Bank
- CA (Chartered Accountant)
- Aadhaar Centers
- School/College Admission
- Library

### User Roles
1. **Admin** - Full system access and management
2. **Provider** - Manage their business, schedule, and queues
3. **Staff** - Assist providers in managing queues
4. **Customer** - Book queues and track their numbers

### Provider Features
- Set working schedule (days and shifts)
- View customer details
- Call next number in queue
- Manage provider settings

### Customer Features
- Book queue numbers (with payment)
- View current number being served
- Track estimated wait time
- View booking history

### Staff Features
- Assign queue numbers to customers
- View current shift queue
- Reinsert customers back in queue

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- MVC Architecture

### Frontend
- React.js
- Material-UI
- React Router
- React Query
- Axios

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/queless
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```
NODE_API_BASE_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

## Project Structure

```
queless/
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.js       # Main app component
│   └── public/          # Static files
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Customer
- `GET /api/customer/providers` - Get all providers
- `POST /api/customer/book` - Book a queue
- `GET /api/customer/current/:providerId` - Get current number
- `GET /api/customer/my-queues` - Get customer's queues

### Provider
- `POST /api/provider` - Create provider
- `GET /api/provider/:id` - Get provider details
- `PUT /api/provider/:id/schedule` - Update schedule
- `GET /api/provider/:id/customers` - Get customers
- `POST /api/provider/:id/next` - Call next number
- `GET /api/provider/:id/current` - Get current number

### Staff
- `POST /api/staff/assign` - Assign number to customer
- `GET /api/staff/current-shift` - Get current shift queue
- `PUT /api/staff/reinsert/:queueId` - Reinsert customer

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/providers` - Get all providers
- `GET /api/admin/queues` - Get all queues
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings
- `GET /api/admin/dashboard` - Get dashboard stats

## Usage

1. Start MongoDB service
2. Start backend server (port 5000)
3. Start frontend server (port 3000)
4. Open browser to `http://localhost:3000`
5. Register as a user (customer, provider, staff, or admin)
6. If provider, create provider profile and set schedule
7. Customers can browse providers and book queues
8. Providers/Staff can manage queues and call next numbers

## Mobile-Friendly Design

The application is built with Material-UI and follows mobile-first responsive design principles. All pages are optimized for mobile devices.

## Database Settings

All settings are stored in the database using the Settings model. Admins can update system-wide settings through the admin panel.

## License

ISC
