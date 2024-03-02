import React from "react";
import { Outlet } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

function Auth() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default Auth;
