import { React } from "react";

const Navbar = ({
  setActiveLogin,
  showLoginHandler,
  isLoggedIn,
  logoutHandler,
}) => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#041931] text-white shadow-md">
      <h1 className="text-xl font-bold">Placement Portal</h1>
      <div className="flex">
        {isLoggedIn ? (
          <button
            className="mx-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            onClick={logoutHandler}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              className="mx-2 px-4 py-2 bg-[#041931] text-white rounded-lg hover:bg-[#3E92CC] transition-all"
              onClick={() => {
                setActiveLogin("admin");
                showLoginHandler(true);
              }}
            >
              Admin
            </button>
            <button
              className="mx-2 px-4 py-2 bg-[#041931] text-white rounded-lg hover:bg-[#3E92CC] transition-all"
              onClick={() => {
                setActiveLogin("student");
                showLoginHandler(true);
              }}
            >
              Student
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
