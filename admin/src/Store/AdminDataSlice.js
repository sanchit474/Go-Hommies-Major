import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  hotels: [],
  bookings: [],
  analytics: {
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeProviders: 0,
  },
  loading: false,
  error: null,
};

const AdminDataSlice = createSlice({
  name: 'adminData',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setHotels: (state, action) => {
      state.hotels = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUsers, setHotels, setBookings, setAnalytics, setLoading, setError } = AdminDataSlice.actions;
export default AdminDataSlice.reducer;
