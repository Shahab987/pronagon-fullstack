import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import { BASE_URL } from "../api/config";

function Layout() {
  const logout = () => {
    axiosApi
      .post(`${BASE_URL}/auth/logout`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <nav className="bg-lime-800 p-3 flex gap-3">
        <NavLink className="text-lime-100" to="/">
          Home
        </NavLink>
        <NavLink className="text-lime-100" to="/words">
          Pronagon
        </NavLink>
        <NavLink className="text-lime-100 ms-auto" to="/Auth/login">
          Login
        </NavLink>
        <NavLink
          onClick={() => logout()}
          className="text-lime-100 ms-auto"
          to="/"
        >
          logOut
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;
