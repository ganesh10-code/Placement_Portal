import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../utilities/api";

const Profile = ({ logoutHandler }) => {
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    skills: [],
    certifications: [{ name: "", link: "" }],
    projects: [{ title: "", description: "", link: "" }],
    experience: [{ company: "", role: "", duration: "", description: "" }],
    socialProfiles: [{ name: "", link: "" }],
  });
  const [message, setMessage] = useState(null);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const getStudentDetails = async () => {
      try {
        const { response, data } = await fetchWithAuth(
          "/student/get_profile",
          logoutHandler
        );
        if (response.ok && data.student) {
          setStudent(data.student);
          setFormData({
            skills: data.student.skills || [],
            certifications: data.student.certifications.length
              ? data.student.certifications
              : [{ name: "", link: "" }],
            projects: data.student.projects.length
              ? data.student.projects
              : [{ title: "", description: "", link: "" }],
            experience: data.student.experience.length
              ? data.student.experience
              : [{ company: "", role: "", duration: "", description: "" }],
            socialProfiles: data.student.socialProfiles.lenght
              ? data.student.socialProfiles
              : [{ name: "", link: "" }],
          });
        } else {
          console.error("Failed to fetch profile :", data.message);
        }
      } catch (error) {
        console.error("Error in fetching profile ", error);
      }
    };
    getStudentDetails();
  }, []);

  const handleChange = (e, index, section, field) => {
    const updatedSection = [...formData[section]];
    updatedSection[index][field] = e.target.value;
    setFormData({ ...formData, [section]: updatedSection });
  };
  const handleAddField = (section, emptyObj) => {
    setFormData({ ...formData, [section]: [...formData[section], emptyObj] });
  };
  const handleRemoveField = (section, index) => {
    const updatedSection = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updatedSection });
  };

  const handleSave = async () => {
    try {
      const { response, data } = await fetchWithAuth(
        "/student/update_profile",
        logoutHandler,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        setMessage({
          type: "success",
          text: "✅ Profile Updated Successfully",
        });
        setStudent(data.updatedProfile);
        setEditing(false);
      } else {
        console.log("failed to update profile");
        setMessage({
          type: "error",
          text: data.message || "failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error in adding job:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-6 bg-lightGray ">
      {message && (
        <p
          className={`p-2 rounded ${
            message.type === "success" ? "bg-green-200" : "bg-red-200"
          }`}
        >
          {message.text}
        </p>
      )}
      {student ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full ">
          <h2 className="text-2xl font-semibold text-[#041931] mb-4">
            Student Profile
          </h2>

          {!editing ? (
            <div>
              <p>
                <strong>Name:</strong> {student.name}
              </p>
              <p>
                <strong>Roll No:</strong> {student.rollno}
              </p>
              <p>
                <strong>Degree:</strong> {student.education.degree}
              </p>
              <p>
                <strong>Branch:</strong> {student.education.branch}
              </p>
              <p>
                <strong>Year:</strong> {student.education.year}
              </p>
              <p>
                <strong>CGPA:</strong> {student.education.cgpa}
              </p>
              <p>
                <strong>Email:</strong> {student.email}
              </p>
              <p>
                <strong>Phone:</strong> {student.phoneNumber}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold">Skills:</h3>
                <ul>
                  {student?.skills?.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">Certifications:</h3>
                <ul>
                  {student?.certifications?.map((cert, i) => (
                    <li key={i}>
                      {cert.name} -{" "}
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Certificate
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">Projects:</h3>
                <ul>
                  {student?.projects?.map((proj, i) => (
                    <li key={i}>
                      <strong className="text-[#3E92CC]">{proj.title}</strong> -{" "}
                      {proj.description}
                      {proj.link && (
                        <span>
                          {" "}
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            View Project
                          </a>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">Experience:</h3>
                <ul>
                  {student?.experience?.map((exp, i) => (
                    <li key={i}>
                      <strong className="text-[#3E92CC]">{exp.company}</strong>{" "}
                      - {exp.role} ({exp.duration})<br />
                      {exp.description}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">Social Profiles:</h3>
                <ul>
                  {student?.socialProfiles?.map((prof, i) => (
                    <li key={i}>
                      {prof.name} -{" "}
                      <a
                        href={prof.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Profile
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="mt-4 bg-[#041931] text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold">Edit Additional Details</h3>

              {/* Skills */}
              <label>Skills:</label>
              <input
                type="text"
                value={formData.skills.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value.split(", "),
                  })
                }
                className="border p-2 w-full"
              />

              {/* Certifications */}
              <h3 className="font-semibold mt-4">Certifications</h3>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) =>
                      handleChange(e, index, "certifications", "name")
                    }
                    placeholder="Certification Name"
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    value={cert.link}
                    onChange={(e) =>
                      handleChange(e, index, "certifications", "link")
                    }
                    placeholder="Link"
                    className="border p-2 w-full"
                  />
                  <button
                    onClick={() => handleRemoveField("certifications", index)}
                    className="bg-red-600 text-white p-2 text-center rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  handleAddField("certifications", { name: "", link: "" })
                }
                className="bg-[#3E92CC] text-white p-2 text-center rounded"
              >
                Add Certification
              </button>

              {/* Projects */}
              <h3 className="font-semibold mt-4">Projects</h3>
              {formData.projects.map((proj, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) =>
                      handleChange(e, index, "projects", "title")
                    }
                    placeholder="Project Title"
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    value={proj.description}
                    onChange={(e) =>
                      handleChange(e, index, "projects", "description")
                    }
                    placeholder="Description"
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    value={proj.link}
                    onChange={(e) => handleChange(e, index, "projects", "link")}
                    placeholder="Project Link"
                    className="border p-2 w-full"
                  />
                  <button
                    onClick={() => handleRemoveField("projects", index)}
                    className="bg-red-600 text-white p-2 text-center rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  handleAddField("projects", {
                    title: "",
                    description: "",
                    link: "",
                  })
                }
                className="bg-[#3E92CC] text-white p-2 text-center rounded"
              >
                Add Project
              </button>

              <h3 className="font-semibold mt-4">Experience</h3>
              {formData.experience.map((exp, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      handleChange(e, index, "experience", "company")
                    }
                    placeholder="Company"
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) =>
                      handleChange(e, index, "experience", "role")
                    }
                    placeholder="Role"
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) =>
                      handleChange(e, index, "experience", "duration")
                    }
                    placeholder="Duration"
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    value={exp.description}
                    onChange={(e) =>
                      handleChange(e, index, "experience", "description")
                    }
                    placeholder="Description"
                    className="border p-2 w-full"
                  />

                  <button
                    onClick={() => handleRemoveField("experience", index)}
                    className="bg-red-600 text-white p-2 text-center rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  handleAddField("experience", {
                    company: "",
                    role: "",
                    duration: "",
                    description: "",
                  })
                }
                className="bg-[#3E92CC] text-white p-2 text-center rounded"
              >
                Add Experience
              </button>
              <div>
                <h3 className="font-semibold">Social Profiles</h3>
                {formData.socialProfiles.map((profile, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Platform Name"
                      value={profile.name}
                      onChange={(e) =>
                        handleChange(e, index, "socialProfiles", "name")
                      }
                      className="border p-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Profile URL"
                      value={profile.link}
                      onChange={(e) =>
                        handleChange(e, index, "socialProfiles", "link")
                      }
                      className="border p-2 w-full"
                    />
                    <button
                      onClick={() => handleRemoveField("socialProfiles", index)}
                      className="bg-red-600 text-white p-2 text-center rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    handleAddField("socialProfiles", { name: "", link: "" })
                  }
                  className="bg-[#3E92CC] text-white p-2 text-center rounded"
                >
                  Add Social Profile
                </button>
                <div>
                  <button
                    onClick={handleSave}
                    className="mt-4 bg-[#041931] text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
