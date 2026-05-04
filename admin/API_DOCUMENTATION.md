# Admin Panel Authentication & API Guide

## Overview
The admin panel has been configured to support:
- **Admin Only**: Login (no signup)
- **Service Provider**: Both signup and login
- **No Traveller Access**: This portal is exclusively for admins and service providers

## Authentication Endpoints

### 1. Admin Login
**Endpoint:** `POST /api/admin/login`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id_123",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 2. Service Provider Login
**Endpoint:** `POST /api/serviceprovider/login`

**Request:**
```json
{
  "email": "provider@hotel.com",
  "password": "securepassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "provider_id_456",
    "email": "provider@hotel.com",
    "name": "Provider Name",
    "role": "service_provider"
  }
}
```

---

### 3. Service Provider Signup
**Endpoint:** `POST /api/serviceprovider/register`

**Request (2-Step Form):**
```json
{
  "name": "John Doe",
  "email": "john@hotel.com",
  "password": "securepassword123",
  "businessName": "Grand Hotel Pvt Ltd",
  "phone": "+91 9876543210",
  "businessType": "hotel"
}
```

**Business Types Allowed:**
- `hotel` - Hotel business
- `resort` - Resort business
- `guesthouse` - Guest house
- `homestay` - Homestay
- `airbnb` - Airbnb/Vacation Rental

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "provider_id_456",
    "email": "john@hotel.com",
    "name": "John Doe",
    "role": "service_provider",
    "businessName": "Grand Hotel Pvt Ltd",
    "phone": "+91 9876543210",
    "businessType": "hotel"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

## Navigation & Routing

### Login Page (`/login`)
- **Admin Tab**: Email + Password login only
- **Provider Tab**: Email + Password login
  - Link to signup for new providers

### Signup Page (`/signup`)
- **Step 1**: Personal Details (Name, Email, Password, Confirm Password)
- **Step 2**: Business Details (Business Name, Phone, Business Type)
- Creates account and auto-logs in

### Protected Routes

**Admin Routes (Require role: 'admin'):**
- `/dashboard` - Admin dashboard
- `/users` - User management
- `/hotels` - Hotel management
- `/analytics` - Analytics dashboard

**Service Provider Routes (Require role: 'service_provider'):**
- `/provider` - Provider dashboard
- `/provider/listings` - Manage properties
- `/provider/bookings` - Manage bookings

**Redirect Behavior:**
- Unauthenticated access → `/login`
- Wrong role access → `/unauthorized`
- Invalid path → `/unauthorized`

---

## Token Management

### Token Storage
```javascript
localStorage.setItem('adminAuthToken', token);
localStorage.setItem('adminUserRole', role);
```

### Token Usage
All API requests automatically include:
```
Authorization: Bearer <token>
```

### Logout
```javascript
// Removes token and role
localStorage.removeItem('adminAuthToken');
localStorage.removeItem('adminUserRole');
```

### Auto-Logout
On `401 Unauthorized` response, user is automatically redirected to `/login`

---

## Flow Diagrams

### Admin Login Flow
```
User → /login → Select "Admin Login"
  ↓
Enter credentials (email, password)
  ↓
POST /api/admin/login
  ↓
Validate credentials
  ├─ Success → Store token & role → Redirect to /dashboard
  └─ Fail → Show error message
```

### Service Provider Signup Flow
```
User → /login → "Create Service Provider Account" link
  ↓
/signup page - Step 1
  ├─ Enter name, email, password
  └─ Validate → Next
  ↓
/signup page - Step 2
  ├─ Enter business details
  └─ Validate → Submit
  ↓
POST /api/serviceprovider/register
  ├─ Success → Store token & role → Redirect to /provider
  └─ Fail → Show error, allow retry
```

### Service Provider Login Flow
```
User → /login → Select "Provider Login"
  ↓
Enter credentials (email, password)
  ↓
POST /api/serviceprovider/login
  ↓
Validate credentials
  ├─ Success → Store token & role → Redirect to /provider
  └─ Fail → Show error message
```

---

## Error Handling

### Common Error Codes

| Status | Error | Response |
|--------|-------|----------|
| 400 | Validation Error | `{ "success": false, "message": "Email is required" }` |
| 401 | Invalid Credentials | `{ "success": false, "message": "Invalid email or password" }` |
| 409 | Email Already Exists | `{ "success": false, "message": "Email already registered" }` |
| 500 | Server Error | `{ "success": false, "message": "Internal server error" }` |

### Frontend Error Messages
- "Login failed. Please try again."
- "Email already registered"
- "Invalid email or password"
- "Password must be at least 6 characters"
- "Passwords do not match"
- "Invalid phone number"

---

## Implementation Checklist for Backend

- [ ] Create `POST /api/admin/login` endpoint
- [ ] Create `POST /api/serviceprovider/register` endpoint
- [ ] Create `POST /api/serviceprovider/login` endpoint
- [ ] Implement JWT token generation
- [ ] Implement role-based authorization middleware
- [ ] Add password hashing (bcrypt)
- [ ] Add email validation
- [ ] Add phone number validation
- [ ] Add duplicate email check
- [ ] Implement refresh token logic (optional)
- [ ] Add rate limiting for login attempts
- [ ] Add email verification (optional)

---

## Testing Credentials (Mock)

Once backend is ready, you can test with:

**Admin:**
- Email: `admin@gohomies.com`
- Password: `AdminPass123`

**Service Provider:**
- Email: `provider@hotel.com`
- Password: `ProviderPass123`

---

## Notes for Backend Developer

1. Admin accounts should be created manually by superadmin (no signup endpoint)
2. Service provider registration should validate business type
3. Passwords should be hashed using bcrypt
4. JWT tokens should include role in payload
5. Add CORS headers for `http://localhost:5174`
6. Implement proper error messages (don't expose DB details)
7. Consider adding email confirmation before provider account activation
