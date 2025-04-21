const authController = require("../controllers/authController");
const {
  loginLimiter,
  loginSlowDown,
  otpLimiter,
} = require("../middleware/rateLimit");
const express = require("express");
const validatePasswordMiddleware = require("../middleware/validatePassword");

const router = express.Router();

router.post(
  "/admin_login",
  loginLimiter,
  loginSlowDown,
  authController.adminLogin
);

router.post(
  "/student_login",
  loginLimiter,
  loginSlowDown,
  authController.studentLogin
);
router.post(
  "/reset_password",
  otpLimiter,
  validatePasswordMiddleware,
  authController.resetPassword
);
router.post("/send_otp", otpLimiter, authController.sendOTP);
router.post("/verify_otp", otpLimiter, authController.verifyOTP);
router.post("/refresh_token", authController.refreshAccessToken);

module.exports = router;
