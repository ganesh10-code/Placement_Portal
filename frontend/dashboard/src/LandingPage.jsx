import { React, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AdminLogin from "./components/forms/AdminLogin";
import StudentLogin from "./components/forms/StudentLogin";
import Sidebar from "./components/Sidebar";
import ForgotPassword from "./components/forms/ForgotPassword";
import Welcome from "./components/Welcome";
import AddAdmin from "./components/forms/AddAdmin";
import AddStudent from "./components/forms/AddStudent";
import AddJob from "./components/forms/AddJob";
import "./index.css";
import "./app.css";
import AddCompany from "./components/forms/AddCompany";
import Alert from "./components/Alert";
import Confirm from "./components/Confirm";

const LandingPage = () => {
  const [activeLogin, setActiveLogin] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

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
    setShowConfirm(true);
  };
  const confirmLogout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("activeLogin");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setActiveLogin(null);
    setShowLogin(false);
    setShowSidebar(false);
    setShowForgotPassword(false);
    setShowWelcome(true);
    setShowConfirm(false);

    // Show styled alert
    setAlert({
      show: true,
      type: "success",
      message: "Logged out successfully!",
    });

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 3000);
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
      {/* Styled Alert */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false })}
        />
      )}
      {showWelcome && <Welcome />}

      <div className="flex h-[calc(100vh-80px)]">
        {/* Confirm Logout Modal */}
        <Confirm
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmLogout}
          title="Logout Confirmation"
          message="Are you sure you want to logout?"
          confirmText="Logout"
        />

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
          {currentPage === "Admins" &&
            isLoggedIn &&
            activeLogin === "admin" && (
              <AddAdmin logoutHandler={logoutHandler} />
            )}
          {currentPage === "Students" &&
            isLoggedIn &&
            activeLogin === "admin" && <AddStudent />}
          {currentPage === "Jobs" && isLoggedIn && activeLogin === "admin" && (
            <AddJob />
          )}
          {currentPage === "Companies" &&
            isLoggedIn &&
            activeLogin === "admin" && <AddCompany />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
