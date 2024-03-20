import { createSlice } from "@reduxjs/toolkit";

import { loginUser, registerUser, tokenCheck } from "./authActions";

const initialState = {
  loading: false,
  user: {},
  userToken: null,
  error: null,
  success: false,
  isLogedIn: false,
};
//HANDLE LOG OUT
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.user = {};
      state.userToken = null;
      state.error = null;
      state.isLogedIn = false;
      state.success = false;
    },
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.success = false;
      state.loading = true;
      state.error = null;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.success = true; // registration successful
      state.loading = false;
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [loginUser.pending]: (state) => {
      state.success = false;
      state.loading = true;
      state.error = null;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.success = true; // login successful
      state.loading = false;
      state.user = { id: payload.id, email: payload.email };
      state.userToken = payload.token;
      state.isLogedIn = true;
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.isLogedIn = false;
    },
    [tokenCheck.pending]: (state) => {
      state.success = false;
      state.loading = true;
      state.error = null;
    },
    [tokenCheck.fulfilled]: (state, { payload }) => {
      state.success = true; //token found
      state.loading = false;
      state.user = { id: payload.id, email: payload.email };
      state.userToken = payload.token;
      state.isLogedIn = true;
    },
    [tokenCheck.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.isLogedIn = false;
    },
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
