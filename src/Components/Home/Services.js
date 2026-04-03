import React from "react";
import { Link } from "react-router-dom";
import imgConvert from "../../Assets/convert.png";
import imgLearnSign from "../../Assets/learn-sign.jpg";
import imgVideos from "../../Assets/videos.png";

function Services() {
  return (
    <section id="services">
      <div className="container">
        <div className="row mt-5">
          <div
            className="col-md-12 d-flex justify-content-center align-items-center"
            style={{ flexDirection: "column" }}
          >
            <div className="h2 section-heading">Our Services</div>
            <div className="col-lg-4 divider my-2" />
            <div className="text-center normal-text">
              A comprehensive and aesthetic Indian Sign Language toolkit. A
              minimalist yet informative interface. Wide range of features
              containing different functionalities that are necessary to work
              with ISL. What else do you need anyway! We have everything wrapped
              up here! <br /> Dive into our diverse services and let us know
              about your experience!
            </div>
          </div>
        </div>
        <div className="card-deck">
          <div className="row justify-content-center">
            {/* Convert Card */}
            <div className="col-lg-4 mt-5">
              <div className="card h-100 d-flex flex-column justify-content-between card-background border-0 shadow-lg" 
                   style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                    <img className="card-img-top" src={imgConvert} alt="Convert Clipart" style={{ width: 'auto', height: '80%', objectFit: 'contain' }} />
                </div>
                <div className="card-body text-white">
                  <h4 className="card-title fw-bold" style={{ color: '#00d2ff' }}>Text to Sign</h4>
                  <p className="card-text text-white-50">
                    Convert any text or audio into Indian Sign Language instantly using our advanced 3D avatar technology.
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 p-4">
                  <Link
                    to="/sign-kit/convert"
                    className="btn btn-outline-info w-100 py-2 rounded-pill"
                    style={{ borderWidth: '2px', fontWeight: 'bold' }}
                  >
                    Start Converting
                  </Link>
                </div>
              </div>
            </div>
           
            {/* Sign to Text/Speech Card */}
            <div className="col-lg-4 mt-5">
              <div className="card h-100 d-flex flex-column justify-content-between card-background border-0 shadow-lg"
                   style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                    <img className="card-img-top" src={imgLearnSign} alt="Learn Sign Clipart" style={{ width: 'auto', height: '80%', objectFit: 'contain' }} />
                </div>
                <div className="card-body text-white">
                  <h4 className="card-title fw-bold" style={{ color: '#a855f7' }}>Sign to Text</h4>
                  <p className="card-text text-white-50">
                    Use your webcam to interpret hand gestures into text or speech in real-time. Bridge the communication gap effortlessly.
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 p-4">
                  <Link
                    to="/sign-kit/sign-to-text"
                    className="btn btn-outline-primary w-100 py-2 rounded-pill"
                    style={{ borderWidth: '2px', fontWeight: 'bold', color: '#a855f7', borderColor: '#a855f7' }}
                  >
                    Interpret Signs
                  </Link>
                </div>
              </div>
            </div>
           
            {/* Videos Card */}
            <div className="col-lg-4 mt-5">
              <div className="card h-100 d-flex flex-column justify-content-between card-background border-0 shadow-lg"
                   style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                    <img className="card-img-top" src={imgVideos} alt="Videos Clipart" style={{ width: 'auto', height: '80%', objectFit: 'contain' }} />
                </div>
                <div className="card-body text-white">
                  <h4 className="card-title fw-bold" style={{ color: '#f472b6' }}>Create Videos</h4>
                  <p className="card-text text-white-50">
                    Generate educational or communicative videos in ISL from your transcripts. Share them with the entire community.
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 p-4">
                  <Link
                    to="/sign-kit/all-videos"
                    className="btn btn-outline-danger w-100 py-2 rounded-pill"
                    style={{ borderWidth: '2px', fontWeight: 'bold', color: '#f472b6', borderColor: '#f472b6' }}
                  >
                    Watch & Create
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
