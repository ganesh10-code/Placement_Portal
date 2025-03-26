import { useState } from "react";
import { API_URL } from "../../../utilities/API_path";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [rollno, setRollno] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [education, setEducation] = useState({
    degree: "",
    branch: "",
    year: "",
    cgpa: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducation((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    const studentData = {
      name,
      rollno,
      email,
      password,
      education,
      phoneNumber,
    };

    const token = localStorage.getItem("loginToken"); // Get token from localStorage

    if (!token) {
      setMessage({ type: "error", text: "Unauthorized: No login token found" });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/add_student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Student added successfully!" });
        setName("");
        setEmail("");
        setPassword("");
        setRollno("");
        setEducation({
          degree: "",
          branch: "",
          year: "",
          cgpa: "",
        });
        setPhoneNumber("");
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
          Add Student
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
        <form onSubmit={handleAddStudent} className="space-y-4">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Student Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="rollno"
            value={rollno}
            onChange={(e) => setRollno(e.target.value)}
            placeholder="Roll Number"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="degree"
            value={education.degree}
            onChange={handleEducationChange}
            placeholder="Degree"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="branch"
            value={education.branch}
            onChange={handleEducationChange}
            placeholder="Branch"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="year"
            value={education.year}
            onChange={handleEducationChange}
            placeholder="Year"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="cgpa"
            value={education.cgpa}
            onChange={handleEducationChange}
            placeholder="CGPA"
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
