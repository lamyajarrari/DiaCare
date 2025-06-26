# DiaCare Database Setup

This document provides instructions for setting up the DiaCare application with a real database using Prisma.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory with the following content:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# Twilio (for SMS alerts) - Optional
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
TECHNICIEN_PHONE=""
```

### 3. Database Setup

Generate the Prisma client:

```bash
pnpm db:generate
```

Push the schema to create the database:

```bash
pnpm db:push
```

Seed the database with initial data:

```bash
pnpm db:seed
```

### 4. Run the Application

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Default Users

After seeding, you can log in with these accounts:

### Patient Account

- **Email**: `patient@diacare.com`
- **Password**: `password123`
- **Role**: Patient
- **Name**: douha

### Technician Account

- **Email**: `tech@diacare.com`
- **Password**: `password123`
- **Role**: Technician
- **Name**: mehdi

### Admin Account

- **Email**: `admin@diacare.com`
- **Password**: `password123`
- **Role**: Admin
- **Name**: lamya

## Database Management

### View Database

To open Prisma Studio (database GUI):

```bash
pnpm db:studio
```

### Reset Database

To reset and reseed the database:

```bash
rm prisma/dev.db
pnpm db:push
pnpm db:seed
```

### Backup Database

The SQLite database file is located at `prisma/dev.db`. You can simply copy this file to create a backup.

## API Endpoints

The application now includes the following API endpoints:

### Authentication

- `POST /api/auth/login` - User login

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

### Machines

- `GET /api/machines` - Get all machines
- `POST /api/machines` - Create new machine

### Faults

- `GET /api/faults` - Get all faults
- `GET /api/faults?patientId=P001` - Get faults for specific patient
- `POST /api/faults` - Create new fault

### Alerts

- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert

### Interventions

- `GET /api/interventions` - Get all interventions
- `POST /api/interventions` - Create new intervention

### Maintenance

- `GET /api/maintenance` - Get maintenance schedule
- `POST /api/maintenance` - Create new maintenance task

## Database Schema

The database includes the following main entities:

- **Users** - System users (patients, technicians, admins)
- **Machines** - Dialysis machines
- **Faults** - Machine faults and incidents
- **Alerts** - System alerts and warnings
- **Interventions** - Maintenance interventions
- **MaintenanceSchedule** - Scheduled maintenance tasks

## Production Deployment

For production deployment:

1. Use a production database (PostgreSQL, MySQL, etc.)
2. Update the `DATABASE_URL` in your environment
3. Run migrations: `pnpm db:migrate`
4. Update environment variables for security
5. Set up proper authentication with NextAuth.js

## Troubleshooting

### Common Issues

1. **Prisma Client not found**: Run `pnpm db:generate`
2. **Database connection errors**: Check your `DATABASE_URL` in `.env`
3. **TypeScript errors**: Ensure all dependencies are installed with `pnpm install`

### Reset Everything

If you encounter issues, you can reset the entire setup:

```bash
rm -rf node_modules
rm prisma/dev.db
rm -rf .next
pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
```
