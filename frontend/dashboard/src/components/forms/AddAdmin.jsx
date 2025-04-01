import { React, useState, useEffect } from "react";
import { fetchWithAuth } from "../../../utilities/api";

const AddAdmin = ({ logoutHandler }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [admins, setAdmins] = useState([]); // Store list of admins
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      const { response, data } = await fetchWithAuth(
        "/admin/get_all_admins",
        logoutHandler
      );
      if (response.ok) {
        setAdmins(data.admins);
      } else {
        console.error("Failed to fetch admins:", data.message);
      }
    };

    fetchAdmins();
  }, [showForm]); // Refresh list when an admin is added

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    try {
      const { response, data } = await fetchWithAuth(
        "/admin/add_admin",
        logoutHandler,
        {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "✅Admin added successfully!" });
        setName("");
        setEmail("");
        setPassword("");
        setShowForm(false);
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
    <div className="flex flex-col justify-center items-center w-full ">
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
      {!showForm ? (
        <div className="p-3 bg-white rounded-lg shadow-lg w-full mt-10">
          <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
            Admin List
          </h2>
          <div className="p-3 bg-gray-50 rounded-lg shadow-inner">
            {admins.length > 0 ? (
              <div className="flex flex-col gap-4">
                {admins.map((admin) => (
                  <div
                    key={admin._id}
                    className="p-4 bg-white rounded-lg shadow-md border transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                  >
                    <h3 className="font-bold text-lg text-[#041931]">
                      📌 {admin.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{admin.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No admins found</p>
            )}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-auto px-6 mt-4 bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
          >
            + Add Admin
          </button>
        </div>
      ) : (
        <div className=" p-6 bg-white rounded-lg shadow-lg w-96 mx-auto mt-10">
          <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
            Add Admin
          </h2>

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
            <div className="flex gap-2">
              <button
                type="submit"
                className="w-full bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
              >
                Add Admin
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 p-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddAdmin;
