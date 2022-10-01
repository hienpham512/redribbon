/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import dbHelper from "../firebase/dbHelper";
import { useAuth } from "../hooks/useAuth";
import firebase from "firebase/app";
import Discussions from "../components/Chat/Discussions";
import ChatMessages from "../components/Chat/ChatMessages";
import SendMessage from "../components/Chat/SendMessage";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserMatched = async () => {
      let matchedArr = [];
      const matchedFirebase = await dbHelper.getDocFromCollection(
        "users",
        user
      );
      matchedArr = matchedFirebase.matched;
      matchedArr.forEach(async ({ chatID, userID }) => {
        const userInfo = await dbHelper.getDocFromCollection("users", userID);
        setConversations((prev) => [...prev, { userInfo, chatID }]);
      });
    };
    fetchUserMatched();
  }, []);

  const [chat, setChat] = useState();
  const [messages, setMessages] = useState();

  useEffect(() => {
    if (!chat) return;
    dbHelper.getRTDataFromCollection("chats", chat.chatID, (doc) => {
      setMessages(doc.data().chat);
    });
  }, [chat]);

  const [text, setText] = useState("");
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
    <div className="flex overflow-hidden h-full">
      <div
        className={`flex-1 flex ${
          chat?.userInfo
            ? "justify-between flex-col"
            : "justify-center items-center"
        }`}
      >
        {chat?.userInfo ? (
          <>
            <div className="overflow-y-scroll flex flex-col space-y-2 p-5 animate__animated animate__lightSpeedInRight animate__faster">
              <ChatMessages
                messages={messages}
                user={user}
                userAvatar={userAvatar}
                scrollRef={scrollRef}
                chat={chat}
              />
            </div>
            <div className="flex pb-2 px-2">
              <SendMessage
                text={text}
                setText={setText}
                sendMessage={sendMessage}
              />
            </div>
          </>
        ) : (
          <div className="animate__animated animate__bounce animate__infinite animate__slow">
            <p className="text-3xl text-gray-500 font-light">
              Please select a conversation to start chatting...
            </p>
          </div>
        )}
      </div>
      <div className="h-screen border border-gray-200 shadow-md rounded-lg overflow-y-scroll flex flex-col items-start p-5 space-y-5 w-[20vw]">
        <p className="text-2xl font-bold underline">Discussions</p>
        <Discussions
          setChat={setChat}
          chat={chat}
          conversations={conversations}
        />
      </div>
    </div>
  );
};

export default Chat;
