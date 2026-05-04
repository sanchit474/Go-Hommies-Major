# GoHomies Admin Panel

A dedicated admin and service provider portal for managing the GoHomies platform.

## Features

- **Admin Dashboard** - Platform overview with key metrics
- **Admin Only Login** - Admin login with no signup option
- **Service Provider Portal** - Signup and login for service providers
- **User Management** - Manage all users on the platform (Admin only)
- **Hotel Management** - Manage hotel listings and bookings (Admin only)
- **Analytics Dashboard** - Detailed performance metrics and charts (Admin only)
- **Service Provider Features** - Manage properties and bookings
- **Role-based Access Control** - Separate access for Admin and Service Providers
- **No Traveller Access** - This portal is exclusive to Admin and Service Providers

## Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd admin
npm install
```

### Environment Configuration

Create a `.env` file in the root of the admin directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api/
VITE_APP_PORT=5174
```

### Development

```bash
npm run dev
```

The admin panel will run on `http://localhost:5174`

### Building

```bash
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

```
admin/
├── src/
│   ├── Components/          # Reusable components
│   │   ├── Sidebar.jsx
│   │   ├── AdminHeader.jsx
│   │   └── ProtectedRoute.jsx
│   ├── Pages/               # Page components
│   │   ├── Login.jsx        # Admin & Service Provider Login
│   │   ├── Signup.jsx       # Service Provider Signup (2-step)
│   │   ├── Dashboard.jsx    # Admin Dashboard
│   │   ├── Users/
│   │   ├── Hotels/
│   │   ├── Analytics/
│   │   └── ServiceProvider/
│   ├── Routes/              # Route configuration
│   ├── Store/               # Redux store
│   │   ├── Store.js
│   │   ├── AuthSlice.js
│   │   └── AdminDataSlice.js
│   ├── utils/               # Utility functions
│   │   ├── api.js
│   │   └── constants.js
│   ├── main.jsx             # App entry point
│   ├── App.jsx
│   ├── theme.js
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## Authentication

### User Roles
- **Admin** - Full access to all admin features (Login only, no signup)
- **Service Provider** - Can signup and login to manage properties and bookings

### Login Endpoints

**Admin Login:**
```
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

**Service Provider Login:**
```
POST /api/serviceprovider/login
Content-Type: application/json

{
  "email": "provider@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "email": "provider@example.com",
    "name": "Provider Name"
  }
}
```

### Service Provider Signup Endpoints

**Step 1 - Registration:**
```
POST /api/serviceprovider/register
Content-Type: application/json

{
  "name": "Provider Name",
  "email": "provider@example.com",
  "password": "password123",
  "businessName": "Business Name",
  "phone": "+91 XXXXXXXXXX",
  "businessType": "hotel" // hotel, resort, guesthouse, homestay, airbnb
}

Response:
{
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "email": "provider@example.com",
    "name": "Provider Name"
  }
}
```

## API Endpoints

### Admin Endpoints (Admin only)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/hotels` - List all hotels
- `POST /api/admin/hotels` - Create hotel
- `PUT /api/admin/hotels/:id` - Update hotel
- `DELETE /api/admin/hotels/:id` - Delete hotel
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/bookings` - List all bookings

### Service Provider Endpoints (Service Provider only)
- `GET /api/serviceprovider/dashboard` - Provider dashboard data
- `GET /api/serviceprovider/listings` - Provider's property listings
- `POST /api/serviceprovider/listings` - Create new listing
- `PUT /api/serviceprovider/listings/:id` - Update listing
- `DELETE /api/serviceprovider/listings/:id` - Delete listing
- `GET /api/serviceprovider/bookings` - Provider's bookings
- `PUT /api/serviceprovider/bookings/:id` - Update booking status

## Pages

### Admin Pages
- **Login Page** (/login) - Admin login only
- **Dashboard** (/dashboard) - Overview with metrics
- **User Management** (/users) - View and manage users
- **Hotel Management** (/hotels) - Manage hotel listings
- **Analytics** (/analytics) - Charts and performance metrics

### Service Provider Pages
- **Login/Signup** (/login, /signup) - Registration and login
- **Dashboard** (/provider) - Provider overview
- **Listings** (/provider/listings) - Manage properties
- **Bookings** (/provider/bookings) - View and manage bookings

## Technology Stack

- **React 18.3** - UI framework
- **Redux Toolkit 2.7** - State management
- **React Router 7.5** - Routing
- **Vite 6.0** - Build tool
- **Tailwind CSS 4.1** - Styling
- **MUI 6.4** - Component library
- **Recharts 2.12** - Charts and graphs
- **Axios 1.9** - HTTP client
- **Lucide React** - Icons

## Authentication Flow

### Admin Login Flow
1. User navigates to /login
2. Selects "Admin Login" tab
3. Enters email and password
4. System validates credentials via `POST /api/admin/login`
5. On success, stores JWT token and redirects to /dashboard
6. Token automatically added to all subsequent requests via axios interceptor

### Service Provider Flow
1. User navigates to /login and selects "Provider Login" OR goes to /signup
2. For signup: 2-step form (personal details → business details)
3. On signup, calls `POST /api/serviceprovider/register`
4. On login, calls `POST /api/serviceprovider/login`
5. Stores JWT token and redirects to /provider dashboard
6. Can manage properties and bookings from dashboard

## Security Features

- JWT token-based authentication
- Token stored in localStorage
- Automatic logout on 401 errors
- Role-based route protection
- Secure password handling with password visibility toggle
- CORS enabled with credentials

## Notes

- The admin app runs on port **5174** (different from frontend port 5173)
- Admin-only routes are protected and redirect to /login if accessed without proper role
- Service provider routes are protected and redirect to /login if accessed without authentication
- No traveller/user roles are allowed in this portal
- All requests automatically include Authorization header with JWT token

## Development Workflow

1. Admin login endpoint: `POST /api/admin/login`
2. Service provider signup endpoint: `POST /api/serviceprovider/register`
3. Service provider login endpoint: `POST /api/serviceprovider/login`
4. Create new pages in `src/Pages/`
5. Add routes in `src/Routes/index.jsx`
6. Update sidebar menu in `src/utils/constants.js`
7. Use Redux for state management with slices in `src/Store/`

## Production Build

```bash
npm run build
npm run preview
```

## License

© 2024 GoHomies. All rights reserved.
