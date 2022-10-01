import React from "react";
import { useEvents } from "../../hooks/useEvents";
import Admin from "./Admin";

const DeclinedEvents = () => {
  const { values } = useEvents();
  return <Admin text="declined" eventsArray={values.declinedEvents} />;
};

export default DeclinedEvents;
