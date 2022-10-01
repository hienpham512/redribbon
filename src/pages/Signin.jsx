import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import redRibbonLogo from "../assets/redRibbonLogo2.png";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

const Signin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login({
      email: data.get("email"),
      password: data.get("password"),
    })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex h-screen justify-center items-start pt-16">
      <div className="flex flex-col border border-gray-200 shadow-md space-y-5 sm:w-80 md:w-96 px-4 py-4 rounded-lg">
        <div className="flex justify-center items-center flex-col pb-10">
          <div
            onClick={() => navigate("/home")}
            className="cursor-pointer transition-all ease-in hover:scale-110"
          >
            <img src={redRibbonLogo} alt="Red Ribbon" className="h-24" />
          </div>
          <div className="flex space-x-2 items-end">
            <p className="font-semibold text-3xl">Red Ribbon</p>
            <p className="text-2xl font-light opacity-50">Account</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center pr-2 space-y-2">
          <p className="text-4xl font-light pb-4">Sign in</p>
          <div className="flex justify-center items-center space-x-1">
            <p className="text-sm opacity-50">Don't have an account?</p>
            <Link
              to="/signup"
              className="text-red-500 text-sm cursor-pointer hover:opacity-50"
            >
              Signup
            </Link>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col space-y-3"
        >
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-500 rounded-md p-3 w-11/12 focus:outline-red-500"
            name="email"
            required
            autoComplete="email"
            autoFocus
          />
          <div className="relative w-11/12 flex items-center">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="border border-gray-500 rounded-md p-3 w-full focus:outline-red-500 "
              name="password"
              autoComplete="current-password"
              required
            />
            <div
              className="absolute right-6 hover:translate-x-1 hover:opacity-40 transition-all duration-200 ease-in-out cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <EyeOffIcon className="h-5" />
              ) : (
                <EyeIcon className="h-5" />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="
              rounded-md
              p-3 w-11/12
              disabled:bg-gray-200
              disabled:text-gray-500
              disabled:hover:opacity-100
              bg-red-500 
              text-white
              hover:opacity-90
              text-lg tracking-wide
            "
          >
            Signin
          </button>
        </form>
        {error && (
          <p className="text-red-500 text-sm mx-auto text-justify">{error}</p>
        )}
        <div className="flex justify-center pt-3 pb-2 opacity-50 font-light cursor-pointer hover:opacity-20">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
