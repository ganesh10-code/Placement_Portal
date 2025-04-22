import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../utilities/api";

const Profile = ({ logoutHandler }) => {
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    personalMail: "",
    skills: [],
    certifications: [{ name: "", link: "" }],
    projects: [{ title: "", description: "", link: "" }],
    experience: [{ company: "", role: "", duration: "", description: "" }],
    socialProfiles: [{ name: "", link: "" }],
    educationList: [
      {
        institute: "",
        degree: "",
        branch: "",
        startYear: "",
        endYear: "",
        cgpa: "",
      },
    ],
  });
  const [message, setMessage] = useState(null);

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
            personalMail: data.student.personalMail || "",
            skills: data.student.skills || [],
            certifications: data.student.certifications || [],
            projects: data.student.projects || [],
            experience: data.student.experience || [],
            socialProfiles: data.student.socialProfiles || [],
            educationList: data.student.education.slice(1) || [],
          });
        } else {
          console.error("Failed to fetch profile :", data.message);
          setMessage({
            type: "error",
            text: data.message || "Failed to fetch profile",
          });
        }
      } catch (error) {
        console.error("Error in fetching profile ", error);
        setMessage({
          type: "error",
          text: "An error occurred fetching profile.",
        });
      }
    };
    getStudentDetails();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      personalMail: student.personalMail || "",
      skills: student.skills || [],
      certifications: student.certifications || [],
      projects: student.projects || [],
      experience: student.experience || [],
      socialProfiles: student.socialProfiles || [],
      educationList: student.education.slice(1) || [], // Ensure educationList is reset properly
    });
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
        console.log("Failed to update profile");
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error in updating profile:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-6  ">
      {message && (
        <p
          className={`p-2 rounded font-semibold ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
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
                <strong>Degree:</strong> {student.education[0].degree}
              </p>
              <p>
                <strong>Branch:</strong> {student.education[0].branch}
              </p>
              <p>
                <strong>Year:</strong> {student.education[0].startYear} -{" "}
                {student.education[0].endYear}
              </p>
              <p>
                <strong>CGPA:</strong> {student.education[0].cgpa}
              </p>
              <p>
                <strong>Phone:</strong> {student.phoneNumber}
              </p>
              <p>
                <strong>Official Mail:</strong> {student.officialMail}
              </p>
              <p>
                <strong>Personal Mail:</strong> {student.personalMail}
              </p>
              <div className="mt-4">
                <h3 className="font-semibold">
                  <strong>Previous Education Details:</strong>
                </h3>
                {student?.education && student?.education?.length > 1 ? (
                  student?.education?.slice(1).map((edu, i) => (
                    <div key={i} className="mb-2">
                      <p>
                        <strong>Institute:</strong>
                        {edu.institute}
                      </p>
                      <p>
                        <strong>Degree:</strong> {edu.degree}
                      </p>
                      <p>
                        <strong>Branch:</strong> {edu.branch}
                      </p>
                      <p>
                        <strong>Duration:</strong> {edu.startYear} -
                        {edu.endYear}
                      </p>
                      <p>
                        <strong>CGPA:</strong> {edu.cgpa}
                      </p>
                      <hr className="my-2" />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No previous education details available.
                  </p>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">
                  <strong>Skills:</strong>
                </h3>
                <ul>
                  {student?.skills?.map((skill, i) => (
                    <li key={i}>
                      <strong className="text-[#06b6d4]">{skill}</strong>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">
                  <strong>Certifications:</strong>
                </h3>
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
                <h3 className="font-semibold">
                  <strong>Projects:</strong>
                </h3>
                <ul>
                  {student?.projects?.map((project, i) => (
                    <li key={i}>
                      <strong className="text-[#3E92CC]">
                        {project.title}
                      </strong>{" "}
                      - {project.description}
                      {project.link && (
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
                <h3 className="font-semibold">
                  <strong>Experience:</strong>
                </h3>
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
                <h3 className="font-semibold">
                  <strong>Social Profiles:</strong>
                </h3>
                <ul>
                  {student?.socialProfiles?.map((prof, i) => (
                    <li key={i}>
                      <strong className="text-[#3E92CC]">{prof.name}</strong>-{" "}
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
              <h2 className="font-semibold text-[#0369a1]">
                Edit Additional Details
              </h2>
              {/*personalMail */}
              <h3 className="font-semibold mt-4">Personal Mail</h3>
              <input
                type="text"
                value={formData.personalMail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalMail: e.target.value,
                  })
                }
                className="border p-2 w-full"
              />
              <h3 className="font-semibold mt-4">Previous Education Details</h3>
              {formData.educationList.map((edu, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Institute"
                    value={edu.institute}
                    onChange={(e) =>
                      handleChange(e, index, "educationList", "institute")
                    }
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      handleChange(e, "educationList", index, "degree")
                    }
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Branch"
                    value={edu.branch}
                    onChange={(e) =>
                      handleChange(e, "educationList", index, "branch")
                    }
                    className="border p-2 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Start Year"
                    value={edu.startYear}
                    onChange={(e) =>
                      handleChange(e, "educationList", index, "startYear")
                    }
                    className="border p-2 w-full"
                  />
                  <input
                    type="number"
                    placeholder="End Year"
                    value={edu.endYear}
                    onChange={(e) =>
                      handleChange(e, "educationList", index, "endYear")
                    }
                    className="border p-2 w-full"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="CGPA"
                    value={edu.cgpa}
                    onChange={(e) =>
                      handleChange(e, "educationList", index, "cgpa")
                    }
                    className="border p-2 w-full"
                  />
                  <button
                    onClick={() => handleRemoveField("educationList", index)}
                    className="bg-red-600 text-white p-2 text-center rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleAddField("educationList", {
                    institute: "",
                    degree: "",
                    branch: "",
                    startYear: "",
                    endYear: "",
                    cgpa: "",
                  })
                }
                className="bg-[#3E92CC] text-white p-2 text-center rounded"
              >
                + Add Education
              </button>
              {/* Skills */}
              <h3 className="font-semibold mt-4">Skills</h3>
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
                    className="mt-4 px-4 py-2 rounded bg-[#041931] text-white"
                  >
                    Save Profile
                  </button>
                  <button
                    onClick={handleCancel}
                    className="mt-2 ml-4 bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
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
