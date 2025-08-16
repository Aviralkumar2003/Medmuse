import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import symptomSlice from './slices/symptomSlice';
import symptomEntrySlice from './slices/symptomEntrySlice';
import reportSlice from './slices/reportSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    symptoms: symptomSlice,
    symptomEntries: symptomEntrySlice,
    reports: reportSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;