import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import userDataReducer from "./userData/userDataSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    userData: userDataReducer,
  },
});

export default store;
