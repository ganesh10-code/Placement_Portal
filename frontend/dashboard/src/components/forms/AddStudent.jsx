import react, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../utilities/api";

const AddStudent = ({ logoutHandler }) => {
  const [name, setName] = useState("");
  const [rollno, setRollno] = useState("");
  const [officialMail, setOfficialMail] = useState("");
  const [password, setPassword] = useState("");
  const [education, setEducation] = useState({
    institute: "Chaitanya Bharathi Institute of Technology",
    degree: "",
    branch: "",
    startYear: "",
    endYear: "",
    cgpa: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]); // Store list of students
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      const { response, data } = await fetchWithAuth(
        "/admin/get_all_students",
        logoutHandler
      );
      if (response.ok) {
        setStudents(data.students);
      } else {
        console.error("Failed to fetch students:", data.message);
      }
    };

    fetchStudents();
  }, [showForm]); // Refresh list when an admin is added

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducation((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    const studentData = {
      name,
      rollno,
      officialMail,
      password,
      education,
      phoneNumber,
    };

    try {
      const { response, data } = await fetchWithAuth(
        "/admin/add_student",
        logoutHandler,
        {
          method: "POST",
          body: JSON.stringify(studentData),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "✅Student added successfully!" });
        setName("");
        setOfficialMail("");
        setPassword("");
        setRollno("");
        setEducation({
          degree: "",
          branch: "",
          startYear: "",
          endYear: "",
          cgpa: "",
        });
        setPhoneNumber("");
        setShowForm(false);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to add admin",
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
    <div>
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
      <div className="flex  flex-col items-center justify-center w-full ">
        {!showForm ? (
          <>
            <div className="p-3 bg-white rounded-lg shadow-lg mx-auto mt-10 w-full">
              <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
                {showForm ? "Add Student" : "Students List"}
              </h2>

              {/* Scrollable Horizontal Bar Container */}
              <div className="p-3 bg-gray-50 rounded-lg shadow-inner">
                {students.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {students.map((student) => (
                      <div
                        key={student._id}
                        className="relative p-4 bg-white rounded-lg shadow-md border transition-transform transform hover:scale-105 hover:shadow-xl min-w-[300px] flex-shrink-0 cursor-pointer"
                      >
                        <h4 className="font-bold text-lg text-[#041931]">
                          📌 {student.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Roll No: {student.rollno}
                        </p>
                        <div className="text-gray-700 mt-2 text-sm space-x-2">
                          <span className="font-semibold">
                            {student.education[0].degree}
                          </span>{" "}
                          | <span>{student.education[0].branch}</span> |{" "}
                          <span>{student.education[0].endYear}</span> |{" "}
                          <span className="font-semibold">
                            CGPA: {student.education[0].cgpa}
                          </span>
                        </div>

                        {/* Pop-up Effect on Hover */}
                        <div className="absolute opacity-0 transition-opacity duration-300 bg-black text-white text-xs p-2 rounded-md shadow-md -top-16 left-1/2 transform -translate-x-1/2 pointer-events-none group-hover:opacity-100">
                          {student.name}'s Details
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No students found</p>
                )}
              </div>

              {/* Show "Add students" button */}
              <button
                onClick={() => setShowForm(true)}
                className="w-auto px-6 bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
              >
                + Add Student
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 bg-white rounded-lg shadow-lg w-96 mx-auto mt-10">
            <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-4">
              Add Student
            </h2>
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
                name="officialMail"
                value={officialMail}
                onChange={(e) => setOfficialMail(e.target.value)}
                placeholder="Official Mail"
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
                name="startYear"
                value={education.startYear}
                onChange={handleEducationChange}
                placeholder="Start Year"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                name="endYear"
                value={education.endYear}
                onChange={handleEducationChange}
                placeholder="End Year"
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
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="w-full bg-[#041931] text-white py-2 rounded-lg hover:bg-[#3E9200] transition-all"
                >
                  Add Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudent;
