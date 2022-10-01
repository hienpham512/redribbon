/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import dbHelper from '../../firebase/dbHelper';
import { useAuth } from "../../hooks/useAuth";
import EventCard from '../Events/EventCard';
import { SearchIcon } from "@heroicons/react/solid";
import fuzzysort from "fuzzysort";
import EventModal from '../Events/EventModal';
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import EditEvent from './EditEvent';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const OrganiserEvents = ({eventsArray}) => {
    const [showModal, setShowModal] = useState(false);
    const [eventPostData, setEventPostData] = useState();
    const { user: uid } = useAuth();
    const [search, setSearch] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const modalRef = useRef();
    const navigate = useNavigate();
    const [allEvents, setAllEvents] = eventsArray;

    useEffect(() => {
        const getUserInfo = async () => {
            const userInfomation = await dbHelper.getDocFromCollection("users", uid);
            if (!userInfomation.organiser)  return navigate("/dashboard/events", { replace: true });
        };
        getUserInfo();
    }, []);

    useOnClickOutside(modalRef, () => {
        setShowModal(false);
        setIsEditModalOpen(false);
        setEventPostData();
    });

    const handleSearch = async () => {
        if (search === "" || search.indexOf(" ") === 0 || !search) {
            eventsArray = allEvents;
            return;
        }
        const results = fuzzysort.go(search, eventsArray, {
            keys: ["author", "title"],
        });
        results.forEach((res) => {
            if (res.obj) results[results.indexOf(res)] = res.obj;
        });
        eventsArray = [...results];
    };

    useEffect(() => {
        handleSearch();
    }, [search]);

    const handleEditEvent = async (post, status, edit) => {
        isEditModalOpen ? setEventPostData(eventsArray.find((event) => event.id === post.id)) : setEventPostData(post)
        setIsEditModalOpen(!isEditModalOpen);
        setShowModal(!showModal);
        if (status && !edit) {
            try {   
                await dbHelper.updateDataToCollection("events", post.id, {
                    id: post.id,
                    author: post.author,
                    title: post.title,
                    description: post.description,
                    date: post.date,
                    location: post.location,
                    price: post.price,
                    approved: false,
                    artists: post.artists,
                    creater: post.creater,
                    photo: post.photo,
                    usersInterested: post.usersInterested,
                    declined: false,
                    moods: post.moods
                });
                post.photoChange && !post.photo
                && await dbHelper.updatePhotoEventToStorage(uid, post.photoChange, post.id);
                post.artistsChange.length > 0 && dbHelper.updatePhotoArtistToStorage(uid, post.artistsChange, post.id);
                const eventChange = await dbHelper.getDocFromCollection("events", post.id);
                const newEvents = eventsArray;
                newEvents.forEach((event) => {
                    if (event.id === eventChange.id) {
                        newEvents[newEvents.indexOf(event)] = eventChange;
                        return;
                    }
                });
                eventsArray= [...newEvents];
                toast.success(`Edited successfully event ${post.title} by ${post.author}`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } catch {
                toast.error("Something went wrong, please try again. &&&&", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            
        } else {
            eventsArray= [...newEvents];
            setEventPostData();
        }
    }

    return (
        <div>
            <form>
                <div className="relative m-3">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <SearchIcon className="h-6" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block p-4 pl-10 w-full text-sm text-gray-900 shadow-md rounded-lg border border-gray-200 focus:outline-red-500"
                        placeholder="Search for an event..."
                    />
                </div>
            </form>
            <div className="grid grid-cols-4 gap-4 pt-8">
                {
                    eventsArray.map((event, index) => {
                        return (
                            <div key={index} onClick={() => setEventPostData(event)}>
                                <EventCard post={event} setShowModal={setShowModal} isOrganiser={true} handleEditEvent={handleEditEvent} />
                            </div>
                        )
                    })
                }
            </div>
            {
                eventPostData &&
                <EditEvent
                    eventPostData={eventPostData}
                    handleEditEvent={handleEditEvent}
                    showModal={showModal}
                    modalRef={modalRef}
                />
            }
            <ToastContainer />
        </div>
    )
}

export default OrganiserEvents;