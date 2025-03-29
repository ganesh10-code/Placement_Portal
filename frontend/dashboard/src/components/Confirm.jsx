import React from "react";

const Confirm = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center border border-gray-300">
        <h2 className="text-xl font-bold text-[#041931] mb-4">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-[#E74C3C] text-white rounded-lg hover:bg-[#C0392B]"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
