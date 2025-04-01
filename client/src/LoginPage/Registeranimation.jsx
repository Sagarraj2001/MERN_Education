import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./registeranimation.css";
import { Container, Row, Col } from "react-bootstrap";

const Registeranimation = () => {
  const [shapes, setShapes] = useState([]);

  const getRandomValues = () => ({
    x: Math.random() * 1000 - 500, 
    y: Math.random() * 600 - 300,  
    rotate: Math.random() * 360,   
    scale: Math.random() * 1.5 + 0.5, 
  });

  useEffect(() => {
    setShapes(Array(4).fill().map(() => getRandomValues()));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShapes(Array(4).fill().map(() => getRandomValues()));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container fluid className="shapes-container d-flex justify-content-center align-items-center position-absolute">
      <Row className="w-100">
        <Col className="d-flex justify-content-center">
          {shapes.map((style, index) => (
            <motion.div
              key={`rectangle-${index}`}
              className="rectangle"
              animate={style}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          ))}
        </Col>
        <Col className="d-flex justify-content-center">
          {shapes.map((style, index) => (
            <motion.div
              key={`hexagon-${index}`}
              className="hexagon"
              animate={style}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          ))}
        </Col>
        <Col className="d-flex justify-content-center">
          {shapes.map((style, index) => (
            <motion.div
              key={`pentagon-${index}`}
              className="pentagon"
              animate={style}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Registeranimation;
