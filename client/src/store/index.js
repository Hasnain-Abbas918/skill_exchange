import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bidReducer from './slices/bidSlice';
import chatReducer from './slices/chatSlice';
import exchangeReducer from './slices/exchangeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bids: bidReducer,
    chat: chatReducer,
    exchanges: exchangeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});