import { React, useState } from "react";
import { API_URL } from "../../../utilities/API_path";

const AddAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("loginToken"); // Get token from localStorage

    if (!token) {
      setMessage({ type: "error", text: "Unauthorized: No login token found" });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/add_admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "✅Admin added successfully!" });
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to add admin",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96 mx-auto mt-10">
        <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
          Add Admin
        </h2>
        {message && (
          <p
            className={`text-center p-2 mb-3 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}
        <form onSubmit={handleAddAdmin}>
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
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
