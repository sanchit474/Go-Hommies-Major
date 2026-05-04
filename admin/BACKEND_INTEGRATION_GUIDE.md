# Quick Reference - Frontend to Backend Integration

## Login Form Flow

### Admin Login (Tab 1)
```
Input Fields:
- Email (required, type: email)
- Password (required, type: password)

Button Click: "Login"
↓
API Call: POST /api/admin/login
Body: {
  "email": "admin@gohomies.com",
  "password": "password123"
}
↓
Expected Response Success (200):
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "admin@gohomies.com",
    "name": "Admin Name"
  }
}
↓
Frontend Actions:
- Store token: localStorage.setItem('adminAuthToken', token)
- Store role: localStorage.setItem('adminUserRole', 'admin')
- Redirect to: /dashboard
↓
Expected Error (401):
{
  "success": false,
  "message": "Invalid email or password"
}
↓
Frontend Shows: Error message in red box
```

---

## Service Provider Login (Tab 2)
```
Input Fields:
- Email (required, type: email)
- Password (required, type: password)

Button Click: "Login"
↓
API Call: POST /api/serviceprovider/login
Body: {
  "email": "provider@hotel.com",
  "password": "password123"
}
↓
Expected Response Success (200):
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "provider_id",
    "email": "provider@hotel.com",
    "name": "Provider Name"
  }
}
↓
Frontend Actions:
- Store token: localStorage.setItem('adminAuthToken', token)
- Store role: localStorage.setItem('adminUserRole', 'service_provider')
- Redirect to: /provider
↓
Expected Error (401):
{
  "success": false,
  "message": "Invalid email or password"
}
↓
Frontend Shows: Error message in red box
```

---

## Service Provider Signup Flow

### Step 1: Personal Details Form
```
Input Fields:
- Full Name (required, type: text)
- Email (required, type: email)
- Password (required, min 6 chars, type: password)
- Confirm Password (required, must match password, type: password)

Button Click: "Next"
↓
Frontend Validation:
✓ Name not empty
✓ Email valid format
✓ Password length >= 6
✓ Password === Confirm Password
↓
If validation passes: Show Step 2
If validation fails: Show error message
```

### Step 2: Business Details Form
```
Input Fields:
- Business Name (required, type: text)
- Phone Number (required, min 10 chars, type: tel)
- Business Type (required, type: select)
  Options: hotel, resort, guesthouse, homestay, airbnb
- Terms & Conditions (required, type: checkbox)

Button Click: "Create Account"
↓
Frontend Validation:
✓ Business name not empty
✓ Phone number length >= 10
✓ Business type selected
✓ Terms checkbox checked
↓
If validation passes:
↓
API Call: POST /api/serviceprovider/register
Body: {
  "name": "John Doe",
  "email": "john@hotel.com",
  "password": "securepass123",
  "businessName": "Grand Hotel",
  "phone": "+919876543210",
  "businessType": "hotel",
  "role": "service_provider"
}
↓
Expected Response Success (201):
{
  "success": true,
  "message": "Account created successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "provider_id",
    "email": "john@hotel.com",
    "name": "John Doe",
    "role": "service_provider"
  }
}
↓
Frontend Actions:
- Store token: localStorage.setItem('adminAuthToken', token)
- Store role: localStorage.setItem('adminUserRole', 'service_provider')
- Redirect to: /provider
↓
Expected Errors:

Email Already Exists (409):
{
  "success": false,
  "message": "Email already registered"
}

Validation Error (400):
{
  "success": false,
  "message": "Invalid email format"
}

Backend Error (500):
{
  "success": false,
  "message": "Internal server error"
}
↓
Frontend Shows: Error message, allows user to fix and retry
```

---

## Token Usage in Subsequent Requests

```
All authenticated API requests automatically include:

Headers:
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

Example:
GET /api/admin/users
GET /api/admin/analytics
GET /api/serviceprovider/dashboard
etc.
```

---

## Logout

```
When logout button clicked:
↓
Frontend Actions:
- Clear token: localStorage.removeItem('adminAuthToken')
- Clear role: localStorage.removeItem('adminUserRole')
- Redirect to: /login

No API call needed for logout
```

---

## Error Handling

### Auto-Logout on 401
```
If any API request returns 401 Unauthorized:
↓
Frontend Actions:
- Clear token
- Redirect to /login
- User must login again
```

---

## Required Backend Response Format

ALL endpoints should return responses in this format:

```json
{
  "success": true/false,
  "message": "Optional message",
  "token": "jwt_token_if_applicable",
  "user": {
    "_id": "user_id",
    "email": "user_email",
    "name": "user_name",
    "role": "admin_or_service_provider"
  },
  "data": {}
}
```

---

## Important Notes

1. **No Traveller Users**: This admin panel is ONLY for:
   - Admins (role: "admin")
   - Service Providers (role: "service_provider")

2. **Token Storage**: Always use `adminAuthToken` and `adminUserRole` keys

3. **CORS**: Must allow requests from `http://localhost:5174`

4. **Password Hashing**: Passwords MUST be hashed (use bcrypt) before storing

5. **Email Validation**: Email should be validated and unique

6. **Role Assignment**: 
   - Admins: role must be "admin"
   - Service Providers: role must be "service_provider"

7. **No Signup for Admins**: Admin accounts must be created manually by superadmin

---

## Database Schema Example (Reference)

### Admin User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### Service Provider User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  businessName: String,
  businessType: String,
  role: "service_provider",
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing Data

Use these credentials for testing once backend is ready:

```
Admin:
Email: admin@gohomies.com
Password: AdminPass123

Service Provider (Test):
Email: test.provider@hotel.com
Password: ProviderPass123
Business: Test Hotel
Phone: +919876543210
Type: hotel
```
