import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducerSlice from './recipes/slice';
import filtersSlice from './filters/slice';
import authReducer from './auth/slice.js';
import { injectStore } from './index.js';

const userTransform = createTransform(
  (inboundState) => {
    if (typeof inboundState.user === 'string') {
      inboundState.user = JSON.parse(inboundState.user);
    }
    return inboundState;
  },
  (outboundState) => {
    if (typeof outboundState.user === 'object') {
      outboundState.user = JSON.stringify(outboundState.user);
    }
    return outboundState;
  },
  { whitelist: ['user'] }
);

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user', 'isLoggedIn'],
  transforms: [userTransform],
};

const store = configureStore({
  reducer: {
    recipes: reducerSlice,
    filters: filtersSlice,
    auth: persistReducer(authPersistConfig, authReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);
injectStore(store);
export { store, persistor };
