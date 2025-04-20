import React from "react";

const ResumePreview = ({ resumeId }) => {
  const previewUrl = `http://localhost:8000/preview/${resumeId}`;

  return (
    <div className="border rounded-md shadow-md">
      <iframe
        src={previewUrl}
        width="100%"
        height="600px"
        title="Resume Preview"
        className="w-full border-none"
      />
      <div className="text-right p-2">
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-skyBlue underline text-sm"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
};

export default ResumePreview;
