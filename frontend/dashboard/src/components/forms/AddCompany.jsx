import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../utilities/api";

const AddCompany = ({ logoutHandler }) => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
    isPopular: false,
  });
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { response, data } = await fetchWithAuth(
        "/admin/get_all_companies",
        logoutHandler
      );
      if (response.ok) {
        setCompanies(data.companies);
      } else {
        console.error("Failed to fetch companies:", data.message);
      }
    };
    fetchCompanies();
  }, [showForm]); // Refresh list when a company is added

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { response, data } = await fetchWithAuth(
        "/admin/add_company",
        logoutHandler,
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );
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
        setShowForm(false);
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
    <div className="flex flex-col items-center justify-center w-full ">
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
      {!showForm ? (
        <>
          <div className="p-3  w-full bg-white rounded-lg shadow-lg mx-auto m-auto  mt-10">
            <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
              Companies List
            </h2>
            <div className="p-3 bg-gray-50 rounded-lg shadow-inner">
              {companies.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {companies.map((company) => (
                    <div
                      key={company._id}
                      className="p-4 bg-white rounded-lg shadow-md border transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                    >
                      {" "}
                      <h4 className="font-bold text-lg text-[#041931]">
                        📌 {company.name}
                      </h4>
                      <div className="text-gray-700 mt-2 text-sm space-x-2">
                        <span className="font-semibold">{company.website}</span>{" "}
                        | <span>{company.location}</span> |{" "}
                        <span className="font-semibold">
                          {company.contactPhone}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No Company found</p>
              )}
            </div>
            {/* Show "Add Company" button */}
            <button
              onClick={() => setShowForm(true)}
              className="w-auto px-6 bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
            >
              + Add Company
            </button>
          </div>
        </>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-lg w-96 mx-auto mt-10">
          <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
            Add Company
          </h2>

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
            <div className="flex gap-2">
              <button
                type="submit"
                className="w-full bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
              >
                Add Company
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddCompany;
