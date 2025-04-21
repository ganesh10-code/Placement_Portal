const Admin = require("../models/Admin");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotEnv = require("dotenv");
const nodemailer = require("nodemailer");

dotEnv.config();
const secretKey = process.env.JWT_KEY;
const refreshKey = process.env.JWT_REFRESH_KEY;

const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, secretKey, { expiresIn: "15m" });
};

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, refreshKey, { expiresIn: "7d" });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//Initial Admin Setup
const createInitialAdmin = async () => {
  try {
    console.log("Checking for initial admin...");

    const existingAdmin = await Admin.findOne({
      email: process.env.INITIAL_ADMIN_EMAIL,
    });

    if (!existingAdmin) {
      console.log("No admin found, creating one...");
      const hashedPassword = await bcrypt.hash(
        process.env.INITIAL_ADMIN_PASSWORD,
        10
      );

      await new Admin({
        name: "Main Admin",
        email: process.env.INITIAL_ADMIN_EMAIL,
        password: hashedPassword,
      }).save();

      console.log("Initial Admin Created Successfully!");
    } else {
      console.log("Main Admin already exists.");
    }
  } catch (error) {
    console.error("Error creating initial admin:", error);
  }
};
//Admin login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const accessToken = generateAccessToken(admin._id, "admin");
    const refreshToken = generateRefreshToken(admin._id, "admin");
    // Send refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]); // 🔍 Debugging
    console.log(email, " - Admin login successful");
    return res.status(200).json({
      token: accessToken,
      Success: "Login Successfull",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//Student Login
const studentLogin = async (req, res) => {
  const { rollno, password } = req.body;
  try {
    const student = await Student.findOne({ rollno });
    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(400).json({ message: "Invalid rollno or password" });
    }
    const accessToken = generateAccessToken(student._id, "student");
    const refreshToken = generateRefreshToken(student._id, "student");
    // Send refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]); // 🔍 Debugging
    console.log(rollno, " - student login successful");
    return res.status(200).json({
      token: accessToken,
      Success: "Login Successfull",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//reset password
const resetPassword = async (req, res) => {
  const { email, currentPassword, password } = req.body;
  const user =
    (await Admin.findOne({ email })) ||
    (await Student.findOne({ personalMail: email })) ||
    (await Student.findOne({ officialMail: email }));
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Current password is incorrect" });

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  res.json({ message: "Password updated successfully" });
};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  const user =
    (await Admin.findOne({ email })) ||
    (await Student.findOne({ personalMail: email })) ||
    (await Student.findOne({ officialMail: email }));
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 300000; // OTP expires in 5 minutes
  await user.save();
  //email content
  const mailOptions = {
    from: `"Placement Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p>Hello, ${user.name} </p>
        <p>Your OTP code is: <strong style="font-size: 18px; color: #007bff;">${otp}</strong></p>
        <p>This code is valid for 5 minutes.</p>
        <hr>
        <p style="font-size: 12px; color: #888;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user =
    (await Admin.findOne({ email })) ||
    (await Student.findOne({ personalMail: email })) ||
    (await Student.findOne({ officialMail: email }));
  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  const userId = user._id;
  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.json({ message: "Password reset successful", token: userId });
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "Unauthorized: No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, refreshKey);
    let user;
    let userType;

    // Check if the user is an admin or student
    user = await Admin.findById(decoded.id);
    if (user) {
      userType = "admin";
    } else {
      user = await Student.findById(decoded.id);
      if (user) {
        userType = "student";
      }
    }

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id, userType);
    return res.status(200).json({ token: newAccessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = {
  adminLogin,
  studentLogin,
  createInitialAdmin,
  resetPassword,
  sendOTP,
  verifyOTP,
  refreshAccessToken,
};
