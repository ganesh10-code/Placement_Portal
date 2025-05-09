import React from "react";

const Alert = ({ type, message, onClose }) => {
  const alertStyles = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-200 border-red-500 text-red-700",
    warning: "bg-orange-100 border-orange-500 text-orange-700",
  };

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-3 border rounded-lg shadow-md text-sm flex items-center justify-between w-[90%] sm:w-1/3 ${
        alertStyles[type] || "bg-gray-100 border-gray-500 text-gray-700"
      }`}
    >
      <span>{message}</span>
      <button className="ml-4 text-lg font-bold" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Alert;
