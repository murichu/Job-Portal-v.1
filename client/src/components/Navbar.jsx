import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { setShowRecruiterLogin, setShowUserLogin, userData } =
    useContext(AppContext);

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="JobBoard Logo"
          className="cursor-pointer"
        />

        {userData ? (
          <div className="flex items-center gap-4 text-gray-700">
            <Link to="/applications" className="hover:underline">
              Applied Jobs
            </Link>
            <span className="hidden sm:inline-block">|</span>
            <p className="max-sm:hidden">Hi, {userData.name}</p>
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="text-gray-600"
            >
              Recruiter Login
            </button>
            <button
              onClick={() => setShowUserLogin(true)}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
