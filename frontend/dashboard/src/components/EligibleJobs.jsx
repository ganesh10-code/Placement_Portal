import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utilities/api"; // Adjust the import path as necessary

const EligibleJobs = ({ logoutHandler }) => {
  const [jobs, setJobs] = useState([]);

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

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Job Notifications</h2>
      <ul className="space-y-2">
        {jobs.length === 0 ? (
          <p className="text-sm text-gray-500">No eligible jobs found.</p>
        ) : (
          jobs.map((job) => (
            <li key={job._id} className="text-sm">
              <span className="text-blue-600 font-medium">{job.role}</span> at{" "}
              {job.companyId?.name || "Unknown Company"} —{" "}
              <span className="text-gray-500 text-xs">
                {new Date(job.deadline).toLocaleDateString()}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default EligibleJobs;
