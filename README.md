# Silent Talk 🗣️

![Silent Talk - Landing Page](./assets/landing.png)
<p align="center">
  <img src=".\public\assets\land.png" width="500"/>
</p>

## 📖 About the Project

**Silent Talk** is a comprehensive web application designed to bridge the communication gap for the deaf and hard-of-hearing community. By leveraging modern web technologies and Artificial Intelligence, specifically Computer Vision and Machine Learning, the project provides a suite of tools for translating between spoken/written language and Indian Sign Language (ISL). The application features real-time Sign-to-Text conversion using webcam input and Text-to-Sign conversion using a 3D avatar, along with learning modules and video creation tools to ensure total workplace and personal communication compliance.

## 🛠️ Technical Stack

*   **Frontend:** React.js, React Router, Bootstrap, CSS3.
*   **3D Graphics:** Three.js for 3D avatar rendering and skeletal animation.
*   **AI/ML Models:** TensorFlow.js deploying `@tensorflow-models/hand-pose-detection` (MediaPipe Hands) for real-time edge computing inferences, alongside the `fingerpose` gesture classifier.
*   **Speech Recognition:** React Speech Recognition for converting audio streams to text.

## 🧩 Core Modules

The system is divided into four principal pillars tailored for sign language translation:

1.  **📷 Sign to Text Conversion**
    Connects to the user's webcam feed to capture video frames. It performs real-time edge processing to detect hand landmarks and classify them against predefined gestures, displaying corresponding text instantly without overwhelming a server.
    
2.  **🎥 Text to Sign Conversion**
    Parses typed text or spoken words (via microphone) and maps them to predefined 3D animations or finger-spelling logic, seamlessly rendering a 3D avatar to perform the signs frame-by-frame.

3.  **📚 Learning Modules**
    Interactive educational tools and modules designed to teach Indian Sign Language (ISL) effectively to new learners, making communication inclusive.

4.  **🎬 Video Creation**
    A dedicated tool allowing users to record, create, and manage sign language videos seamlessly for further distribution or educational purposes.

## 🏗️ System Architecture

*   **Client-Side Edge Computing:** To preserve privacy, lower latency, and reduce server-side load, real-time video stream inferences (hand pose detection) run directly in the user's browser via hardware-accelerated TensorFlow.js models.
*   **Component-Based SPA:** The application follows a robust React component-based architecture, utilizing reusable UI elements and efficient state management to handle real-time video feeds and animation states.
*   **3D Rendering Engine:** Three.js is utilized as the WebGL library to render the 3D avatar, handling the scene, camera, lighting, and bone-based animation updates.

## 🧠 Algorithm Details

*   **Hand Point Detection:** The application primarily delegates hand mapping to the MediaPipe Hands model (via TFJS), outputting 21 3D keypoints per hand from the active webcam feed.
*   **Gesture Classification:** The `fingerpose` library analyzes the geometric relationship between keypoints. Gestures are defined based on the "Curl" (No Curl, Half Curl, Full Curl) and "Direction" (Vertical Up, Diagonal, Horizontal, etc.) of each finger.
*   **Confidence Thresholding:** The gesture estimator returns a confidence score (0 to 10) for each match. To avoid false positives, the system enforces a strict threshold (e.g., 7.5 or 8), selecting only the highest confidence matches corresponding to reliable predefined strings (e.g., 'Victory', 'Thumbs Up').
*   **Fallback Animation Mapping:** In Text-to-Sign, if an entire word lacks a predefined custom animation sequence, the system algorithmically falls back to finger-spelling the target word letter-by-letter using localized individual alphabet animations.

## 💻 How to Set Up

### Prerequisites
*   Node.js (v14+)
*   Modern Web Browser with WebGL and Webcam support.

### 1. Project Setup

```bash
npm install

Start the React client:

📸 Sample Screens
Below are some visual representations of the application:

Translation Interface
Silent Talk - Service Page

<p align="center"> <img src=".\assets\future.png" width="500"/> </p>

📜 Copyright

© 2026 Silent Talk. All rights reserved.

No part of this application, including algorithms, architectural designs, UI concepts, or gesture definitions, may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the owner.