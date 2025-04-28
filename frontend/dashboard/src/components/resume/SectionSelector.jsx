import React, { useState } from "react";

const allSections = [
  "objective",
  "skills",
  "projects",
  "certifications",
  "experience",
  "socialProfiles",
];

const SectionSelector = ({
  selectedSections,
  setSelectedSections,
  jobDescription,
  setJobDescription,
}) => {
  const toggleSection = (section) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter((s) => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Select Sections</h3>
      <div className="flex flex-wrap gap-4">
        {allSections.map((section) => (
          <label key={section} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedSections.includes(section)}
              onChange={() => toggleSection(section)}
              className="accent-deepBlue"
            />
            <span className="capitalize">{section}</span>
          </label>
        ))}
      </div>
      <br />
      {selectedSections.includes("objective") && (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Enter Job Description
            </h3>
            <textarea
              placeholder="Enter Job Description for Objective generation"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="border p-2 mt-2 w-full"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SectionSelector;
