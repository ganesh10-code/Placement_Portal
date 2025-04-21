import React from "react";

const Welcome = () => {
  return (
    <div className="fixed bg-white/30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center z-40 p-8 rounded-lg shadow-lg text-center animate-fadeIn bg-transparent text-white border border border-white">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the Placement Portal!
      </h1>
      <h2 className="text-xl font-500 text-[#041931]">
        Your Gateway to Career Opportunities
      </h2>
      <p className="text-lg">Please select your login type.</p>
    </div>
  );
};

export default Welcome;
