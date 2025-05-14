import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import Footer from "./Footer";
import axios from "axios";

const Course = () => {
  axios.defaults.withCredentials = true;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://mern-education-vj03.onrender.com/api/showCourse"); 
        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <section style={{ backgroundColor: "#e3f2fd", padding: "60px 0" }}>
        <Container className="text-center">
          <h2 className="fw-bold text-primary">All Courses</h2>
          <p className="text-muted">Browse our collection of courses to enhance your skills</p>

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
        </Container>
      </section>
      <Footer />
    </div>
  );
};

export default Course;
