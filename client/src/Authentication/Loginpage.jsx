import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
} from "./Firebaseauth";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ParticlesBackground from "./Particlebackground";
import "bootstrap/dist/css/bootstrap.min.css";

const Loginpage = ({ setRole }) => {
  axios.defaults.withCredentials = true;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [role, setLocalRole] = useState("");

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://mern-education-vj03.onrender.com/api/login", { email, password, role });
      
      if (res.data.login) {
        toast.success("Login successful", { position: "top-right" });
        setRole(res.data.role);
        navigate(res.data.role === 'admin' ? "/admin/dashboard" : "/");
      } else {
        toast.error("Email or password is incorrect", { position: "top-right" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", { position: "top-right" });
    }
  };
  

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.sucess("Google Sign-In Success:", { position: "top-right" });
      navigate("/Landingpage/Home");
      console.log(result.user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      toast.sucess("Facebook Sign-In Success:", { position: "top-right" });
      navigate("/LandingPage/Home");
      console.log(result.user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      toast.sucess("GitHub Sign-In Success:", { position: "top-right" });
      navigate("/LandingPage/Home");
      console.log(result.user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="align-items-center justify-content-center vh-90 bg-dark position-relative">
      <ParticlesBackground />
      <ToastContainer />
      <div
        className="card shadow-lg p-4"
        style={{
          width: "22rem",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <h2 className="text-center mb-4">LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="form-floating mb-3 position-relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="btn position-absolute top-50 end-0 translate-middle-y me-2"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              style={{ background: "none", border: "none" }}
            >
              {isPasswordVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <div className="form-floating mb-3">
            <select
              className="form-select"
              id="role"
              value={role}
              onChange={(e) => setLocalRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <label htmlFor="role">Role</label>
          </div>
          <motion.button type="submit" className="btn btn-primary w-100" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Login
          </motion.button>
        </form>

        {message && <p className="text-danger text-center mt-2">{message}</p>}

        <div className="text-center mt-2">
          <Link to="/forgot" className="text-danger fw-bold">
            Forgot Password?
          </Link>
        </div>

        <div className="text-center my-3 fw-bold">OR</div>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-danger" onClick={signInWithGoogle}>
            <FaGoogle />
          </button>
          <button className="btn btn-primary" onClick={signInWithFacebook}>
            <FaFacebook />
          </button>
          <button className="btn btn-dark" onClick={signInWithGithub}>
            <FaGithub />
          </button>
        </div>

        <div className="text-center mt-3">
          Need an Account?{" "}
          <Link className="text-primary fw-bold" to="/register">
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
