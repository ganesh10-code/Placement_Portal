import { React, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AdminLogin from "./components/forms/AdminLogin";
import StudentLogin from "./components/forms/StudentLogin";
import Sidebar from "./components/Sidebar";
import ForgotPassword from "./components/forms/ForgotPassword";
import Welcome from "./components/Welcome";
import AddAdmin from "./components/forms/AddAdmin";
import "./index.css";
import "./app.css";
import AddStudent from "./components/forms/AddStudent";

const LandingPage = () => {
  const [activeLogin, setActiveLogin] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard"); // Track active page

  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    const storedRole = localStorage.getItem("activeLogin");
    if (token && storedRole) {
      setIsLoggedIn(true);
      setActiveLogin(storedRole);
      setShowWelcome(false);
      setShowSidebar(true);
    }
  }, [activeLogin]);

  const logoutHandler = () => {
    const userConfirm = confirm("Are You Sure! Do You Want to Logout⚠");
    if (!userConfirm) return;
    localStorage.removeItem("loginToken");
    localStorage.removeItem("activeLogin");
    setIsLoggedIn(false);
    setActiveLogin(null);
    setShowLogin(false);
    setShowSidebar(false);
    setShowForgotPassword(false);
    setShowWelcome(true);
    alert("Logged out successfully");
  };

  const showLoginHandler = () => {
    setShowWelcome(false);
    setShowLogin(true);
    setShowForgotPassword(false);
    setOtpVerified(false);
    setShowSidebar(false);
  };
  const showForgotPasswordHandler = () => {
    setShowLogin(false);
    setShowForgotPassword(true);
    setOtpVerified(false);
    setShowWelcome(false);
    setShowSidebar(false);
  };
  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setShowLogin(true);
    setOtpVerified(false);
    setShowWelcome(false);
    setShowSidebar(false);
  };
  const handleOtpVerified = () => {
    setOtpVerified(true);
    setShowForgotPassword(false);
    setShowLogin(true);
    setShowWelcome(false);
    setShowSidebar(false);
  };
  const showSidebarHandler = (role) => {
    setShowSidebar(true);
    setActiveLogin(role);
    setIsLoggedIn(true);
    setShowWelcome(false);
    setShowLogin(false);
    setOtpVerified(false);
    setShowForgotPassword(false);
    localStorage.setItem("activeLogin", role);
  };
  // Handle Sidebar Navigation
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <Navbar
        setActiveLogin={setActiveLogin}
        showLoginHandler={showLoginHandler}
        isLoggedIn={isLoggedIn}
        logoutHandler={logoutHandler}
      />

      {showWelcome && <Welcome />}

      <div className="flex h-[calc(100vh-80px)]">
        {isLoggedIn && (
          <Sidebar
            activeLogin={activeLogin}
            handleNavigation={handleNavigation}
          />
        )}

        <div className="flex-1 flex justify-center items-center p-6">
          {!isLoggedIn &&
            showLogin &&
            (activeLogin === "admin" ? (
              <AdminLogin
                showForgotPasswordHandler={showForgotPasswordHandler}
                showSidebarHandler={showSidebarHandler}
              />
            ) : (
              <StudentLogin
                showForgotPasswordHandler={showForgotPasswordHandler}
                showSidebarHandler={showSidebarHandler}
              />
            ))}

          {showForgotPassword && (
            <ForgotPassword
              onClose={closeForgotPassword}
              onOtpVerified={handleOtpVerified}
            />
          )}

          {currentPage === "addAdmin" && <AddAdmin />}
          {currentPage === "addStudent" && <AddStudent />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
