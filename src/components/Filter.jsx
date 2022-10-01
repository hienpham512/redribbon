import { ArrowNarrowDownIcon, ArrowNarrowUpIcon } from "@heroicons/react/solid";
import React from "react";

const Filter = ({
  name,
  toggle = false,
  sortable = false,
  inverted = false,
  onClick,
}) => (
  <button
    onClick={() => onClick()}
    className={`flex items-center justify-center border border-red-500 shadow-md ${
      toggle ? "bg-red-500 text-white" : "text-red-500"
    } hover:opacity-80 py-1 px-3 rounded-lg transition-all duration-200 ease-in-out hover:translate-x-1`}
  >
    {name}
    {sortable &&
      (toggle ? (
        <ArrowNarrowDownIcon className="h-3" />
      ) : (
        <ArrowNarrowUpIcon className="h-3" />
      ))}
  </button>
);

export default Filter;
