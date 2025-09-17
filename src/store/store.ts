import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { productsApi } from '../api/productsApi';
import productsReducer from './slices/productsSlice';
import uiReducer from './slices/uiSlice';

// Define the root state type
export type RootState = {
  products: ReturnType<typeof productsReducer>;
  ui: ReturnType<typeof uiReducer>;
  [productsApi.reducerPath]: ReturnType<typeof productsApi.reducer>;
};

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

const rootReducer = combineReducers({
  products: productsReducer,
  ui: uiReducer,
  [productsApi.reducerPath]: productsApi.reducer,
});

// Configure the store with middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: {
        warnAfter: 1000, // Increase warning threshold
      },
    }).concat(productsApi.middleware),
  devTools: __DEV__, // Only enable dev tools in development
});

// Setup RTK Query listeners
setupListeners(store.dispatch);

// Export the store instance
export { store };
