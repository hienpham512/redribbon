import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import redRibbonLogo from "../assets/redRibbonLogo2.png";
import { CheckIcon } from "@heroicons/react/outline";
import { useAuth } from "../hooks/useAuth";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import firebase from "firebase/app";

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isOrganiser, setIsOrganiser] = useState(false);
  const [organiserFirstName, setOrganiserFirstName] = useState("");
  const [organiserLastName, setOrganiserLastName] = useState("");
  const [organiserBirthdate, setOrganiserBirthdate] = useState();
  const [avatar, setAvatar] = useState(null);
  const avatarRef = useRef();

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = (event) => {
    event.preventDefault();
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (isOrganiser && !avatar) {
      setError("Please upload an avatar");
      console.log("Yo");
      return;
    }
    register({
      email,
      password,
      isOrganiser,
      organiserFirstName,
      organiserLastName,
      organiserBirthdate,
      avatar,
    })
      .then(() => {
        setLoading(true);
        setError(null);
        setSuccess(
          "Please verify your Email to use Red Ribbon via the Email Verification link sent to your email. Check your spam folder if you don't see it in your inbox."
        );
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  return (
    <div
      className={`flex h-screen justify-center items-start ${
        isOrganiser ? "" : "pt-16"
      }`}
    >
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
          <p className="text-4xl font-light pb-4">Sign up</p>
          <div className="flex justify-center items-center space-x-1">
            <p className="text-sm opacity-50">Already have an account?</p>
            <Link
              to="/signin"
              className="text-red-500 text-sm cursor-pointer hover:opacity-50"
            >
              Signin
            </Link>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col space-y-3 pb-3"
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
              className="border border-gray-500 rounded-md p-3 w-full focus:outline-red-500"
              name="password"
              required
              autoComplete="new-password"
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
          <div className="relative w-11/12 flex items-center">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              className="border border-gray-500 rounded-md p-3 w-full focus:outline-red-500"
              name="confirmPassword"
              required
              autoComplete="new-password"
            />
            <div
              className="absolute right-6 hover:translate-x-1 hover:opacity-40 transition-all duration-200 ease-in-out cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? (
                <EyeOffIcon className="h-5" />
              ) : (
                <EyeIcon className="h-5" />
              )}
            </div>
          </div>
          <div
            className="w-11/12 flex items-center justify-between p-3 border border-gray-500 rounded-md relative cursor-pointer group"
            onClick={() => setIsOrganiser(!isOrganiser)}
          >
            <label className="text-gray-400">Organiser ?</label>
            <input
              className="absolute right-6 group-hover:-translate-x-2 transition-all ease-in-out"
              type="checkbox"
              name="isOrganiser"
              value={isOrganiser}
              checked={isOrganiser}
              onChange={() => setIsOrganiser(!isOrganiser)}
            />
          </div>
          {isOrganiser && (
            <div className="grid grid-cols-2 w-11/12 gap-1">
              <input
                type="text"
                placeholder="First Name"
                required
                className="border border-gray-500 rounded-md p-3 w-full focus:outline-red-500"
                value={organiserFirstName}
                onChange={(e) => setOrganiserFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                className="border border-gray-500 rounded-md p-3 w-full focus:outline-red-500"
                value={organiserLastName}
                onChange={(e) => setOrganiserLastName(e.target.value)}
              />
              <div className="flex justify-center items-center">
                <div onClick={() => avatarRef?.current?.click()}>
                  <img
                    src={
                      avatar
                        ? URL.createObjectURL(avatar)
                        : "http://www.gravatar.com/avatar/?d=mp"
                    }
                    alt="avatar"
                    className="h-14 w-14 rounded-full cursor-pointer hover:opacity-70"
                  />
                </div>
              </div>
              <input
                type="file"
                name="avatar"
                className="hidden"
                ref={avatarRef}
                onChange={(e) =>
                  e.target.files[0] ? setAvatar(e.target.files[0]) : null
                }
              />
              <input
                type="date"
                required
                className="border border-gray-500 rounded-md p-3 w-full focus:outline-red-500"
                max={format(
                  new Date().setFullYear(new Date().getFullYear() - 18),
                  "yyyy-MM-dd"
                )}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const miliseconds = date.getTime();
                  setOrganiserBirthdate(
                    firebase.firestore.Timestamp.fromMillis(miliseconds)
                  );
                }}
              />
            </div>
          )}
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
            {loading ? (
              <span className="flex space-x-2 items-center justify-center text-green-500">
                <p>Sent</p>
                <CheckIcon className="h-7" />
              </span>
            ) : (
              "Signup"
            )}
          </button>
        </form>
        {success && (
          <p className="text-green-500 text-sm px-5 text-justify animate__animated animate__bounce">
            {success}
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm px-5 text-justify">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Signup;
