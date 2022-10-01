import React from "react";

const DatingInfo = ({ profileData, title }) => {
  if (!profileData || profileData.length === 0) return;
  return (
    <div className="grid grid-cols-1 gap-2 p-2 shadow-md rounded-md border border-gray-200">
      <p className="font-bold text-black text-lg">{title} </p>
      <div className="grid grid-cols-3 gap-3">
        {profileData.map((data, index) => (
          <div
            key={index}
            className="shadow-md border border-gray-200 rounded-lg w-28 flex justify-center py-1 bg-white"
          >
            <p className="font-semibold text-red-500 text-sm cursor-pointer">
              {data}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatingInfo;
