const Student = require("../models/Student");
const Job = require("../models/Job");
const fs = require("fs");
const path = require("path");

const uploadResume = async (req, res) => {
  if (req.user.role != "student") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const studentId = req.user.id; // Extract student ID from JWT token
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save file path in student document
    const filepath = req.file.path.replace(/\\/g, "/");
    student.resume = `/${filepath}`;
    await student.save();

    res.status(200).json({
      message: "Resume uploaded successfully",
      filePath: filepath,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from JWT
    const student = await Student.findById(studentId);

    if (!student || !student.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ resumePath: student.resume });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteResume = async (req, res) => {
  if (req.user.role != "student") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const studentId = req.user.id;
    const student = await Student.findById(studentId);

    if (!student || !student.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Delete the file from storage
    const filePath = path.join(__dirname, "..", student.resume);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting resume file:", err);
        return res.status(500).json({ message: "Error deleting resume file." });
      }
      student.resume = null;
      student.save();
      res.status(200).json({ message: "Resume deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// eligible-jobs
const getEligibleJobs = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await Student.findById(studentId).populate({
      path: "eligibleJobs",
      populate: { path: "companyId", model: "Company" },
    });

    res
      .status(200)
      .json({ jobs: student.eligibleJobs, appliedJobIds: student.jobsApplied });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch eligible jobs", error: err.message });
  }
};

//applied-job
const getAppliedJobs = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await Student.findById(studentId)
      .populate({
        path: "jobsApplied.jobId",
        populate: { path: "companyId", model: "Company" },
      })
      .select("jobsApplied");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ jobs: student.jobsApplied });
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch Applied jobs", error: err.message });
  }
};

const applyJob = async (req, res) => {
  if (req.user.role != "student") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const studentId = req.user.id; // Extract student ID from token
    const student = await Student.findById(studentId);
    if (!student.resume) {
      return res
        .status(400)
        .json({ message: "Please upload your resume before applying." });
    }

    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (new Date(job.deadline) < new Date()) {
      return res
        .status(400)
        .json({ message: "Application deadline has passed." });
    }
    if (job.applicants.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    job.applicants.push({ studentId, status: "Pending" });
    await job.save();

    student.jobsApplied.push({ jobId, status: "Pending" });
    await student.save();

    res
      .status(200)
      .json({ message: "Job application submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getStudentDetails = async (req, res) => {
  if (req.user.role != "student") {
    return res.status(403).json({ message: "Access Denied" });
  }
  try {
    const studentId = req.user.id; // Extracted from token via middleware

    const student = await Student.findById(studentId).select("-password"); // Exclude password field

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateProfile = async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    const studentId = req.user.id;
    const {
      personalMail,
      skills,
      certifications,
      projects,
      experience,
      socialProfiles,
      educationList, // This contains updated student-added entries (index 1 onwards)
    } = req.body;

    // Fetch the student document to get the existing education
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const originalEducation = student.education || [];
    const preservedAdminEducation =
      originalEducation.length > 0 ? [originalEducation[0]] : [];

    const updatedEducation = preservedAdminEducation.concat(
      educationList || []
    );

    const updateData = {
      personalMail,
      skills,
      certifications,
      projects,
      experience,
      socialProfiles,
      education: updatedEducation, // Full replacement with preserved first item
    };

    const updatedProfile = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadResume,
  getResume,
  deleteResume,
  getEligibleJobs,
  applyJob,
  getStudentDetails,
  getAppliedJobs,
  updateProfile,
};
