import React from "react";
import { useEvents } from "../../hooks/useEvents";
import Admin from "./Admin";

const ApprovedEvents = () => {
  const { values } = useEvents();
  return <Admin text="approved" eventsArray={values.approvedEvents} />;
};

export default ApprovedEvents;
