import React from "react";
import { Outlet } from "react-router-dom";
import MyLink from "../components/ui/MyLink";

function Reader() {
  return (
    <div className="p-2">
      <div className=" ps-3 flex gap-2 border-b text-stone-500">
        <MyLink
          activeStyle="text-lime-600 bg-stone-50 border-stone-300"
          className="rounded-t-lg border border-b-0 px-2 py-1 font-semibold "
          to="list"
        >
          Essay List
        </MyLink>
        <MyLink
          activeStyle="text-lime-600 bg-stone-50 border-stone-300"
          className="rounded-t-lg border border-b-0 px-2 py-1 font-semibold "
          to="add-essay"
        >
          Add Essay
        </MyLink>
      </div>

      <Outlet />
    </div>
  );
}

export default Reader;
