import { useEffect, useState } from "react";
import dbHelper from "../firebase/dbHelper";
import { firestore } from "../firebase/init";
import { useAuth } from "./useAuth";

export const useDating = (toggleLoaded) => {
  const { user: uid } = useAuth();
  const [eventsUsers, setEventsUsers] = useState([]);
  const [likedUsers, setLikedUsers] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);

  useEffect(() => {
    const fetchLikedEventsUnlikedUsers = async () => {
      firestore.collection("users").onSnapshot(async (snapshot) => {
        let likedEvents = [];
        let usersInterestedInEvent = [];
        const data = await dbHelper.getDocFromCollection("users", uid);
        likedEvents = data.events;
        await Promise.all(
          likedEvents?.map(async (event) => {
            const eventUsers = await dbHelper.getDocFromCollection(
              "events",
              event
            );
            const users = eventUsers?.usersInterested?.filter(
              (u) =>
                u !== uid &&
                !data?.liked?.includes(u) &&
                !data?.matched?.map((m) => m.userID).includes(u)
            );
            usersInterestedInEvent.push({
              event: await dbHelper.getDocFromCollection("events", event),
              users: await Promise.all(
                users?.map(async (user) => {
                  return await dbHelper.getDocFromCollection("users", user);
                })
              ),
            });
          })
        ).then(() => {
          toggleLoaded(true);
        });
        setEventsUsers(usersInterestedInEvent);
      });
    };

    fetchLikedEventsUnlikedUsers();
  }, []);

  useEffect(() => {
    const fetchLikedEventsLikedUsers = async () => {
      firestore.collection("users").onSnapshot(async (snapshot) => {
        let likedEvents = [];
        let usersInterestedInEvent = [];
        const data = await dbHelper.getDocFromCollection("users", uid);
        likedEvents = data.events;
        await Promise.all(
          likedEvents?.map(async (event) => {
            const eventUsers = await dbHelper.getDocFromCollection(
              "events",
              event
            );
            const users = eventUsers?.usersInterested?.filter(
              (u) => u !== uid && data?.liked?.includes(u)
            );
            usersInterestedInEvent.push({
              event: await dbHelper.getDocFromCollection("events", event),
              users: await Promise.all(
                users?.map(async (user) => {
                  return await dbHelper.getDocFromCollection("users", user);
                })
              ),
            });
          })
        ).then(() => {
          toggleLoaded(true);
        });
        setLikedUsers(usersInterestedInEvent);
      });
    };
    fetchLikedEventsLikedUsers();
  }, []);

  useEffect(() => {
    const fetchLikedEventsMatchedUsers = async () => {
      firestore.collection("users").onSnapshot(async (snapshot) => {
        let likedEvents = [];
        let usersInterestedInEvent = [];
        const data = await dbHelper.getDocFromCollection("users", uid);
        likedEvents = data.events;
        await Promise.all(
          likedEvents?.map(async (event) => {
            const eventUsers = await dbHelper.getDocFromCollection(
              "events",
              event
            );
            const users = eventUsers?.usersInterested?.filter(
              (u) =>
                u !== uid && data?.matched?.map((m) => m.userID).includes(u)
            );
            usersInterestedInEvent.push({
              event: await dbHelper.getDocFromCollection("events", event),
              users: await Promise.all(
                users?.map(async (user) => {
                  return await dbHelper.getDocFromCollection("users", user);
                })
              ),
            });
          })
        ).then(() => {
          toggleLoaded(true);
        });
        setMatchedUsers(usersInterestedInEvent);
      });
    };
    fetchLikedEventsMatchedUsers();
  }, []);

  return { eventsUsers, likedUsers, matchedUsers };
};
