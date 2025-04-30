import React, { useState } from "react";
import { API_URL } from "../../../utilities/API_path";
import Alert from "../Alert";

const AdminRegister = ({
  showForgotPasswordHandler,
  showAdminRegisterHandler,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/admin_register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          type: "success",
          message: "Registration request sent. Awaiting approval!",
        });
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => showAdminRegisterHandler(false), 500);
      } else {
        setAlert({ type: "warning", message: data.message });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Something went wrong!" });
      console.error(error);
    }
  };

  return (
    <div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="p-6 bg-white/30 backdrop-blur-md border border-white rounded-lg shadow-lg w-96 transition-all animate-fadeIn">
        <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
          Admin Registration
        </h2>
        <form onSubmit={handleAdminRegister}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border border-gray-300 rounded-lg mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-lg mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-lg mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
          >
            Register
          </button>
        </form>
        <p
          className="text-center mt-4 text-blue-600 cursor-pointer"
          onClick={() => showForgotPasswordHandler(true)}
        >
          Forgot Password?
        </p>
        <p
          className="text-center mt-4 text-blue-900 cursor-pointer"
          onClick={() => showAdminRegisterHandler(false)}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
