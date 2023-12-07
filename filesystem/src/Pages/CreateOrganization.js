import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateOrganization = () => {
  const [formData, setFormData] = useState({
    org_name: "",
    domain: "",
    is_active: true,
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.org_name || !formData.domain) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios
        .post("http://localhost:3001/api/organization", formData)
        .then((res) => {
          navigate(`/signup/${res.data.organization.id}`);
        })
        .catch((err) => {
          throw new Error("Failed to create organization.");
        });

      console.log(response);

      setFormData({
        orgName: "",
        domain: "",
      });
      setError("");
      console.log("Organization created successfully!");
    } catch (error) {
      setError("Error creating organization. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create Organization</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="org_name"
            className="block text-sm font-medium text-gray-600"
          >
            Organization Name:
          </label>
          <input
            type="text"
            id="org_name"
            value={formData.org_name}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="domain"
            className="block text-sm font-medium text-gray-600"
          >
            Domain:
          </label>
          <input
            type="text"
            id="domain"
            value={formData.domain}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Create Organization
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrganization;
