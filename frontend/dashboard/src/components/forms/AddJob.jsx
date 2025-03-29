import { useState } from "react";
import { API_URL } from "../../../utilities/API_path";

const AddJob = () => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    companyId: "",
    role: "",
    jobDescription: "",
    skillsRequired: "",
    location: "",
    salary: "",
    eligibilityCriteria: { minCGPA: "", allowedBranches: "" },
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "allowedBranches") {
      setFormData({
        ...formData,
        eligibilityCriteria: {
          ...formData.eligibilityCriteria,
          allowedBranches: value.split(",").map((branch) => branch.trim()),
        },
      });
    } else if (name === "minCGPA") {
      setFormData({
        ...formData,
        eligibilityCriteria: {
          ...formData.eligibilityCriteria,
          minCGPA: value,
        },
      });
    } else if (name === "skillsRequired") {
      setFormData({
        ...formData,
        skillsRequired: value.split(",").map((skill) => skill.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("loginToken"); // Get token from localStorage

    if (!token) {
      setMessage({ type: "error", text: "Unauthorized: No login token found" });
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/add_job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "✅Job added successfully!" });
        setFormData({
          companyId: "",
          role: "",
          jobDescription: "",
          skillsRequired: "",
          location: "",
          salary: "",
          eligibilityCriteria: { minCGPA: "", allowedBranches: "" },
          deadline: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to add admin",
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
          Add Job
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
            name="companyId"
            placeholder="Company ID"
            value={formData.companyId}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <textarea
            name="jobDescription"
            placeholder="Job Description"
            value={formData.jobDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="skillsRequired"
            placeholder="Skills (comma separated)"
            value={formData.skillsRequired}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="minCGPA"
            placeholder="Min CGPA"
            value={formData.eligibilityCriteria.minCGPA}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="allowedBranches"
            placeholder="Allowed Branches (comma separated)"
            value={formData.eligibilityCriteria.allowedBranches}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
          >
            Add Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
