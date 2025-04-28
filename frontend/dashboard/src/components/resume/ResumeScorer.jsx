import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import Spinner from "../spinner"; // Assuming Spinner is a basic loading spinner component
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ResumeScorer = ({ handleNavigation }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleScoreResume = async () => {
    if (!selectedFile || !jobDescription.trim()) {
      setError("Please upload your resume and paste the job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("jobDescription", jobDescription);

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/score-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to score resume");

      const rawData = await response.json();

      // ✅ Corrected transformation (removed .split)
      const transformedResult = {
        score: rawData.score || 0,
        verdict:
          rawData.score >= 80
            ? "Excellent fit"
            : rawData.score >= 60
            ? "Good fit"
            : "Needs Improvement",
        missingSkills: rawData.skillsMissing || [],
        languageReview: rawData.languageReview || "", // If backend returns it
        gaps: rawData.gaps || [],
        topSuggestions: rawData.suggestions || [],
        careerGuidance: rawData.careerGuidance || "", // If backend returns it
      };

      setResult(transformedResult);
      setError("");
    } catch (err) {
      console.error("Error scoring resume:", err);
      setError("Error scoring resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Back Button */}
      <button
        onClick={() => handleNavigation("resumeMain")}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
      >
        ⬅️ Back
      </button>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#041931] mb-8">
          Resume Scorer
        </h1>

        {/* Upload & JD Input Section */}
        <div className="flex flex-col items-center space-y-6">
          <label className="flex flex-col items-center justify-center w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
            <div className="flex flex-col items-center justify-center">
              <FaUpload className="text-4xl text-gray-400 mb-2" />
              <p className="text-gray-500">
                {selectedFile
                  ? selectedFile.name
                  : "Click to upload your resume (PDF)"}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf"
            />
          </label>

          <textarea
            className="w-full border rounded-md p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Paste the Job Description here..."
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>

          <button
            onClick={handleScoreResume}
            className="bg-gradient-to-r from-[#041931] to-[#063b77] text-white px-8 py-3 rounded-md hover:from-[#063b77] hover:to-[#041931] transition font-semibold"
          >
            Score My Resume
          </button>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center mt-6">
            <Spinner />
            <p className="text-gray-500 mt-4">
              Analyzing your resume, please wait...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center text-red-500 mt-4">{error}</div>
        )}

        {/* Result Section */}
        {result && !isLoading && (
          <div className="mt-10 space-y-8">
            {/* Resume Score */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#041931] mb-2">
                Your Resume Match Score
              </h2>
              <div className="w-40 h-40 mx-auto">
                <CircularProgressbar
                  value={result.score}
                  text={`${result.score}%`}
                  styles={buildStyles({
                    textColor: "#041931",
                    pathColor:
                      result.score >= 80
                        ? "green"
                        : result.score >= 60
                        ? "orange"
                        : "red",
                    trailColor: "#d6d6d6",
                    textSize: "16px",
                    strokeLinecap: "round",
                  })}
                />
              </div>
              <div className="text-lg font-semibold text-gray-600 mt-2">
                {result.verdict}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-md space-y-6">
              {/* Missing Skills */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Missing Skills:</h3>
                <p className="text-gray-700">
                  {result.missingSkills.length > 0
                    ? result.missingSkills.join(", ")
                    : "None"}
                </p>
              </div>

              {/* Language & Tone Review */}
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Language and Tone Review:
                </h3>
                <p className="text-gray-700">
                  {result.languageReview || "No major issues detected."}
                </p>
              </div>

              {/* Gaps Detected */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Gaps Detected:</h3>
                <p className="text-gray-700">
                  {result.gaps.length > 0 ? result.gaps.join(", ") : "None"}
                </p>
              </div>

              {/* Top 5 Suggestions */}
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Top 5 Resume Suggestions:
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {result.topSuggestions.length > 0 ? (
                    result.topSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))
                  ) : (
                    <li>No suggestions provided.</li>
                  )}
                </ul>
              </div>

              {/* Career Guidance (optional) */}
              {result.careerGuidance && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Career Guidance:
                  </h3>
                  <p className="text-gray-700">{result.careerGuidance}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeScorer;
