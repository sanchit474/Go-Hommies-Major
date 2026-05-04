import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
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

