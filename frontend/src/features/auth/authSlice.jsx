import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user') !== null ? localStorage.getItem('user') : null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAdmin = JSON.parse(action.payload.isAdmin);
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', action.payload.user);
      localStorage.setItem('isAdmin', JSON.parse(action.payload.isAdmin));
    },
    logOut: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
