# Project Report: Silent Talk

## Abstract
**Silent Talk** is a comprehensive web application designed to bridge the communication gap for the deaf and hard-of-hearing community. By leveraging modern web technologies and Artificial Intelligence, specifically Computer Vision and Machine Learning, the project provides a suite of tools for translating between spoken/written language and Indian Sign Language (ISL). The application features real-time **Sign-to-Text** conversion using webcam input and **Text-to-Sign** conversion using a 3D avatar, along with learning modules and video creation tools. This project aims to make communication more inclusive and accessible.

## Technology Stack

### Frontend
- **React.js**: A JavaScript library for building user interfaces. It handles the view layer of the application.
- **React Router**: For navigation between different pages in the Single Page Application (SPA).
- **Bootstrap & React-Bootstrap**: For responsive design and pre-built UI components.
- **CSS3**: For custom styling and animations.

### AI & Machine Learning
- **TensorFlow.js**: An open-source hardware-accelerated JavaScript library for training and deploying ML models.
- **@tensorflow-models/hand-pose-detection**: A pre-trained model for real-time hand pose detection in the browser. It detects 21 3D keypoints of a hand.
- **Fingerpose**: A gesture classifier library for hand landmarks. It analyzes the curl and direction of fingers to recognize custom gestures.
- **React Speech Recognition**: A library to incorporate speech-to-text functionality.

### 3D Graphics
- **Three.js**: A cross-browser JavaScript library and application programming interface (API) used to create and display 3D computer graphics (the avatar).

## How it Works

### 1. Sign to Text Conversion
- **Input**: The user's webcam feed captures video frames.
- **Detection**: The MediaPipe Hands model (via TensorFlow.js) processes each frame to detect hand landmarks (keypoints).
- **Classification**: The `fingerpose` library analyzes the geometric relationship between these keypoints (e.g., is the index finger curled? is the thumb pointing up?).
- **Matching**: The detected finger configurations are compared against a set of reliable predefined gesture descriptions (e.g., 'Victory', 'Thumbs Up', 'I Love You').
- **Output**: When a gesture matches with high confidence, the corresponding text is displayed on the screen.

### 2. Text to Sign Conversion
- **Input**: User types text or speaks into the microphone.
- **Parsing**: The input is broken down into letters or recognized words.
- **Animation Mapping**: The system checks if there is a predefined animation for the word (in `src/Animations/Words`). If not, it falls back to finger-spelling (in `src/Animations/Alphabets`).
- **Rendering**: The 3D avatar updates its skeletal pose frame-by-frame based on the animation data using Three.js.

## Architecture & Structure

The project follows a component-based architecture typical of React applications.

### Folder Structure
- **`public/`**: Static assets like `index.html`, `manifest.json`, and 3D models.
- **`src/`**: Source code of the application.
  - **`Animations/`**: Contains the logic and data for 3D avatar animations (Alphabets and Words).
  - **`Assets/`**: Images, icons, and other static media.
  - **`Components/`**: Reusable UI components like `Navbar`, `Footer`, `VideoCard`.
  - **`Config/`**: Configuration files.
  - **`Models/`**: (Likely contains references or loaders for 3D models).
  - **`Pages/`**: Main views of the application corresponding to routes:
    - `Home.js`: Landing page.
    - `Convert.js`: Text/Speech to Sign interface.
    - `SignToText.js`: Sign to Text interface using webcam.
    - `LearnSign.js`: Educational module.
    - `CreateVideo.js`: Tool to make sign language videos.
  - **`App.js`**: Main component handling routing.

## Key Functions

1.  **Sign Detection**: Real-time identification of hand gestures.
2.  **3D Rendering**: Manipulating a 3D character rig to perform signs.
3.  **Speech-to-Text**: converting audio input to text for sign generation.
4.  **Learning Modules**: Interactive cards or videos to teach ISL.

## Supported Vocabulary

### 1. Sign to Text (Gestures)
The system recognizes the following static hand gestures via the webcam:

| Gesture Name | Description | Meaning |
| :--- | :--- | :--- |
| **Victory** | Index and Middle fingers extended in a V shape. | "Victory" / Letter 'V' |
| **Thumbs Up** | Thumb extended upward, other fingers curled. | "Yes" / "Good" |
| **Thumbs Down** | Thumb extended downward. | "No" / "Bad" |
| **Hello** | All fingers extended (Open Palm). | "Hello" / Greeting |
| **C** | Fingers curled to form a C shape. | Letter 'C' |
| **OK** | Thumb and Index finger touching in a circle. | "OK" / Perfect |
| **Confident** | All fingers curled into a fist. | "Confident" / "Solid" |
| **I Love You** | Thumb, Index, and Pinky extended. | "I Love You" |
| **Aeroplane** | Thumb and Pinky extended, others curled. | "Aeroplane" / "Call Me" |
| **Pointing** | Index finger pointing up or diagonally. | "Look" / Deictic reference |

### 2. Text to Sign (Words)
The 3D avatar can perform animations for specific words. If a word is not in this list, the system will finger-spell it letter-by-letter.

- **TIME**
- **HOME**
- **PERSON**
- **YOU**

(Note: The dictionary can be expanded by adding more animation files in `src/Animations/Words/`)

## Viva Questions

**Q1: What algorithm is used for hand detection?**
**A:** We use the MediaPipe Hands model, accessed via TensorFlow.js (`@tensorflow-models/hand-pose-detection`). It uses a single-shot detector model optimized for mobile and web.

**Q2: How does the system distinguish between different signs?**
**A:** The system uses the `fingerpose` library. We define gestures based on the "Curl" (No Curl, Half Curl, Full Curl) and "Direction" (Vertical Up, Diagonal, Horizontal, etc.) of each finger. The classifier compares the current hand state against these definitions.

**Q3: Why use React for this project?**
**A:** React's component-based architecture allows for reusable UI elements (like the Navbar or VideoCard) and efficient state management, which is crucial for handling real-time video feeds and animation states.

**Q4: What is the role of Three.js?**
**A:** Three.js is a WebGL library used to render the 3D avatar in the browser. It handles the scene, camera, lighting, and the bone-based animation system required to move the avatar's hands and arms.

**Q5: Is the processing done on the server or client?**
**A:** The processing is **Client-side**. TensorFlow.js runs the machine learning models directly in the user's web browser, ensuring privacy (video doesn't leave the device) and lower latency.

**Q6: What are the limitations of the current Sign-to-Text system?**
**A:** It currently recognizes a limited dictionary of static gestures. It may struggle with dynamic signs involving complex movement (motion paths) or facial expressions, and rapid continuous signing. Lighting conditions and camera quality also affect accuracy.

**Q7: How is the 'confidence' score used?**
**A:** The gesture estimator returns a confidence score (usually 0 to 10) for each match. We select dimensions with the highest confidence score (usually setting a minimum threshold, e.g., 7.5 or 8) to avoid false positives.
