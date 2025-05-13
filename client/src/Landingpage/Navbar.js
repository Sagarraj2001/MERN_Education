import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBars, FaSignInAlt, FaUserCircle } from "react-icons/fa";
import profileImage from "../assets/images/web-development.jpg";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = ({ role }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get("https://mern-education-vj03.onrender.com/api/getUsername", {
          withCredentials: true,
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    if (role === "user") {
      fetchUsername();
    }
  }, [role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close menu on link click
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="mb-5">
      <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: "rgba(211, 164, 234, 0.8)" }}>
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/" onClick={handleNavLinkClick}>
            ChristianNGO
          </Link>

          <button className="navbar-toggler" type="button" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars />
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto text-center fw-bold">
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={handleNavLinkClick}>Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link" onClick={handleNavLinkClick}>About</Link>
              </li>
              <li className="nav-item">
                <Link to="/course" className="nav-link" onClick={handleNavLinkClick}>Courses</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link" onClick={handleNavLinkClick}>Contact</Link>
              </li>
            </ul>
          </div>

          <div ref={dropdownRef} className="d-flex align-items-center position-relative">
            {role === "user" ? (
              <>
                <button
                  className="btn p-0 border-0 bg-transparent"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FaUserCircle
                    style={{ fontSize: "2rem", color: "black", cursor: "pointer" }}
                  />
                </button>
                {dropdownOpen && (
                  <ul
                    className={`dropdown-menu dropdown-menu-end show position-absolute ${menuOpen ? 'drop-down-menu' : ''}`}
                    style={{ right: "0px", top: "50px", backgroundColor: "#bbdefb" }}
                  >
                    <li className="dropdown-header fw-bold">{username || "Loading..."}</li>
                    <li>
                      <Link className="dropdown-item" to="/user/dashboard" onClick={handleNavLinkClick}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/user/profile" onClick={handleNavLinkClick}>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item text-danger" to="/logout" onClick={handleNavLinkClick}>
                        Log Out
                      </Link>
                    </li>
                  </ul>
                )}
              </>
            ) : (
              <Link className="btn btn-primary d-flex align-items-center" to="/login" onClick={handleNavLinkClick}>
                <FaSignInAlt className="me-2" /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

