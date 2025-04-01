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
router.post("/apply_job/:jobId", verifyToken, studentController.applyJob);
router.post(
  "/withdraw_application/:jobId",
  verifyToken,
  studentController.withdrawApplication
);

module.exports = router;
