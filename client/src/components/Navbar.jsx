import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { setShowRecruiterLogin, setShowUserLogin, userData, logout,} =
    useContext(AppContext);

  const handleLogout = () => {
    logout();
    navigate("/");
    
  };

  //<Link to="/applications" className="hover:underline">Applied Jobs</Link>
          // <span className="hidden sm:inline-block">|</span>

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="JobBoard Logo"
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />

        {userData ? (
          <div className="flex items-center gap-4 text-gray-700">
            
            <div className="flex items-center gap-2">
              <img 
                src={userData.image} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = assets.profile_img;
                }}
              />
              <div className="max-sm:hidden">
                <p className="text-sm font-medium">Hi, {userData.name}</p>
              </div>
              <div className="relative group">
                <button className="text-gray-500 hover:text-gray-700 ml-2">
                  ⋮
                </button>
                <div className="absolute right-0 top-8 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-10">
                  <Link 
                    to="/applications" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Applications
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Recruiter Login
            </button>
            <button
              onClick={() => setShowUserLogin(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-9 py-2 rounded-full transition-colors"
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
