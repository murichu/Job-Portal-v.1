import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext(); // Create global context

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Backend API base URL from environment variables

  // State for search filters when browsing jobs
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  // Flag to indicate if a search has been performed
  const [isSearched, setIsSearched] = useState(false);

  // List of jobs fetched from the backend
  const [jobs, setJobs] = useState([]);

  // Controls User login modal visibility
  const [showUserLogin, setShowUserLogin] = useState(false);

  // Token for authenticated user requests
  const [token, setToken] = useState(null);

  // Controls recruiter login modal visibility
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  // Token for authenticated company requests
  const [companyToken, setCompanyToken] = useState(null);

  // Company data fetched from backend
  const [companyData, setCompanyData] = useState(null);

  // Holds the current logged-in user's information (e.g., name, email, profile details)
  const [userData, setUserData] = useState(null);

  // Holds the list of job applications made by the current user
  const [userApplications, setUserApplications] = useState(null);

  /**
   * Fetches all job listings from backend
   */
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);

      if (data.success) {
        setJobs(data.jobs);
        // console.log(data.jobs); // Debugging line (can be removed in production)
      } else {
        toast.error(data.message || "Failed to fetch jobs.");
      }
    } catch (error) {
      console.log("fetchJobs error:", error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching jobs."
      );
    }
  };

  /**
   * Fetches company details using the stored company token
   */
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        setCompanyData(data.company);
        // console.log(data);
      } else {
        toast.error(data.message || "Failed to fetch company data.");
      }
    } catch (error) {
      console.log("fetchCompanyData error:", error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching company data."
      );
    }
  };

  //Function to fetch user data
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/user`, {
        headers: { token: token },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message || "Failed to fetch user data.");
      }
    } catch (error) {
      console.log("fetchUserData error:", error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching user data."
      );
    }
  };

  //Function to fetch user applications
  const fetchUserApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/applications`, {
        headers: { token: token },
      });

      if (data.success) {
        setUserApplications(data.applications);
      }
    } catch (error) {
      console.log("fetchUserApplications error:", error.message);
    }
  };

  /**
   * Runs once on component mount:
   * - Fetches jobs
   * - Retrieves stored company token from localStorage
   */
  useEffect(() => {
    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }

    const storedUserToken = localStorage.getItem("Token");
    if (storedUserToken) {
      setToken(storedUserToken); // triggers another useEffect
    }
  }, []);

  /**
   * Runs whenever companyToken changes:
   * - Fetches company data if token exists
   */
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [token]);

  // Values accessible across the app via context
  const value = {
    backendUrl,
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    token,
    setToken,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    userData,
    setUserData,
    fetchUserData,
    userApplications,
    setUserApplications,
    fetchUserApplications,
    showUserLogin,
    setShowUserLogin,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
