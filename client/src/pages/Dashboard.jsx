import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { companyData, setCompanyData, setCompanyToken } =
    useContext(AppContext);

  // Sidebar menu configuration
  const menuItems = [
    { label: "Add Job", icon: assets.add_icon, path: "/dashboard/add-job" },
    {
      label: "Manage Job",
      icon: assets.home_icon,
      path: "/dashboard/manage-jobs",
    },
    {
      label: "View Applications",
      icon: assets.person_tick_icon,
      path: "/dashboard/view-applications",
    },
  ];

  // Logout function
  const handleLogout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    setCompanyData(null);
    navigate("/");
  };

  // Redirect user to managejob in /dashboard url
  useEffect(() => {
    if (companyData) {
      navigate("/dashboard/manage-jobs");
    }
  }, [companyData]);

  return (
    <div className="min-h-screen">
      {/* Navbar for Recruiter Panel */}
      <div className="shadow py-5">
        <div className="px-5 flex justify-between items-center">
          <img
            onClick={() => navigate("/")}
            className="max-sm:w-32 cursor-pointer"
            src={assets.logo}
            alt="Logo"
          />

          {companyData && (
            <div className="flex items-center gap-3">
              <p className="max-sm:hidden">Welcome, {companyData.name}</p>
              <div className="relative group">
                <img
                  className="w-8 border rounded-full"
                  src={companyData.image || assets.default_company_icon}
                  alt="Company Icon"
                  onError={(e) => {
                    e.target.src = assets.default_company_icon;
                  }}
                />
                <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                  <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm">
                    <li
                      className="py-1 px-2 cursor-pointer pr-10"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start">
        {/* Sidebar */}
        {companyData && (
          <div className="inline-block min-h-screen border-r-2 w-56 max-sm:w-20">
            <ul className="flex flex-col items-start pt-5 text-gray-800">
              {menuItems.map(({ label, icon, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    [
                      "flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100",
                      isActive ? "bg-blue-100 border-r-4 border-blue-500" : "",
                    ].join(" ")
                  }
                >
                  <img className="min-w-4" src={icon} alt={`${label} Icon`} />
                  <p className="max-sm:hidden">{label}</p>
                </NavLink>
              ))}
            </ul>
          </div>
        )}

        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
