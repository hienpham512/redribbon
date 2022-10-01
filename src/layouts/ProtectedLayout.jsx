import React, { useEffect, useState } from "react";
import { useLocation, useOutlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { CalendarIcon, HeartIcon, ChatAltIcon } from "@heroicons/react/solid";
import ChatButton from "../components/Chat/ChatButton/ChatButton";
import NotificationButton from "../components/NotificationButton";
import dbHelper from "../firebase/dbHelper";

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();
  let location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate("/signin", { replace: true });
    const fetchUserData = async () => {
      const userData = await dbHelper.getDocFromCollection("users", user);
      if (userData?.organiser)
        navigate("/organiser/create-event", { replace: true });
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const pages = [
    {
      label: "Events",
      path: "events",
      icon: <CalendarIcon className="h-5 col-span-4" />,
    },
    {
      label: "Dating",
      path: "dating",
      icon: <HeartIcon className="h-5 col-span-4" />,
    },
    {
      label: "Chat",
      path: "chat",
      icon: <ChatAltIcon className="h-5 col-span-4" />,
    },
  ];

  return (
    !loading && (
      <div className="flex font-poppins">
        {location.pathname !== "/dashboard/chat" &&
          location.pathname !== "/dashboard/admin" && <ChatButton />}
        <NotificationButton />
        <Sidebar pages={pages} />
        <div className="container ml-[270px] h-screen w-full">{outlet}</div>
      </div>
    )
  );
};
