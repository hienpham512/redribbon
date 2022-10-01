/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { XIcon, CheckIcon } from "@heroicons/react/solid";
import dbHelper from "../../firebase/dbHelper";
import { useAuth } from "../../hooks/useAuth";
import firebase from "firebase/app";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const CreateEvent = () => {
  const eventID = uuidv4();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);

  const [artists, setArtists] = useState([]);
  const [artistName, setArtistName] = useState("");
  const [artistPhoto, setArtistPhoto] = useState(null);

  const [moods, setMoods] = useState([]);
  const [isOpenMoodsDropdown, setIsOpenMoodsDropdown] = useState(false);

  const { user: uid } = useAuth();

  const addPhotoRef = useRef();
  const addArtistPhotoRef = useRef();
  const navigate = useNavigate();

  const moodsArray = [
    "dance",
    "R&B",
    "rock",
    "metal",
    "house",
    "tech house",
    "techno",
    "deep tech house",
    "hard house",
    "afro",
    "afro beat",
    "dark electro-industrial",
    "dark minimal techno",
    "dark progressive house",
  ];

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfomation = await dbHelper.getDocFromCollection("users", uid);
      if (!userInfomation.organiser)
        return navigate("/dashboard/events", { replace: true });
    };
    getUserInfo();
  }, []);

  const handleCreateEvent = async () => {
    if (
      author === "" ||
      title === "" ||
      description === "" ||
      date === "" ||
      price === "" ||
      !photo ||
      location === "" ||
      moods.length === 0 ||
      artists.length === 0
    ) {
      toast.error("Missing Information !", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    try {
      await dbHelper.setDataToCollection("events", eventID, {
        id: eventID,
        author: author,
        title: title,
        description: description,
        date: date,
        price: price,
        usersInterested: [],
        creater: uid,
        location: location,
        moods: moods,
        approved: false,
        declined: false,
        artists: [],
      });
      await dbHelper.updatePhotoEventToStorage(uid, photo, eventID);
      dbHelper.updatePhotoArtistToStorage(uid, artists, eventID);
      toast.success(`Created successfully event ${title} buy ${author}.`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setAuthor("");
      setTitle("");
      setDescription("");
      setDate("");
      setPrice("");
      setMoods([]);
      setLocation("");
      setPhoto(null);
      setArtists([]);
      setArtistName("");
      setArtistPhoto(null);
    } catch {
      toast.error("Something went wrong, please try again !", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleAddArtist = () => {
    if (artistName === "" || artistName.indexOf(" ") === 0 || !artistPhoto) {
      toast.error("Missing Artist Information !", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setArtists([...artists, { name: artistName, photo: artistPhoto }]);
    setArtistName("");
    setArtistPhoto(null);
  };

  const handleMoods = (mood) => {
    if (moods.includes(mood)) {
      let newMoods = moods;
      newMoods.splice(newMoods.indexOf(mood), 1);
      setMoods([...newMoods]);
      return;
    }
    if (moods.length === 4) {
      toast.error("You can just add 4 moods maximum !", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setMoods([...moods, mood]);
  };

  return (
    <div className="flex h-full justify-center space-y-1">
      <div className="p-5 w-auto h-max border border-gray-200 shadow-md rounded-md flex flex-col space-y-5">
        <div>
          <input
            type="file"
            onChange={(e) =>
              e.target.files[0] ? setPhoto(e.target.files[0]) : null
            }
            onClick={(e) => (e.target.value = "")}
            className="hidden"
            name="photo"
            ref={addPhotoRef}
          />
          {photo ? (
            <div className="flex relative">
              <img
                src={URL.createObjectURL(photo)}
                alt="photoEvent"
                className="rounded-lg border border-gray-200 shadow-md h-60 w-full object-cover hover:opacity-70 cursor-pointer"
                onClick={() => addPhotoRef.current.click()}
              />
              <button
                onClick={() => setPhoto(null)}
                className="absolute -top-1 -right-1 transition-all ease-in-out hover:-translate-y-1"
              >
                <XIcon className="h-7 w-7 text-white bg-red-500 rounded-full p-1" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addPhotoRef.current.click()}
              className="w-full"
            >
              <img
                src="https://via.placeholder.com/1280x1080.png/D3D3D3/fff?text=Upload+Cover"
                alt="Upload"
                className="h-60 w-full object-cover rounded-lg shadow-md hover:opacity-70 cursor-pointer"
              />
            </button>
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col space-y-1">
            <div className="text-3xl">
              <input
                size={10}
                required
                type="text"
                value={title}
                placeholder="Title"
                name="title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="focus:border hover:border focus:border-gray-200 focus:shadow-md outline-red-500 rounded-lg py-1 px-2 font-bold placeholder:font-bold hover:opacity-70 transition-all ease-in-out hover:border-red-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center text-sm pl-3">
              <label>by </label>
              <input
                size={10}
                required
                type="text"
                value={author}
                placeholder="Author"
                name="author"
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
                className="focus:border hover:border focus:border-gray-200 focus:shadow-md placeholder:font-bold outline-red-500 rounded-lg py-1 px-2 font-bold hover:opacity-70 transition-all ease-in-out hover:border-red-500 cursor-pointer"
              />
            </div>
          </div>
          <div className="">
            <div className="flex space-x-2">
              {artists.map((artist, index) => (
                <div className="flex items-start" key={index}>
                  <div className="flex flex-col space-y-1">
                    <img
                      src={
                        artist.photo
                          ? URL.createObjectURL(artist.photo)
                          : "http://www.gravatar.com/avatar/?d=mp"
                      }
                      alt="photoArtist"
                      className="rounded-full shadow-md h-14 w-14 object-cover"
                      onClick={() => addArtistPhotoRef.current.click()}
                    />
                    <p className="text-xs">{artist.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newArtists = artists;
                      newArtists.splice(index, 1);
                      setArtists([...newArtists]);
                    }}
                    className="transition-all duration-300 ease-in-out hover:-translate-x-1"
                  >
                    <XIcon className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
              {artists.length < 4 ? (
                <>
                  <div className="space-y-1 relative">
                    <div>
                      <input
                        type="file"
                        onChange={(e) =>
                          e.target.files[0]
                            ? setArtistPhoto(e.target.files[0])
                            : null
                        }
                        onClick={(e) => (e.target.value = "")}
                        className="hidden"
                        name="photo"
                        ref={addArtistPhotoRef}
                      />
                      <div className="flex justify-center">
                        {artistPhoto ? (
                          <img
                            src={URL.createObjectURL(artistPhoto)}
                            alt="photoArtist"
                            className="rounded-full shadow-md h-14 w-14 object-cover hover:opacity-70 cursor-pointer"
                            onClick={() => addArtistPhotoRef.current.click()}
                          />
                        ) : (
                          <button
                            className="hover:opacity-75 transition-all ease-in-out cursor-pointer"
                            onClick={() => addArtistPhotoRef.current.click()}
                          >
                            <img
                              src="http://www.gravatar.com/avatar/?d=mp"
                              alt="Artist"
                              className="h-14 w-14 rounded-full object-cover"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <input
                        required
                        type="text"
                        value={artistName}
                        placeholder="Artist"
                        name="artistName"
                        onChange={(e) => {
                          setArtistName(e.target.value);
                        }}
                        className="border border-gray-200 shadow-md rounded-lg py-1 px-2 text-xs placeholder:text-center outline-red-500 transition-all ease-in-out hover:border-red-500 cursor-pointer"
                        size={10}
                      />
                    </div>
                    <button
                      onClick={handleAddArtist}
                      className="absolute -top-1 right-0 transition-all ease-in-out hover:translate-x-1"
                    >
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <textarea
            required
            className="border border-gray-200 shadow-md rounded-lg py-1 px-2 text-base leading-relaxed w-full resize-none outline-red-500 transition-all ease-in-out hover:border-red-500 cursor-pointer"
            rows="7"
            placeholder="About event"
            value={description}
            maxLength={500}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="relative">
          <div
            onClick={() => setIsOpenMoodsDropdown(!isOpenMoodsDropdown)}
            className="h-14 flex items-center justify-between border p-1 focus:border hover:border focus:border-gray-200 shadow-md outline-red-500 rounded-lg py-1 px-2 transition-all ease-in-out hover:border-red-500 cursor-pointer"
          >
            Moods:
            <div className="flex space-x-3 my-1">
              {moods.map((mood, index) => {
                return (
                  <div
                    key={index}
                    className="relative border rounded-lg px-2 py-1 font-bold  text-center shadow-md"
                  >
                    <p className="text-xs italic">
                      {`# ${mood.toUpperCase()}`}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newMoods = moods;
                        newMoods.splice(index, 1);
                        setMoods([...newMoods]);
                      }}
                      className={`top-0 right-0 -m-2 absolute shadow-md rounded-full p-1 transition-all bg-red-500 ease-in hover:-translate-x-1`}
                    >
                      <XIcon className="text-white h-2 w-2 outline-none" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className={`${
              isOpenMoodsDropdown ? "scale-100" : "scale-0"
            } absolute w-full h-28 mr-1 overflow-y-scroll bg-white shadow-lg border border-gray-200 px-2 py-1 rounded-md scrollbar-hide origin-top transition-all ease-in`}
          >
            <div className="flex flex-wrap gap-2 my-1">
              {moodsArray.map((mood, index) => (
                <div
                  className={`relative border rounded-lg px-2 py-1 font-bold text-center shadow-md transition-all ease-in cursor-pointer ${
                    moods.includes(mood) ? "bg-red-500 text-white" : "bg-white"
                  }`}
                  key={index}
                  onClick={() => handleMoods(mood)}
                >
                  <p className="text-xs italic">{`# ${mood.toUpperCase()}`}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-6 items-center text-sm">
          <input
            required
            type="date"
            value={date !== "" ? format(date.toMillis(), "yyyy-MM-dd") : ""}
            placeholder="Date"
            name="date"
            onChange={(e) => {
              const date = new Date(e.target.value);
              const miliseconds = date.getTime();
              const dateEvent =
                firebase.firestore.Timestamp.fromMillis(miliseconds);
              setDate(dateEvent);
            }}
            className="border border-gray-200 shadow-md rounded-lg py-1 px-2 w-full outline-red-500 transition-all ease-in-out hover:border-red-500 cursor-pointer"
          />
          <div className="border-r-2 h-6"></div>
          <input
            required
            type="text"
            value={location}
            placeholder="Location"
            name="title"
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            className="border border-gray-200 shadow-md rounded-lg py-1 px-2 w-full outline-red-500 transition-all ease-in-out hover:border-red-500 cursor-pointer"
          />
          <div className="border-r-2 h-6"></div>
          <input
            required
            type="number"
            step="0.01"
            value={price}
            placeholder="Price"
            name="price"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            className="border border-gray-200 shadow-md rounded-lg py-1 px-2 w-full outline-red-500 transition-all ease-in-out hover:border-red-500 cursor-pointer"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCreateEvent}
            className="border border-gray-200 shadow-md bg-red-500 text-white transition-all ease-in-out hover:translate-x-2 py-1 px-7 rounded-lg"
          >
            Create
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateEvent;
