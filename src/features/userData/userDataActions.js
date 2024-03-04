import { createAsyncThunk } from "@reduxjs/toolkit";

import { BASE_URL } from "../../api/config";

export const loadUserData = createAsyncThunk(
  "userData/loadUserData",
  async (id, { rejectWithValue }) => {
    return await fetch(`${BASE_URL}/api/users/userprofile.php?id=${id}`)
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response.ok) {
          return response.data;
        } else {
          return rejectWithValue(response.message);
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

export const loadUserExams = createAsyncThunk(
  "userData/loadUserExams",

  async (jsonUserExamIds, { rejectWithValue }) => {
    if (jsonUserExamIds !== "[]" || !jsonUserExamIds) {
      const data = new FormData();
      data.append("userexams", jsonUserExamIds);

      return await fetch(`${BASE_URL}/api/exam/examlist.php`, {
        method: "POST",
        body: data,
      })
        .then((res) => {
          return res.json();
        })
        .then((response) => {
          if (response.ok) {
            return response.data;
          } else {
            return rejectWithValue(response.message);
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
  }
);
