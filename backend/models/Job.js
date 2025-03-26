const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    role: { type: String, required: true },
    jobDescription: { type: String, required: true },
    skillsRequired: [String],
    location: { type: String },
    salary: { type: Number },
    eligibilityCriteria: {
      minCGPA: Number,
      allowedBranches: [String],
    },
    deadline: { type: Date },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    }, // Admin who posted
    applicants: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
          default: "Pending",
        },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
