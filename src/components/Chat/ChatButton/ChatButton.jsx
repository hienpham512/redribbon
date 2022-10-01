import React, { useEffect, useRef, useState } from "react";
import { ChatAlt2Icon, ArrowLeftIcon } from "@heroicons/react/solid";
import Draggable from "react-draggable";
import dbHelper from "../../../firebase/dbHelper";
import { useAuth } from "../../../hooks/useAuth";
import firebase from "firebase/app";
import Discussions from "../Discussions";
import ChatMessages from "../ChatMessages";
import SendMessage from "../SendMessage";

const ChatButton = () => {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <Draggable axis="both" bounds="parent">
      <div className="fixed top-2 right-4 flex flex-col items-end z-50">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="shadow-md rounded-full p-2 bg-red-500 transition-all duration-300 ease-in-out hover:translate-x-2"
        >
          <ChatAlt2Icon className="h-8 w-8 text-white" />
        </button>
        <div
          className={`${
            chatOpen
              ? "animate__animated animate__fadeInRight animate__faster"
              : "hidden"
          } border border-gray-200 shadow-md origin-top-right rounded-lg h-[75vh] w-[25vw] bg-white overflow-y-scroll`}
        >
          <ChatButtonContent />
        </div>
      </div>
    </Draggable>
  );
};

const ChatButtonContent = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    dbHelper.getRTDataFromCollection("users", user, (doc) => {
      const matchedArr = doc.data().matched;
      const conversationsArr = [];
      matchedArr?.forEach(async ({ userID, chatID }) => {
        const userInfo = await dbHelper.getDocFromCollection("users", userID);
        conversationsArr.push({ userInfo, chatID });
      });
      setConversations(conversationsArr);
    });
  }, []);

  const [chat, setChat] = useState();
  const [messages, setMessages] = useState();

  useEffect(() => {
    if (!chat) return;
    dbHelper.getRTDataFromCollection("chats", chat.chatID, (doc) => {
      setMessages(doc.data().chat);
    });
  }, [chat]);

  const [text, setText] = useState();

  const sendMessage = async () => {
    if (text === "" || text.indexOf(" ") === 0 || !text) return;
    await dbHelper.updateDataToCollection("chats", chat.chatID, {
      chat: firebase.firestore.FieldValue.arrayUnion({
        message: text,
        sender: user,
        time: firebase.firestore.Timestamp.now(),
      }),
    });
    setText("");
  };

  const scrollRef = useRef();

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [userAvatar, setUserAvatar] = useState();

  useEffect(() => {
    const getUserAvatar = async () => {
      const userData = await dbHelper.getDocFromCollection("users", user);
      setUserAvatar(userData.avatar);
    };
    getUserAvatar();
  }, []);

  return (
    <>
      {!chat ? (
        <div className="flex flex-col justify-start px-5 py-2 animate__animated animate__fadeInRight animate__faster">
          <p className="font-bold text-lg pb-3 underline">Discussions</p>
          <div className="flex flex-col space-y-3">
            <Discussions
              chat={chat}
              setChat={setChat}
              conversations={conversations}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-hidden animate__animated animate__fadeInLeft animate__faster">
          <div className="flex items-center border-b-2 border-gray-200 pb-2 w-full shadow-md p-2">
            <button onClick={() => setChat()}>
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center w-full justify-center space-x-2">
              <img
                src={
                  chat.userInfo.avatar
                    ? chat.userInfo.avatar
                    : "http://www.gravatar.com/avatar/?d=mp"
                }
                alt="Avatar"
                className="h-8 w-8 rounded-full object-contain"
              />
              <p className="font-light text-gray-500">{`${chat.userInfo.firstName} ${chat.userInfo.lastName}`}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between h-full overflow-hidden">
            <div className="h-full overflow-y-scroll flex flex-col space-y-3 p-3">
              <ChatMessages
                messages={messages}
                user={user}
                userAvatar={userAvatar}
                scrollRef={scrollRef}
                chat={chat}
              />
            </div>
            <div className="flex items-center p-2">
              <SendMessage
                text={text}
                setText={setText}
                sendMessage={sendMessage}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
