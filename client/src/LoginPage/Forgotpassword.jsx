import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ParticlesBackground from "./ParticlesBackground";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordpage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", { email });
      toast.success(response.data.message || "Password reset link sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Processing..." : "Submit"}
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

export default ForgotPasswordpage;
