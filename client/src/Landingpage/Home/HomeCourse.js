import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import axios from "axios";

const HomeCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://mern-education-vj03.onrender.com/api/showCourse");
        setCourses(res.data.slice(0, 4)); 
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section style={{ backgroundColor: "#e3f2fd", padding: "50px 0" }}>
      <Container className="text-center" id="courses">
        <h2 className="fw-bold text-primary">Featured Courses</h2>
        <p className="text-muted">Explore our most popular courses and start your learning journey today.</p>

        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Row className="mt-4">
            {courses.map((course, index) => (
              <Col md={6} lg={3} key={index} className="mb-4">
                <Card className="shadow-sm border-0 p-3 desktop-coursecard" style={{ backgroundColor: "#ffffff" }}>
                  {course.image && (
                    <Card.Img
                      variant="top"
                      src={course.image}
                      alt={course.title}
                      style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px" }}
                    />
                  )}
                  <Card.Body>
                    <h5 className="fw-bold text-dark">{course.title}</h5>
                    <p className="text-muted small">{course.description}</p>
                    <p className="text-muted small">
                      <FaClock className="me-1 text-primary" /> {course.duration}
                    </p>
                    <Button variant="primary" className="w-100 mt-3">
                      <Link to={`/details/${course.title}`} style={{ color: "white", textDecoration: "none" }}>View Course</Link>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Button variant="primary" className="mt-3">
          <Link to="/course" style={{ color: "white", textDecoration: "none" }}>View All Courses</Link>
        </Button>
      </Container>
    </section>
  );
};

export default HomeCourse;
