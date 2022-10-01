import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

export const NavElement = ({ label, path, Icon }) => {
  const resolved = useResolvedPath(path);
  const match = useMatch({ path: resolved.pathname, end: true });
  return (
    <li className="flex group">
      <div
        className={`p-2 border-r-4 absolute left-0 h-full border-red-500 -ml-[1.72rem] transition-all ease-in duration-100 rounded-lg ${
          match ? "scale-105" : "group-hover:scale-90 scale-0"
        } `}
      ></div>
      <Link
        to={path}
        className="grid grid-cols-10 w-full items-center p-2 transform hover:translate-x-2 transition-transform ease-in duration-100 text-gray-500 hover:text-gray-800 border border-gray-200 shaodow-md rounded-lg ml-2"
        style={{
          color: match && "#f44336",
        }}
      >
        {Icon}
        <span className="text-md font-light col-span-6">{label}</span>
      </Link>
    </li>
  );
};
