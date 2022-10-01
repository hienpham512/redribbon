import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../../components/Events/EventCard";
import dbHelper from "../../firebase/dbHelper";
import { useAuth } from "../../hooks/useAuth";
import { useEvents } from "../../hooks/useEvents";
import EventModal from "../../components/Events/EventModal";
import { RefreshIcon } from "@heroicons/react/outline";

const Admin = ({ text, eventsArray }) => {
  const { values } = useEvents();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userIsAdmin, setUserIsAdmin] = useState();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const modalRef = useRef();

  const handleDecline = async (eventId) => {
    await dbHelper.updateDataToCollection("events", eventId, {
      declined: true,
      approved: false,
    });
    setShowEventModal(false);
  };

  const handleApprove = async (approved, eventId) => {
    if (approved) {
      await dbHelper.updateDataToCollection("events", eventId, {
        approved: true,
        declined: false,
      });
      setShowEventModal(false);
      return;
    }
    await dbHelper.updateDataToCollection("events", eventId, {
      declined: true,
      approved: false,
    });
    setShowEventModal(false);
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await dbHelper.getDocFromCollection("users", user);
      if (!userInfo?.admin) navigate("/dashboard/events", { replace: true });
      setUserIsAdmin(true);
    };
    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {values.loading ? (
        <div className="flex h-full items-center justify-center animate-spin">
          <RefreshIcon className="h-10 font-light" />
        </div>
      ) : values.props?.eventsArray?.length < 1 ? (
        <div className="animate__animated animate__bounce animate__infinite animate__slow h-full flex items-center justify-center">
          <p className="text-3xl font-light">No {text} events...</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {eventsArray?.map((post, index) => (
            <div key={index} onClick={() => setSelectedEvent(post)}>
              <EventCard
                post={post}
                setShowModal={setShowEventModal}
                userIsAdmin={userIsAdmin}
              />
            </div>
          ))}
        </div>
      )}
      <EventModal
        eventPostData={selectedEvent}
        setShowModal={setShowEventModal}
        showModal={showEventModal}
        modalRef={modalRef}
        userIsAdmin={userIsAdmin}
        handleDecline={handleDecline}
        handleApprove={handleApprove}
      />
    </>
  );
};

export default Admin;
