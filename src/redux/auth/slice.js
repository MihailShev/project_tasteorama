import { createSlice } from '@reduxjs/toolkit';
import {
  register,
  logIn,
  logOut,
  refresh,
  addFavorite,
  removeFavorite,
} from './operations.js';

const initialState = {
  user: {
    name: null,
    email: null,
    favorites: [],
  },
  token: null,
  isLoggedIn: false,
  error: null,
  isLoading: false,
  isRefreshing: false,
};

const formatUser = (user) => ({
  name: user?.name || null,
  email: user?.email || null,
  favorites: Array.isArray(user?.favorites) ? user.favorites : [],
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = formatUser(action.payload);
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    clearAuthError(state) {
      state.error = null;
    },
    logout() {
      return initialState;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = formatUser(action.payload.user);
        state.token = action.payload.token || null;
        state.isLoggedIn = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error =
          action.payload || action.error?.message || 'Something went wrong';
        state.isLoading = false;
      })
      .addCase(logIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.user = formatUser(action.payload.user);
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
        state.isLoading = false;
      })
      .addCase(logOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logOut.fulfilled, () => initialState)
      .addCase(logOut.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
        state.isLoading = false;
      })
      .addCase(refresh.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
        state.isRefreshing = false;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (!Array.isArray(state.user.favorites)) {
          state.user.favorites = [];
        }
        state.user.favorites.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.user.favorites = state.user.favorites.filter(
          (id) => id !== action.payload
        );
      }),
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
