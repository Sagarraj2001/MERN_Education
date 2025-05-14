
import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = ({ setRole }) => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const res = await axios.get("https://mern-education-vj03.onrender.com/api/logout", { withCredentials: true });
        if (res.data.logout) {
          setRole(""); 
          navigate("/"); 
        }
      } catch (err) {
        console.log(err);
      }
    };

    logoutUser();
  }, [navigate, setRole]); 

  return <div>Logging out...</div>;
};

export default Logout;
