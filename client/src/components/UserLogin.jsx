import React, { useContext, useState, useEffect, useCallback } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const UserLogin = () => {
  const navigate = useNavigate();

  // Form state
  const [formType, setFormType] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const { setShowUserLogin, backendUrl, setToken, setUserData } =
    useContext(AppContext);

  // Memoized input change handler
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field-specific error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

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
  const handleAuthSuccess = useCallback(
    (data) => {
      setUserData(data.user);
      setToken(data.token);
      localStorage.setItem("Token", data.token);
      setShowUserLogin(false);
      toast.success(`Welcome ${data.user.name}!`);
      navigate("/");
    },
    [setUserData, setToken, setShowUserLogin, navigate]
  );

  // Handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // For Sign Up: first submit text data, then ask for image upload
    if (formType === "Sign Up" && !isTextDataSubmitted) {
      setIsTextDataSubmitted(true);
      return;
    }

    setIsLoading(true);

    try {
      if (formType === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email: formData.email,
          password: formData.password,
        });

        if (data.success) {
          handleAuthSuccess(data);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        // Sign Up: send form data with image
        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("email", formData.email);
        submitData.append("password", formData.password);
        if (image) submitData.append("image", image);

        const { data } = await axios.post(
          `${backendUrl}/api/user/register`,
          submitData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (data.success) {
          handleAuthSuccess(data);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("User login error", error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when switching between login/signup
  const handleFormTypeChange = useCallback((newType) => {
    setFormType(newType);
    setIsTextDataSubmitted(false);
    setErrors({});
    setFormData({ name: "", email: "", password: "" });
    setImage(null);
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-12 rounded-xl text-slate-500 w-full max-w-md mx-4 shadow-2xl"
      >
        {/* Close modal */}
        <img
          onClick={() => setShowUserLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt="Close"
        />

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-700 mb-2">
            {formType === "Login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-gray-600">
            {formType === "Login"
              ? "Sign in to continue to your account"
              : "Join us to find your dream job"}
          </p>
        </div>

        {/* Second step of Sign Up: image upload */}
        {formType === "Sign Up" && isTextDataSubmitted ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <label htmlFor="image" className="cursor-pointer group">
                <div className="relative">
                  <img
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                    src={imageUrl || assets.upload_area}
                    alt="Upload Profile"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs">Change</span>
                  </div>
                </div>
                <input
                  id="image"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  disabled={isLoading}
                />
              </label>
              <p className="text-sm text-gray-600">Upload Profile Picture</p>
              {errors.image && (
                <p className="text-red-500 text-xs">{errors.image}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Name input only for Sign Up */}
            {formType === "Sign Up" && (
              <div>
                <div className="border border-gray-300 px-4 py-3 flex items-center gap-3 rounded-lg focus-within:border-blue-500 transition-colors">
                  <img
                    src={assets.person_icon}
                    alt="Name Icon"
                    className="w-4 h-4"
                  />
                  <input
                    className="outline-none text-sm w-full placeholder-gray-400"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    type="text"
                    placeholder="Full Name"
                    disabled={isLoading}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email field */}
            <div>
              <div className="border border-gray-300 px-4 py-3 flex items-center gap-3 rounded-lg focus-within:border-blue-500 transition-colors">
                <img
                  src={assets.email_icon}
                  alt="Email Icon"
                  className="w-4 h-4"
                />
                <input
                  className="outline-none text-sm w-full placeholder-gray-400"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  type="email"
                  placeholder="Email Address"
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password field with Eye icon for toggle */}
            <div>
              <div className="border border-gray-300 px-4 py-3 flex items-center gap-3 rounded-lg focus-within:border-blue-500 transition-colors relative">
                <img
                  src={assets.lock_icon}
                  alt="Password Icon"
                  className="w-4 h-4"
                />
                <input
                  className="outline-none text-sm w-full placeholder-gray-400"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  type={showPassword ? "text" : "password"} // Toggle input type
                  placeholder="Password"
                  disabled={isLoading}
                  required
                />
                {/* Eye icon for password visibility toggle */}
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-600" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>
        )}

        {/* Forgot Password (Login only) */}
        {formType === "Login" && (
          <div className="text-right mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg mt-6 font-medium transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {formType === "Login"
                ? "Signing in..."
                : isTextDataSubmitted
                ? "Creating Account..."
                : "Processing..."}
            </>
          ) : formType === "Login" ? (
            "Sign In"
          ) : isTextDataSubmitted ? (
            "Create Account"
          ) : (
            "Continue"
          )}
        </button>

        {/* Toggle form type */}
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {formType === "Login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  onClick={() => handleFormTypeChange("Sign Up")}
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  onClick={() => handleFormTypeChange("Login")}
                  disabled={isLoading}
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
