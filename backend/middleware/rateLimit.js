const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Rate limiter for login endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow only 5 attempts per window per IP
  message: {
    status: 429,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true, // Sends rate limit info in headers
  legacyHeaders: false, // Disable old headers
});

// Slow down brute-force attacks
const loginSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 3, // Start slowing after 3 requests
  delayMs: (attempt) => attempt * 500, // Increase delay for each request
});

// Rate limiter for OTP and password reset
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Allow only 3 OTP requests per window per IP
  message: {
    status: 429,
    message: "Too many OTP requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, loginSlowDown, otpLimiter };
