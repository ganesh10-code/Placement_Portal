import { React, useState } from "react";
import { API_URL } from "../../../utilities/API_path";

const StudentLogin = ({ showForgotPasswordHandler, showSidebarHandler }) => {
  const [rollno, setRollNo] = useState("");
  const [password, setPassword] = useState("");

  const studentLoginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/student_login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rollno, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login Successfully");
        console.log(data);
        localStorage.setItem("loginToken", data.token);
        setRollNo("");
        setPassword("");
        showSidebarHandler("student");
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-96 transition-all animate-fadeIn">
      <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
        Student Login
      </h2>
      <form onSubmit={studentLoginHandler}>
        <input
          type="text"
          placeholder="Roll Number"
          className="w-full p-2 border border-gray-300 rounded-lg mb-3"
          value={rollno}
          onChange={(e) => setRollNo(e.target.value)}
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

export default StudentLogin;
