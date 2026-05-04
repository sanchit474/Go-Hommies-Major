export const ROLES = {
  ADMIN: 'admin',
  SERVICE_PROVIDER: 'service_provider',
};

export const API_ENDPOINTS = {
  AUTH: {
    ADMIN_LOGIN: 'admin/login',
    PROVIDER_LOGIN: 'serviceprovider/login',
    PROVIDER_REGISTER: 'serviceprovider/register',
  },
  ADMIN: {
    USERS: 'admin/users',
    HOTELS: 'admin/hotels',
    ANALYTICS: 'admin/analytics',
    BOOKINGS: 'admin/bookings',
  },
  SERVICE_PROVIDER: {
    LISTINGS: 'serviceprovider/listings',
    BOOKINGS: 'serviceprovider/bookings',
    DASHBOARD: 'serviceprovider/dashboard',
  },
};

export const MENU_ITEMS = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Users', path: '/users', icon: 'Users' },
    { label: 'Hotels', path: '/hotels', icon: 'Home' },
    { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  ],
  service_provider: [
    { label: 'Dashboard', path: '/provider', icon: 'LayoutDashboard' },
    { label: 'Listings', path: '/provider/listings', icon: 'Home' },
    { label: 'Bookings', path: '/provider/bookings', icon: 'Calendar' },
  ],
};

