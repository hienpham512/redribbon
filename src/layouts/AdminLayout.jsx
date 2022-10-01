import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useOutlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import {
  BadgeCheckIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import dbHelper from "../firebase/dbHelper";
const adminPages = [
  {
    label: "Pending",
    path: "pending-events",
    icon: <ExclamationCircleIcon className="h-5 col-span-4" />,
  },
  {
    label: "Approved",
    path: "approved-events",
    icon: <BadgeCheckIcon className="h-5 col-span-4" />,
  },
  {
    label: "Declined",
    path: "declined-events",
    icon: <XCircleIcon className="h-5 col-span-4" />,
  },
];

export const AdminLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate("/signin", { replace: true });
    const fetchUserData = async () => {
      const userData = await dbHelper.getDocFromCollection("users", user);
      if (userData?.organiser)
        navigate("/organiser/create-event", { replace: true });
      if (!userData?.admin) navigate("/dashboard/events", { replace: true });
      setLoading(false);
    };
    fetchUserData();
  }, []);

  return (
    !loading && (
      <div className="flex font-poppins">
        <Sidebar pages={adminPages} />
        <div className="container ml-[270px] h-screen w-full p-5">{outlet}</div>
      </div>
    )
  );
};
