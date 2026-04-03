import React, { useEffect, useState } from "react";
import { mockVideos, getVideos } from '../Assets/mockVideos';
import { useNavigate, Link } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import VideoCard from "../Components/Videos/VideoCard";

function Videos() {
  const [videos, setVideos] = useState([]);
  const [videoId, setVideoId] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const retrieveVideos = () => {
    // Mock data retrieval instead of API call
    setVideos(getVideos());
  };

  useEffect(retrieveVideos, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!videoId) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    navigate(`/sign-kit/video/${videoId}`, { replace: false });
  };

  const handleClick = (videoId) => {
    navigate(`/sign-kit/video/${videoId}`, { replace: false });
  };

  const videoList = videos.map((video, index) => (
    <VideoCard key={index} video={video} handleClick={handleClick} />
  ));

  return (
    <div className="page-container d-flex flex-column align-items-center px-0">
      <div className="section-header container-fluid text-center">
        <div className="container">
          <div className="display-4 fw-bold glow-text mb-3">
            Explore ISL Videos
          </div>
          <div className="lead text-white-50" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Welcome to the ISL video section of Silent Talk. Create your own public
            or private videos, share with friends, or browse content from the community!
          </div>
        </div>
      </div>

      <section id="create-video" className="container mb-5">
        <div className="glass-card text-center py-5">
              <div className="h2 glow-text mb-3">Create a new video!</div>
              <div className="col-lg-1 mx-auto divider my-4" />
              <div className="lead text-white-50 mb-4 px-5">
                Create your own video within a few clicks! Provide your content
                via text, speech or file and keep the videos private or share
                them with the entire community!
              </div>
              <Link to='/sign-kit/create-video' className="btn btn-info btn-lg px-5 rounded-pill fw-bold">
                <i className="fa fa-plus-circle me-2"></i> Create Video
              </Link>
        </div>
      </section>

      <section id="Open-video" className="container">
        <div className="row">
          <div className="col-md-12 text-center mb-5">
              <div className="h2 glow-text">Open a video</div>
              <div className="col-lg-1 mx-auto divider my-3" />
              <div className="text-white-50">
                Enter a specific Video ID to watch directly
              </div>
          </div>
        </div>
        
        <div className="row justify-content-center">
            <div className="col-lg-6">
                <div className="glass-card p-4">
                     <Form noValidate validated={validated} onSubmit={handleSubmit} className="d-flex gap-2">
                        <Form.Control
                            type="text"
                            placeholder="Enter Video ID (e.g., 6245...)"
                            value={videoId}
                            required
                            onChange={(e) => setVideoId(e.target.value)}
                            className="form-control-lg"
                        />
                        <Button type="submit" variant="info" className="px-4 fw-bold">
                            Open
                        </Button>
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid video ID.
                        </Form.Control.Feedback>
                    </Form>
                </div>
            </div>
        </div>
      </section>

      <div className="container mt-5">
         <div className="h3 glow-text mb-4 text-center">Latest Community Videos</div>
         <Row xs={1} md={2} lg={3} className="g-4">
            {videoList}
         </Row>
      </div>

    </div>
  );
}

export default Videos;