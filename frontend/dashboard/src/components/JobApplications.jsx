import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utilities/api"; // Adjust the import path as necessary

const JobApplications = ({ logoutHandler }) => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      const { response, data } = await fetchWithAuth(
        "/student/applied_jobs",
        logoutHandler
      );

      if (response.ok) {
        // Ensure data.jobsApplied is an array before setting state
        setApplications(Array.isArray(data.jobs) ? data.jobs : []);
      } else {
        setError(data.message || "Failed to fetch job applications");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error fetching job applications.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-deepBlue">
        My Job Applications
      </h2>

      {error && (
        <p className="text-errorRed font-medium bg-red-50 p-3 rounded-md mb-4">
          {error}
        </p>
      )}

      {applications.length === 0 ? (
        <p className="text-white text-lg">No applications found.</p>
      ) : (
        <div className="space-y-5">
          {applications.map((app, index) => {
            const job = app.jobId;
            const company = job?.companyId;

            return (
              <div
                key={index}
                className="p-5 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
              >
                <div className="text-xl font-bold text-deepBlue">
                  {job?.role}
                </div>
                <div className="text-[#06b6d4] text-base font-medium">
                  {company?.name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Type: <span className="font-medium">{job?.jobType}</span> |
                  Salary: ₹{job?.salary?.toLocaleString()}
                </div>
                <div className="mt-3">
                  <span className="font-medium text-gray-700">Status: </span>
                  <span
                    className={`font-bold ${
                      app.status === "Accepted"
                        ? "text-[#80e917]"
                        : app.status === "Rejected"
                        ? "text-red-500"
                        : app.status === "Pending"
                        ? "text-[#f86a20]"
                        : ""
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
