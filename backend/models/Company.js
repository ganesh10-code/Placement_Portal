const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    website: { type: String },
    location: { type: String },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    isPopular: { type: Boolean, default: false },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // Reference to Job schema
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;
