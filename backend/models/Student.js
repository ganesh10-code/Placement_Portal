const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollno: {
    type: String,
    required: true,
    unique: true,
  },
  officialMail: {
    type: String,
  },
  personalMail: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  education: [
    {
      institute: { type: String },
      degree: { type: String },
      branch: { type: String },
      startYear: { type: Number },
      endYear: { type: Number },
      cgpa: { type: Number },
    },
  ],
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  resume: {
    type: String,
  },
  jobOffers: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      salaryPackage: { type: Number },
    },
  ],
  jobsApplied: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
      },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
  eligibleJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

  // ✅ Additional Profile Fields
  skills: [{ type: String }], // Array of skills
  certifications: [
    { name: { type: String }, link: { type: String }, date: { type: String } },
  ], // Array of certifications
  projects: [
    {
      title: { type: String },
      description: [{ type: String }],
      techStack: { type: String },
      link: { type: String }, // Optional GitHub/Portfolio link
    },
  ],
  experience: [
    {
      company: { type: String },
      role: { type: String },
      duration: { type: String },
      description: { type: String },
    },
  ],
  // ✅ Social Profiles Field
  socialProfiles: [{ name: { type: String }, link: { type: String } }],
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
