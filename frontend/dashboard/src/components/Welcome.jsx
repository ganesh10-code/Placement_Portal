import React, { useEffect, useState } from "react";

const Welcome = () => {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const fetchAndIncrementVisitCount = async () => {
      try {
        const response = await fetch("http://localhost:4000/visit/increment", {
          method: "POST",
        });
        const data = await response.json(); // Parse JSON from response
        setVisitCount(data.count); // Access 'count' from parsed data
      } catch (error) {
        console.error("Error fetching or incrementing visit count:", error);
      }
    };

    fetchAndIncrementVisitCount();
  }, []);

  return (
    <div className="fixed bg-white/30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center z-40 p-8 rounded-lg shadow-lg text-center animate-fadeIn bg-transparent text-white border border border-white">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the Placement Portal!
      </h1>
      <h2 className="text-xl font-500 text-[#041931]">
        Your Gateway to Career Opportunities
      </h2>
      <p className="text-lg mb-4">Please select your login type.</p>
      <h2 className=" text-[#e09722]">
        <strong>Total Visits: {visitCount}</strong>
      </h2>
    </div>
  );
};

export default Welcome;
