import React, { useState } from "react";
import { useEffect } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import MyLink from "../components/ui/MyLink";
import { logout, tokenCheck } from "../features/auth/authActions";

function Layout() {
  const { loading, success, error, userToken, user, isLogedIn } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(tokenCheck());
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div>
      <div className="bg-lime-700 ">
        <nav className=" sm:container sm:mx-auto py-4 px-5  flex justify-center items-center gap-3 text-lime-100">
          <MyLink activeStyle="text-lime-950 font-semibold" className="" to="/">
            Home
          </MyLink>
          {isLogedIn && user.role === "ADMIN" && (
            <MyLink
              activeStyle="text-lime-950 font-semibold"
              className=""
              to="/update"
            >
              Update
            </MyLink>
          )}
          {isLogedIn && (
            <MyLink
              activeStyle="text-lime-950 font-semibold"
              className=""
              to="/words"
            >
              <div className="flex">Phonegon</div>
            </MyLink>
          )}
          {isLogedIn && (
            <MyLink
              activeStyle="text-lime-950 font-semibold"
              className=""
              to="/reader"
            >
              <div className="flex">Reader</div>
            </MyLink>
          )}
          {isLogedIn && (
            <MyLink
              activeStyle="text-lime-950 font-semibold"
              className=""
              to="/typing"
            >
              <div className="flex">Typing</div>
            </MyLink>
          )}
          {!isLogedIn && (
            <NavLink className=" ms-auto" to="/auth/login">
              Login
            </NavLink>
          )}
          {isLogedIn && (
            <NavLink
              onClick={() => logoutHandler()}
              className=" ms-auto flex items-center gap-2"
              to="/"
            >
              <p>{user.email.split("@")[0]}</p> <FaSignOutAlt />
            </NavLink>
          )}
        </nav>
      </div>
      <div className="sm:container sm:mx-auto">
        <Outlet />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"></div>
    </div>
  );
}

export default Layout;
