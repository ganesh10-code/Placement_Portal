import React, { useEffect, useState } from "react";
import axios from "axios";

const Welcome = () => {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const fetchAndIncrementVisitCount = async () => {
      try {
        // Increment visit count on the server
        const incrementResponse = await axios.post("http://localhost:4000/visit/increment");
        setVisitCount(incrementResponse.data.count);
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
      <p className="text-sm text-white/80">Total Visits: {visitCount}</p>
    </div>
  );
};

export default Welcome;
