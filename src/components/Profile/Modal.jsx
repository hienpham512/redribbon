import { format } from "date-fns";
import firebase from "firebase/app";
import React, { useEffect, useState } from "react";
import dbHelper from "../../firebase/dbHelper";
import { useAuth } from "../../hooks/useAuth";
import isValidDescription from "../../utils/isValidDescription";
import Lifestyle from "./Lifestyle";
import UploadImage from "./UploadImage";

const Modal = ({ closeModal, title }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    description: "",
    avatar: {},
    images: new Array(4),
  });
  const [isFilled, setIsFilled] = useState({
    avatar: true,
    images: true,
    general: true,
  });
  const { user: uid } = useAuth();

  const getZodiacByBirthdate = (birthdate) => {
    const date = format(birthdate, "L-d");
    const month = date.split("-")[0];
    const day = date.split("-")[1];
    const zodiac = [
      "capricorn",
      "aquarius",
      "pisces",
      "aries",
      "taurus",
      "gemini",
      "cancer",
      "leo",
      "virgo",
      "libra",
      "scorpio",
      "sagittarius",
    ];
    const idx = (month - 1 + (day > 20 ? 1 : 0)) % 12;
    return zodiac[idx];
  };

  useEffect(() => {
    const getUser = async () => {
      const data = await dbHelper.getRTDataFromCollection(
        "users",
        uid,
        (doc) => {
          const data = doc.data();
          setUser({
            ...data,
            zodiac: data?.birthdate
              ? getZodiacByBirthdate(
                  data.birthdate?.toMillis() ||
                    firebase.firestore.Timestamp.fromMillis(0)
                )
              : "",
          });
        }
      );
    };
    getUser();
  }, [uid]);

  const updateImages = async (image, pos) => {
    const imageUrl =
      pos === -1
        ? await dbHelper.addAvatarToStorage(uid, image)
        : await dbHelper.addImageToStorage(uid, image);
    console.log({ imageUrl });
    if (pos === -1) setUser({ ...user, avatar: imageUrl });
    else {
      const newImages = user.images?.slice() || [];
      newImages[pos] = imageUrl;
      setUser({ ...user, images: newImages });
    }
  };

  useEffect(() => {
    setIsFilled({
      avatar: !!user.avatar,
      general:
        !!user.birthdate &&
        !!user.lastName?.trim() &&
        !!user.firstName?.trim() &&
        ["male", "female"].includes(user.gender) &&
        isValidDescription(user.description?.trim()),
      images: user.images?.at(0) && user.images?.at(1),
    });
  }, [user]);

  return (
    <div className="justify-center bg-black/75 items-center flex overflow-x-hidden overflow-y-none fixed inset-0 z-50 outline-none focus:outline-none animate__animated animate__fadeIn">
      <div className="relative w-full my-6 mx-auto max-w-7xl h-full">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold">{title}</h3>
            <button
              className={`p-1 ml-auto bg-transparent border-0 text-black hover:opacity-50 float-right text-2xl leading-none font-semibold outline-none focus:outline-none ${
                Object.values(isFilled).some((v) => !v)
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={closeModal}
              disabled={Object.values(isFilled).some((v) => !v)}
            >
              ✕
            </button>
          </div>
          <form
            action=""
            onSubmit={async (e) => {
              e.preventDefault();
              const data = user;
              delete data.id;
              await dbHelper.updateDataToCollection("users", uid, data);
              closeModal();
            }}
          >
            <div
              id="edit-profile"
              className="relative p-6 flex space-x-10 justify-between"
            >
              <div className="flex flex-col space-y-5 w-full">
                {Object.values(isFilled).some((v) => !v) && (
                  <p className="mx-auto text-red-500 font-semibold">
                    Complete your profile to continue using Red Ribbon
                  </p>
                )}
                <div className="flex justify-between space-x-2">
                  <div
                    className={`flex justify-center items-center w-full ${
                      !isFilled.avatar
                        ? `border-2 p-2 border-red-500 rounded-lg`
                        : ``
                    }`}
                  >
                    <UploadImage
                      className="rounded-full object-cover shadow-md hover:opacity-70 cursor-pointer h-64 w-64"
                      type="avatar"
                      source={user.avatar}
                      setState={(avatar) => updateImages(avatar, -1)}
                    />
                  </div>
                  <div
                    className={`flex flex-col space-y-2 w-full ${
                      !isFilled.general
                        ? `border-2 p-2 border-red-500 rounded-lg`
                        : ``
                    }`}
                  >
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={user.firstName}
                        placeholder="First Name"
                        name="firstName"
                        onChange={(e) => {
                          setUser({ ...user, firstName: e.target.value });
                        }}
                        className="border border-gray-200 shadow-md rounded-lg py-1 px-2 font-light w-full"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={user.lastName}
                        name="lastName"
                        onChange={(e) =>
                          setUser({ ...user, lastName: e.target.value })
                        }
                        className="border border-gray-200 shadow-md rounded-lg py-1 px-2 font-light w-full"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={
                          user?.birthdate
                            ? format(user.birthdate.toMillis(), "yyyy-MM-dd")
                            : ""
                        }
                        max={format(
                          new Date().setFullYear(new Date().getFullYear() - 18),
                          "yyyy-MM-dd"
                        )}
                        className="border border-gray-200 shadow-md rounded-lg py-1 px-2 font-light w-full"
                        onChange={(e) => {
                          // input date to miliseconds
                          const date = new Date(e.target.value);
                          const miliseconds = date.getTime();
                          const birthdate =
                            firebase.firestore.Timestamp.fromMillis(
                              miliseconds
                            );
                          setUser({ ...user, birthdate });
                        }}
                      />
                      <select
                        name="gender"
                        value={user.gender}
                        onChange={(e) =>
                          setUser({ ...user, gender: e.target.value })
                        }
                        placeholder="Gender"
                        className="border border-gray-200 shadow-md rounded-lg py-1 px-2 font-light w-full"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <textarea
                      className="border border-gray-200 shadow-md rounded-lg py-1 px-2 font-light w-full resize-none"
                      cols="30"
                      style={{ height: "200px" }}
                      placeholder="About me"
                      maxLength={200}
                      value={user.description}
                      onChange={(e) =>
                        setUser({ ...user, description: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div
                  className={`grid grid-cols-2 gap-4 ${
                    !isFilled.images
                      ? `border-2 p-2 border-red-500 rounded-lg`
                      : ``
                  }`}
                >
                  <UploadImage
                    source={user.images?.at(0)}
                    className="rounded-lg shadow-md h-[12.5rem] w-80 object-cover hover:opacity-70 cursor-pointer"
                    type="image"
                    setState={(image) => updateImages(image, 0)}
                  />
                  <UploadImage
                    source={user.images?.at(1)}
                    className="rounded-lg shadow-md h-[12.5rem] w-80 object-cover hover:opacity-70 cursor-pointer"
                    type="image"
                    setState={(image) => updateImages(image, 1)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <UploadImage
                    source={user.images?.at(2)}
                    className="rounded-lg shadow-md h-[12.5rem] w-80 object-cover hover:opacity-70 cursor-pointer"
                    type="image"
                    setState={(image) => updateImages(image, 2)}
                  />
                  <UploadImage
                    source={user.images?.at(3)}
                    className="rounded-lg shadow-md h-[12.5rem] w-80 object-cover hover:opacity-70 cursor-pointer"
                    type="image"
                    setState={(image) => updateImages(image, 3)}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-[1.05rem] pb-2 w-full">
                <Lifestyle setUser={setUser} user={user} />
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className={`
                    font-bold 
                    focus:outline-none 
                    uppercase px-6 py-2 
                    text-sm outline-none 
                    mr-1 mb-1 ease-linear 
                    background-transparent 
                    transition-all duration-150
                    ${
                      Object.values(isFilled).some((v) => !v)
                        ? "opacity-50 cursor-not-allowed text-gray-500"
                        : "text-red-500 cursor-pointer"
                    }
                  `}
                type="button"
                disabled={Object.values(isFilled).some((v) => !v)}
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className={`
                    text-white font-bold
                    uppercase text-sm
                    px-6 py-3 rounded
                    shadow hover:shadow-lg
                    outline-none focus:outline-none
                    mr-1 mb-1 ease-linear
                    transition-all duration-150
                    ${
                      Object.values(isFilled).some((v) => !v)
                        ? "bg-gray-500 opacity-50 cursor-not-allowed "
                        : "bg-emerald-600 active:bg-emerald-600 cursor-pointer"
                    }
                  `}
                type="submit"
                disabled={Object.values(isFilled).some((v) => !v)}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
