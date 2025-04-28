import React from "react";

const ResumeMain = ({ handleNavigation }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#041931]">
        Resume
      </h1>

      {/* Two Cards Side by Side */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        {/* Resume Generator Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Resume Generator
          </h2>
          <p className="text-gray-600 mb-6">
            Build a professional and customized resume with templates in
            minutes!
          </p>
          <button
            onClick={() => handleNavigation("resumeGenerator")}
            className="bg-[#041931] text-white px-6 py-2 rounded-md hover:bg-[#063b77] transition"
          >
            Generate Resume
          </button>
        </div>

        {/* Resume Scorer Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Resume Scoring
          </h2>
          <p className="text-gray-600 mb-6">
            Analyze and get feedback to improve your resume!
          </p>
          <button
            onClick={() => handleNavigation("resumeScorer")}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Score Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeMain;
