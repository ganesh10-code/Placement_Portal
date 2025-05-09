import { React, useState } from "react";
import { API_URL } from "../../../utilities/API_path";
import Alert from "../Alert";

const ForgotPassword = ({ onClose, onOtpVerified }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/send_otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setAlert({ type: "success", message: "OTP Sent Successfully!" });
        console.log(data.message);
        setOtpSent(true);
        localStorage.setItem("email", email);
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Something went wrong!" });
      console.error(error);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const otp_email = localStorage.getItem("email");
      setEmail(otp_email);
      const response = await fetch(`${API_URL}/auth/verify_otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setAlert({
          type: "success",
          message: "Password Changed! Please login again",
        });
        console.log(data.message);
        localStorage.removeItem("email");
        setTimeout(() => {
          onOtpVerified();
          onclose();
        }, 2000); // Close the modal
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Something went wrong!" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg w-96 text-center">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        <h2 className="text-xl font-bold text-[#041931] mb-4">
          Forgot Password
        </h2>

        {!otpSent ? (
          <>
            <form onSubmit={sendOtp}>
              <input
                type="email"
                placeholder="Enter your email"
                className="border p-2 w-full rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="mt-4 bg-[#3E9200] text-white p-2 w-full rounded-md"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <form onSubmit={verifyOtp}>
              <input
                type="text"
                placeholder="Enter OTP"
                className="border p-2 w-full rounded-md"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter new Password"
                className="border p-2 w-full rounded-md"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="submit"
                className="mt-4 bg-[#041931] text-white p-2 w-full rounded-md"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        <button onClick={onClose} className="mt-4 text-[#E74C3C] underline">
          Cancel
        </button>
      </div>
    </div>
  );
};
export default ForgotPassword;
