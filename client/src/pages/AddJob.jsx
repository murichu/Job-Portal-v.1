import React, { useEffect, useRef, useState, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Quill styles
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AddJob = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Select Location");
  const [category, setCategory] = useState("Select Category");
  const [level, setLevel] = useState("Select Level");
  const [salary, setSalary] = useState(0);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write job description here...",
      });
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const description = quillRef.current.root.innerHTML.trim();

    if (!description || description === "<p><br></p>") {
      return toast.error("Job description cannot be empty");
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        { title, description, location, salary, category, level },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        setLocation("Select Location");
        setCategory("Select Category");
        setLevel("Select Level");
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="container border border-gray-200 p-4 flex flex-col rounded mx-auto items-start gap-3 mt-3 ml-4 w-full max-w-3xl"
    >
      {/* Job Title */}
      <div className="w-full">
        <p className="mb-2 font-medium">Job Title</p>
        <input
          type="text"
          placeholder="Type here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
          className="w-full px-3 py-2 border-2 border-gray-300 rounded"
        />
      </div>

      {/* Job Description */}
      <div className="w-full">
        <p className="my-2 font-medium">Job Description</p>
        <div
          ref={editorRef}
          className="border border-gray-300 rounded min-h-[150px]"
        />
      </div>

      {/* Job Category, Location, and Level */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex-1">
          <p className="mb-2 font-medium">Job Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
          >
            {JobCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <p className="mb-2 font-medium">Job Location</p>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
          >
            {JobLocations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <p className="mb-2 font-medium">Job Level</p>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
          >
            <option value="Beginner level">Select Level</option>
            <option value="Beginner level">Beginner Level</option>
            <option value="Intermediate level">Intermediate Level</option>
            <option value="Senior level">Senior Level</option>
          </select>
        </div>
      </div>

      {/* Salary */}
      <div>
        <p className="mb-2 font-medium">Job Salary</p>
        <input
          min={0}
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          placeholder="2500"
          className="w-full sm:w-[120px] px-3 py-2 border-2 border-gray-300 rounded"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 mt-4 rounded text-white transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Posting...
          </div>
        ) : (
          "Add"
        )}
      </button>
    </form>
  );
};

export default AddJob;
