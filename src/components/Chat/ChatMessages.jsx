import React from "react";

const ChatMessages = ({ messages, user, userAvatar, scrollRef, chat }) => {
  return (
    <>
      {messages &&
        messages.map((data, index) => {
          const { message, sender } = data;
          return (
            <div
              className={`flex ${
                sender === user ? "justify-start" : "justify-end"
              }`}
              key={index}
            >
              <div className="flex space-x-3 items-center">
                {sender === user && (
                  <img
                    src={
                      userAvatar
                        ? userAvatar
                        : "http://www.gravatar.com/avatar/?d=mp"
                    }
                    alt="Avatar"
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <p
                  className={`${
                    user === sender ? " bg-red-500 text-white" : "text-gray-500"
                  } shadow-md border border-gray-200 p-2 rounded-lg font-light `}
                >
                  {message}
                </p>
                {sender !== user && (
                  <img
                    src={
                      chat.userInfo.avatar
                        ? chat.userInfo.avatar
                        : "http://www.gravatar.com/avatar/?d=mp"
                    }
                    alt="Avatar"
                    className="h-12 w-12 rounded-full"
                  />
                )}
              </div>
            </div>
          );
        })}
      <div ref={scrollRef}></div>
    </>
  );
};

export default ChatMessages;
