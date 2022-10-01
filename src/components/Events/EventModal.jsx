import React from "react";
import millisToDate from "../../utils/millisToDate";
import {
  HeartIcon,
  CalendarIcon,
  LocationMarkerIcon,
  TicketIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { useAuth } from "../../hooks/useAuth";
import ArtistCard from "./ArtistCard";

const EventModal = ({
  showModal,
  eventPostData,
  setShowModal,
  modalRef,
  handleInterested,
  userIsAdmin,
  handleApprove,
  handleDecline,
}) => {
  const { user: uid } = useAuth();
  const priceToDisplay = [
    parseInt(eventPostData?.price / 100),
    eventPostData?.price % 100 < 10
      ? `0${eventPostData?.price % 100}`
      : eventPostData?.price % 100,
  ];
  return (
    <>
      {showModal && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-blur-md border border-gray-200 rounded-xl">
            <div
              className="relative w-auto my-auto mx-auto max-w-3xl px-16"
              ref={modalRef}
            >
              <div className="border-0 p-5 rounded-xl shadow-lg relative flex flex-col w-full bg-white scale-95">
                <img
                  className="h-60 w-full object-cover rounded-lg shadow-md"
                  src={
                    eventPostData?.photo
                      ? eventPostData?.photo
                      : "https://picsum.photos/600/400/?random"
                  }
                  alt="Event"
                />
                <div className="flex pt-5">
                  <div className="flex-col flex pl-3 font-light text-lg w-full">
                    <p className="font-bold text-3xl">
                      {eventPostData?.title.charAt(0).toUpperCase() +
                        eventPostData?.title.slice(1)}
                    </p>
                    <p className="text-sm">
                      by{" "}
                      <span className="font-bold">
                        {eventPostData?.author[0].toUpperCase() +
                          eventPostData?.author.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-end space-x-4">
                    {eventPostData?.artists?.map(({ name, photo }, index) => (
                      <ArtistCard name={name} photo={photo} key={index} />
                    ))}
                  </div>
                </div>
                <div className="p-3 my-5 overflow-y-scroll max-h-64 scrollbar-hide border-t-2 border-b-2 rounded-lg">
                  <p className="text-base leading-relaxed">
                    {eventPostData?.description}
                  </p>
                </div>
                <div className="flex space-x-2 my-1 px-3 justify-end">
                  {eventPostData?.moods.map((mood, index) => {
                    return (
                      <div
                        key={index}
                        className="border rounded-lg px-2 py-1 font-bold  text-center shadow-md"
                      >
                        <p className="text-xs italic">
                          {`# ${mood.toUpperCase()}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex w-full space-x-4 items-center px-3 py-4 pb-6">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5" />
                    <p className="pl-2 pt-1 text-sm font-semibold italic">
                      {millisToDate(eventPostData?.date?.toMillis())}
                    </p>
                  </div>
                  <div className="border-r-2 h-6"></div>
                  <div className="flex items-center">
                    <LocationMarkerIcon className="h-5" />
                    <p className="pl-2 pt-1 text-sm font-semibold italic">
                      {eventPostData?.location}
                    </p>
                  </div>
                  <div className="border-r-2 h-6"></div>
                  <div className="flex items-center">
                    <TicketIcon className="h-5" />
                    <p className="pl-2 pt-1 text-sm font-semibold italic">
                      {priceToDisplay[0]}€<sup>{priceToDisplay[1]}</sup>
                    </p>
                  </div>
                  {eventPostData?.approved && (
                    <>
                      <div className="border-r-2 h-6"></div>
                      <p className="font-semibold text-sm pt-1 italic">
                        {eventPostData?.usersInterested?.length} others
                        interested
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-6 justify-end px-6 rounded-b">
                  <button
                    className="border border-gray-200 shadow-md px-5 py-2 rounded-lg text-xs transition-all ease-in hover:bg-red-500 hover:text-white hover:font-semibold hover:-translate-x-2"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {userIsAdmin && !eventPostData?.declined ? (
                    <div className="flex space-x-6">
                      <button
                        className="border border-red-200 shadow-md py-2 px-5 text-xs rounded-lg transition-all ease-in hover:-translate-x-2 hover:bg-red-500 hover:text-white text-red-500 hover:font-semibold"
                        onClick={() =>
                          eventPostData?.approved
                            ? handleDecline(eventPostData?.id)
                            : handleApprove(false, eventPostData?.id)
                        }
                      >
                        Decline
                      </button>
                      {!eventPostData?.approved && (
                        <button
                          className="border border-green-200 shadow-md py-2 px-5 text-xs rounded-lg transition-all ease-in hover:-translate-x-2 hover:bg-green-500 hover:text-white text-green-500 hover:font-semibold"
                          onClick={() => handleApprove(true, eventPostData?.id)}
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  ) : (
                    !eventPostData?.declined && (
                      <button
                        className={`flex space-x-2 items-center border hover:font-bold border-gray-200 shadow-md px-2 py-1 rounded-lg text-xs transition-all ease-in hover:-translate-x-2 ${
                          !eventPostData?.usersInterested?.includes(uid)
                            ? "hover:bg-red-500 hover:text-white"
                            : "hover:bg-white hover:text-red-500 bg-red-500 text-white"
                        } group`}
                        onClick={() => {
                          handleInterested(
                            eventPostData,
                            !eventPostData?.usersInterested?.includes(uid)
                              ? false
                              : true
                          );
                          setShowModal(false);
                        }}
                      >
                        {!eventPostData?.usersInterested?.includes(uid) ? (
                          <>
                            <HeartIcon className="h-6 text-red-500 group-hover:text-white" />
                            <p>INTERESTED</p>
                          </>
                        ) : (
                          <>
                            <HeartIconSolid className="h-6 text-white group-hover:text-red-500" />
                            <p>UNINTERESTED</p>
                          </>
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EventModal;
