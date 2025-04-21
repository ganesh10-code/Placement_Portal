import React from "react";

const templates = [
  { name: "Template 1", file: "template1.tex" },
  { name: "Template 2", file: "template2.tex" },
  //   { name: "Ganesh's Template", file: "ganesh_template.tex" }
];

const TemplateSelector = ({ selected, setSelected }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Choose Template</h3>
      <div className="flex flex-wrap gap-4">
        {templates.map((template) => (
          <div
            key={template.file}
            className={`border rounded-md p-4 cursor-pointer transition hover:shadow-md ${
              selected === template.file
                ? "border-deepBlue bg-lightGray"
                : "border-gray-300"
            }`}
            onClick={() => setSelected(template.file)}
          >
            <p className="font-medium">{template.name}</p>
            <p className="text-xs text-gray-500">{template.file}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
