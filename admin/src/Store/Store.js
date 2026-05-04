import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './AuthSlice';
import AdminDataSlice from './AdminDataSlice';

export const Store = configureStore({
  reducer: {
    auth: AuthSlice,
    adminData: AdminDataSlice,
  },
});
