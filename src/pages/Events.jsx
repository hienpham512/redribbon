/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { SearchIcon } from "@heroicons/react/solid";
import EventCard from "../components/Events/EventCard";
import dbHelper from "../firebase/dbHelper";
import { useAuth } from "../hooks/useAuth";
import fuzzysort from "fuzzysort";
import EventModal from "../components/Events/EventModal";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import Filter from "../components/Filter";
import firebase from "firebase/app";

function Events() {
  const [showModal, setShowModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [foundEvents, setFoundEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [dateFilter, setDateFilter] = useState(false);
  const [priceFilter, setPriceFilter] = useState(false);
  const [interestedFilter, setInterestedFilter] = useState(false);
  const { user: uid } = useAuth();
  const [eventPostData, setEventPostData] = useState();
  const modalRef = useRef();

  useOnClickOutside(modalRef, () => setShowModal(false));

  const fetchData = async () => {
    await dbHelper
      .getAllDataFromCollection("events")
      .then((res) => res.filter((event) => event.approved))
      .then((res) => res.sort((a, b) => a.date.toMillis() - b.date.toMillis()))
      .then((res) => {
        setIsLoaded(true);
        setFoundEvents(
          res.filter((event) =>
            interestedFilter
              ? event.usersInterested.includes(uid)
              : !event.usersInterested.includes(uid)
          )
        );
        setAllEvents(res);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async (value) => {
    const listToSearch = allEvents.filter((event) =>
      interestedFilter
        ? event.usersInterested.includes(uid)
        : !event.usersInterested.includes(uid)
    );
    if (value.trim() === "") return setFoundEvents(listToSearch);
    const results = fuzzysort.go(value, listToSearch, {
      keys: ["author", "title"],
    });
    results.forEach((res) => {
      if (res.obj) results[results.indexOf(res)] = res.obj;
    });
    setFoundEvents([...results]);
  };

  useEffect(() => {
    setFoundEvents(
      allEvents.filter((event) =>
        interestedFilter
          ? event.usersInterested.includes(uid)
          : !event.usersInterested.includes(uid)
      )
    );
  }, [interestedFilter]);

  const handleInterested = async (post, isInterested) => {
    const userInfo = await dbHelper.getDocFromCollection("users", uid);
    const newAllEvents = allEvents;
    if (!isInterested) {
      const events = userInfo.events
        ? [...userInfo.events, post.id]
        : [post.id];
      await dbHelper.updateDataToCollection("users", uid, { events });
      await dbHelper.updateDataToCollection("events", post.id, {
        usersInterested: firebase.firestore.FieldValue.arrayUnion(uid),
      });
      newAllEvents.forEach((event) => {
        if (event.id === post.id) {
          event.usersInterested.push(uid);
          return;
        }
      });
    } else {
      userInfo.events.splice(userInfo.events.indexOf(post.id), 1);
      post.usersInterested.splice(post.usersInterested.indexOf(uid), 1);
      await dbHelper.updateDataToCollection("users", uid, {
        events: userInfo.events,
      });
      await dbHelper.updateDataToCollection("events", post.id, {
        usersInterested: firebase.firestore.FieldValue.arrayRemove(uid),
      });
      newAllEvents.forEach((event) => {
        if (event.id === post.id) {
          event.usersInterested.splice(event.usersInterested.indexOf(uid), 1);
          return;
        }
      });
    }
    fetchData();
  };

  const sortDates = () => {
    if (priceFilter) setPriceFilter(!priceFilter);
    setDateFilter(!dateFilter);
    foundEvents.sort((a, b) =>
      dateFilter
        ? a.date.toMillis() - b.date.toMillis()
        : b.date.toMillis() - a.date.toMillis()
    );
  };

  const sortPrices = () => {
    if (dateFilter) setDateFilter(!dateFilter);
    setPriceFilter(!priceFilter);
    foundEvents.sort((a, b) =>
      priceFilter ? a.price - b.price : b.price - a.price
    );
  };

  return (
    <div className="p-5 min-h-screen">
      <form>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <SearchIcon className="h-6" />
          </div>
          <input
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            className="block p-4 pl-10 w-full text-sm text-gray-900 shadow-md rounded-lg border border-gray-200 focus:outline-red-500"
            placeholder="Search for an event..."
          />
        </div>
      </form>
      <div className="flex py-2 space-x-3 text-xs">
        <Filter
          name="Date"
          sortable
          inverted
          toggle={dateFilter}
          onClick={() => sortDates()}
        />
        <Filter
          name="Price"
          sortable
          toggle={priceFilter}
          onClick={() => sortPrices()}
        />
        <Filter
          name="Interested"
          toggle={interestedFilter}
          onClick={() => setInterestedFilter(!interestedFilter)}
        />
      </div>
      <div className="grid grid-cols-4 gap-4 pt-8">
        {foundEvents && foundEvents.length > 0 ? (
          foundEvents.map((post, index) => (
            <div key={index} onClick={() => setEventPostData(post)}>
              <EventCard
                post={post}
                setShowModal={setShowModal}
                handleInterested={handleInterested}
              />
            </div>
          ))
        ) : (
          <h1 className="pt-3 text-2xl font-light italic tracking-wide">
            {isLoaded ? "No events found" : "Loading..."}
          </h1>
        )}
      </div>
      <EventModal
        eventPostData={eventPostData}
        setShowModal={setShowModal}
        showModal={showModal}
        modalRef={modalRef}
        handleInterested={handleInterested}
      />
    </div>
  );
}

export default Events;
