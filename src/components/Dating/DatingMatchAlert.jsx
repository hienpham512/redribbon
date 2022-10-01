import React from "react";
import { SparklesIcon } from "@heroicons/react/solid";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const DatingMatchAlert = ({ otherUser, setMatchedAlert }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-lg">
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          tweenDuration={1000}
        />
        <div className="relative w-1/3 my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <SparklesIcon className="h-6 w-6 text-red-500" />
              <h3 className="text-3xl font-semibold">You found a match !</h3>
              <SparklesIcon className="h-6 w-6 text-red-500" />
            </div>
            <div className="relative p-6 flex justify-center">
              <div
                className={`w-72 h-full border shadow-gray-400 shadow-md rounded-2xl transition-all ease-in cursor-pointer hover:scale-105`}
              >
                <div className="m-2">
                  <div className="h-56 border border-white shadow-md shadow-gray-500 rounded-2xl">
                    <img
                      src={otherUser.avatar}
                      alt="Post"
                      className="object-cover rounded-2xl h-full w-full"
                    />
                  </div>
                  <div className="text-gray-500 leading-none text-sm font-light tracking-wider pt-8 pb-3 pl-1">
                    <p className="text-black font-semibold text-xl pb-2">
                      {otherUser.firstName} {otherUser.lastName}
                    </p>
                    {otherUser.description}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="border border-gray-200 shadow-md hover:bg-red-500 hover:text-white hover:font-bold text-red-500 hover:-translate-x-2 py-1 px-2 rounded-lg transition-all ease-in"
                onClick={() => setMatchedAlert(false)}
              >
                Close
              </button>
              <button
                className="border border-gray-200 shadow-md hover:bg-red-500 hover:text-white hover:font-bold text-red-500 hover:-translate-x-2 py-1 px-2 rounded-lg transition-all ease-in"
                onClick={() => navigate("/dashboard/chat")}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DatingMatchAlert;
