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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  education: {
    degree: { type: String },
    branch: { type: String },
    year: { type: Number },
    cgpa: { type: Number },
  },
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
  // ✅ Additional Profile Fields
  skills: [{ type: String }], // Array of skills
  certifications: [{ name: { type: String }, link: { type: String } }], // Array of certifications
  projects: [
    {
      title: { type: String },
      description: { type: String },
      link: { type: String }, // Optional GitHub/Portfolio link
    },
  ],
  experience: [
    {
      company: { type: String },
      role: { type: String },
      duration: { type: String }, // Example: "June 2023 - Dec 2023"
      description: { type: String },
    },
  ],
  // ✅ Social Profiles Field
  socialProfiles: [{ name: { type: String }, link: { type: String } }],
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
