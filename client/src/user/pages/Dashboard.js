import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest");
  const [enrolledCourses, setEnrolledCourses] = useState([]);


  useEffect(() => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("enrolledCourses");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://mern-education-vj03.onrender.com/api/enrollCourse", {
          withCredentials: true,
        });

        setUsername(res.data.username || "User");
        setEnrolledCourses(res.data.courses || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const handleViewCourse = (course) => {
    navigate(`/details/${course.name}`);
  };

  return (
    <div className="container" style={{ minHeight: "100vh", padding: "20px" }}>
      <h2 className="mb-4">Welcome, {username}</h2>
      <p className="lead">Track your enrolled courses below.</p>

      <div className="card p-4 mb-4">
        <h4>Enrolled Courses ({enrolledCourses.length})</h4>

        {enrolledCourses.length > 0 ? (
          <ul className="list-group">
            {enrolledCourses.map((course) => (
              <li
                key={course.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {course.name}
                <Button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewCourse(course)}
                >
                  Go To Course
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No courses enrolled yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
