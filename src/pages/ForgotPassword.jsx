import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import redRibbonLogo from "../assets/redRibbonLogo2.png";
import { CheckIcon } from "@heroicons/react/outline";
import { Link, useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendPasswordResetMail } = useAuth();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendPasswordResetMail(email)
      .then(() => {
        setLoading(true);
        setSuccess(
          "Password reset link sent to your email. Check your spam folder if you don't see it in your inbox."
        );
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };
  return (
    <div className="flex h-screen justify-center items-start pt-16">
      <div className="flex flex-col border border-gray-200 shadow-md space-y-5 sm:w-80 md:w-96 px-4 py-5 pb-10 rounded-lg">
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
        <div className="flex flex-col items-center justify-center pr-2 space-y-8">
          <span className="flex flex-col items-center space-y-8">
            <p className="text-3xl font-light">Reset Password</p>
            <Link to="/signin" className="text-sm text-gray-500">
              Go back to{" "}
              <span className="text-red-500 cursor-pointer hover:opacity-50">
                Signin?
              </span>
            </Link>
          </span>
          <p className="text-sm text-gray-500 font-light px-5">
            Enter your email and we will send you a password reset email.
          </p>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`
              rounded-md
              p-3 w-11/12
              disabled:bg-gray-200
              disabled:text-gray-500
              disabled:hover:opacity-100
              bg-red-500 
              text-white
              hover:opacity-90
              text-lg tracking-wide
            `}
          >
            {loading ? (
              <span className="flex space-x-2 items-center justify-center text-green-500">
                <p>Sent</p>
                <CheckIcon className="h-7" />
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        {error && (
          <p className="text-red-500 text-sm px-5 text-justify">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm px-5 text-justify animate__animated animate__bounce">
            {success}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
