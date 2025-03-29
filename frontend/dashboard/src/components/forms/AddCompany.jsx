import React, { useState } from "react";
import { API_URL } from "../../../utilities/API_path";

const AddCompany = () => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
    isPopular: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("loginToken"); // Get token from localStorage

    if (!token) {
      setMessage({ type: "error", text: "Unauthorized: No login token found" });
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/add_company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "✅Company added successfully!" });
        setFormData({
          name: "",
          website: "",
          location: "",
          contactEmail: "",
          contactPhone: "",
          isPopular: false,
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to add company",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };
  return (
    <div className="flex items-center justify-center ">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96 mx-auto mt-10">
        <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
          Add Company
        </h2>
        {message && (
          <p
            className={`text-center p-2 mb-3 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Contact Email"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Contact Phone"
            className="w-full p-2 border rounded-md"
            required
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPopular"
              checked={formData.isPopular}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="isPopular" className="text-gray-700">
              Popular Company
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
          >
            Add Company
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;
