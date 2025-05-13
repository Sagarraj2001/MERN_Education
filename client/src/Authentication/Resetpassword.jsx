import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; 
import ParticlesBackground from "./Particlebackground";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPasswordpage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [cnfmpasd, setCnfmpasd] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  useEffect(() => {
    setMessage("");
  }, [password, cnfmpasd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cnfmpasd) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    const email = localStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Email not found. Please try the forgot password flow again.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("https://mern-education-vj03.onrender.com/api/resetPassword", {
        email,
        newPassword: password,       
        confirmPassword: cnfmpasd,
      });

      toast.success(response.data.message || "Password reset successfully!");

      setTimeout(() => {
        setPassword("");
        setCnfmpasd("");
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("otpPurpose");
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark text-white position-relative">
      <ParticlesBackground className="position-absolute top-10 start-10 w-100 h-100" />
      <ToastContainer />
      <div className="card p-4 shadow-lg" style={{ width: "25rem" }}>
        <h2 className="text-center mb-3">Reset Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3 position-relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">New Password</label>
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ cursor: "pointer" }}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </span>
          </div>

          <div className="form-floating mb-3 position-relative">
            <input
              type={isConfirmVisible ? "text" : "password"}
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={cnfmpasd}
              onChange={(e) => setCnfmpasd(e.target.value)}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ cursor: "pointer" }}
              onClick={() => setIsConfirmVisible(!isConfirmVisible)}
            >
              {isConfirmVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </span>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && <p className="text-center mt-3 text-warning">{message}</p>}
        
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

export default ResetPasswordpage;
