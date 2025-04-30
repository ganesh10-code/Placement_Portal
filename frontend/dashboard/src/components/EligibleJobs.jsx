import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utilities/api"; // Adjust the import path as necessary

const EligibleJobs = ({ logoutHandler }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchEligibleJobs = async () => {
    try {
      const { response, data } = await fetchWithAuth(
        "/student/eligible_jobs", // corrected route with hyphen
        logoutHandler
      );
      if (response.ok) {
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } else {
        console.error("Failed to fetch jobs:", data.message || data.error);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchEligibleJobs();
  }, []);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleBackClick = () => {
    setSelectedJob(null);
  };

  return (
    <div className="p-6 bg-lightGray min-h-screen">
      {!selectedJob ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-deepBlue">
            Eligible Job Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.length === 0 ? (
              <p className="text-sm text-gray-500">No eligible jobs found.</p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="flex-1 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
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
          <p className="text-darkGray text-lg">{selectedJob.companyId?.name}</p>
          <p className="text-sm text-gray-600 mb-4">{selectedJob.location}</p>
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
              className="text-[#3E92CC] underline mt-2 "
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedJob.applyLink}
            </a>
          </p>
          <br />
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
    </div>
  );
};

export default EligibleJobs;
