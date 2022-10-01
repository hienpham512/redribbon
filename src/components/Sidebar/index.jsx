import { PencilAltIcon } from "@heroicons/react/outline";
import { LogoutIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import logo from "../../assets/redRibbonLogo.png";
import dbHelper from "../../firebase/dbHelper";
import { useAuth } from "../../hooks/useAuth";
import isValidDescription from "../../utils/isValidDescription";
import Modal from "../Profile/Modal";
import { NavElement } from "./NavElement";

export const Sidebar = ({ pages }) => {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const { logout, user: uid } = useAuth();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [avatar, setAvatar] = useState("http://www.gravatar.com/avatar/?d=mp");
  const [isFilled, setIsFilled] = useState({
    avatar: true,
    images: true,
    general: true,
  });

  useEffect(() => {
    dbHelper.getRTDataFromCollection("users", uid, (snap) => {
      const data = snap.data();
      setUserData({ ...data });
      setUser(`${data.firstName} ${data.lastName}`);
      if (data.avatar) setAvatar(data.avatar);
      if (!data.organiser)
        setIsFilled({
          avatar: !!data.avatar,
          general:
            !!data?.birthdate?.toMillis() &&
            !!data?.firstName?.trim() &&
            !!data?.lastName?.trim() &&
            !!data?.description?.trim() &&
            ["male", "female"].includes(data?.gender),
          images: !!data.images?.at(0) && !!data.images?.at(1),
        });
    });
  }, [uid]);

  return (
    <>
      <div className="min-h-screen flex flex-row fixed bg-gray-100 shadow-lg">
        <div className="flex flex-col w-64 bg-white overflow-hidden">
          <div className="flex items-center justify-center ">
            <img src={logo} alt="Red Ribbon" className="h-48" />
          </div>
          <hr />
          {user && (
            <div className="py-4 px-1 flex items-center justify-around">
              <div className="flex items-center text-md text-gray-800 font-medium">
                <img
                  className="w-10 h-10 rounded-full border border-gray-500 mr-1"
                  src={avatar}
                  alt="Avatar"
                />
              </div>
              <p>{user}</p>
              <button
                type="button"
                className={userData.organiser ? "cursor-not-allowed group" : ""}
                disabled={userData.organiser}
                onClick={() => setShowModal(true)}
              >
                <PencilAltIcon className="h-5 w-5" />
                <div className="absolute z-50 border shadow-md w-full p-3 rounded-lg italic text-sm text-start scale-0 group-hover:scale-100 transition-all ease-in origin-top-left bg-red-500 text-white font-semibold">
                  Please contact the Red Ribbon team to change your profile
                  information.
                </div>
              </button>
            </div>
          )}
          <ul className="flex flex-col space-y-3 p-3">
            {pages.map((page, idx) => (
              <div key={idx} className="relative">
                <NavElement
                  label={page.label}
                  path={page.path}
                  Icon={page.icon}
                />
              </div>
            ))}
            <div onClick={logout}>
              <NavElement
                label="Logout"
                path=""
                Icon={<LogoutIcon className="h-5 col-span-4" />}
              />
            </div>
          </ul>
        </div>
      </div>
      {(showModal || Object.values(isFilled).some((v) => !v)) && (
        <Modal closeModal={closeModal} title="Edit profile" />
      )}
    </>
  );
};
