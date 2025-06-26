# DiaCare Setup Guide

This guide will help you set up both the frontend and backend for the DiaCare system.

## Prerequisites

- Node.js 18+
- MySQL database
- npm or pnpm

## Backend Setup

1. **Navigate to the backend directory**

   ```bash
   cd diacare-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in `diacare-backend/` with:

   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/diacare"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. **Set up the database**

   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3000/api`

## Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd ..  # Go back to root
   ```

2. **Create environment file**
   Create a `.env.local` file in the root directory with:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Install dependencies** (if not already done)

   ```bash
   npm install
   ```

4. **Start the frontend server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3001`

## Default Users

After seeding the database, you can use these test accounts:

- **Patient**: `patient@diacare.com` / `password123`
- **Technician**: `tech@diacare.com` / `password123`
- **Admin**: `admin@diacare.com` / `password123`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

### Machines

- `GET /api/machines` - Get all machines
- `POST /api/machines` - Create new machine

### Faults

- `GET /api/faults` - Get all faults (with optional filters)
- `POST /api/faults` - Create new fault

### Alerts

- `GET /api/alerts` - Get all alerts (with optional filters)
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts` - Update alert status

### Interventions

- `GET /api/interventions` - Get all interventions (with optional filters)
- `POST /api/interventions` - Create new intervention
- `PUT /api/interventions` - Update intervention

### Maintenance Schedules

- `GET /api/maintenance-schedules` - Get all maintenance schedules
- `POST /api/maintenance-schedules` - Create new maintenance schedule
- `PUT /api/maintenance-schedules` - Update maintenance schedule

### Taxes

- `GET /api/taxes` - Get all taxes
- `POST /api/taxes` - Create new tax
- `PUT /api/taxes` - Update tax
- `DELETE /api/taxes` - Delete tax

## Troubleshooting

### Common Issues

1. **Module not found: @prisma/client**

   - Make sure you're in the backend directory
   - Run `npm run db:generate` to generate the Prisma client

2. **Database connection error**

   - Check your DATABASE_URL in the backend .env file
   - Ensure MySQL is running and accessible

3. **Frontend can't connect to backend**

   - Verify the backend is running on port 3000
   - Check NEXT_PUBLIC_API_URL in frontend .env.local
   - Ensure CORS is properly configured

4. **Authentication errors**
   - Check JWT_SECRET is set in backend .env
   - Verify the database is seeded with default users

### Port Conflicts

If you have port conflicts:

- Backend: Change port in `diacare-backend/package.json` scripts
- Frontend: Use `npm run dev -- -p 3001` to run on different port

## Development

### Backend Development

- API routes are in `diacare-backend/pages/api/`
- Database schema in `diacare-backend/prisma/schema.prisma`
- Seed data in `diacare-backend/prisma/seed.js`

### Frontend Development

- Pages are in `app/` directory
- Components in `components/` directory
- API client in `lib/api-client.js`
- Authentication hook in `hooks/useAuth.js`

## Production Deployment

1. **Backend**

   - Set up production database
   - Update environment variables
   - Run `npm run build` and `npm start`

2. **Frontend**
   - Update `NEXT_PUBLIC_API_URL` to production backend URL
   - Run `npm run build` and `npm start`

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the README files in both frontend and backend
3. Check the console for error messages
