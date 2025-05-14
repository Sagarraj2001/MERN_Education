import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider, githubProvider } from "./Firebaseauth";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Registeranimation from "./Registeranimation";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Registerpage = () => {
  axios.defaults.withCredentials = true;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(number)) {
      toast.error("Phone number must contain exactly 10 digits.");
      return;
    }
  
    try {
      await axios.post("https://mern-education-vj03.onrender.com/api/register", {
        username,
        email,
        number,
        password,
      });
  
      localStorage.setItem("pendingUser", JSON.stringify({ email, username, number }));
      localStorage.setItem("otpPurpose", "signup"); // ✅ KEY FIX
      toast.success("User registered successfully! Check your email for OTP.", {
        position: "top-right",
      });
  
      setTimeout(() => {
        navigate("/otp");
      }, 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to register";
      toast.error(errorMessage, { position: "top-right" });
    }
  };
  
  
  

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success("Google Sign-In Success:", { position: "top-right" });
      console.log(result.user);
      navigate("/landing");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      toast.success("Facebook Sign-In Success:", { position: "top-right" });
      console.log(result.user);
      navigate("/landing");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      toast.success("GitHub Sign-In Success:", { position: "top-right" });
      console.log(result.user);
      navigate("/landing");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (

    <div className="d-flex align-items-center justify-content-center vh-100 bg-dark text-white position-relative">
      <ToastContainer />
      <div className="card p-4 shadow-lg position-absolute" style={{ width: "25rem", zIndex: 2 }}>
        <h2 className="text-center mb-4">SIGN UP</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="tel"
              className="form-control"
              id="phone"
              placeholder="Phone Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
            <label htmlFor="phone">Phone Number</label>
          </div>

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

          <motion.button
            type="submit"
            className="btn btn-primary w-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </form>

        {message && <p className="text-danger text-center mt-2">{message}</p>}

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
          Already a User?{" "}
          <Link className="text-primary fw-bold" to="/login">
            LOGIN
          </Link>
        </div>
      </div>
      <Registeranimation style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
    </div>
  );
};

export default Registerpage;
