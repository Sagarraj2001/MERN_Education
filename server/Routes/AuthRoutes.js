const { 
  register,
  verifyOtp,
  resendOtp,
  verify,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require("../Controller/AuthController");

const verifyUser = require("../Middleware/VerifyUser");
const express = require("express");
const router = express.Router();

// ✅ Public routes
router.post("/register", register); 
router.post("/verifyOtp", verifyOtp); 
router.post("/resendOtp", resendOtp); 
router.post("/login", login);
router.post("/forgotPassword", forgotPassword); 
router.post("/resetPassword", resetPassword);   

// ✅ Protected routes
router.get("/verify", verifyUser, verify);
router.get("/logout", logout); // optionally protect this if you want

module.exports = router;
