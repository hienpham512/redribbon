import dbHelper from "../../firebase/dbHelper";
import React, { useEffect, useState } from "react";
import { LIFESTYLE } from "../Profile/data";
import { ChatAlt2Icon, HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Zoom from "react-medium-image-zoom";

const DatingModal = ({
  handleDatingModalClose,
  selectedImages,
  profileData,
  isLiked,
  isMatched,
  handleLikedAction,
}) => {
  const [imageToDisplay, setImageToDisplay] = useState(selectedImages[0]);

  const LifestyleName = ({ name, value }) => {
    if (value === "undefined") return null;
    const data = LIFESTYLE.find((l) => l.id === name)?.values.find(
      (v) => v.value === value
    )?.name;
    return (
      <div className="border border-red-500 rounded-lg px-2 py-1 text-center shadow-md text-red-500">
        <p className="text-xs italic">#{data}</p>
      </div>
    );
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center space-x-4 p-5 border-b border-solid border-slate-200 rounded-t">
              <img
                src={profileData?.avatar}
                alt="Post"
                className="h-14 w-14 object-cover rounded-full"
              />
              <h3 className="text-2xl font-semibold">
                {`${profileData?.firstName} ${profileData?.lastName}, ${~~(
                  (Date.now() -
                    +new Date(
                      format(profileData?.birthdate.toMillis(), "yyyy-MM-dd")
                    )) /
                  31557600000
                )}`}
              </h3>
            </div>
            <div className="relative p-6 flex flex-col items-center">
              <div className="relative w-[35rem] my-5">
                <Zoom>
                  <img
                    src={imageToDisplay}
                    alt="Display"
                    className="h-72 w-full object-contain"
                  />
                </Zoom>
                {selectedImages && (
                  <div className="flex justify-center items-center space-x-1 pt-5 absolute bottom-1 w-full">
                    {selectedImages?.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => setImageToDisplay(image)}
                        className="transition-all ease-in hover:-translate-y-1 rounded-lg border-t border-b"
                      >
                        <div className=" rounded-lg border border-gray-700">
                          <img
                            key={index}
                            src={image}
                            alt="Post"
                            className="object-cover h-10 w-10 cursor-pointer shadow-md rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-b p-5 w-full flex justify-center text-base">
                <p>{profileData.description}</p>
              </div>
              <div className="w-full flex flex-wrap gap-2 justify-center px-4 my-5 font-semibold">
                {profileData?.lifestyle &&
                  Object.keys(profileData?.lifestyle).map((el, index) => {
                    return (
                      <LifestyleName
                        key={index}
                        name={el}
                        value={profileData?.lifestyle[el]}
                      />
                    );
                  })}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-5 p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="border px-2 py-1 rounded-lg text-red-500 tracking-wide transition-all ease-in hover:-translate-x-2 hover:bg-red-500 hover:text-white"
                type="button"
                onClick={handleDatingModalClose}
              >
                Close
              </button>
              {isMatched ? (
                <button
                  className="tracking-wide text-base flex space-x-2 items-center border border-gray-200 shadow-md px-2 py-1 rounded-lg transition-all  ease-in hover:bg-red-500 hover:text-white text-red-500 group hover:-translate-x-2"
                  onClick={() => navigate("/dashboard/chat")}
                >
                  <ChatAlt2Icon className="h-6 text-red-500 group-hover:text-white" />
                  <p>Message</p>
                </button>
              ) : (
                <button
                  className={`group flex space-x-2 items-center border border-gray-200 shadow-md px-2 py-1 rounded-lg transition-all duration-200 ease-in hover:-translate-x-2 ${
                    !isLiked
                      ? "hover:bg-red-500 hover:text-white"
                      : "hover:bg-white hover:text-black bg-red-500 text-white"
                  } group `}
                  onClick={() => {
                    handleLikedAction(profileData?.id);
                    handleDatingModalClose();
                  }}
                >
                  {!isLiked ? (
                    <div className="flex items-center space-x-2 tracking-wide text-base">
                      <HeartIcon className="h-6 text-red-500 group-hover:text-white" />
                      <p>Like</p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 tracking-wide text-base">
                      <HeartIconSolid className="h-6 text-white group-hover:text-red-500" />
                      <p>Dislike</p>
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default DatingModal;
