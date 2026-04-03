import React from "react";
import '../App.css'; // Ensure app.css is imported

function Feedback() {
  return (
    <div className="page-container d-flex flex-column align-items-center px-0">
      <div className="section-header container-fluid text-center">
        <div className="container">
          <div className="display-4 fw-bold glow-text mb-3">Give your Feedback!</div>
          <div className="lead text-white-50" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Help us improve our webapp by providing your valuable feedback. Your
            feedback will be used to improve the UI/UX and functionality!
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center gap-4">
            
            {/* Feedback Card 1 */}
            <div className="col-md-5 glass-card p-0 overflow-hidden border-0">
                <div className="bg-primary bg-opacity-25 p-3 text-center border-bottom border-light border-opacity-10">
                    <h5 className="m-0 text-white fw-bold">Feedback Form 1</h5>
                </div>
                <div className="p-4 d-flex flex-column h-100">
                    <h5 className="text-info mb-3">Overall Website Experience</h5>
                    <p className="text-white-50 mb-4 flexible-text">
                        Tell us what you think about the overall webapp design, navigation, and features. Rate us on satisfaction, appearance, and usability.
                    </p>
                    <div className="mt-auto text-center">
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSf1yDHIBGR2EusbGSuk-zBWBwoS5i-Gwm7Rvprw6IhBlWfJTQ/viewform?usp=sf_link" target="_blank" rel="noreferrer" className="btn btn-info w-100 rounded-pill">
                            Open Form
                        </a>
                    </div>
                </div>
            </div>

            {/* Feedback Card 2 */}
            <div className="col-md-5 glass-card p-0 overflow-hidden border-0">
                <div className="bg-primary bg-opacity-25 p-3 text-center border-bottom border-light border-opacity-10">
                    <h5 className="m-0 text-white fw-bold">Feedback Form 2</h5>
                </div>
                <div className="p-4 d-flex flex-column h-100">
                    <h5 className="text-info mb-3">Audio to Sign Module</h5>
                    <p className="text-white-50 mb-4 flexible-text">
                        Help us assess how well the system understands different voices, accents, and converts them to accurate sign language animations.
                    </p>
                    <div className="mt-auto text-center">
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSehlA48o3Y_k9ntfHRzY5II6iqhlpaP2iALN7h1sTjYn7Nr4w/viewform?usp=sf_link" target="_blank" rel="noreferrer" className="btn btn-info w-100 rounded-pill">
                            Open Form
                        </a>
                    </div>
                </div>
            </div>
            
             {/* Feedback Card 3 */}
             <div className="col-md-5 glass-card p-0 overflow-hidden border-0 mt-4">
                <div className="bg-primary bg-opacity-25 p-3 text-center border-bottom border-light border-opacity-10">
                    <h5 className="m-0 text-white fw-bold">Feedback Form 3</h5>
                </div>
                <div className="p-4 d-flex flex-column h-100">
                    <h5 className="text-info mb-3">Sign Correctness (Experts)</h5>
                    <p className="text-white-50 mb-4 flexible-text">
                        Expert users well versed in Indian Sign Language can help us by verifying if the animated signs displayed are linguistically correct.
                    </p>
                    <div className="mt-auto text-center">
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLScDfQ-6EbKgG-nLdjTI7atlA65EnWoQb3mOo3Bl-JtpNhjJuA/viewform?usp=sf_link" target="_blank" rel="noreferrer" className="btn btn-info w-100 rounded-pill">
                            Open Form
                        </a>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default Feedback;
