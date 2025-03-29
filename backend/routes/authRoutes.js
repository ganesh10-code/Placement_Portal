const authController = require("../controllers/authController");
const studentController = require("../controllers/studentController");
const adminController = require("../controllers/adminController");
const verifyToken = require("../middleware/verifyToken");
const { upload } = require("../middleware/upload");
const {
  loginLimiter,
  loginSlowDown,
  otpLimiter,
} = require("../middleware/rateLimit");
const express = require("express");

const router = express.Router();

router.post(
  "/admin_login",
  loginLimiter,
  loginSlowDown,
  authController.adminLogin
);
router.post("/add_admin", verifyToken, adminController.addAdmin);
router.post("/add_student", verifyToken, adminController.addStudent);
router.post(
  "/student_login",
  loginLimiter,
  loginSlowDown,
  authController.studentLogin
);
router.post("/reset_password", otpLimiter, authController.resetPassword);
router.post("/send_otp", otpLimiter, authController.sendOTP);
router.post("/verify_otp", otpLimiter, authController.verifyOTP);
router.post("/refresh_token", authController.refreshAccessToken);
router.post(
  "/upload_resume",
  verifyToken,
  upload.single("resume"),
  studentController.uploadResume
);
router.get("/get_resume", verifyToken, studentController.getResume);
router.delete("/delete_resume", verifyToken, studentController.deleteResume);
router.post("/add_job", verifyToken, adminController.addJob);
router.get("/get_jobs", adminController.getJobs);
router.get("/get_job_by_company/:companyId", adminController.getJobByCompany);
router.post("/add_company", verifyToken, adminController.addCompany);
router.get("/get_companies", adminController.getAllCompanies);
router.post("/apply_job/:jobId", verifyToken, studentController.applyJob);
router.post(
  "/withdraw_application/:jobId",
  verifyToken,
  studentController.withdrawApplication
);
router.post(
  "/get_all_applications",
  verifyToken,
  adminController.getAllApplications
);
router.post(
  "/withdraw_application/:jobId/:studentId",
  verifyToken,
  adminController.updateApplicationStatus
);

module.exports = router;
