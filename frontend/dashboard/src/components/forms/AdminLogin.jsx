import { React, useState } from "react";
import { API_URL } from "../../../utilities/API_path";
import Alert from "../Alert";

const AdminLogin = ({ showForgotPasswordHandler, showSidebarHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const adminLoginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/admin_login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setAlert({ type: "success", message: "Admin Login Successful!" });
        console.log(data);
        localStorage.setItem("loginToken", data.token);
        localStorage.setItem("User", email);
        setEmail("");
        setPassword("");
        setTimeout(() => showSidebarHandler("admin"), 500);
      } else {
        setAlert({ type: "error", message: data.error });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Something went wrong!" });
      console.error(error);
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-96 transition-all animate-fadeIn">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
        Admin Login
      </h2>
      <form onSubmit={adminLoginHandler}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-lg mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded-lg mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
        >
          Login
        </button>
      </form>
      <p
        className="text-center mt-4 text-blue-600 cursor-pointer"
        onClick={showForgotPasswordHandler}
      >
        Forgot Password?
      </p>
    </div>
  );
};

export default AdminLogin;
