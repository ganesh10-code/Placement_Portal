import React, { useState, useEffect } from "react";
import TemplateSelector from "./TemplateSelector";
import SectionSelector from "./SectionSelector";
import ResumePreview from "./ResumePreview";
import { fetchWithAuth } from "../../../utilities/api";
import Spinner from "../spinner";

const ResumeGenerator = ({ logoutHandler, handleNavigation }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("template1.tex");
  const [selectedSections, setSelectedSections] = useState([
    "skills",
    "projects",
    "certifications",
    "experience",
    "socialProfiles",
  ]);
  const [resumeId, setResumeId] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [aiObjective, setAiObjective] = useState("");
  const [manualEditObjective, setManualEditObjective] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { response, data } = await fetchWithAuth(
          "/student/get_profile",
          logoutHandler
        );
        if (response.ok) {
          setStudentProfile(data.student);
        } else {
          alert(data.message || "Failed to fetch student profile.");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to load student profile");
      }
    };

    fetchStudent();
  }, []);

  const formatStudentData = (profile) => {
    return {
      name: profile.name,
      rollNo: profile.rollno,
      email: profile.personalMail,
      phoneNumber: profile.phoneNumber,
      education: profile.education,
      skills: profile.skills || [],

      certifications: (profile.certifications || []).map((c) => ({
        name: c.name,
        link: c.link || "",
        date: c.date || "",
      })),

      projects: (profile.projects || []).map((p) => ({
        title: p.title,
        techStack: p.techStack || "", // ✅ this matches the LaTeX template
        link: p.link || "", // ✅ explicitly added
        date: p.date || "",
        description: p.description || [],
      })),

      experience: profile.experience || [],
      socialProfiles: profile.socialProfiles || [],
    };
  };

  const handleGenerateObjective = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/generate-objective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: studentProfile, jobDescription }),
      });
      const data = await response.json();
      if (data.success) {
        setAiObjective(data.objective);
        setManualEditObjective(data.objective);
      } else {
        alert(data.error || "Failed to generate objective.");
      }
    } catch (error) {
      console.error("Error generating objective:", error);
      alert("Error generating objective.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const formattedData = formatStudentData(studentProfile);

      const res = await fetch("http://localhost:8000/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentData: formattedData,
          template: selectedTemplate,
          selectedSections,
          objective: manualEditObjective,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResumeId(data.resumeId);
      } else {
        alert(data.detail || "Resume generation failed.");
      }
    } catch (error) {
      alert("Error generating resume");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!studentProfile)
    return <div className="text-red-600 p-4">Loading student profile...</div>;
  const templateImage = `/templates/${selectedTemplate.replace(
    ".tex",
    ".jpg"
  )}`;
  return (
    <div className="mt-3 p-6 bg-white">
      {/* Back Button */}
      <button
        onClick={() => handleNavigation("resumeMain")}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition"
      >
        ⬅️ Back
      </button>
      <h2 className="text-2xl font-bold mb-3">Generate Your Resume</h2>
      <div className="flex gap-10">
        {/* Left Side: Form Inputs */}
        <div className="flex-1">
          <TemplateSelector
            selected={selectedTemplate}
            setSelected={setSelectedTemplate}
          />
          <SectionSelector
            selectedSections={selectedSections}
            setSelectedSections={setSelectedSections}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
          {selectedSections.includes("objective") && aiObjective && (
            <div className="mt-4">
              <label className="text-lg font-semibold mb-2">
                Edit Objective (optional)
              </label>
              <textarea
                className="border p-2 w-full"
                value={manualEditObjective}
                onChange={(e) => setManualEditObjective(e.target.value)}
                rows={5}
              />
            </div>
          )}
          <div className="flex gap-4 mt-4">
            {selectedSections.includes("objective") && (
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60"
                onClick={handleGenerateObjective}
                disabled={isLoading}
              >
                {isLoading ? "Generating Objective..." : "Generate Objective"}
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Template Preview + Button */}
        <div className="flex flex-col items-center w-1/3">
          <img
            src={templateImage}
            alt="Template Preview"
            style={{ height: "500px" }}
            className="border rounded shadow-md w-full object-contain mb-4"
          />
          <button
            className="bg-[#041931] text-white px-6 py-2 rounded disabled:opacity-60"
            onClick={handleGenerate}
            disabled={isLoading || !manualEditObjective}
          >
            {isLoading ? "Generating..." : "Generate Resume"}
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="flex flex-col items-center mt-6">
          <Spinner />
          <p className="text-gray-500 mt-4">
            Generating your resume, please wait...
          </p>
        </div>
      )}
      {resumeId && (
        <div className="bg-black text-white mt-6">
          <h3 className="text-lg font-semibold mb-2">Preview:</h3>
          <ResumePreview resumeId={resumeId} />
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;
