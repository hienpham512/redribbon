import { useEffect, useState } from "react";
import { firestore } from "../firebase/init";

export const useEvents = () => {
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [declinedEvents, setDeclinedEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);

  useEffect(() => {
    const fetchAllEvents = () => {
      firestore.collection("events").onSnapshot((snapshot) => {
        let events = [];
        snapshot.docs.forEach((doc) => events.push(doc.data()));
        setPendingEvents(
          events.filter((event) => !event.approved && !event.declined)
        );
        setDeclinedEvents(
          events.filter((event) => event.declined && !event.approved)
        );
        setApprovedEvents(
          events.filter((event) => event.approved && !event.declined)
        );
        setAllEvents(events);
        setLoading(false);
      });
    };
    fetchAllEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    values: {
      pendingEvents,
      declinedEvents,
      approvedEvents,
      allEvents,
      loading,
    },
  };
};
