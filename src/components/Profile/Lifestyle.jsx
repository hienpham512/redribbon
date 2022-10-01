import React, { useState } from "react";
import { LIFESTYLE } from "./data";

const Lifestyle = ({ user, setUser }) => {
  const [lifestyle, setLifystyle] = useState(
    user.lifestyle ||
      LIFESTYLE.map((item) => ({ [item.id]: item.values[0].value })).reduce(
        (obj, item) => {
          return Object.assign(obj, {
            [Object.keys(item)[0]]: Object.values(item)[0],
          });
        }
      )
  );

  const setLifestyleValue = (id, value) => {
    setLifystyle({ ...lifestyle, [id]: value });
    setUser({ ...user, lifestyle: { ...lifestyle, [id]: value } });
  };

  return (
    <div className="flex flex-col space-y-7 border border-gray-200 shadow-md rounded-lg p-3 h-full">
      <p className="text-lg text-black font-semibold">Lifestyle</p>
      <div className="flex flex-col space-y-6">
        {LIFESTYLE.map((item) => (
          <div
            className="flex justify-between border px-4 py-2 rounded-md shadow-md"
            key={item.id}
          >
            {item.name}:{" "}
            <select
              name={item.id}
              className="text-end pr-2"
              value={lifestyle[item.id]}
              onChange={(e) => setLifestyleValue(item.id, e.target.value)}
            >
              {item.values.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lifestyle;
