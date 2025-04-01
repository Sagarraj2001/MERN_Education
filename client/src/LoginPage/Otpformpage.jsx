import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Registeranimation from "./Registeranimation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OtpFormRegistrationpage = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const pendingUser = JSON.parse(localStorage.getItem("pendingUser"));

    if (!pendingUser) {
      toast.error("No registration data found. Please register again.");
      return;
    }

    axios
      .post("http://localhost:5000/verify-otp", { email: pendingUser.email, otp })
      .then((response) => {
        toast.success("OTP Verified Successfully! ✅");
        console.log("OTP Verified:", response.data);

        axios
          .post("http://localhost:5000/register", pendingUser)
          .then((res) => {
            toast.success("User Registered Successfully! 🎉");
            console.log("User Registered Successfully:", res.data);
            localStorage.removeItem("pendingUser");
            setTimeout(() => navigate("/login"), 2000);
          })
          .catch((err) => {
            toast.error(err.response?.data?.message || "Registration failed");
          });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Invalid OTP");
      });
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark">
      <Registeranimation />
      <ToastContainer />
      <div className="card p-4 shadow-lg text-center" style={{ width: "22rem", zIndex: 1 }}>
        <h2 className="mb-3 text-primary">OTP Verification</h2>
        <p className="text-muted">Enter the 6-digit verification code sent to your email.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control text-center"
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />
            <label htmlFor="otp">Enter OTP</label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Verify OTP
          </button>
        </form>

        <div className="mt-3">
          Didn't receive the OTP? <a href="/" className="text-primary fw-bold">Resend OTP</a>
        </div>
      </div>
    </div>
  );
};

export default OtpFormRegistrationpage;

