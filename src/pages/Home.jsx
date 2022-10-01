import React from "react";
import { useNavigate } from "react-router-dom";
import logo2 from "../assets/redRibbonLogo2.png";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex min-h-screen bg-cover bg-center bg-hero bg-fixed relative">
        <div className="flex">
          <div className="fixed top-2 right-2 p-6 space-x-5">
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2 text-lg shadow-md border border-gray-200 hover:border-red-500 hover:text-red-500 hover:bg-white text-white bg-red-500 rounded-md transition-all ease-in hover:-translate-x-2 font-semibold"
            >
              Register
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-2 text-lg shadow-md border border-gray-200 hover:border-red-500 hover:text-red-500 hover:bg-white text-white bg-red-500 rounded-md transition-all ease-in hover:-translate-x-2 font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="relative my-auto mx-auto">
          <img src={logo2} alt="Red Ribbon" className="h-48 mx-auto" />
          <div className="text-center text-6xl font-home">RED RIBBON</div>
        </div>
      </div>
      <footer className="p-4 bg-white">
        <div className="flex items-center justify-between">
          <a className="flex items-center mb-4 space-x-3">
            <img src={logo2} className="h-12" alt="Logo" />
            <span className="self-center text-l font-semibold text-black">
              RED RIBBON
            </span>
          </a>
        </div>
        <hr className="my-4 border-gray-200" />
        <p className="text-l text-gray-500 text-center p-4">
          You're single ? Are you looking for love, do you want to meet friends
          or just have fun? It's on RedRibon that it's happening.
          <br />
          This application is the best plan to meet your next date while having
          fun thanks to the many evenings that we offer you.
          <br />
          With Redribbon, we allow you to meet your future partner and even
          better we offer you parties and festivals for the best date of your
          life.
          <br />
          Many singles are just a click away and just waiting to meet someone
          like you.
        </p>
        <span className="block text-sm text-gray-500 text-center">
          © 2022 <a class="">Red Ribbon™</a>
        </span>
      </footer>
    </div>
  );
};

export default Home;
