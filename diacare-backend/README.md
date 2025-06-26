# DiaCare Backend

Backend API for the DiaCare dialysis machine management system.

## Features

- **User Management**: Authentication and authorization for patients, technicians, and admins
- **Machine Management**: CRUD operations for dialysis machines
- **Fault Tracking**: Record and track machine faults
- **Alert System**: Real-time alerts for machine issues
- **Intervention Management**: Track maintenance interventions
- **Maintenance Scheduling**: Schedule and track maintenance tasks
- **Tax Management**: Manage taxes and fees

## Tech Stack

- **Framework**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with bcrypt for password hashing
- **Validation**: Built-in request validation

## Prerequisites

- Node.js 18+
- MySQL database
- npm or pnpm

## Setup

1. **Clone the repository and navigate to the backend directory**

   ```bash
   cd diacare-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/diacare"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api`

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

## Database Schema

The database includes the following models:

- **User**: Users with different roles (patient, technician, admin)
- **Machine**: Dialysis machines with inventory and status
- **Fault**: Machine faults and their resolution
- **Alert**: Real-time alerts for machine issues
- **Intervention**: Maintenance interventions and their details
- **MaintenanceSchedule**: Scheduled maintenance tasks
- **Taxe**: Tax and fee management

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data

## Default Users

After seeding, the following users are available:

- **Patient**: `patient@diacare.com` / `password123`
- **Technician**: `tech@diacare.com` / `password123`
- **Admin**: `admin@diacare.com` / `password123`

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages in French. Common status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
