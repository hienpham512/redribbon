import React from "react";
import { useEvents } from "../../hooks/useEvents";
import Admin from "./Admin";

const PendingEvents = () => {
  const { values } = useEvents();
  return <Admin text="pending" eventsArray={values.pendingEvents} />;
};

export default PendingEvents;
