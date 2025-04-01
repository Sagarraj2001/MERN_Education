import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import ParticlesBackground from "./ParticlesBackground";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordpage = () => {
  // const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [cnfmpasd, setCnfmpasd] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cnfmpasd) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/reset-password", {
        // token,
        password,
      });

      toast.success(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark text-white position-relative">
      <ParticlesBackground className="position-absolute top-10 start-10 w-100 h-100" />
      <ToastContainer />
      <div className="card p-4 shadow-lg" style={{ width: "25rem" }}>
        <h2 className="text-center mb-3">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">New Password</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={cnfmpasd}
              onChange={(e) => setCnfmpasd(e.target.value)}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Reset Password
          </button>
        </form>

        <div className="text-center mt-3">
          Remembered your password? {" "}
          <a href="/login" className="text-primary fw-bold">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordpage;



