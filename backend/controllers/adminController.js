const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Company = require("../models/Company");
const Job = require("../models/Job");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

//get all admins
const getAllAdmins = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const admins = await Admin.find({ status: "accepted" }).select("-password");
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

const getPendingRegistrations = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const registrations = await Admin.find({ status: "pending" }).select(
      "-password"
    );
    res.status(200).json({ registrations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};
//Handle Registration
const handleRegistration = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  const { id, decision } = req.body;
  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (decision === "accept") {
      admin.status = "accepted";
      await admin.save();
      res.status(200).json({ message: "Registration accepted" });
    } else if (decision === "reject") {
      await Admin.findByIdAndDelete(id);
      res.status(200).json({ message: "Registration rejected" });
    } else {
      res.status(400).json({ message: "Invalid decision" });
    }
  } catch (error) {
    console.error("❌ Error in handleRegistration:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//add student
const addStudent = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  const { name, rollno, officialMail, password, education, phoneNumber } =
    req.body;
  try {
    const studentRollno = await Student.findOne({ rollno });
    if (studentRollno) {
      return res.status(400).json("Roll number already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      name,
      rollno,
      officialMail,
      password: hashedPassword,
      education,
      phoneNumber,
    });
    await newStudent.save();
    res.status(200).json({ message: "Student Added Successfully" });
    console.log("Student Added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get all students
const getAllStudents = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const students = await Student.find({}, "name rollno education"); // Fetch only name and email
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

//Add job
const addJob = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const {
      companyId,
      role,
      jobDescription,
      skillsRequired,
      location,
      salary,
      eligibilityCriteria,
      applyLink,
      jobType,
      deadline,
    } = req.body;

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const newJob = new Job({
      companyId,
      role,
      jobDescription,
      skillsRequired,
      location,
      salary,
      eligibilityCriteria,
      applyLink,
      jobType,
      deadline,
      postedBy: req.user.id, // Admin adding the job
    });

    await newJob.save();

    // Associate the job with the company
    company.jobs.push(newJob._id);
    await company.save();

    // **Trigger Email Notifications Based on Eligibility Criteria**
    const students = await Student.find(); // Fetch all students
    students.forEach(async (student) => {
      let shouldSendEmail = false;
      const studentCGPA = student.education[0].cgpa;
      const studentBranch = student.education[0].branch;
      const allowedBranches = eligibilityCriteria.allowedBranches || [];

      // Check if the student meets the eligibility criteria
      const isEligible =
        studentCGPA >= eligibilityCriteria.minCGPA &&
        allowedBranches.includes(studentBranch);

      if (!isEligible) {
        return;
      }
      if (!Array.isArray(student.eligibleJobs)) {
        student.eligibleJobs = [];
      }
      if (!student.eligibleJobs.includes(newJob._id)) {
        student.eligibleJobs.push(newJob._id);
        await student.save();
      }

      if (company.isPopular) {
        shouldSendEmail = true; // Popular company, send to all eligible students
      } else if (isEligible) {
        const offers = student.jobOffers || [];
        if (offers.length < 2) {
          const highestOffer = Math.max(
            0,
            ...offers.map((offer) => offer.salaryPackage)
          );
          if (offers.length === 0 || salary >= 1.5 * highestOffer) {
            shouldSendEmail = true;
          }
        }
      }

      if (shouldSendEmail) {
        if (!student.eligibleJobs.includes(newJob._id)) {
          student.eligibleJobs.push(newJob._id);
          await student.save();
        }

        const emailBody = `
          <p>Dear ${student.name},</p>
      
          <p>We are pleased to inform you about a new job opportunity that aligns with your profile:</p>
      
          <table style="border-collapse: collapse; font-size: 15px;">
            <tr>
              <td style="padding: 4px 8px;"><strong>Company:</strong></td>
              <td style="padding: 4px 8px;">${company.name}</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px;"><strong>Position:</strong></td>
              <td style="padding: 4px 8px;">${role}</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px;"><strong>Location:</strong></td>
              <td style="padding: 4px 8px;">${location}</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px;"><strong>Salary Package:</strong></td>
              <td style="padding: 4px 8px;">₹${salary} LPA</td>
            </tr>
          </table><br>
          <p>For More Information about the job, please visit official Website ${company.website}</p>
      
          <p>Please log in to your Placement Portal account to view the full job description and apply before the deadline.</p>

          <p>Best regards,<br/>
          Placement Cell<br/>
          CDC Placement Portal</p>
          Chaitanya Bharathi Institute of Technology
          </p><br/>
          <p><strong>Note:</strong> This is an automated email. Please do not reply.</p>
        `;

        await sendEmail(
          [student.personalMail, student.officialMail],
          `New Job Opportunity – ${role} at ${company.name}`,
          emailBody
        );
      }
    });
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all jobs (Populate company details)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("companyId", "name");
    res.status(200).json({
      jobs,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Get jobs of a specific company
const getJobByCompany = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const jobs = await Job.find({ companyId: companyId });
    res.status(200).json({ jobs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
};
//Add company
const addCompany = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const { name, website, location, contactEmail, contactPhone, isPopular } =
      req.body;
    const existingCompany = await Company.findOne({ name });
    if (existingCompany)
      return res.status(400).json({ message: "Company already exists" });
    const newCompany = new Company({
      name,
      website,
      location,
      contactEmail,
      contactPhone,
      isPopular,
    });
    await newCompany.save();

    res
      .status(201)
      .json({ message: "Company added successfully", company: newCompany });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding company", error: error.message });
  }
};

//Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({ companies });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching companies", error: error.message });
  }
};

const sendEmail = async (to, subject, emailBody) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: emailBody,
  };
  await transporter.sendMail(mailOptions);
};

const getAllApplications = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const applications = await Job.find().populate(
      "applicants.studentId",
      "name email"
    );
    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const { jobId, studentId } = req.params;
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const application = job.applicants.find(
      (app) => app.studentId.toString() === studentId
    );
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await job.save();

    res.status(200).json({ message: `Application ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllAdmins,
  getPendingRegistrations,
  handleRegistration,
  addStudent,
  getAllStudents,
  addJob,
  getAllJobs,
  getJobByCompany,
  addCompany,
  getAllCompanies,
  getAllApplications,
  updateApplicationStatus,
};
