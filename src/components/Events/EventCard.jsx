import { CalendarIcon, TicketIcon } from "@heroicons/react/outline";
import React from "react";
import millisToDate from "../../utils/millisToDate";
import { PencilIcon } from "@heroicons/react/solid";

const EventCard = ({
  post,
  setShowModal,
  isOrganiser,
  handleEditEvent,
  userIsAdmin,
}) => {
  const {
    author,
    date,
    description,
    price: rawPrice,
    title,
    approved,
    declined,
  } = post;
  // price is rawPrice as cents to format euro€cents
  const price = [
    parseInt(rawPrice / 100),
    rawPrice % 100 < 10 ? `0${rawPrice % 100}` : rawPrice % 100,
  ];

  return (
    <div
      className={`w-full text-xs flex-col border border-gray-200 shadow-md rounded-lg relative p-2 transition-all duration-200 easie-in-out hover:scale-[1.04]`}
      onClick={() => {
        setShowModal(true);
      }}
    >
      <div className="relative">
        {(userIsAdmin || isOrganiser) && (
          <div
            className={`absolute px-2 py-1 
            ${
              approved
                ? "bg-green-500"
                : declined
                ? "bg-red-500"
                : "bg-yellow-500"
            } 
            rounded-lg left-0 text-white`}
          >
            {approved ? "Approved" : declined ? "Declined" : "Pending"}
          </div>
        )}
        <img
          src={
            post?.photo ? post?.photo : "https://picsum.photos/600/400/?random"
          }
          alt="Placeholder"
          className="object-cover h-40 w-full rounded-lg cursor-pointer"
        />
      </div>
      <div className="py-2 px-1 grid grid-cols-1 gap-3 cursor-pointer">
        <div className="flex justify-between">
          <p className="text-base font-semibold truncate">
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </p>
          <p className="text-base font-semibold truncate">
            {author[0].toUpperCase() + author.slice(1)}
          </p>
        </div>
        <div className="h-36 overflow-y-scroll scrollbar-hide mb-2">
          <p className="text-xs">{description}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-center space-x-2 shadow-md border border-gray-200 rounded-lg px-2 py-1">
            <CalendarIcon className="h-6" />
            <p className="text-md tracking-wide italic">
              {millisToDate(date?.toMillis())}
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2 shadow-md border border-gray-200 rounded-lg px-2 py-1">
            <TicketIcon className="h-6" />
            <p className="text-md italic tracking-wider">
              {price[0]}€<sup>{price[1]}</sup>
            </p>
          </div>
          <div>
            <div className="flex space-x-3">
              {isOrganiser ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditEvent(post, true, true);
                  }}
                  className="flex absolute top-0 right-0 space-x-1 border border-gray-200 shadow-md bg-red-500 text-white hover:translate-y-[-5px] py-2 px-3 rounded-lg col-span-2"
                >
                  Edit <PencilIcon className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
