import React from "react";
import { HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";

const DatingCard = ({
  filter,
  otherId,
  description,
  avatar,
  name,
  handleLikedAction,
  likedList,
  age,
}) => {
  return (
    <div
      className={`w-72 h-full border shadow-gray-400 shadow-md rounded-2xl relative transition-all ease-in cursor-pointer hover:translate-x-2`}
    >
      <div className="m-2">
        <div className="h-56 border border-white shadow-md shadow-gray-500 rounded-2xl">
          <img
            src={avatar}
            alt="Post"
            className="object-cover rounded-2xl h-full w-full"
          />
        </div>
        {filter !== "Matched" && (
          <div className="flex space-x-2 absolute -m-7 ml-4">
            <div
              className={`bg-white ${
                likedList?.includes(otherId)
                  ? "text-white bg-red-600 hover:text-red-500 hover:bg-white "
                  : "text-red-500 hover:bg-red-500 hover:text-white"
              }  shadow-gray-400 shadow-md w-12 h-10 rounded-2xl flex items-center justify-center mt-2 transition-all ease-in-out duration-500 hover:mt-0 cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                handleLikedAction(otherId);
              }}
            >
              {likedList?.includes(otherId) ? (
                <HeartIconSolid className="w-6" />
              ) : (
                <HeartIcon className="w-6" />
              )}
            </div>
          </div>
        )}
        <div className="text-gray-500 leading-none text-sm font-light tracking-wider pt-8 pb-3 pl-1">
          <p className="text-black font-semibold text-xl pb-2">
            {name}, {age}
          </p>
          {description}
        </div>
      </div>
    </div>
  );
};

export default DatingCard;
