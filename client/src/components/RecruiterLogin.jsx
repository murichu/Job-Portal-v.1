import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterLogin = () => {
  const navigate = useNavigate();

  // Form state
  const [state, setState] = useState("Login"); // "Login" or "Sign Up"
  const [name, setName] = useState(""); // Company name (signup only)
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(false); // Company logo file (signup second step)

  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false); // Controls two-step signup flow

  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  // Handle authentication success
  const handleAuthSuccess = (data) => {
    //console.log(data);
    setCompanyData(data.company);
    setCompanyToken(data.token);
    localStorage.setItem("companyToken", data.token);
    setShowRecruiterLogin(false);
    navigate("/dashboard");
  };

  // Handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Step 1 of signup: only text fields, then ask for logo
    if (state === "Sign Up" && !isTextDataSubmited) {
      setIsTextDataSubmited(true);
      return; // Prevent API call on first step
    }

    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });

        if (data.success) {
          handleAuthSuccess(data);
        } else {
          toast.error(data.message);
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) formData.append("image", image);

        const { data } = await axios.post(
          `${backendUrl}/api/company/register`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (data.success) {
          handleAuthSuccess(data);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Recruiter login error", error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Lock scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/40 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {/* Second step of signup: upload logo */}
        {state === "Sign Up" && isTextDataSubmited ? (
          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image">
              <img
                className="w-16 rounded-full"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Upload area"
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
            <p>Upload Company Logo</p>
          </div>
        ) : (
          <>
            {/* Company name field (signup only) */}
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
                <img src={assets.person_icon} alt="Company Name Icon" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}

            {/* Email field */}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
              <img src={assets.email_icon} alt="Email Icon" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Id"
                required
              />
            </div>

            {/* Password field */}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
              <img src={assets.lock_icon} alt="Password Icon" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        {/* Forgot password link (login only) */}
        {state === "Login" && (
          <p className="text-sm text-blue-600 mt-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
        >
          {state === "Login"
            ? "Login"
            : isTextDataSubmited
            ? "Create Account"
            : "Next"}
        </button>

        {/* Toggle between login/signup */}
        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}

        {/* Close modal */}
        <img
          onClick={() => setShowRecruiterLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt="Close"
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
