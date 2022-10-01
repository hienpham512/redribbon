import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DatingCard from "../components/Dating/DatingCard";
import DatingModal from "../components/Dating/DatingModal";
import EventCard from "../components/Events/EventCard";
import Filter from "../components/Filter";
import dbHelper from "../firebase/dbHelper";
import { useAuth } from "../hooks/useAuth";
import { useDating } from "../hooks/useDating";
import firebase from "firebase/app";
import { firestore as db } from "../firebase/init";
import DatingMatchAlert from "../components/Dating/DatingMatchAlert";
import { format } from "date-fns";

const Dating = () => {
  const { user: uid } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [datingModalOpen, setDatingModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const { eventsUsers, likedUsers, matchedUsers } = useDating((state) =>
    setTimeout(() => {
      setIsLoaded(state);
    }, 200)
  );
  const [usersArray, setUsersArray] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const [matchedAlert, setMatchedAlert] = useState(false);
  const [otherUser, setOtherUser] = useState({});

  useEffect(() => {
    const getCurrentUser = () => {
      dbHelper.getRTDataFromCollection("users", uid, (doc) =>
        setCurrentUser(doc.data())
      );
    };
    getCurrentUser();
  }, []);

  const handleDatingModalClose = () => setDatingModalOpen(false);

  const handleLikedAction = async (otherId) => {
    const chatID = uuidv4();
    const otherUser = await dbHelper.getDocFromCollection("users", otherId);
    setOtherUser(otherUser);
    const otherUserLikedList = otherUser?.liked;
    const currentUserLikedList = currentUser?.liked;
    if (currentUserLikedList?.includes(otherId)) {
      await dbHelper.updateDataToCollection("users", uid, {
        liked: firebase.firestore.FieldValue.arrayRemove(otherId),
      });
    } else if (otherUserLikedList?.includes(uid)) {
      await dbHelper.updateDataToCollection("users", uid, {
        matched: firebase.firestore.FieldValue.arrayUnion({
          chatID: chatID,
          userID: otherId,
        }),
      });
      await dbHelper.updateDataToCollection("users", otherId, {
        matched: firebase.firestore.FieldValue.arrayUnion({
          chatID: chatID,
          userID: uid,
        }),
      });
      await dbHelper.setDataToCollection("chats", chatID, {
        chat: [],
      });
      await dbHelper.updateDataToCollection("users", uid, {
        liked: firebase.firestore.FieldValue.arrayRemove(otherId),
      });
      await dbHelper.updateDataToCollection("users", otherId, {
        liked: firebase.firestore.FieldValue.arrayRemove(uid),
      });
      setMatchedAlert(true);
      await db
        .collection("users")
        .doc(otherId)
        .collection("notifications")
        .add({
          read: false,
          matched: true,
          chatMessage: false,
          matchedFirstName: currentUser.firstName,
          matchedLastName: currentUser.lastName,
          matchedAvatar: currentUser.avatar,
        });
      await db.collection("users").doc(uid).collection("notifications").add({
        read: false,
        matched: true,
        chatMessage: false,
        matchedFirstName: otherUser.firstName,
        matchedLastName: otherUser.lastName,
        matchedAvatar: otherUser.avatar,
      });
    } else
      await dbHelper.updateDataToCollection("users", uid, {
        liked: firebase.firestore.FieldValue.arrayUnion(otherId),
      });
  };

  useEffect(() => {
    if (filter === "All" && eventsUsers) {
      setUsersArray(eventsUsers.filter(({ users }) => users.length > 0));
      setMessage("Nobody is interested in the events that you are, yet.");
    }
    if (filter === "Liked" && likedUsers) {
      setUsersArray(likedUsers.filter(({ users }) => users.length > 0));
      setMessage("You have not liked anybody, yet.");
    }
    if (filter === "Matched" && matchedUsers) {
      setUsersArray(matchedUsers.filter(({ users }) => users.length > 0));
      setMessage("You have no matches, yet.");
    }
    return () => {
      setUsersArray([]);
      setMessage("");
    };
  }, [filter, eventsUsers, likedUsers, matchedUsers]);

  return (
    <div className="p-5">
      <div className="flex py-2 space-x-3 text-xs ">
        {["All", "Liked", "Matched"].map((button) => (
          <Filter
            key={button}
            name={button}
            toggle={!filter.localeCompare(button)}
            onClick={() => setFilter(button)}
          />
        ))}
      </div>
      <div className="flex flex-col space-y-5 pt-5">
        {usersArray && usersArray.length !== 0 ? (
          usersArray?.map((event, index) => (
            <div
              className="flex space-x-10 items-center border border-gray-200 rounded-lg p-3 shadow-md mr-10"
              key={index}
            >
              <div className="w-96">
                <EventCard
                  post={event?.event}
                  isOrganiser={false}
                  userIsAdmin={false}
                />
              </div>
              <div className="flex overflow-x-scroll space-x-5 w-full px-5 py-2 scrollbar-hide">
                {event?.users &&
                  event?.users?.map(
                    (user, index) =>
                      user && (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedUser(user);
                            setDatingModalOpen(true);
                          }}
                        >
                          <DatingCard
                            otherId={user?.id}
                            description={user?.description}
                            avatar={user?.avatar}
                            name={`${user?.firstName} ${user?.lastName}`}
                            likedList={currentUser?.liked}
                            filter={filter}
                            handleLikedAction={handleLikedAction}
                            age={
                              ~~(
                                (Date.now() -
                                  +new Date(
                                    format(
                                      user?.birthdate.toMillis(),
                                      "yyyy-MM-dd"
                                    )
                                  )) /
                                31557600000
                              )
                            }
                          />
                        </div>
                      )
                  )}
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-3xl italic font-light">
            {isLoaded ? message : "Loading..."}
          </h1>
        )}
      </div>
      {datingModalOpen && (
        <DatingModal
          handleDatingModalClose={handleDatingModalClose}
          selectedImages={selectedUser?.images}
          profileData={selectedUser}
          isLiked={currentUser?.liked?.includes(selectedUser?.id)}
          isMatched={currentUser?.matched
            ?.map((el) => el.userID)
            .includes(selectedUser?.id)}
          handleLikedAction={handleLikedAction}
        />
      )}
      {matchedAlert && (
        <DatingMatchAlert
          otherUser={otherUser}
          setMatchedAlert={setMatchedAlert}
        />
      )}
    </div>
  );
};

export default Dating;
