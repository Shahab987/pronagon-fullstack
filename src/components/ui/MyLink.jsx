import React from "react";
import { NavLink } from "react-router-dom";

function MyLink({ children, className, activeStyle, to }) {
  return (
    <NavLink
      className={({ isActive }) =>
        isActive ? className + " " + activeStyle : className
      }
      to={to}
    >
      {children}
    </NavLink>
  );
}

export default MyLink;
