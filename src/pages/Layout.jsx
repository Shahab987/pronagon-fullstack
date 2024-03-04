import React, { useState } from "react";
import { useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import { BASE_URL } from "../api/config";
import { tokenCheck } from "../features/auth/authActions";
import { logout } from "../features/auth/authSlice";

function Layout() {
  const { loading, success, error, userToken, user, isLogedIn } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(tokenCheck());
  }, []);

  const logoutHandler = () => {
    axiosApi
      .post(`${BASE_URL}/auth/logout`)
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.removeItem("token");
          dispatch(logout());
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <nav className="bg-lime-800 p-3 flex gap-3">
        <NavLink className="text-lime-100" to="/">
          Home
        </NavLink>
        {isLogedIn && (
          <NavLink className="text-lime-100" to="/words">
            Pronagon
          </NavLink>
        )}
        {!isLogedIn && (
          <NavLink className="text-lime-100 ms-auto" to="/Auth/login">
            Login
          </NavLink>
        )}
        {isLogedIn && (
          <NavLink
            onClick={() => logoutHandler()}
            className="text-lime-100 ms-auto flex items-center gap-2"
            to="/"
          >
            <p>Logout</p> <FaSignOutAlt />
          </NavLink>
        )}
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;
