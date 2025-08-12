import { createContext, useState, useEffect } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([]);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);

  const [companyData, setCompanyData] = useState(null);

  // Function to fetch JobData (Jobs)
  const fetchJobs = async () => {
    setJobs(jobsData);
  };

  // Function to fetch company data

  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        setCompanyData(data.company);
        //console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("fetchCompanyData", error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Retrieve the company token from localStorage
    const storedCompanyToken = localStorage.getItem("companyToken");

    // Check if token exists and is a non-empty string
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    } else {
      setShowRecruiterLogin(true); // Show recruiter login modal/component
    }
  }, []);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  const value = {
    backendUrl,
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
