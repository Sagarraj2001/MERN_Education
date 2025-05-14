import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaEnvelope,  FaUser ,FaPhoneAlt,} from "react-icons/fa";

const UserProfile = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    axios
      .get("https://mern-education-vj03.onrender.com/api/verify", { withCredentials: true })
      .then(res => {
        if (!res.data.login) {
          navigate("/login");
        }
      })
      .catch(err => {
        console.error("Authentication error:", err);
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://mern-education-vj03.onrender.com/api/getProfileData", {
          withCredentials: true,
        });
        const { username, email, number } = response.data;
        setProfile(prev => ({
          ...prev,
          username,
          email,
          mobile: number,
        }));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center px-3 mobile-profile"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div
        className="card w-100 shadow-sm p-4"
        style={{
          maxWidth: "500px",
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <div className="text-center mb-4">
          <FaUserTie size={100} color="#6c757d" />
          <h4 className="mt-3">User Profile</h4>
        </div>

        {/* Username Row */}
        <div className="d-flex align-items-center mb-3">
          <FaUser size={20} color="#0d6efd" className="me-3" />
          <div className="flex-grow-1">
            <div className="fw-bold">Username</div>
            <div>{profile.username || "Loading..."}</div>
          </div>
        </div>

        {/* Email Row */}
        <div className="d-flex align-items-center mb-3">
          <FaEnvelope size={20} color="#0d6efd" className="me-3" />
          <div className="flex-grow-1">
            <div className="fw-bold">Email</div>
            <div>{profile.email || "Loading..."}</div>
          </div>
        </div>

        {/* Mobile Row */}
        <div className="d-flex align-items-center mb-3">
          <FaPhoneAlt size={20} color="#0d6efd" className="me-3" />
          <div className="flex-grow-1">
            <div className="fw-bold">Mobile</div>
            <div>{profile.mobile || "Loading..."}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
