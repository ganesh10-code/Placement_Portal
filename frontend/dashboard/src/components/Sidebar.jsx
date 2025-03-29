import { useEffect, useState } from "react";
import {
  FaUser,
  FaFileUpload,
  FaBriefcase,
  FaBuilding,
  FaUserPlus,
} from "react-icons/fa";

const Sidebar = ({ activeLogin, handleNavigation }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Slide-in animation when component mounts
  }, []);

  const menuItems =
    activeLogin === "admin"
      ? [
          {
            name: "Admins",
            icon: <FaUserPlus />,
            action: () => handleNavigation("Admins"),
          },
          {
            name: "Students",
            icon: <FaUserPlus />,
            action: () => handleNavigation("Students"),
          },
          {
            name: "Jobs",
            icon: <FaBriefcase />,
            action: () => handleNavigation("Jobs"),
          },
          {
            name: "Companies",
            icon: <FaBuilding />,
            action: () => handleNavigation("Companies"),
          },
        ]
      : [
          {
            name: "Profile",
            icon: <FaUser />,
            action: () => handleNavigation("profile"),
          },
          {
            name: "Resume",
            icon: <FaFileUpload />,
            action: () => handleNavigation("resume"),
          },
          {
            name: "Find Jobs",
            icon: <FaBriefcase />,
            action: () => handleNavigation("findJobs"),
          },
        ];

  return (
    <div
      className={`fixed top-[80px] left-0 bottom-0 w-64 bg-[#041931] text-white p-4 shadow-lg transition-transform duration-500 ease-out ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center space-x-3 p-3 hover:bg-[#3E92CC] rounded-lg cursor-pointer transition-all"
            onClick={item.action}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
