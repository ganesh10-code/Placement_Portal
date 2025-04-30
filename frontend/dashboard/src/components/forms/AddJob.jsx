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
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleBackClick = () => {
    setSelectedJob(null);
  };

  const [formData, setFormData] = useState({
    role: "",
    jobDescription: "",
    skillsRequired: "",
    location: "",
    salary: "",
    eligibilityCriteria: { minCGPA: "", allowedBranches: "" },
    applyLink: "",
    jobType: "",
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
          applyLink: "",
          jobType: "",
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
          {!selectedJob && (
            <>
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
            </>
          )}

          {!selectedJob ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.length === 0 ? (
                  <p className="text-sm text-gray-500">No jobs found.</p>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition cursor-pointer border"
                      onClick={() => handleJobClick(job)}
                    >
                      <h3 className="text-xl font-bold text-deepBlue">
                        {job.role}{" "}
                        <span className="text-sm text-gray-600 capitalize">
                          ({job.jobType || "Full-time"})
                        </span>
                      </h3>
                      <p className="text-darkGray">
                        {job.companyId?.name || "Unknown Company"}
                      </p>
                      <p className="text-successGreen font-semibold">
                        ₹{job.salary} LPA
                      </p>
                      <p className="text-s text-red-600 mt-1">
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="bg-white shadow-md rounded-2xl p-6">
              <button
                className="mb-4 px-4 py-2 bg-[#041931] hover:bg-[#3E92CC] text-white rounded-xl"
                onClick={handleBackClick}
              >
                ← Back to Job List
              </button>
              <h2 className="text-2xl font-bold text-[#041931] mb-2">
                {selectedJob.role}{" "}
                <span className="text-xl font-semibold">
                  ({selectedJob.jobType || "Full-time"})
                </span>
              </h2>
              <p className="text-darkGray text-lg">
                {selectedJob.companyId?.name}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {selectedJob.location}
              </p>
              <p className="text-successGreen text-lg font-medium">
                ₹{selectedJob.salary} LPA
              </p>
              <hr className="my-4" />
              <h3 className="text-lg font-semibold text-deepBlue mb-2">
                Job Description
              </h3>
              <p className="text-base text-gray-700 whitespace-pre-line">
                {selectedJob.jobDescription}
              </p>
              <hr className="my-4" />
              {selectedJob.eligibilityCriteria && (
                <>
                  <h3 className="text-lg font-semibold text-deepBlue mb-2">
                    Eligibility Criteria
                  </h3>
                  <p className="text-base text-gray-700 whitespace-pre-line mb-4">
                    <strong>Minimum CGPA: </strong>
                    {selectedJob.eligibilityCriteria.minCGPA}
                    <br />
                    <strong>Allowed Branches: </strong>
                    {selectedJob.eligibilityCriteria.allowedBranches.join(", ")}
                  </p>
                </>
              )}

              {selectedJob.skillsRequired &&
                selectedJob.skillsRequired.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold text-deepBlue mb-2">
                      Skills Required
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                      {selectedJob.skillsRequired.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </>
                )}
              <br />
              <p>
                To Apply visit{" "}
                <a
                  href={
                    selectedJob.applyLink.startsWith("http://") ||
                    selectedJob.applyLink.startsWith("https://")
                      ? selectedJob.applyLink
                      : `https://${selectedJob.applyLink}`
                  }
                  className="text-[#3E92CC] underline mt-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedJob.applyLink}
                </a>
              </p>
              {selectedJob.companyId?.website && (
                <p>
                  For More Details,{" "}
                  <a
                    href={
                      selectedJob.applyLink.startsWith("http://") ||
                      selectedJob.applyLink.startsWith("https://")
                        ? selectedJob.applyLink
                        : `https://${selectedJob.applyLink}`
                    }
                    className="text-blue-600 underline mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Company Website
                  </a>
                </p>
              )}
              <p className="mt-4 text-sm text-red-600">
                <strong>Deadline:</strong>{" "}
                {new Date(selectedJob.deadline).toLocaleDateString()}
              </p>
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
              placeholder="LPA"
              step={0.01}
              className="border p-2 w-full mb-2"
              onChange={handleChange}
              required
            />
            <div>
              <input
                type="number"
                name="minCGPA"
                step={0.01}
                placeholder="Minimum CGPA"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="allowedBranches"
                placeholder="Allowed Branches (comma-separated)"
                className="border p-2 w-full mb-2"
                onChange={handleChange}
                required
              />
            </div>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
              required
            >
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>

            <input
              type="text"
              name="applyLink"
              placeholder="Application Link"
              className="border p-2 w-full mb-2"
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="deadline"
              placeholder="Deadline"
              className="border p-2 w-full mb-2"
              onChange={handleChange}
              required
            />
            <div className="text-center mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#041931] text-white rounded-lg hover:bg-[#3E9200]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddJob;
