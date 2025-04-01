import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import Logo from "../Landing_page/NGO_logo.webp";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoggedIn(true);
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <div className="navbar-brand d-flex align-items-center">
          <img
            src={"/"}
            alt="logo"
            className="me-2"
            style={{ height: "50px" }}
          />
        </div>
        <div className="text-center">
          <span className="fw-bold fs-3">Christian NGO</span>
        </div>

        {!loggedIn && (
          <div className="d-flex">
            <button
              className="btn btn-outline-success me-2"
              onClick={handleLogin}
            >
              Login
            </button>
            <button className="btn btn-primary" onClick={handleRegister}>
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
