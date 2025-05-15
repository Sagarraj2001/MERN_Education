import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ParticlesBackground from "./Particlebackground";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        "https://mern-education-vj03.onrender.com/api/forgotPassword",
        { email },
        { withCredentials: true } // ✅ Important for cross-origin cookies
      );


      // Store OTP context and email in localStorage for OTP page to use
      localStorage.setItem("resetEmail", email);
      localStorage.setItem("otpPurpose", "forgot");


      toast.success(response.data.message || "OTP sent to your email!");
      navigate("/otp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark text-white">
      <ParticlesBackground />
      <ToastContainer />
      <div className="card p-4 shadow-lg" style={{ width: "25rem" }}>
        <h2 className="text-center mb-3">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <label htmlFor="email">Enter your email</label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>

        <div className="text-center mt-3">
          Remembered your password?{" "}
          <a href="/login" className="text-primary fw-bold">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
