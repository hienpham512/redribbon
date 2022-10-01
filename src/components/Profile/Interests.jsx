import React from "react";

const Interests = ({ user, setUser }) => {
  const getInterests = () => {
    return user.interests?.join(", ") || "";
  }
  const setInterests = (value) => {
    const interests = String(value)
      .split(",")
      .map((item) => item.trim());
    setUser({ ...user, interests });
  };
  return (
    <div className="flex flex-col space-y-2 border border-gray-200 shadow-md rounded-lg p-3">
      <p className="text-lg text-black font-semibold">Interests</p>
      <div className="flex space-x-2">
        <input
          type="text"
          name="interest1"
          placeholder="Music"
          value={getInterests()}
          onChange={(e) => setInterests(e.target.value)}
          className="border border-gray-200 shadow-md rounded-lg py-1 px-2 font-light"
        />
      </div>
    </div>
  );
};

export default Interests;
