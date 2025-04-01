import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Pic from '../LoginPage/Images/NGOimage.png';

const words = [
  ["creativity", "impact"],
  ["dedication", "vision"],
  ["innovation", "excellence"],
  ["curiosity", "brilliance"],
  ["confidence", "strength"],
];

const Welcome = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-dark"
      style={{ height: "90vh" }}
    >
      <div className="container text-center my-5">
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-content" style={{ marginLeft: "100px" }}>
            <h1 className="display-4 fw-bold text-primary">
              Welcome to Christian NGO
            </h1>
            <p className="lead text-secondary">
              Code with{" "}
              <span className="text-success fw-bold">{words[index][0]}</span>,
              create with{" "}
              <span className="text-danger fw-bold">{words[index][1]}</span>.
            </p>
          </div>
          <div className="d-flex justify-content-start">
            <div className="image-content" style={{ marginRight: '120px' }}>
              <img
                src={Pic}
                alt="Christian NGO"
                className="img-con rounded-circle"
                style={{ maxWidth: "300px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
