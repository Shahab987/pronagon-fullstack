import { createSlice } from "@reduxjs/toolkit";
import { loadUserData, loadUserExams } from "./userDataActions";

const initialState = {
  loading: false,
  error: null,
  success: false,
  userData: {
    firstname: "",
    lastname: "",
    tel: "",
    birthday: "",
    id: "",
    userexams: "", //userexams contains a list of ids
    user_products: "",
    exam_result: "",
    meet_request: "",
    fullUserExams: [],
  },
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    unLoad: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.userData = {
        firstname: "",
        lastname: "",
        tel: "",
        birthday: "",
        id: "",
        userexams: "",
        user_products: "",
        exam_result: "",
        fullUserExams: [],
      };
    },
  },
  extraReducers: {
    [loadUserData.pending]: (state) => {
      state.loading = true;
    },
    [loadUserData.fulfilled]: (state, { payload }) => {
      state.userData = payload; // load successful
      state.success = true;
      state.loading = false;
      state.error = null;
    },
    [loadUserData.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.success = false;
    },
    [loadUserExams.pending]: (state) => {
      state.loading = true;
    },
    [loadUserExams.fulfilled]: (state, { payload }) => {
      state.userData.fullUserExams = payload; // load successful
      state.success = true;
      state.loading = false;
      state.error = null;
    },
    [loadUserExams.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.success = false;
    },
  },
});

export const { unLoad } = userDataSlice.actions;
export default userDataSlice.reducer;
