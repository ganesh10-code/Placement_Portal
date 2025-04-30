import { React, useState, useEffect } from "react";
import { fetchWithAuth } from "../../../utilities/api";

const AddAdmin = ({ logoutHandler }) => {
  const [admins, setAdmins] = useState([]);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAdmins();
    fetchRegistrations();
  }, []);
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

  const fetchRegistrations = async () => {
    const { response, data } = await fetchWithAuth(
      "/admin/pending_registrations",
      logoutHandler
    );
    if (response.ok) {
      setRegistrations(data.registrations || []);
    } else {
      console.error("Failed to fetch registrations:", data.message);
    }
  };
  const handleDecision = async (id, decision) => {
    const { response, data } = await fetchWithAuth(
      "/admin/handle_registration",
      logoutHandler,
      {
        method: "POST",
        body: JSON.stringify({ id, decision }), // decision = 'accept' or 'reject'
      }
    );

    if (response.ok) {
      setMessage({
        type: "success",
        text: `✅ Registration ${decision}ed successfully!`,
      });
      fetchAdmins();
      fetchRegistrations();
    } else {
      setMessage({
        type: "error",
        text: data.message || `Failed to ${decision} registration.`,
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full mt-10">
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

      <div className="p-4 bg-white rounded-lg shadow-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#1E1E1E]">Admin List</h2>
          <button
            onClick={() => {
              setShowRegistrations(!showRegistrations);
              if (!showRegistrations) {
                fetchRegistrations();
              }
            }}
            className="bg-[#041931] text-white px-4 py-2 rounded hover:bg-[#3E9200] transition"
          >
            {showRegistrations ? "Hide Registrations" : "Show Registrations"}
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          {admins.length > 0 ? (
            admins.map((admin) => (
              <div
                key={admin._id}
                className="p-4 bg-white rounded-lg shadow-md border mb-2 hover:shadow-xl"
              >
                <h3 className="font-bold text-lg text-[#041931]">
                  📌 {admin.name}
                </h3>
                <p className="text-sm text-gray-600">{admin.email}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No admins found.</p>
          )}
        </div>

        {showRegistrations && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-[#1E1E1E]">
              Pending Admin Registrations
            </h3>
            {registrations.length > 0 ? (
              registrations.map((reg) => (
                <div
                  key={reg._id}
                  className="p-4 bg-white rounded-lg shadow-md border mb-2 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-[#041931]">{reg.name}</h4>
                    <p className="text-gray-600 text-sm">{reg.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision(reg._id, "accept")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecision(reg._id, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No pending registrations.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAdmin;
