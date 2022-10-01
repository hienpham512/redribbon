import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { BellIcon } from "@heroicons/react/solid";
import { firestore as db } from "../firebase/init";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const NotificationButton = () => {
  const { user: uid } = useAuth();
  const [notificationButtonOpen, setNotificationButtonOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    db.collection(`users/${uid}/notifications`).onSnapshot((doc) => {
      const notificationsToFetch = [];
      let notificationsReadCount = 0;
      doc.forEach((fetchedNotifications) =>
        notificationsToFetch.push({
          ...fetchedNotifications.data(),
          id: fetchedNotifications.id,
        })
      );
      setNotifications(notificationsToFetch);
      notificationsToFetch
        .filter((notification) => notification.read === false)
        .forEach((notification) => (notificationsReadCount += 1));
      setNewNotificationsCount(notificationsReadCount);
    });
  }, []);

  const setRead = async (notificationId) => {
    db.collection(`users/${uid}/notifications`).doc(notificationId).update({
      read: true,
    });
  };

  return (
    <Draggable axis="both" bounds="parent">
      <div className="fixed top-16 right-4 flex flex-col items-end z-50">
        <button
          onClick={() => setNotificationButtonOpen(!notificationButtonOpen)}
          className="shadow-md rounded-full p-2 bg-red-500 transition-all ease-in hover:translate-x-2"
        >
          {newNotificationsCount > 0 && !notificationButtonOpen && (
            <div className="absolute -bottom-2 -right-2 border text-center bg-red-500 text-white rounded-full w-6 z-50">
              {newNotificationsCount}
            </div>
          )}

          <BellIcon className="h-8 w-8 text-white" />
        </button>
        <div
          className={`${
            notificationButtonOpen
              ? "animate__animated animate__fadeInRight animate__faster"
              : "hidden"
          } border border-gray-200 shadow-md origin-top-right rounded-lg h-[75vh] w-[25vw] bg-white overflow-y-scroll scrollbar-hide`}
        >
          <div className="flex justify-start px-5 py-2">
            <p className="text-lg font-bold underline">Notifications</p>
          </div>
          <div className="flex flex-col px-5 py-4 space-y-5">
            {notifications &&
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`w-full px-2 py-1 border shadow-md rounded-lg ${
                    !notification.read
                      ? "bg-red-500 text-white font-semibold"
                      : ""
                  } transition-all ease-in hover:translate-x-2 cursor-pointer`}
                  onClick={() => {
                    navigate("/dashboard/chat");
                    setNotificationButtonOpen(!notificationButtonOpen);
                    setRead(notification.id);
                  }}
                >
                  {notification.matched && (
                    <div className="flex items-center space-x-4 text-xs">
                      <img
                        src={notification.matchedAvatar}
                        alt="Avatar"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex flex-col space-y-1">
                        <p>Congratulations! You matched with</p>
                        <p className="font-bold italic">{` ${notification.matchedFirstName} ${notification.matchedLastName}`}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default NotificationButton;
