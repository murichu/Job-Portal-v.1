import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create axios instance with default config
const api = axios.create({
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token (user or company)
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("Token");
    const companyToken = localStorage.getItem("companyToken");

    const token = userToken || companyToken; // Prefer userToken if both exist
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("Token");
      localStorage.removeItem("companyToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

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
  const fetchJobs = async (useCache = true) => {
    // Simple cache mechanism
    const cacheKey = "jobs_cache";
    const cacheTimeKey = "jobs_cache_time";
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes

    if (useCache) {
      const cachedJobs = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);

      if (
        cachedJobs &&
        cacheTime &&
        Date.now() - parseInt(cacheTime) < cacheExpiry
      ) {
        setJobs(JSON.parse(cachedJobs));
        return;
      }
    }

    try {
      const { data } = await api.get(`${backendUrl}/api/jobs`);

      if (data.success) {
        setJobs(data.jobs);
        // Cache the jobs
        localStorage.setItem(cacheKey, JSON.stringify(data.jobs));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
      } else {
        toast.error(data.message || "Failed to fetch jobs.");
      }
    } catch (error) {
      console.log("fetchJobs error:", error.message);
      if (!error.response || error.response.status >= 500) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch jobs.");
      }
    }
  };

  /**
   * Fetches company details using the stored company token
   */
  const fetchCompanyData = async () => {
    try {
      const { data } = await api.get(`${backendUrl}/api/company/company`);

      if (data.success) {
        setCompanyData(data.company);
        console.log(data.company);
      } else {
        toast.error(data.message || "Failed to fetch company data.");
      }
    } catch (error) {
      console.log("fetchCompanyData error:", error.message);
      if (!error.response || error.response.status >= 500) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to fetch company data."
        );
      }
    }
  };

  //Function to fetch user data
  const fetchUserData = async () => {
    try {
      const { data } = await api.get(`${backendUrl}/api/user/user`);

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message || "Failed to fetch user data.");
      }
    } catch (error) {
      console.log("fetchUserData error:", error.message);
      if (error.response?.status !== 401) {
        toast.error(
          error.response?.data?.message || "Failed to fetch user data."
        );
      }
    }
  };

  //Function to fetch user applications
  const fetchUserApplications = async () => {
    try {
      const { data } = await api.get(`${backendUrl}/api/user/applications`);

      if (data.success) {
        setUserApplications(data.applications);
      }
    } catch (error) {
      console.log("fetchUserApplications error:", error.message);
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUserData(null);
    setUserApplications(null);
    localStorage.removeItem("Token");
    // Clear jobs cache on logout
    localStorage.removeItem("jobs_cache");
    localStorage.removeItem("jobs_cache_time");
    toast.success("Logged out successfully");
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
    logout,
    api, // Expose configured axios instance
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
