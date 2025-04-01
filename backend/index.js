const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes.js");
const studentRoutes = require("./routes/studentRoutes.js");
const path = require("path");

const { createInitialAdmin } = require("./controllers/authController.js");

dotEnv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Mongodb connected successfully");
    createInitialAdmin();
  })
  .catch((error) => console.log(error));

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);

app.listen(PORT, () => {
  console.log(`Server Started and running at ${PORT} `);
});

app.use("/home", (req, res) => {
  res.send("<h1>Welcome to placement portal</h1>");
});
