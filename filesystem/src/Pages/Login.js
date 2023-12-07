import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (name === "userName") {
      newErrors.userName = value.trim() === "" ? "User Name is required" : "";
    }
    if (name === "password") {
      newErrors.password = value.trim() === "" ? "Password is required" : "";
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(errors).length === 0) {
      console.log("error is there");
    } else {
      axios
        .post("http://localhost:3001/login", formData)
        .then((response) => {
          const expirationDate = new Date(new Date().getTime() + 60 * 60000);
          Cookies.set("token", response.data.access_token, {
            expires: expirationDate,
          });
          console.log(response);
          navigate("/home");
        })
        .catch((error) => {
          console.error("Error", error.message);
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-md p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="userName"
            >
              User Name
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
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded focus-outline-none focus-shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
          <div className="mt-4">
            <p
              className="text-center cursor-pointer text-blue-500 hover:underline"
              onClick={() => navigate("/signup")}
            >
              create user.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
