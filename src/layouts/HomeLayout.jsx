import React, { useEffect, useState } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import dbHelper from "../firebase/dbHelper";
import { useAuth } from "../hooks/useAuth";

export const HomeLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // navigate("/home", { replace: true });
      setLoading(false);
      return;
    }
    const fetchUserData = async () => {
      const userData = await dbHelper.getDocFromCollection("users", user);
      if (userData?.organiser)
        navigate("/organiser/create-event", { replace: true });
      else if (!userData?.organiser)
        navigate("/dashboard/events", { replace: true });
      else setLoading(false);
    };
    fetchUserData();
  }, []);

  return !loading && <div className="font-poppins">{outlet}</div>;
};
