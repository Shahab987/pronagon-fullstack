import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
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
      </nav>
      <Outlet />
    </div>
  );
}

export default Layout;
