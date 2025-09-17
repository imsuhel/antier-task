import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import { productsApi } from '../api/productsApi';
import productsReducer from './slices/productsSlice';
import uiReducer from './slices/uiSlice';
import storageService from '../utils/storage';

// Define the root state type
export type RootState = {
  products: ReturnType<typeof productsReducer>;
  ui: ReturnType<typeof uiReducer>;
  [productsApi.reducerPath]: ReturnType<typeof productsApi.reducer>;
  _persist?: {
    version: number;
    rehydrated: boolean;
  };
};

export type AppDispatch = ReturnType<typeof createStore>['store']['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

function createStore() {
  // Use our storage service which has built-in error handling and fallback
  const reduxMmkvStorage = {
    setItem: (key: string, value: string) => storageService.setItem(key, value),
    getItem: (key: string) => storageService.getItem(key),
    removeItem: (key: string) => storageService.removeItem(key),
  };

  const rootReducer = combineReducers({
    products: productsReducer,
    ui: uiReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  });

  // Define the persist config with migrations
  const persistConfig = {
    key: 'root',
    storage: reduxMmkvStorage,
    whitelist: ['products'],
    version: 1,
    migrate: createMigrate({
      // Add migration functions here if needed
    }),
    // Add timeout to prevent hanging
    timeout: 10000, // 10 seconds
  };

  // Create the persisted reducer
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  // Configure the store with middleware
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/FLUSH'],
          ignoredPaths: ['register', 'rehydrate'],
        },
        immutableCheck: {
          warnAfter: 1000, // Increase warning threshold
        },
      }).concat(productsApi.middleware),
    devTools: __DEV__, // Only enable dev tools in development
  });

  // Setup RTK Query listeners
  setupListeners(store.dispatch);

  const persistor = persistStore(store);

  return { store, persistor };
}

// Create and export the store instance
export const { store, persistor } = createStore();
