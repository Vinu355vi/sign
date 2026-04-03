import React from "react";
import { Link } from "react-router-dom";
import ThreeDBackground from "./ThreeDBackground";

function Masthead() {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center home-gradient" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', padding: '0 5%' }}>
      <ThreeDBackground />
      <div className="container" style={{ zIndex: 1 }}>
        <div className="row align-items-center">
          <div className="col-lg-6 text-start">
            <h1 className="text-white font-weight-bold display-3 mb-4" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)', fontFamily: "'Poppins', sans-serif" }}>
              <span style={{ color: '#00d2ff' }}>Silent Talk</span> <br />
              The Future of Communication
            </h1>
            <p className="text-white-50 lead mb-5" style={{ maxWidth: '90%' }}>
              A comprehensive Indian Sign Language toolkit featuring real-time translation, learning modules, and video creation powered by AI avatars.
            </p>
            <div className="d-flex gap-3">
              <Link to="/sign-kit/learn-sign" className="btn btn-info btn-lg px-5 py-3 rounded-pill" style={{ fontWeight: 'bold' }}>
                Start Learning
              </Link>
              <Link to="/sign-kit/all-videos" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill d-flex align-items-center">
                <i className="fa fa-play-circle me-2" /> Watch Video
              </Link>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block">
             {/* 3D background handles visual interest here, or we could add a specific hero image if needed, but the 3D shapes are better */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Masthead;
