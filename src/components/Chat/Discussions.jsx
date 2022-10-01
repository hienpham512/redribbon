import React from "react";

const Discussions = ({ conversations, setChat, chat }) => {
  return (
    <>
      {conversations &&
        conversations.map((conversation, index) => {
          const { userInfo } = conversation;
          const { firstName, lastName, avatar } = userInfo;
          return (
            <div key={index} className="flex w-full relative group">
              <div
                className={`${
                  chat?.userInfo.id === userInfo.id
                    ? "text-red-500 font-semibold border-red-500"
                    : "text-gray-500  border-gray-200"
                } flex justify-center items-center px-2 py-2 w-full space-x-7 border-2 rounded-lg cursor-pointer transition-all ease-in-out hover:translate-x-2 duration-200`}
                onClick={() => setChat(conversation)}
              >
                <img
                  src={avatar ? avatar : "http://www.gravatar.com/avatar/?d=mp"}
                  alt="Avatar"
                  className="rounded-full h-8 w-8"
                />
                <p className="text-light  w-32">{`${firstName} ${lastName}`}</p>
              </div>
              <div
                className={`border-l-4 transition-all ease-in-out duration-20 border-red-500 rounded-lg w-3 h-full absolute right-0 -mr-6 ${
                  chat?.userInfo.id === userInfo.id
                    ? "scale-110"
                    : "scale-0 group-hover:scale-75"
                }`}
              ></div>
            </div>
          );
        })}
    </>
  );
};

export default Discussions;
