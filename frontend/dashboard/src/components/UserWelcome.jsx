import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaUserTie, FaUserGraduate } from "react-icons/fa";

const UserWelcome = ({ role, name }) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-2xl w-full max-w-xl mx-auto mt-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="text-5xl text-[#3E9200]"
      >
        {role === "admin" ? <FaUserTie /> : <FaUserGraduate />}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl font-bold text-[#041931] mt-4"
      >
        {greeting}, {name}!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-gray-600 text-lg mt-2"
      >
        Welcome to your {role === "admin" ? "Admin" : "Student"} Dashboard 🚀
      </motion.p>
    </motion.div>
  );
};

export default UserWelcome;
