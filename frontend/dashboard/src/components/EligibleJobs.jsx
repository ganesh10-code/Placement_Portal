import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utilities/api"; // Adjust the import path as necessary

const EligibleJobs = ({ logoutHandler }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [message, setMessage] = useState(null);

  // Fetch eligible jobs
  const fetchEligibleJobs = async () => {
    try {
      const { response, data } = await fetchWithAuth(
        "/student/eligible_jobs", // corrected route with hyphen
        logoutHandler
      );
      if (response.ok) {
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
        const backendAppliedJobs = data.appliedJobIds || [];
        const storedAppliedJobs =
          JSON.parse(localStorage.getItem("appliedJobs")) || [];

        const merged = [
          ...new Set([...backendAppliedJobs, ...storedAppliedJobs]),
        ];
        setAppliedJobs(merged);
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

  // On component mount, check for applied jobs in localStorage
  useEffect(() => {
    const storedAppliedJobs =
      JSON.parse(localStorage.getItem("appliedJobs")) || [];
    if (appliedJobs.length > 0) {
      const merged = [...new Set([...appliedJobs, ...storedAppliedJobs])];
      setAppliedJobs(merged);
    } else {
      setAppliedJobs(storedAppliedJobs);
    }
  }, []);

  // Update localStorage whenever appliedJobs changes
  useEffect(() => {
    if (appliedJobs.length > 0) {
      localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
    }
  }, [appliedJobs]);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleBackClick = () => {
    setSelectedJob(null);
  };

  const markAsApplied = async (jobId) => {
    try {
      const { response, data } = await fetchWithAuth(
        `/student/apply_job/${jobId}`,
        logoutHandler,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        // Add to appliedJobs state and update localStorage
        setAppliedJobs((prev) => {
          const updatedJobs = [...prev, jobId];
          localStorage.setItem("appliedJobs", JSON.stringify(updatedJobs)); // Persist to localStorage
          return updatedJobs;
        });
        setMessage({
          type: "success",
          text: "✅ Marked as Applied successfully!",
        });
      } else {
        alert(data.message || "Failed to mark as applied");
        setMessage({
          type: "error",
          text: data.message || "Failed to mark as applied",
        });
      }
    } catch (error) {
      alert("Error applying to job");
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="p-6 bg-lightGray min-h-screen">
      {message && (
        <p
          className={`p-2 rounded ${
            message.type === "success" ? "bg-green-200" : "bg-red-200"
          }`}
        >
          {message.text}
        </p>
      )}
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
                      ({job.jobType || "Full-time"} )
                    </span>
                  </h3>

                  <p className="text-darkGray">
                    {job.companyId?.name || "Unknown Company"}
                  </p>
                  <p className="text-successGreen font-semibold">
                    ₹{job.salary} LPA
                  </p>
                  <div className="flex justify-between items-center ">
                    <p className=" text-s text-red-600 mt-1">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </p>
                    <span className="flex justify-end mt-4">
                      {appliedJobs.includes(job._id) ? (
                        <button
                          className="bg-[#80e317] text-white px-4 py-2 rounded-xl cursor-default"
                          disabled
                        >
                          Applied
                        </button>
                      ) : (
                        <button
                          className="bg-[#f86a20] text-white text-s px-3 py-1 rounded-xl hover:bg-[#ff7a20]"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering job click
                            markAsApplied(job._id);
                          }}
                        >
                          Mark as Applied
                        </button>
                      )}
                    </span>
                  </div>
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
          <div className="flex items-center justify-between mr-10 mb-2">
            <h2 className="text-2xl font-bold text-[#041931] mb-2">
              {selectedJob.role}{" "}
              <span className="text-xl font-semibold">
                ({selectedJob.jobType || "Full-time"})
              </span>
            </h2>
            {appliedJobs.includes(selectedJob._id) ? (
              <button
                className="bg-[#80e317] text-white px-2 py-2 rounded-xl cursor-default"
                disabled
              >
                Applied
              </button>
            ) : (
              <button
                className="bg-[#f86a20] text-white text-s px-3 py-1 rounded-xl hover:bg-[#ff7a20]"
                onClick={() => markAsApplied(selectedJob._id)}
              >
                Mark as Applied
              </button>
            )}
          </div>
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
