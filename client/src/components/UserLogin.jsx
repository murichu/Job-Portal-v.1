import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserLogin = () => {
  const navigate = useNavigate();

  // Form state
  const [formType, setFormType] = useState("Login"); // "Login" or "Sign Up"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null); // Profile image file
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false); // Controls two-step signup flow
  const [imageUrl, setImageUrl] = useState(null); // URL for preview

  const { setShowUserLogin, backendUrl, setToken, setUserData } =
    useContext(AppContext);

  // Create and cleanup image preview URL
  useEffect(() => {
    if (!image) {
      setImageUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  // Lock scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = (data) => {
    setUserData(data.user);
    setToken(data.token);
    localStorage.setItem("Token", data.token);
    setShowUserLogin(false);
    navigate("/");
  };

  // Handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // For Sign Up: first submit text data, then ask for image upload
    if (formType === "Sign Up" && !isTextDataSubmitted) {
      setIsTextDataSubmitted(true);
      return;
    }

    try {
      if (formType === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (data.success) {
          handleAuthSuccess(data);
        } else {
          toast.error(data.message);
        }
      } else {
        // Sign Up: send form data with image
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) formData.append("image", image);

        const { data } = await axios.post(
          `${backendUrl}/api/user/register`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (data.success) {
          handleAuthSuccess(data);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("User login error", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/40 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500 w-full max-w-md"
      >
        {/* Close button */}
        <img
          onClick={() => setShowUserLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt="Close"
        />

        {/* Heading */}
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          User {formType}
        </h1>
        <p className="text-sm mb-4 text-center">
          {formType === "Login"
            ? "Welcome back! Please sign in to continue."
            : "Create an account to get started."}
        </p>

        {/* Second step of Sign Up: image upload */}
        {formType === "Sign Up" && isTextDataSubmitted ? (
          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image" className="cursor-pointer">
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={imageUrl || assets.upload_area}
                alt="Upload Profile"
              />
              <input
                id="image"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <p>Upload Profile Picture</p>
          </div>
        ) : (
          <>
            {/* Name input only for Sign Up */}
            {formType === "Sign Up" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
                <img src={assets.person_icon} alt="Name Icon" />
                <input
                  className="outline-none text-sm w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Name"
                  required
                />
              </div>
            )}

            {/* Email field */}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
              <img src={assets.email_icon} alt="Email Icon" />
              <input
                className="outline-none text-sm w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                required
              />
            </div>

            {/* Password field */}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-lg mt-5">
              <img src={assets.lock_icon} alt="Password Icon" />
              <input
                className="outline-none text-sm w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        {/* Forgot Password (Login only) */}
        {formType === "Login" && (
          <p className="text-sm text-blue-600 mt-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
        >
          {formType === "Login"
            ? "Login"
            : isTextDataSubmitted
            ? "Create Account"
            : "Next"}
        </button>

        {/* Toggle form type */}
        <p className="mt-5 text-center">
          {formType === "Login" ? (
            <>
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setFormType("Sign Up");
                  setIsTextDataSubmitted(false);
                }}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  setFormType("Login");
                  setIsTextDataSubmitted(false);
                }}
              >
                Login
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default UserLogin;
