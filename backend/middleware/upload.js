const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/resumes/";
    fs.mkdirSync(dir, { recursive: true }); // Ensures directory exists
    cb(null, dir); // Folder where resumes will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = { upload };
