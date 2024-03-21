import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosApi from "../../api/axiosApi";

import { BASE_URL } from "../../api/config";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    return await axiosApi
      .post(`${BASE_URL}/auth/register`, formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          return res.data;
        } else {
          return rejectWithValue(res.message);
          // Login failed
          // Show error message
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      });
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    return await axiosApi
      .post(`${BASE_URL}/auth/login`, formData)
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem("token", res.data.token);
          toast.success(res.data.message);
          console.log(res.data);
          return res.data;
        } else {
          return rejectWithValue(res.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
          return rejectWithValue(error.response.data.message);
        } else {
          console.log(error);
          return rejectWithValue(error.message);
        }
      });
  }
);

export const tokenCheck = createAsyncThunk(
  "auth/tokenCheck",
  async (credentials, { rejectWithValue }) => {
    return await axiosApi
      .post(`${BASE_URL}/auth/checkToken`)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          sessionStorage.setItem("token", res.data.token);
          toast.success(res.data.message);
          return res.data;
        } else {
          return rejectWithValue(res.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      });
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (credentials, { rejectWithValue }) => {
    return await axiosApi
      .post(`${BASE_URL}/auth/logout`)
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.removeItem("token");
          return true;
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      });
  }
);
