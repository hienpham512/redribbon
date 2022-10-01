import { PaperAirplaneIcon } from "@heroicons/react/solid";
import React from "react";

const SendMessage = ({ text, setText, sendMessage }) => {
  return (
    <>
      <textarea
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 border border-gray-200 shadow-md rounded-lg w-full focus:outline-red-500 resize-none text-gray-500 font-light"
        placeholder="Send a message...."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        className="px-2 py-1 flex items-center justify-center hover:scale-110 transition-all ease-in-out duration-200"
        onClick={sendMessage}
      >
        <PaperAirplaneIcon className="rotate-90 h-8 text-red-500" />
      </button>
    </>
  );
};

export default SendMessage;
