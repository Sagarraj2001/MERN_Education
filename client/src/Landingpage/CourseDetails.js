import React, { useState, useEffect } from 'react';
import axios from "axios";
import Footer from "./Footer";
import { useNavigate, useParams } from 'react-router-dom';
import { FaFilePdf } from "react-icons/fa";

const CourseDetails = ({ role }) => {
  const { title } = useParams();
  const navigate = useNavigate();

  const [courseInfo, setCourseInfo] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  const moduleImage = "https://png.pngitem.com/pimgs/s/127-1272138_best-web-app-development-company-in-uk-india.png";

  const feedback = [
    {
      id: 1,
      name: "John Doe",
      feedback: "This course was very informative and well-structured. The instructor explained concepts clearly.",
      rating: 5
    },
    {
      id: 2,
      name: "Jane Smith",
      feedback: "I learned a lot from this course. The hands-on projects were very helpful.",
      rating: 4
    },
    {
      id: 3,
      name: "Michael Johnson",
      feedback: "Good content but could use more real-world examples. Overall, a great learning experience!",
      rating: 4
    }
  ];

  const modules = [
    { title: "Module 1: HTML & CSS", description: "Learn the fundamentals of HTML & CSS.", pdf: "#" },
    { title: "Module 2: Bootstrap", description: "Explore Bootstrap for responsive design.", pdf: "#" },
    { title: "Module 3: JavaScript", description: "Understand JavaScript for dynamic content.", pdf: "#" },
    { title: "Module 4: React.js", description: "Develop dynamic UI using React.js.", pdf: "#" },
    { title: "Module 5: Node.js & Express", description: "Build backend applications using Node.js.", pdf: "#" },
    { title: "Module 6: MongoDB", description: "Work with NoSQL databases and CRUD operations.", pdf: "#" },
    { title: "Module 7: REST APIs", description: "Learn how to design and develop RESTful APIs.", pdf: "#" },
    { title: "Module 8: Authentication", description: "Implement secure authentication using JWT & OAuth.", pdf: "#" },
    { title: "Module 9: Deployment", description: "Deploy applications on cloud platforms.", pdf: "#" }
  ];

  // Auth verification
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

  // Fetch course info and check enrollment
  useEffect(() => {
    axios
      .get(`https://mern-education-vj03.onrender.com/api/course/${title}`)
      .then(res => {
        setCourseInfo(res.data);

        axios.get(`https://mern-education-vj03.onrender.com/api/enrollment-status/${res.data._id}`, {
          withCredentials: true
        })
          .then(response => {
            setIsEnrolled(response.data.enrolled);
          })
          .catch(err => console.error("Error checking enrollment:", err));
      })
      .catch(err => console.error("Failed to fetch course:", err));
  }, [title]);

  // const handleEnroll = () => {
  //   if (!courseInfo || !courseInfo._id) return;

  //   setLoadingEnroll(true);

  //   axios.post("https://mern-education-vj03.onrender.com/api/enroll", {
  //     courseId: courseInfo._id
  //   }, { withCredentials: true })
  //     .then(res => {
  //       alert(res.data.message);
  //       setIsEnrolled(true);
  //     })
  //     .catch(err => {
  //       console.error("Enrollment error:", err);
  //       alert(err.response?.data?.message || "Enrollment failed");
  //     })
  //     .finally(() => {
  //       setLoadingEnroll(false);
  //     });
  // };


  const handleEnroll = () => {
    if (!courseInfo || !courseInfo._id) return;
  
    setLoadingEnroll(true);
  
    axios.post("https://mern-education-vj03.onrender.com/api/enroll", {
      courseId: courseInfo._id
    }, { withCredentials: true })
      .then(res => {
        alert(res.data.message);
        setIsEnrolled(true);
      })
      .catch(err => {
        console.error("Enrollment error:", err);
        alert(err.response?.data?.message || "Enrollment failed");
      })
      .finally(() => {
        setLoadingEnroll(false);
      });
  };
  
  
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!courseInfo) return <div className="text-center py-5">Loading course details...</div>;

  return (
    <>
      <div>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-5 text-center">
              <img
                src={`https://mern-education-vj03.onrender.com/uploads/course_images/${courseInfo.image}`}
                alt="Course Illustration"
                className="img-fluid w-100"
              />
            </div>
            <div className="col-lg-7 text-center text-lg-start">
              <h1 className="text-primary fw-bold">{courseInfo.title}</h1>
              <h3 className="fw-semibold text-dark">{courseInfo.tagline || "Course Overview"}</h3>
              <p className="text-muted">{courseInfo.description}</p>
              <button
                className="btn btn-primary mt-3"
                onClick={handleEnroll}
                disabled={isEnrolled || loadingEnroll}
              >
                {loadingEnroll ? "Enrolling..." : isEnrolled ? "Already Enrolled" : "Enroll Now"}
              </button>
            </div>
          </div>

          <div className="container py-5">
            <h1 className="text-center text-primary fw-bold mb-4">Course Modules</h1>
            <div className="row">
              <div className="col-lg-6">
                <div className="accordion" id="courseAccordion">
                  {modules.map((module, index) => (
                    <div className="accordion-item border rounded shadow-sm mb-2" key={index}>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button fw-bold ${activeIndex === index ? '' : 'collapsed'}`}
                          type="button"
                          onClick={() => toggleAccordion(index)}
                        >
                          {module.title}
                        </button>
                      </h2>
                      <div
                        className={`accordion-collapse collapse ${activeIndex === index ? 'show' : ''}`}
                      >
                        <div className="accordion-body">
                          <p>{module.description}</p>
                          {module.pdf && (
                            <a
                              href={module.pdf}
                              className="btn btn-danger btn-sm"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaFilePdf className="me-1" /> Download PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <img
                  src={moduleImage}
                  alt="Course Modules"
                  className="img-fluid rounded shadow-lg w-100"
                />
              </div>
            </div>
          </div>

          <div className="container mt-4">
            <h2 className="text-center mb-4">Student Feedback</h2>
            <div className="card-group">
              {feedback.map((f) => (
                <div key={f.id} className="card p-3 mx-2 shadow">
                  <div className="card-body">
                    <h5 className="card-title">{f.name}</h5>
                    <p className="card-text">{f.feedback}</p>
                    <div className="rating text-warning">
                      {'★'.repeat(f.rating)}
                      {'☆'.repeat(5 - f.rating)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CourseDetails;