const Student = require("../models/Student");
const Job = require("../models/Job");

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
    const filepath = req.file.path;
    student.resume = filepath;
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
    const filePath = student.resume;
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

    if (
      student.education.cgpa < job.eligibilityCriteria.minCGPA ||
      !job.eligibilityCriteria.allowedBranches.includes(
        student.education.branch
      )
    ) {
      return res.status(403).json({
        message: "You do not meet the eligibility criteria for this job.",
      });
    }

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

const withdrawApplication = async (req, res) => {
  if (req.user.role != "student") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const studentId = req.user.id;
    const jobId = req.params.jobId;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Remove application from student and job
    student.appliedJobs = student.appliedJobs.filter(
      (app) => app.jobId.toString() !== jobId
    );
    job.applicants = job.applicants.filter(
      (app) => app.studentId.toString() !== studentId
    );

    await student.save();
    await job.save();

    res.status(200).json({ message: "Application withdrawn successfully." });
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
  if (req.user.role != "student") {
    return res.status(404).json({ message: "Access Denied" });
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
      educationList,
    } = req.body;

    const updateData = {
      personalMail,
      skills,
      certifications,
      projects,
      experience,
      socialProfiles,
    };
    if (educationList) {
      // Optional: Push new entries instead of overwriting
      updateData.$push = { education: { $each: educationList } };
    }

    const updatedProfile = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Student not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadResume,
  getResume,
  deleteResume,
  applyJob,
  withdrawApplication,
  getStudentDetails,
  updateProfile,
};
