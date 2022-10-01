import React from "react";
import { useEvents } from "../../hooks/useEvents";
import OrganiserEvents from "./OrganiserEvents";
import { useAuth } from "../../hooks/useAuth";

const OrganiserApprovedEvents = () => {
  const { values } = useEvents();
  const { user: uid } = useAuth();

  const events = values.approvedEvents.filter(event => event.creater === uid);
  return <OrganiserEvents eventsArray={events} />;
};

export default OrganiserApprovedEvents;
