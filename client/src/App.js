import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Landingpage/Home/LandingPage";
import Navbar from "./Landingpage/Navbar";
import About from "./Landingpage/About";
import Contact from "./Landingpage/Contact";
import LoginPage from "./Authentication/Loginpage";
import RegisterPage from "./Authentication/Registerpage";
import ForgotPassword from "./Authentication/Forgotpassword";
import ResetPassword from "./Authentication/Resetpassword";
import OtpFormPage from "./Authentication/Otpformpage";
import Courses from "./Landingpage/Course";
import CourseDetails from "./Landingpage/CourseDetails";
import UserPanel from "./user/UserPanel";
import Dashboard from "./user/pages/Dashboard";
import UserProfile from "./user/pages/UserProfile";
import Logout from "./Authentication/Logout";
import AdminPanel from "./admin/AdminPanel";
import AdminDashboard from "./admin/pages/Dashboard";
import CourseManagement from "./admin/pages/CourseManagement"
import BatchManagement from "./admin/pages/BatchManagement"
import UserEnrollment from "./admin/pages/UserEnrollment"


const App = () => {
  const [role, setRole] = useState('');
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("https://mern-education-vj03.onrender.com/api/verify")
      .then(res => {
        if (res.data.login) {
          setRole(res.data.role);
        } else {
          setRole('');
        }
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
  }, []);

  
  return (
    <Router>
      <Navbar role={role} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<LoginPage setRole={setRole} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/otp" element={<OtpFormPage />} />
        <Route path="/course" element={<Courses />} />
        <Route path="/details/:title" element={<CourseDetails setRole={setRole} />} />
        <Route path="/admin" element={<AdminPanel />}>
          <Route path="dashboard" element={<AdminDashboard/>} />
          <Route path="batch" element={<BatchManagement />} />
          <Route path="course" element={<CourseManagement />} />
          <Route path="user" element={<UserEnrollment />} />
        </Route>
        <Route path="/user" element={<UserPanel />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        <Route path="/logout" element={<Logout setRole={setRole} />} />
      </Routes>
    </Router>
  );
};

export default App;

