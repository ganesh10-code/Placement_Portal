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
            name: "Add Admin",
            icon: <FaUserPlus />,
            action: () => handleNavigation("addAdmin"),
          },
          {
            name: "Add Student",
            icon: <FaUser />,
            action: () => handleNavigation("addStudent"),
          },
          {
            name: "Add Job",
            icon: <FaBriefcase />,
            action: () => handleNavigation("addJob"),
          },
          {
            name: "Add Company",
            icon: <FaBuilding />,
            action: () => handleNavigation("addCompany"),
          },
        ]
      : [
          {
            name: "Resume",
            icon: <FaFileUpload />,
            action: () => handleNavigation("uploadResume"),
          },
          {
            name: "Apply Job",
            icon: <FaBriefcase />,
            action: () => handleNavigation("applyJob"),
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
            className="flex items-center space-x-3 p-3 hover:bg-[#3E9200] rounded-lg cursor-pointer transition-all"
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
