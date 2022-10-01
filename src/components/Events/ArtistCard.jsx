import React from "react";

const ArtistCard = ({ name, photo }) => {
  return (
    <div className="flex flex-col space-y-1">
      <img
        className="w-14 h-14 object-cover rounded-full border border-gray-200 shadow-md"
        src={photo ? photo : "http://www.gravatar.com/avatar/?d=mp"}
        alt=""
      />
      <div className="w-auto">
        <p className="text-xs">{name && name}</p>
      </div>
    </div>
  );
};

export default ArtistCard;
