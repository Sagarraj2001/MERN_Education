import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Registeranimation from "./Registeranimation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OtpVerificationPage = () => {
  axios.defaults.withCredentials = true;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState(""); // "signup" or "forgot"
  const navigate = useNavigate();

  useEffect(() => {
    const storedPurpose = localStorage.getItem("otpPurpose");
    const storedEmail =
      storedPurpose === "signup"
        ? JSON.parse(localStorage.getItem("pendingUser"))?.email
        : localStorage.getItem("resetEmail");
    

    if (!storedPurpose || !storedEmail) {
      toast.error("OTP verification session expired. Please try again.");
      navigate(storedPurpose === "signup" ? "/register" : "/otp");
    } else {
      setPurpose(storedPurpose);
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("https://mern-education-vj03.onrender.com/api/verifyOtp", {
        email,
        otp,
        context: purpose,
      },{ withCredentials: true});

      toast.success("OTP Verified Successfully!");

      localStorage.removeItem("otpPurpose");

      if (purpose === "signup") {
        localStorage.removeItem("pendingUser");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setTimeout(() => navigate("/reset"), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post("https://mern-education-vj03.onrender.com/api/resendOtp", {
        email,
        context: purpose,
      },{ withCredentials: true});
      toast.info("A new OTP has been sent to your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resending OTP.");
    }
  };

  if (!email || !purpose) return null;

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark">
      <Registeranimation />
      <ToastContainer />
      <div className="card p-4 shadow-lg text-center" style={{ width: "22rem", zIndex: 1 }}>
        <h2 className="mb-3 text-primary">OTP Verification</h2>
        <p className="text-muted">
          Enter the 6-digit code sent to your email for{" "}
          <strong>
            {purpose === "signup" ? "registration" : "password reset"}
          </strong>
          .
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control text-center"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />
            <label>Enter OTP</label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading || otp.length < 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-3">
          Didn’t get the code?{" "}
          <button
            onClick={handleResendOtp}
            className="btn btn-link text-primary fw-bold"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
