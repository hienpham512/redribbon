/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import {
  CalendarIcon,
  LocationMarkerIcon,
  PencilIcon,
  XIcon,
  PlusIcon,
  CheckIcon,
} from "@heroicons/react/solid";
import ArtistCard from "../Events/ArtistCard";
import millisToDate from "../../utils/millisToDate";
import { format } from "date-fns";
import firebase from "firebase/app";
import { toast, ToastContainer } from "react-toastify";

const EditEvent = ({ showModal, eventPostData, handleEditEvent, modalRef }) => {
  const [author, setAuthor] = useState(eventPostData.author);
  const [title, setTitle] = useState(eventPostData.title);
  const [description, setDescription] = useState(eventPostData.description);
  const [location, setLocation] = useState(eventPostData.location);
  const [date, setDate] = useState(eventPostData.date);
  const [price, setPrice] = useState(eventPostData.price);

  const [photo, setPhoto] = useState(eventPostData.photo);
  const [photoChange, setPhotoChange] = useState(null);

  const [artists, setArtists] = useState(eventPostData.artists);
  const [artistsChange, setArtistsChange] = useState([]);

  const [artistName, setArtistName] = useState("");
  const [artistPhoto, setArtistPhoto] = useState(null);

  const [moods, setMoods] = useState(eventPostData.moods);
  const [isOpenMoodsDropdown, setIsOpenMoodsDropdown] = useState(false);

  const addPhotoRef = useRef();
  const addArtistPhotoRef = useRef();
  const [editPosition, setEditPostion] = useState("");

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

  const handleAddArtist = () => {
    if (artistName === "" || artistName.indexOf(" ") === 0 || !artistPhoto) {
      toast.error("Missing infomation of artist, please try again.", {
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
    setArtistsChange([
      ...artistsChange,
      { name: artistName, photo: artistPhoto },
    ]);
    setArtistName("");
    setArtistPhoto(null);
  };

  const handleValidChange = () => {
    handleEditEvent(
      {
        author: author,
        title: title,
        photo: photo,
        photoChange: photoChange,
        artists: artists,
        artistsChange: artistsChange,
        location: location,
        date: date,
        moods: moods,
        price: price,
        description: description,
        id: eventPostData.id,
        creater: eventPostData.creater,
        usersInterested: eventPostData.usersInterested,
      },
      true
    );
  };

  return (
    <>
      {showModal && (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-51 backdrop-blur-md border border-gray-200 rounded-xl">
          <div
            className="relative w-auto my-auto mx-auto max-w-3xl px-16"
            ref={modalRef}
          >
            <div className="border-0 p-5 rounded-xl shadow-lg relative flex flex-col w-full bg-white scale-95">
              <div className="flex cursor-pointer hover:opacity-80">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files[0]) setPhotoChange(e.target.files[0]);
                    setPhoto(null);
                  }}
                  onClick={(e) => (e.target.value = "")}
                  className="hidden"
                  name="photo"
                  ref={addPhotoRef}
                />
                <img
                  className="h-60 w-full object-cover rounded-lg shadow-md"
                  src={
                    photo
                      ? photo
                      : photoChange
                      ? URL.createObjectURL(photoChange)
                      : "https://picsum.photos/600/400/?random"
                  }
                  alt="Event"
                  onClick={() => addPhotoRef.current.click()}
                />
                <button
                  onClick={() => addPhotoRef.current.click()}
                  className="fixed top-0 right-0 m-3 bg-white shadow-md rounded-full p-2 z-50 transition-all duration-300 ease-in-out hover:translate-y-[-5px]"
                >
                  <PencilIcon className="h-6 text-red-500" />
                </button>
              </div>
              <div className="flex pt-5">
                <div className="flex">
                  <div className="flex-col flex pl-3 font-light text-lg w-full">
                    {editPosition === "title" ? (
                      <input
                        required
                        type="text"
                        value={title}
                        placeholder="Title"
                        name="title"
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                        autoFocus
                        className="font-bold w-full text-3xl focus:outline-none"
                      />
                    ) : (
                      <div className="flex">
                        <p className="font-bold text-3xl">
                          {title.charAt(0).toUpperCase() + title.slice(1)}
                        </p>
                        <button
                          onClick={() => setEditPostion("title")}
                          className="h-6 w-6 ml-2 bg-white shadow-md rounded-full p-1 z-50 transition-all duration-300 ease-in-out hover:translate-y-[-5px]"
                        >
                          <PencilIcon className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    )}
                    {editPosition === "author" ? (
                      <p className="flex text-sm">
                        by{" "}
                        <input
                          required
                          type="text"
                          value={author}
                          placeholder="Author"
                          name="author"
                          onChange={(e) => {
                            setAuthor(e.target.value);
                          }}
                          autoFocus
                          className="font-bold pl-2 focus:outline-none"
                        />
                      </p>
                    ) : (
                      <div className="flex">
                        <p className="text-sm">
                          by{" "}
                          <span className="font-bold">
                            {author[0].toUpperCase() + author.slice(1)}
                          </span>
                        </p>
                        <button
                          onClick={() => setEditPostion("author")}
                          className="h-6 w-6 ml-2 bg-white shadow-md rounded-full p-1 z-50 transition-all duration-300 ease-in-out hover:translate-y-[-5px]"
                        >
                          <PencilIcon className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {editPosition === "artists" ? (
                  <div className="flex space-x-2">
                    {artists.length > 0 &&
                      artists.map((artist, index) => (
                        <div className="flex relative" key={index}>
                          <div>
                            <img
                              src={artist.photo}
                              alt="photoArtist"
                              className="rounded-full shadow-md h-14 w-14 object-cover hover:opacity-70 cursor-pointer"
                              onClick={() => addArtistPhotoRef.current.click()}
                            />
                            {artist.name}
                          </div>
                          <button
                            onClick={() => {
                              let newArtists = artists;
                              newArtists.splice(index, 1);
                              setArtists([...newArtists]);
                            }}
                            className="transition-all absolute duration-300 ease-in-out hover:-translate-x-1 top-0 right-0 -m-2"
                          >
                            <XIcon className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    {artistsChange?.length > 0 &&
                      artistsChange.map((artist, index) => (
                        <div className="flex relative" key={index}>
                          <div>
                            <img
                              src={URL.createObjectURL(artist.photo)}
                              alt="photoArtist"
                              className="rounded-full shadow-md h-14 w-14 object-cover hover:opacity-70 cursor-pointer"
                              onClick={() => addArtistPhotoRef.current.click()}
                            />
                            {artist.name}
                          </div>
                          <button
                            onClick={() => {
                              let newArtists = artistsChange;
                              newArtists.splice(index, 1);
                              setArtistsChange([...newArtists]);
                            }}
                            className="transition-all absolute duration-300 ease-in-out hover:-translate-x-1 top-0 right-0 -m-1"
                          >
                            <XIcon className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    {artists.length + artistsChange.length < 4 && (
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
                          <div className="w-full flex justify-center">
                            {artistPhoto ? (
                              <img
                                src={URL.createObjectURL(artistPhoto)}
                                alt="photoArtist"
                                className="rounded-full shadow-md h-14 w-14 object-cover hover:opacity-70 cursor-pointer"
                                onClick={() =>
                                  addArtistPhotoRef.current.click()
                                }
                              />
                            ) : (
                              <button
                                className="hover:opacity-75 transition-all ease-in-out cursor-pointer"
                                onClick={() =>
                                  addArtistPhotoRef.current.click()
                                }
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
                        <div className="w-full flex justify-center">
                          <button
                            onClick={handleAddArtist}
                            className="absolute -top-1 right-0 transition-all ease-in-out hover:translate-x-1"
                          >
                            <CheckIcon className="h-4 w-4 text-green-500" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  eventPostData?.artists?.length > 0 && (
                    <div className="w-full flex items-center justify-end space-x-4">
                      {eventPostData?.artists.map((artist, index) => (
                        <div key={index}>
                          <ArtistCard name={artist.name} photo={artist.photo} />
                        </div>
                      ))}
                      <button
                        onClick={() => setEditPostion("artists")}
                        className="h-10 w-10 m-3 bg-white shadow-md rounded-full p-2 z-50 transition-all duration-300 ease-in-out hover:translate-y-[-5px]"
                      >
                        <PencilIcon className="h-6 w-6 text-red-500" />
                      </button>
                    </div>
                  )
                )}
              </div>
              <div className="p-3 flex space-x-2">
                {editPosition === "description" ? (
                  <textarea
                    required
                    className="border border-gray-200 shadow-md rounded-lg py-1 px-2 font-light w-full"
                    cols="30"
                    rows="10"
                    placeholder="About event"
                    value={description}
                    maxLength={500}
                    onChange={(e) => setDescription(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <div className="p-3 flex space-x-2">
                    <div className="p-3 my-5 overflow-y-scroll max-h-64 scrollbar-hide border-t-2 border-b-2 rounded-lg">
                      <p className="text-base leading-relaxed ">
                        {description}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditPostion("description")}
                      className="h-10 w-10 m-3 bg-white shadow-md rounded-full p-2 z-50 transition-all duration-300 ease-in-out hover:translate-y-[-5px]"
                    >
                      <PencilIcon className="h-6 w-6 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
              <div className="relative">
                <div
                  onClick={() => setIsOpenMoodsDropdown(!isOpenMoodsDropdown)}
                  className="h-14 flex items-center justify-between border p-1 focus:border hover:border focus:border-gray-200 focus:shadow-md outline-red-500 rounded-lg py-1 px-2 transition-all ease-in-out hover:border-red-500 cursor-pointer"
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
                  } absolute w-full h-28 mr-1 z-50 overflow-y-scroll bg-white shadow-lg border border-gray-200 px-2 py-1 rounded-md scrollbar-hide origin-top transition-all ease-in`}
                >
                  <div className="flex flex-wrap gap-2 my-1">
                    {moodsArray.map((mood, index) => (
                      <div
                        className={`relative border rounded-lg px-2 py-1 font-bold text-center shadow-md transition-all ease-in cursor-pointer ${
                          moods.includes(mood)
                            ? "bg-red-500 text-white"
                            : "bg-white"
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
              <div className="flex w-full space-x-4 items-center px-3 py-4 pb-6">
                {editPosition === "date" ? (
                  <div>
                    <input
                      required
                      type="date"
                      value={
                        date !== "" ? format(date.toMillis(), "yyyy-MM-dd") : ""
                      }
                      placeholder="Date"
                      name="date"
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        const miliseconds = date.getTime();
                        const dateEvent =
                          firebase.firestore.Timestamp.fromMillis(miliseconds);
                        setDate(dateEvent);
                      }}
                      autoFocus
                      className="border border-gray-200 shadow-md rounded-lg py-1 px-2 font-light w-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5" />
                    <p className="pl-2 pt-1 text-sm">
                      {format(date.toMillis(), "yyyy-MM-dd")}
                    </p>
                    <button
                      onClick={() => setEditPostion("date")}
                      className="h-10 w-10 m-3 bg-white shadow-md rounded-full p-2 z-40 transition-all duration-300 ease-in-out hover:translate-y-[-5px]"
                    >
                      <PencilIcon className="h-6 w-6 text-red-500" />
                    </button>
                  </div>
                )}
                <div className="border-r-2 h-6"></div>
                {editPosition === "location" ? (
                  <div className="flex items-center space-x-2">
                    <LocationMarkerIcon className="h-5" />
                    <input
                      required
                      type="text"
                      value={location}
                      placeholder="Location"
                      name="location"
                      onChange={(e) => {
                        setLocation(e.target.value);
                      }}
                      autoFocus
                      className="border border-gray-200 shadow-md rounded-lg py-1 px-2 font-light w-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LocationMarkerIcon className="h-5" />
                    <p className="pl-2 pt-1 text-sm">{location}</p>
                    <button
                      onClick={() => setEditPostion("location")}
                      className="h-10 w-10 m-3 bg-white shadow-md rounded-full p-2 z-40 transition-all duration-300 ease-in-out hover:translate-y-[-5px]"
                    >
                      <PencilIcon className="h-6 w-6 text-red-500" />
                    </button>
                  </div>
                )}
                <div className="border-r-2 h-6"></div>
                {editPosition === "price" ? (
                  <div className="flex space-x-1 items-center text-sm pt-1">
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
                      autoFocus
                      className="border border-gray-200 shadow-md rounded-lg py-1 px-2 font-light w-full"
                    />
                  </div>
                ) : (
                  <div className="flex space-x-1 items-center text-sm pt-1">
                    <p className="font-bold">Price:</p>
                    <p>{price}€</p>
                    <button
                      onClick={() => setEditPostion("price")}
                      className="h-10 w-10 m-3 bg-white shadow-md rounded-full p-2 z-40 transition-all duration-300 ease-in-out hover:translate-y-[-5px]"
                    >
                      <PencilIcon className="h-6 w-6 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-x-4 flex w-full my-1 justify-end">
                <button
                  className="border border-gray-200 shadow-md px-5 py-2 rounded-lg text-xs transition-all ease-in hover:-translate-x-2 hover:bg-red-500 hover:text-white hover:font-semibold"
                  type="button"
                  onClick={() => {
                    setEditPostion("");
                    handleEditEvent(eventPostData, false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="border border-gray-200 text-green-500 shadow-md px-5 py-2 rounded-lg text-xs transition-all ease-in hover:-translate-x-2 hover:bg-green-500 hover:text-white hover:font-semibold"
                  type="button"
                  onClick={() => {
                    setEditPostion("");
                    handleValidChange();
                  }}
                >
                  Valid change
                </button>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default EditEvent;
