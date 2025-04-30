const adminController = require("../controllers/adminController");
const validatePasswordMiddleware = require("../middleware/validatePassword");
const verifyToken = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();

router.get("/get_all_admins", verifyToken, adminController.getAllAdmins);
router.get(
  "/pending_registrations",
  verifyToken,
  adminController.getPendingRegistrations
);
router.post(
  "/handle_registration",
  verifyToken,
  adminController.handleRegistration
);
router.post(
  "/add_student",
  validatePasswordMiddleware,
  verifyToken,
  adminController.addStudent
);
router.get("/get_all_students", verifyToken, adminController.getAllStudents);
router.post("/add_job", verifyToken, adminController.addJob);
router.get("/get_all_jobs", verifyToken, adminController.getAllJobs);
router.get("/get_job_by_company/:companyId", adminController.getJobByCompany);
router.post("/add_company", verifyToken, adminController.addCompany);
router.get("/get_all_companies", adminController.getAllCompanies);
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
