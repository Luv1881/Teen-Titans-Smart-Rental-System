# CAT Smart Rental Tracker

A comprehensive equipment rental tracking system for Caterpillar dealerships with real-time updates, weather-aware suggestions, and demand forecasting.

![Dashboard](./docs/dashboard.png)
*CAT Smart Rental Tracker Dashboard*

## Features

- Real-time equipment and rental tracking
- Weather-aware equipment suggestions
- Basic demand forecasting using Holt-Winters algorithm
- Anomaly detection for equipment utilization
- Interactive dashboard with maps and charts
- QR code generation for equipment
- Role-based access control

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL with Prisma ORM
- Socket.IO for real-time updates
- TypeScript
- Zod for request validation
- node-cron for scheduled jobs

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- React-Leaflet for maps
- QRCode.react for QR codes

## Getting Started

### Prerequisites

1. Node.js 18+
2. PostgreSQL database
3. npm or yarn

### Installing PostgreSQL on Linux Mint

1. **Update your system packages:**
   ```bash
   sudo apt update
   ```

2. **Install PostgreSQL and additional utilities:**
   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

3. **Start and enable PostgreSQL service:**
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

4. **Check PostgreSQL status to ensure it's running:**
   ```bash
   sudo systemctl status postgresql
   ```
   You should see output indicating the service is active (running).

5. **Switch to the PostgreSQL user account:**
   ```bash
   sudo -i -u postgres
   ```

6. **Access the PostgreSQL prompt:**
   ```bash
   psql
   ```
   You should now see the PostgreSQL prompt: `postgres=#`

7. **Set a password for the postgres user (optional but recommended):**
   ```sql
   \password postgres
   ```
   Enter and confirm a secure password when prompted.

8. **Exit the PostgreSQL prompt:**
   ```sql
   \q
   ```

9. **Return to your regular user account:**
   ```bash
   exit
   ```

10. **Create a new database for the application:**
    ```bash
    sudo -u postgres createdb cat_smart_rental
    ```

11. **Create a dedicated database user for the application (optional but recommended):**
    ```bash
    sudo -u postgres createuser --interactive --pwprompt
    ```
    When prompted:
    - Enter name of role to add: `cat_user`
    - Enter password for new role: [Enter a secure password]
    - Re-enter password: [Re-enter the password]
    - Shall the new role be a superuser? (y/n) n
    - Shall the new role be allowed to create databases? (y/n) y
    - Shall the new role be allowed to create more new roles? (y/n) n

12. **Grant privileges to the new user on the database:**
    ```bash
    sudo -u postgres psql
    ```
    Then in the PostgreSQL prompt:
    ```sql
    GRANT ALL PRIVILEGES ON DATABASE cat_smart_rental TO cat_user;
    \q
    ```

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd caterpillar-rental-tracker
   ```

2. Install root dependencies:
   ```bash
   npm install
   ```

3. Set up the backend:
   ```bash
   cd apps/server
   npm install
   ```
   
   Copy the example environment file and update the `DATABASE_URL`:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file to match your database configuration:
   ```bash
   nano .env
   ```
   
   If you created a dedicated user, update the DATABASE_URL to:
   ```
   DATABASE_URL=postgresql://cat_user:your_password@localhost:5432/cat_smart_rental
   ```
   
   If you're using the default postgres user:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cat_smart_rental
   ```
   
   Run database migrations and seed data:
   ```bash
   npm run db:reset
   ```

4. Set up the frontend:
   ```bash
   cd ../web
   npm install
   ```

### Running the Application

Start the development servers:

```bash
# From the root directory
npm run dev
```

This will start both the backend API server and the frontend development server concurrently.

The application will be available at:
- Backend API: http://localhost:4000
- Frontend Dashboard: http://localhost:3000

### Available Scripts

#### Root
- `npm run dev` - Start development servers for both frontend and backend
- `npm run build` - Build both frontend and backend
- `npm run start` - Start production servers
- `npm run test` - Run tests for both frontend and backend

#### Backend (apps/server)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start the production server
- `npm run dev` - Start the development server with ts-node
- `npm run db:reset` - Reset and seed the database
- `npm run test` - Run backend tests

#### Frontend (apps/web)
- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── apps/
│   ├── server/                 # Express backend
│   │   ├── prisma/             # Prisma schema and migrations
│   │   ├── src/                # TypeScript source code
│   │   │   ├── modules/        # Feature modules
│   │   │   ├── routes.ts       # Route registration
│   │   │   └── server.ts       # Main server file
│   │   ├── package.json        # Backend dependencies
│   │   └── .env.example        # Environment variables template
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── equipment/  # Equipment management
│       │   │   ├── rentals/    # Rental management
│       │   │   ├── maintenance/# Maintenance tracking
│       │   │   ├── forecasting/# Demand forecasting
│       │   │   ├── alerts/     # Alert notifications
│       │   │   ├── sites/      # Site management
│       │   │   ├── settings/   # System settings
│       │   │   ├── layout.tsx  # Root layout
│       │   │   └── page.tsx    # Dashboard
│       │   └── components/     # Shared components
│       ├── package.json        # Frontend dependencies
│       └── tailwind.config.ts  # Tailwind CSS configuration
├── package.json                # Root package.json
└── README.md                   # This file
```

## Database Schema

The application uses the following tables:

1. `equipment` - Equipment inventory
2. `sites` - Work sites
3. `operators` - Equipment operators
4. `companies` - Rental companies
5. `rentals` - Rental transactions
6. `maintenance` - Maintenance records
7. `revenue` - Revenue tracking
8. `weather_cache` - Weather data cache
9. `telemetry` - Real-time equipment telemetry

## API Endpoints

### Health
- `GET /api/health` - Health check endpoint

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create new equipment
- `PATCH /api/equipment/:id` - Update equipment

### Rentals
- `GET /api/rentals` - Get rentals with filters
- `POST /api/rentals/check-out` - Check out equipment
- `POST /api/rentals/check-in` - Check in equipment

### Sites
- `GET /api/sites` - Get all sites
- `GET /api/sites/:id` - Get site by ID
- `POST /api/sites` - Create new site
- `PATCH /api/sites/:id` - Update site

### Insights
- `GET /api/insights/utilization` - Get utilization metrics
- `GET /api/insights/availability` - Get availability metrics
- `GET /api/insights/suggestions` - Get equipment suggestions
- `GET /api/insights/forecast` - Get demand forecast
- `GET /api/insights/anomalies` - Get anomaly reports

## Real-time Updates

The application uses Socket.IO for real-time updates across these namespaces:
- `/equipment` - Equipment status changes
- `/rentals` - Rental status updates
- `/alerts` - System alerts
- `/telemetry` - Equipment telemetry data

## Environment Variables

The backend uses the following environment variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 4000)
- `WEATHER_PROVIDER` - Weather data provider
- `WEATHER_CACHE_DAYS` - Weather cache duration
- `DEMO_OFFLINE_WEATHER` - Offline weather mode
- `REALTIME_MODE` - Realtime update mode (listen or poll)

## Troubleshooting

### Port in Use
If you get an error that the port is in use, you can:
1. Kill the process using the port: `kill $(lsof -t -i:4000)` (backend) or `kill $(lsof -t -i:3000)` (frontend)
2. Or change the port in the `.env` file

### Database Connection
Ensure PostgreSQL is running and:
1. The database `cat_smart_rental` exists
2. The `DATABASE_URL` in `.env` is correct
3. The PostgreSQL user has access to the database

### Missing Dependencies
If you encounter issues with missing dependencies:
1. Ensure you've run `npm install` in both the root directory and each app directory
2. Check that Node.js 18+ is installed