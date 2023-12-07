import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    rePassword: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
    rePassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      console.log("error is there");
    } else {
      axios
        .post("http://localhost:3001/signup", formData)
        .then((response) => {
          console.log("Response", response.data);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error", error.message);
        });
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "userName":
        newErrors.userName = value.trim() === "" ? "Full Name is required" : "";
        break;

      case "password":
        newErrors.password =
          value.length < 6 ? "Password must be at least 6 characters" : "";
        break;
      case "rePassword":
        newErrors.rePassword =
          value !== formData.password ? "Passwords do not match" : "";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-md p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="userName"
            >
              UserName
            </label>
            <input
              className={`border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.userName ? "border-red-500" : ""
              }`}
              id="userName"
              name="userName"
              type="text"
              placeholder="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
            {errors.userName && (
              <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500" : ""
              }`}
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="rePassword"
            >
              Re-enter Password
            </label>
            <input
              className={`border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.rePassword ? "border-red-500" : ""
              }`}
              id="rePassword"
              name="rePassword"
              type="password"
              placeholder="Re-enter Password"
              value={formData.rePassword}
              onChange={handleChange}
              required
            />
            {errors.rePassword && (
              <p className="text-red-500 text-xs mt-1">{errors.rePassword}</p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
          <div className="mt-4">
            <p
              className="text-center cursor-pointer text-blue-500 hover:underline"
              onClick={() => navigate("/")}
            >
              Already logged in.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
