// middleware/validatePasswordMiddleware.js

const validatePasswordMiddleware = (req, res, next) => {
  const { password } = req.body;

  // Define the password regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  next(); // Password is valid, proceed to the next middleware/controller
};

module.exports = validatePasswordMiddleware;
