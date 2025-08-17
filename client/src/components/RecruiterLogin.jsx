import React, { useContext, useState, useEffect, useCallback } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Building2,
  Phone,
  User,
  Briefcase,
  Mail,
  Lock,
  MapPin,
} from "lucide-react";

const RecruiterLogin = () => {
  const navigate = useNavigate();

  const [state, setState] = useState("Login"); // "Login" or "Sign Up"
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterPosition, setRecruiterPosition] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // for preview
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  const handleAuthSuccess = useCallback(
    (data) => {
      setCompanyData(data.company);
      setCompanyToken(data.token);
      localStorage.setItem("companyToken", data.token);
      setShowRecruiterLogin(false);
      navigate("/dashboard");
    },
    [setCompanyData, setCompanyToken, setShowRecruiterLogin, navigate]
  );

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === "Sign Up" && !isTextDataSubmitted) {
      setIsTextDataSubmitted(true);
      return;
    }

    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });

        data.success ? handleAuthSuccess(data) : toast.error(data.message);
      } else {
        const formPayload = new FormData();
        formPayload.append("name", name);
        formPayload.append("recruiterName", recruiterName);
        formPayload.append("recruiterPosition", recruiterPosition);
        formPayload.append("companyPhone", companyPhone);
        formPayload.append("email", email);
        formPayload.append("password", password);
        formPayload.append("companyLocation", companyLocation);
        if (image) formPayload.append("image", image);

        const { data } = await axios.post(
          `${backendUrl}/api/company/register`,
          formPayload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        data.success ? handleAuthSuccess(data) : toast.error(data.message);
      }
    } catch (error) {
      console.error("Recruiter login error", error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!image) {
      setImageUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Reset form when switching between login/signup
  const handleFormTypeChange = (newType) => {
    setState(newType);
    setIsTextDataSubmitted(false);
    setName("");
    setEmail("");
    setPassword("");
    setImage(null);
    setCompanyPhone("");
    setRecruiterPosition("");
    setRecruiterName("");
  };

  return (
    <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/40 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-12 rounded-xl text-slate-500 w-full max-w-md mx-4 shadow-2xl"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-700 mb-2">
            {state === "Login"
              ? "Welcome Back, Recruiter"
              : "Create Company Account"}
          </h1>
          <p className="text-sm text-gray-600">
            {state === "Login"
              ? "Sign in to manage job postings and track candidates"
              : "Join us to connect with top talent and grow your team"}
          </p>
        </div>

        {state === "Sign Up" && isTextDataSubmitted ? (
          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image">
              <img
                className="w-16 rounded-full"
                src={imageUrl || assets.upload_area}
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
            {state === "Sign Up" && (
              <>
                {/* Company Name */}
                <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <input
                    className="outline-none text-sm flex-1"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder="Company Name"
                    required
                  />
                </div>

                {/* Company Phone */}
                <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <input
                    className="outline-none text-sm flex-1"
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    value={companyPhone}
                    type="text"
                    placeholder="Company Contact"
                    required
                  />
                </div>

                {/* Company Location */}
                <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <input
                    className="outline-none text-sm flex-1"
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    value={companyLocation}
                    type="text"
                    placeholder="Company Location (City, Country)"
                    required
                  />
                </div>

                {/* Recruiter Name */}
                <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
                  <User className="w-5 h-5 text-gray-500" />
                  <input
                    className="outline-none text-sm flex-1"
                    onChange={(e) => setRecruiterName(e.target.value)}
                    value={recruiterName}
                    type="text"
                    placeholder="Your Full Name"
                    required
                  />
                </div>

                {/* Recruiter Position */}
                <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <input
                    className="outline-none text-sm flex-1"
                    onChange={(e) => setRecruiterPosition(e.target.value)}
                    value={recruiterPosition}
                    type="text"
                    placeholder="Your Position (e.g., HR Manager)"
                    required
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
              <Mail className="w-5 h-5 text-gray-500" />
              <input
                className="outline-none text-sm flex-1"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Id"
                required
              />
            </div>

            {/* Password */}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
              <Lock className="w-5 h-5 text-gray-500" />
              <input
                className="outline-none text-sm flex-1"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        {state === "Login" && (
          <p className="text-sm text-blue-600 mt-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
        >
          {state === "Login"
            ? "Login"
            : isTextDataSubmitted
            ? "Create Account"
            : "Next"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => handleFormTypeChange("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => handleFormTypeChange("Login")}
            >
              Login
            </span>
          </p>
        )}

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
