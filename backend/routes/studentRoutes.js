const studentController = require("../controllers/studentController");
const verifyToken = require("../middleware/verifyToken");
const { upload } = require("../middleware/upload");
const express = require("express");
const router = express.Router();

router.post(
  "/upload_resume",
  verifyToken,
  upload.single("resume"),
  studentController.uploadResume
);
router.get("/get_resume", verifyToken, studentController.getResume);
router.delete("/delete_resume", verifyToken, studentController.deleteResume);
router.get("/eligible_jobs", verifyToken, studentController.getEligibleJobs);
router.get("/applied_jobs", verifyToken, studentController.getAppliedJobs);
router.post("/apply_job/:jobId", verifyToken, studentController.applyJob);
router.get("/get_profile", verifyToken, studentController.getStudentDetails);
router.put("/update_profile", verifyToken, studentController.updateProfile);

module.exports = router;
