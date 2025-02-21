import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
  },
});