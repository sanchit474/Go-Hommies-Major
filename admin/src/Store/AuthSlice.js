import { createSlice } from '@reduxjs/toolkit';

const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem('adminAuthToken');
  const role = localStorage.getItem('adminUserRole');

  if (!token || !role) {
    return null;
  }

  return {
    id: '',
    email: localStorage.getItem('adminUserEmail') || '',
    name: localStorage.getItem('adminUserName') || '',
    role,
    isAuthenticated: true,
    token,
  };
};

const initialState = {
  user: getStoredAuth() || {
    id: '',
    email: '',
    name: '',
    role: '', // admin or service_provider
    isAuthenticated: false,
    token: '',
  },
  loading: false,
  error: null,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = {
        ...action.payload,
        isAuthenticated: true,
      };
      state.error = null;
      localStorage.setItem('adminAuthToken', action.payload.token);
      localStorage.setItem('adminUserRole', action.payload.role);
      if (action.payload.name) localStorage.setItem('adminUserName', action.payload.name);
      if (action.payload.email) localStorage.setItem('adminUserEmail', action.payload.email);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = initialState.user;
      state.error = null;
      localStorage.removeItem('adminAuthToken');
      localStorage.removeItem('adminUserRole');
      localStorage.removeItem('adminUserName');
      localStorage.removeItem('adminUserEmail');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, setError } = AuthSlice.actions;
export default AuthSlice.reducer;

