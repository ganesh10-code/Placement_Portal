import React, { useState, useEffect } from "react";
import TemplateSelector from "./TemplateSelector";
import SectionSelector from "./SectionSelector";
import ResumePreview from "./ResumePreview";
import { fetchWithAuth } from "../../../utilities/api";

const ResumeGenerator = ({ logoutHandler }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("template1.tex");
  const [selectedSections, setSelectedSections] = useState([
    "skills",
    "projects",
    "certifications",
    "experience",
    "socialProfiles",
  ]);
  const [resumeId, setResumeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);

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

  return (
    <div className="mt-3 p-6 bg-white">
      <h2 className="text-2xl font-bold mb-3">Generate Your Resume</h2>

      <TemplateSelector
        selected={selectedTemplate}
        setSelected={setSelectedTemplate}
      />
      <SectionSelector
        selectedSections={selectedSections}
        setSelectedSections={setSelectedSections}
      />

      <button
        className="bg-[#041931] text-white px-6 py-2 rounded mt-4 disabled:opacity-60"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Resume"}
      </button>

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
