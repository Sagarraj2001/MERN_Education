const AuthModel = require("../Model/AuthModel");
const Admin = require("../Model/Admin");
const OtpModel = require("../Model/OtpModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ======================== REGISTER ========================
exports.register = async (req, res) => {
  try {
    const { email, username, number, password } = req.body;

    if (!email || !username || !password || !number) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await AuthModel.findOne({ $or: [{ email }, { username }, { number }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await OtpModel.findOneAndUpdate(
      { email },
      { email, otpHash, context: "signup", createdAt: Date.now() },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Account",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    await new AuthModel({ username, number, email, password: hashPassword, isVerified: false }).save();

    res.status(201).json({ message: "OTP sent to email. Please verify your account!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ======================== VERIFY OTP (Signup & Forgot) ========================
exports.verifyOtp = async (req, res) => {
  const { email, otp, context } = req.body;

  try {
    const otpRecord = await OtpModel.findOne({ email, context });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isExpired = Date.now() - new Date(otpRecord.createdAt).getTime() > 5 * 60 * 1000;
    if (isExpired) {
      await OtpModel.deleteOne({ email, context });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOtp !== otpRecord.otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await OtpModel.deleteOne({ email, context });

    if (context === "signup") {
      const updatedUser = await AuthModel.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
      );
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({ message: "OTP verified. Account activated!" });
    }

    if (context === "forgot") {
      return res.status(200).json({ message: "OTP verified. Proceed to reset password." });
    }

    return res.status(400).json({ message: "Invalid context." });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};

// ======================== FORGOT PASSWORD - SEND OTP ========================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await AuthModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email." });
    }

    const otp = generateOtp();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await OtpModel.findOneAndUpdate(
      { email },
      { email, otpHash, context: "forgot", createdAt: Date.now() },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for Password Reset",
      text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ message: "OTP sent to your email for password reset." });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again.", error: err.message });
  }
};

// ======================== RESET PASSWORD ========================
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await AuthModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};

// ======================== RESET PASSWORD ========================
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await AuthModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};


// ======================== RESEND OTP (Signup & Forgot) ========================
exports.resendOtp = async (req, res) => {
  const { email, context } = req.body;

  try {
    const otp = generateOtp();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await OtpModel.findOneAndUpdate(
      { email },
      { email, otpHash, context, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    const subject = context === "forgot" ? "OTP for Password Reset" : "Verify Your Account";

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resending OTP", error: error.message });
  }
};

// ======================== LOGIN ========================
// exports.login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     if (role === "admin") {
//       const admin = await Admin.findOne({ email });
//       if (!admin) return res.status(401).json({ message: "Admin not registered" });

//       const validPassword = await bcrypt.compare(password, admin.password);
//       if (!validPassword) return res.status(401).json({ message: "Wrong password" });

//       const token = jwt.sign({ email: admin.email, role: "admin" }, process.env.Admin_Key);
//       res.cookie("token", token, { httpOnly: true, secure: true });
//       return res.status(200).json({ login: true, role: "admin" });
//     } else if (role === "user") {
//       const user = await AuthModel.findOne({ email });
//       if (!user) return res.status(401).json({ message: "User not registered" });

//       const validPassword = await bcrypt.compare(password, user.password);
//       if (!validPassword) return res.status(401).json({ message: "Wrong password" });

//       const token = jwt.sign({ email: user.email, role: "user" }, process.env.User_Key);
//       res.cookie("token", token, { httpOnly: true, secure: true });
//       return res.status(200).json({ login: true, role: "user" });
//     } else {
//       return res.status(400).json({ message: "Invalid role specified" });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Login error", error: err.message });
//   }
// };
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === "admin") {
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(401).json({ message: "Admin not registered" });

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) return res.status(401).json({ message: "Wrong password" });

      const token = jwt.sign({ email: admin.email, role: "admin" }, process.env.Admin_Key, {
        expiresIn: "7d"
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      return res.status(200).json({ login: true, role: "admin" });
    }

    else if (role === "user") {
      const user = await AuthModel.findOne({ email });
      if (!user) return res.status(401).json({ message: "User not registered" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ message: "Wrong password" });

      const token = jwt.sign({ email: user.email, role: "user" }, process.env.User_Key, {
        expiresIn: "7d"
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      return res.status(200).json({ login: true, role: "user" });
    }

    else {
      return res.status(400).json({ message: "Invalid role specified" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};


// ======================== LOGOUT ========================
exports.logout = async (req, res) => {
  res.clearCookie("token");
  return res.json({ logout: true });
};

// ======================== VERIFY AUTH TOKEN ========================
exports.verify = async (req, res) => {
  return res.json({ login: true, role: req.role });
};

