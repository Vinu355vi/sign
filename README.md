# Silent Talk

**The complete toolkit for Indian Sign Language.**

Silent Talk is a comprehensive web application designed to bridge the communication gap for the deaf and hard-of-hearing community. It offers a suite of tools for learning, converting, and interpreting Indian Sign Language (ISL).

## Features

- **Text to Sign Conversion**: Enter text and watch a 3D avatar render the corresponding ISL signs in real-time.
- **Sign to Text Conversion**: Use your webcam to perform signs, and the application uses computer vision to detect and translate them into text.
- **Learn ISL**: Interactive modules to learn ISL alphabets and common words.
- **Speech Recognition**: Convert spoken words into sign language animations.
- **Video Library**: Access a collection of sign language videos.
- **Create Videos**: Tools to create and customize sign language videos.
- **Feedback System**: Integrated feedback mechanism for user suggestions.

## Technologies Used

This project leverages modern web technologies and machine learning libraries:

- **Frontend Framework**: [React.js](https://reactjs.org/)
- **Routing**: [React Router](https://reactrouter.com/) (v6)
- **Styling**: [Bootstrap](https://getbootstrap.com/) & React Bootstrap, Font Awesome
- **3D Graphics**: [Three.js](https://threejs.org/) (for Avatar rendering)
- **Machine Learning & Computer Vision**:
  - [TensorFlow.js](https://www.tensorflow.org/js)
  - `@tensorflow-models/handpose`: For real-time hand pose detection.
  - `fingerpose`: For gesture classification.
- **Speech**: `react-speech-recognition` for speech-to-text functionality.

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd sign
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Running the Application

In the project directory, you can run:

```sh
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Project Structure

```
src/
├── Animations/       # animation data for 3D avatar (Alphabets, Words)
├── Assets/           # Static assets
├── Components/       # Reusable UI components (Navbar, Footer, etc.)
├── Config/           # Configuration files
├── Models/           # 3D Models (xbot, ybot)
├── Pages/            # Main application pages
│   ├── Convert.js    # Text/Speech to Sign logic
│   ├── SignToText.js # Sign to Text (ML) logic
│   ├── LearnSign.js  # Learning modules
│   ├── Home.js       # Landing page
│   └── ...
├── App.js            # Main entry point with Routing
└── index.js          # React DOM rendering
```


