import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Row, Form, Col, Button } from "react-bootstrap";
import { baseURL } from "../Config/config";
import { addVideo } from "../Assets/mockVideos";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
import ConfirmModal from "../Components/CreateVideo/ConfirmModal";

function CreateVideo() {
  const [video, setVideo] = useState({
    title: "",
    desc: "",
    createdBy: "",
    type: "PUBLIC"
  });
  const [validated, setValidated] = useState(false);
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState("");
  const [videoId, setVideoId] = useState("")
  const [showModal, setShowModal] = useState(false)
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const navigate = useNavigate()

  const handleInputChanges = (event) => {
    setVideo((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const validateVideo = () => {
    if (!video.title || !video.desc || !video.createdBy) return false;
    else if (mode === "text" && !text) return false;
    else if (mode === "file" && !file) return false;
    else if (mode === "speech" && !transcript) return false;
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateVideo() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    let content = "";
    if (mode === "text") content = text;
    else if (mode === "file") content = await file.text();
    else if (mode === "speech") content = transcript;

    const newVideo = {
      ...video,
      content: content,
    };

    // Mock API call
    console.log("Mocking API call to create video:", newVideo);
    const addedVideo = addVideo(newVideo);
    setVideoId(addedVideo._id);
    setShowModal(true);
  };

  return (
    <div className="page-container d-flex flex-column align-items-center">
      <div className="section-header w-100 text-center">
         <div className="display-4 fw-bold glow-text mb-2">Create a New Video</div>
         <div className="lead text-white-50">
            Fill this form and provide your content to create a video using ISL in a few clicks!
         </div>
      </div>

      <Row className="container d-flex justify-content-center">
        <Col md={8} lg={6}>
            <div className="glass-card">
                <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className="d-flex flex-column"
                >
                <Form.Group controlId="title" className="mb-3">
                    <Form.Label className="text-white">Title of Video</Form.Label>
                    <Form.Control
                    required
                    type="text"
                    placeholder="Enter video title"
                    name="title"
                    value={video.title}
                    onChange={handleInputChanges}
                    />
                    <Form.Control.Feedback type="invalid">
                    Please provide a valid video title.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="desc" className="mb-3">
                    <Form.Label className="text-white">Description</Form.Label>
                    <Form.Control
                    required
                    as="textarea"
                    rows={3}
                    placeholder="Brief description of the video"
                    name="desc"
                    value={video.desc}
                    onChange={handleInputChanges}
                    />
                    <Form.Control.Feedback type="invalid">
                    Please provide a valid description.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="createdBy" className="mb-4">
                    <Form.Label className="text-white">Creator Name</Form.Label>
                    <Form.Control
                    required
                    type="text"
                    placeholder="Enter your name"
                    name="createdBy"
                    value={video.createdBy}
                    onChange={handleInputChanges}
                    />
                    <Form.Control.Feedback type="invalid">
                    Please provide the creator name.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label className="text-white d-block mb-3">Video Type</Form.Label>
                    <div className="d-flex gap-3">
                        <Form.Check
                            type="radio"
                            label="Public"
                            name="type"
                            id="public"
                            value="PUBLIC"
                            className="text-white"
                            checked={video.type === "PUBLIC"}
                            onChange={handleInputChanges}
                        />
                        <Form.Check
                            type="radio"
                            label="Private"
                            name="type"
                            id="private"
                            value="PRIVATE"
                            className="text-white"
                            checked={video.type === "PRIVATE"}
                            onChange={handleInputChanges}
                        />
                    </div>
                </Form.Group>
                
                <div className="bg-dark p-3 rounded mb-4 border border-secondary">
                    <Form.Label className="text-white mb-3">Content Source:</Form.Label>
                    <div className="d-flex gap-2 mb-3">
                        <Button
                            variant={mode === "text" ? "info" : "outline-secondary"}
                            onClick={() => setMode("text")}
                            className="flex-grow-1"
                        >Text</Button>
                        <Button
                            variant={mode === "file" ? "info" : "outline-secondary"}
                            onClick={() => setMode("file")}
                            className="flex-grow-1"
                        >File</Button>
                         <Button
                            variant={mode === "speech" ? "info" : "outline-secondary"}
                            onClick={() => setMode("speech")}
                            className="flex-grow-1"
                        >Speech</Button>
                    </div>

                    {mode === "text" && (
                        <Form.Group controlId="text">
                        <Form.Control
                            required
                            as="textarea"
                            rows={5}
                            placeholder="Enter text content here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                         <Form.Control.Feedback type="invalid">
                            Please provide text content.
                        </Form.Control.Feedback>
                        </Form.Group>
                    )}

                    {mode === "file" && (
                         <Form.Group controlId="file">
                             <Form.Control 
                                type="file" 
                                required
                                onChange={(e)=>setFile(e.target.files[0])}
                             />
                             <Form.Control.Feedback type="invalid">
                                Please select a file.
                            </Form.Control.Feedback>
                         </Form.Group>
                    )}

                    {mode === "speech" && (
                         <div className="d-flex flex-column gap-2">
                             <div className="d-flex gap-2">
                                <Button variant={listening ? "danger" : "success"} onClick={listening ? stopListening : startListening}>
                                    <i className={`fa ${listening ? 'fa-microphone-slash' : 'fa-microphone'} me-2`}></i>
                                    {listening ? "Stop Recording" : "Start Recording"}
                                </Button>
                             </div>
                             <Form.Control
                                as="textarea"
                                rows={4}
                                disabled
                                value={transcript}
                            />
                             {transcript.length === 0 && <span className="text-muted small">Speak something...</span>}
                         </div>
                    )}
                </div>

                <div className="d-flex justify-content-center">
                    <Button type="submit" variant="info" size="lg" className="w-100 fw-bold">
                        Create Video
                    </Button>
                </div>

                </Form>
            </div>
        </Col>
      </Row>
      
      <ConfirmModal 
        show={showModal}
        onHide={() => setShowModal(false)}
        videoId={videoId}
      />
    </div>
  );
}

export default CreateVideo;