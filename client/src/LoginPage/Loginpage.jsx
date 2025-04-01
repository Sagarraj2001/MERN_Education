import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signInWithPopup } from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
  githubprovider,
} from "./Firebaseauth";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "./ParticlesBackground";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", { email, password })
      .then((response) => {
        toast.success("Login successful! 🎉", { position: "top-right" });
        console.log(response.data);
        setEmail("");
        setPassword("");
        // navigate("/landing");
        setTimeout(() => navigate("/landing"), 2000);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Login failed!", { position: "top-right" });
      });
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success("Google Login successful! 🎉", { position: "top-right" });
      navigate("/landing");
      console.log( result.user);
    } catch (error) {
      toast.error(error.message, { position: "top-right" });
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      toast.success("Facebook Login successful! 🎉", { position: "top-right" });
      navigate("/landing");
      console.log( result.user);
    } catch (error) {
      toast.error(error.message, { position: "top-right" });
    }
  };

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubprovider);
      toast.success("GitHub Login successful! 🎉", { position: "top-right" });
      navigate("/landing");
      console.log( result.user);
    } catch (error) {
      toast.error(error.message, { position: "top-right" });
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
              {isPasswordVisible ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <div className="form-floating mb-3">
            <select
              className="form-select"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <label htmlFor="role">Role</label>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label className="form-check-label" htmlFor="remember">
              Remember Me
            </label>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary w-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>

        <div className="text-center mt-2">
          <a href="/forgot-password" className="text-danger fw-bold">
            Forgot Password?
          </a>
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
          Need an Account? {" "}
          <a className="text-primary fw-bold" href="/register">
            SIGN UP
          </a>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;


// import { useState, useEffect } from "react";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { signInWithPopup } from "firebase/auth";
// import {
//   auth,
//   googleProvider,
//   facebookProvider,
//   githubprovider,
// } from "./Firebaseauth";
// import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import ParticlesBackground from "./ParticlesBackground";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Cookies from "js-cookie";

// const Loginpage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const [role, setRole] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedEmail = Cookies.get("email");
//     const savedPassword = Cookies.get("password");

//     if (savedEmail && savedPassword) {
//       setEmail(savedEmail);
//       setPassword(savedPassword);
//       setRememberMe(true); 
//     }
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     axios
//       .post("http://localhost:5000/login", { email, password })
//       .then((response) => {
//         toast.success("Login successful! 🎉", { position: "top-right" });
//         console.log(response.data);
//         setEmail("");
//         setPassword("");

        
//         if (rememberMe) {
//           Cookies.set("email", email, { expires: 30 }); 
//           Cookies.set("password", password, { expires: 30 }); 
//         } else {
//           Cookies.remove("email");
//           Cookies.remove("password");
//         }

//         navigate("/landing");
//         setTimeout(() => navigate("/landing"), 2000);
//       })
//       .catch((err) => {
//         toast.error(err.response?.data?.message || "Login failed!", { position: "top-right" });
//       });
//   };

//   const signInWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       toast.success("Google Login successful! 🎉", { position: "top-right" });
//       navigate("/landing");
//       console.log(result.user);
//     } catch (error) {
//       toast.error(error.message, { position: "top-right" });
//     }
//   };

//   const signInWithFacebook = async () => {
//     try {
//       const result = await signInWithPopup(auth, facebookProvider);
//       toast.success("Facebook Login successful! 🎉", { position: "top-right" });
//       navigate("/landing");
//       console.log(result.user);
//     } catch (error) {
//       toast.error(error.message, { position: "top-right" });
//     }
//   };

//   const signInWithGithub = async () => {
//     try {
//       const result = await signInWithPopup(auth, githubprovider);
//       toast.success("GitHub Login successful! 🎉", { position: "top-right" });
//       navigate("/landing");
//       console.log(result.user);
//     } catch (error) {
//       toast.error(error.message, { position: "top-right" });
//     }
//   };

//   return (
//     <div className="align-items-center justify-content-center vh-90 bg-dark position-relative">
//       <ParticlesBackground />
//       <ToastContainer />
//       <div
//         className="card shadow-lg p-4"
//         style={{
//           width: "22rem",
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           transition: "transform 0.3s ease-in-out",
//         }}
//       >
//         <h2 className="text-center mb-4">LOGIN</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="form-floating mb-3">
//             <input
//               type="email"
//               className="form-control"
//               id="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <label htmlFor="email">Email</label>
//           </div>

//           <div className="form-floating mb-3 position-relative">
//             <input
//               type={isPasswordVisible ? "text" : "password"}
//               className="form-control"
//               id="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <label htmlFor="password">Password</label>
//             <button
//               type="button"
//               className="btn position-absolute top-50 end-0 translate-middle-y me-2"
//               onClick={() => setIsPasswordVisible(!isPasswordVisible)}
//               style={{ background: "none", border: "none" }}
//             >
//               {isPasswordVisible ? (
//                 <AiOutlineEyeInvisible size={20} />
//               ) : (
//                 <AiOutlineEye size={20} />
//               )}
//             </button>
//           </div>

//           <div className="form-floating mb-3">
//             <select
//               className="form-select"
//               id="role"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               required
//             >
//               <option value="">Select Role</option>
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//             <label htmlFor="role">Role</label>
//           </div>

//           <div className="form-check mb-3">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               id="remember"
//               checked={rememberMe}
//               onChange={() => setRememberMe(!rememberMe)}
//             />
//             <label className="form-check-label" htmlFor="remember">
//               Remember Me
//             </label>
//           </div>

//           <motion.button
//             type="submit"
//             className="btn btn-primary w-100"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Login
//           </motion.button>
//         </form>

//         <div className="text-center mt-2">
//           <a href="/forgot-password" className="text-danger fw-bold">
//             Forgot Password?
//           </a>
//         </div>

//         <div className="text-center my-3 fw-bold">OR</div>

//         <div className="d-flex justify-content-center gap-3">
//           <button className="btn btn-danger" onClick={signInWithGoogle}>
//             <FaGoogle />
//           </button>
//           <button className="btn btn-primary" onClick={signInWithFacebook}>
//             <FaFacebook />
//           </button>
//           <button className="btn btn-dark" onClick={signInWithGithub}>
//             <FaGithub />
//           </button>
//         </div>

//         <div className="text-center mt-3">
//           Need an Account?{" "}
//           <a className="text-primary fw-bold" href="/register">
//             SIGN UP
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Loginpage;


