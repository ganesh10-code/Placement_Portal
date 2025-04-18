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
import UserWelcome from "./components/UserWelcome";
import Profile from "./components/forms/Profile";

const LandingPage = () => {
  const [activeLogin, setActiveLogin] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showUserWelcome, setShowUserWelcome] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [User, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    const storedRole = localStorage.getItem("activeLogin");
    const user = localStorage.getItem("User");
    if (token && storedRole) {
      setIsLoggedIn(true);
      setActiveLogin(storedRole);
      setShowWelcome(false);
      setShowSidebar(true);
      setShowUserWelcome(true);
    }
    setUser(user);
  }, [activeLogin, isLoggedIn]);

  const logoutHandler = () => {
    setShowConfirm(true);
  };
  const confirmLogout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("activeLogin");
    localStorage.removeItem("email");
    localStorage.removeItem("User");
    setIsLoggedIn(false);
    setActiveLogin(null);
    setShowLogin(false);
    setShowSidebar(false);
    setShowForgotPassword(false);
    setShowWelcome(true);
    setShowConfirm(false);
    setShowUserWelcome(false);

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
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
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

      <div className="flex flex-grow h-[calc(100vh-80px)] overflow-hidden">
        <div className="z-50">
          {/* Confirm Logout Modal */}
          <Confirm
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={confirmLogout}
            title="Logout Confirmation "
            message="Are you sure you want to logout? "
            confirmText="Logout"
          />
        </div>
        {isLoggedIn && (
          <Sidebar
            activeLogin={activeLogin}
            handleNavigation={handleNavigation}
            setShowUserWelcome={setShowUserWelcome}
          />
        )}

        <div
          className={`flex-1 p-3 overflow-auto pt-[80px] ${
            isLoggedIn ? "ml-[250px]" : "flex justify-center items-center"
          }`}
        >
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
          {isLoggedIn && (
            <div className="relative bg-white shadow-md rounded-lg p-3 pt-0 h-full  overflow-auto">
              {showUserWelcome ? (
                <UserWelcome role={activeLogin} name={User} />
              ) : (
                <>
                  {currentPage === "Admins" &&
                    isLoggedIn &&
                    activeLogin === "admin" && (
                      <AddAdmin logoutHandler={logoutHandler} />
                    )}
                  {currentPage === "Students" &&
                    isLoggedIn &&
                    activeLogin === "admin" && (
                      <AddStudent logoutHandler={logoutHandler} />
                    )}
                  {currentPage === "Jobs" &&
                    isLoggedIn &&
                    activeLogin === "admin" && (
                      <AddJob logoutHandler={logoutHandler} />
                    )}
                  {currentPage === "Companies" &&
                    isLoggedIn &&
                    activeLogin === "admin" && (
                      <AddCompany logoutHandler={logoutHandler} />
                    )}
                  {currentPage === "profile" &&
                    isLoggedIn &&
                    activeLogin === "student" && (
                      <Profile logoutHandler={logoutHandler} />
                    )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
