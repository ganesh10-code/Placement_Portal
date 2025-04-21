const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Company = require("../models/Company");
const Job = require("../models/Job");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

//Add Admin
const addAdmin = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  console.log(req.user);
  const { name, email, password } = req.body;
  try {
    const adminEmail = await Admin.findOne({ email });
    if (adminEmail) {
      return res.status(400).json("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin Added Successfully" });
    console.log("Admin Added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//get all admins
const getAllAdmins = async (req, res) => {
  if (req.user.role != "admin") {
    return res.status(404).json({ message: "Access Denied" });
  }
  try {
    const admins = await Admin.find({}, "name email"); // Fetch only name and email
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
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
      const studentCGPA = student.education.cgpa;
      const studentBranch = student.education.branch;
      const allowedBranches = eligibilityCriteria.allowedBranches || [];

      // Check if the student meets the eligibility criteria
      const isEligible =
        studentCGPA >= eligibilityCriteria.minCGPA &&
        allowedBranches.includes(studentBranch);

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
        await sendEmail(
          student.email,
          student.name,
          "New Job Opportunity",
          `A new job at ${company.name} offering ${role} role has been posted.`
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

const sendEmail = async (to, name, subject, text) => {
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
    html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #333;">New Job Notification</h2>
            <p>Hello, ${name} </p>
            <p>${text}</p>
            <hr>
            <p style="font-size: 12px; color: #888;">This is an automated email from Placement Portal. Please do not reply.</p>
          </div> `,
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
  addAdmin,
  getAllAdmins,
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
