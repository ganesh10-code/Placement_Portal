import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../utilities/api";

const AddJob = ({ logoutHandler }) => {
  const [message, setMessage] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showJobs, setShowJobs] = useState(true);
  const [showCompanies, setShowCompanies] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    jobDescription: "",
    skillsRequired: "",
    location: "",
    salary: "",
    eligibilityCriteria: { minCGPA: "", allowedBranches: "" },
    deadline: "",
  });

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  const fetchJobs = async () => {
    try {
      const { response, data } = await fetchWithAuth(
        "/admin/get_all_jobs",
        logoutHandler
      );
      if (response.ok) {
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      } else {
        console.error("Failed to fetch jobs:", data.error);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const { response, data } = await fetchWithAuth(
        "/admin/get_all_companies",
        logoutHandler
      );
      if (response.ok) {
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error("Error fetching Companies:", error);
    }
  };

  const handleSearch = () => {
    const filtered = jobs.filter((job) =>
      job.companyId.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setShowCompanies(false);
    setShowForm(true);
  };

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
    try {
      const { response, data } = await fetchWithAuth(
        "/admin/add_job",
        logoutHandler,
        {
          method: "POST",
          body: JSON.stringify({ ...formData, companyId: selectedCompany._id }),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "✅ Job added successfully!" });
        setFormData({
          role: "",
          jobDescription: "",
          skillsRequired: "",
          location: "",
          salary: "",
          eligibilityCriteria: { minCGPA: "", allowedBranches: "" },
          deadline: "",
        });
        setShowForm(false);
        setShowJobs(true);
        fetchJobs();
      } else {
        console.error("failed to Add jobs:", data.error);
        setMessage({
          type: "error",
          text: data.message || "Failed to add job",
        });
      }
    } catch (error) {
      console.error("Error in adding job:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center align-center w-full">
      {showJobs && (
        <div className="bg-white rounded-lg shadow-lg mx-auto m-auto w-full p-6 mt-1">
          <h2 className="text-2xl font-bold text-center mb-4">All Jobs</h2>
          {message && (
            <p
              className={`p-2 rounded ${
                message.type === "success" ? "bg-green-200" : "bg-red-200"
              }`}
            >
              {message.text}
            </p>
          )}
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search by company name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 w-full rounded-l-md"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white p-2 rounded-r-md"
            >
              Search
            </button>
          </div>

          {!showForm && !showCompanies && (
            <div className="p-3 bg-gray-50 rounded-lg shadow-inner">
              {companies.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job._id}
                      className="p-4 bg-white rounded-lg shadow-md border transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                    >
                      <h4 className="font-bold text-lg text-[#041931]">
                        📌 {job.role} at {job.companyId.name}
                      </h4>
                      <p className="text-gray-700 mt-2 text-sm">
                        {job.jobDescription}
                      </p>
                      <div className="text-gray-700 mt-2 text-sm space-x-2">
                        <span className="font-semibold">
                          {job.skillsRequired}
                        </span>{" "}
                        | <span>{job.location}</span> |{" "}
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No Company found</p>
              )}
            </div>
          )}

          <button
            onClick={() => {
              setShowCompanies(true);
              setShowJobs(false);
            }}
            className="w-auto px-6 mt-4 bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
          >
            + Add Job
          </button>
        </div>
      )}

      {showCompanies && (
        <div className="p-6 bg-white rounded-lg shadow-lg mx-auto m-auto w-[80%] mt-10">
          <button
            onClick={() => {
              setShowJobs(true);
              setShowCompanies(false);
              setShowForm(false);
            }}
            className="w-auto px-6 mt-4 bg-gray-300 text-[#041931] py-2 rounded-lg hover:bg-[#3E9200] transition-all"
          >
            Back to Job List
          </button>
          <h3 className="text-xl font-bold mb-2">Select a Company</h3>
          {companies.map((company) => (
            <button
              key={company._id}
              onClick={() => handleCompanySelect(company)}
              className="block border p-2 mb-2 w-full text-left transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              {company.name}
            </button>
          ))}
        </div>
      )}

      {showForm && selectedCompany && (
        <div className="p-6 bg-white rounded-lg shadow-lg mx-auto m-auto w-96 mt-10">
          <button
            onClick={() => {
              setShowJobs(true);
              setShowCompanies(false);
              setShowForm(false);
            }}
            className="w-auto px-6 mt-4 bg-gray-300 text-[#041931] py-2 rounded-lg hover:bg-[#3E9200] transition-all"
          >
            Back to Job List
          </button>
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-2">
              Add Job at {selectedCompany.name}
            </h3>
            <input
              type="text"
              name="role"
              placeholder="Role"
              className="border p-2 w-full mb-2"
              onChange={handleChange}
              required
            />
            <textarea
              name="jobDescription"
              placeholder="Description"
              className="border p-2 w-full mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="skillsRequired"
              placeholder="Skills"
              className="border p-2 w-full mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="border p-2 w-full mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="salary"
              placeholder="Salary"
              className="border p-2 w-full mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="deadline"
              className="border p-2 w-full mb-2"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddJob;
