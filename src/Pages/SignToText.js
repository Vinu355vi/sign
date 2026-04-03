import React, { useRef, useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import * as tf from '@tensorflow/tfjs';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as fp from 'fingerpose';
import '../App.css'; 

function SignToText() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const lastSpokenWord = useRef(""); // Track last spoken word to prevent repetition
    const [isRecording, setIsRecording] = useState(false);
    const [translatedText, setTranslatedText] = useState("Waiting for gesture...");
    const [model, setModel] = useState(null);

    useEffect(() => {
        let mounted = true;
        const loadModel = async () => {
            console.log("Loading handpose model...");
            try {
                await tf.ready();
                const model = handPoseDetection.SupportedModels.MediaPipeHands;
                const detectorConfig = {
                    runtime: 'tfjs',
                    maxHands: 2
                };
                const detector = await handPoseDetection.createDetector(model, detectorConfig);
                if (mounted) {
                    setModel(detector);
                    console.log("Handpose model loaded.");
                }
            } catch (err) {
                console.error("Failed to load handpose model", err);
            }
        };
        loadModel();

        return () => {
            mounted = false;
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                };
            }
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please ensure you have granted permission.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsRecording(false);
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        }
    };

    const drawHand = (hands, ctx) => {
        if (hands.length > 0) {
            hands.forEach((hand) => {
                const keypoints = hand.keypoints;
                for (let j = 0; j < keypoints.length; j++) {
                    const x = keypoints[j].x;
                    const y = keypoints[j].y;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 3 * Math.PI);
                    ctx.fillStyle = "aqua";
                    ctx.fill();
                }
            });
        }
    };


    useEffect(() => {
        let mounted = true;
        let interval;
        const runDetection = async () => {
            if (isRecording && model && videoRef.current && videoRef.current.readyState === 4) {
                const video = videoRef.current;
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;
                
                if (!mounted) return;

                videoRef.current.width = videoWidth;
                videoRef.current.height = videoHeight;

                if(canvasRef.current) {
                    canvasRef.current.width = videoWidth;
                    canvasRef.current.height = videoHeight;
                }

                // 1. Get predictions for all hands
                const hands = await model.estimateHands(video);

                // --- Gesture Definitions (Reusable) ---
                // Helper to add simple directions
                const addDirection = (gesture, finger, dir, weight) => gesture.addDirection(finger, dir, weight);
                const addCurl = (gesture, finger, curl, weight) => gesture.addCurl(finger, curl, weight);

                // Generic "Pointing" (Index up, others curled) - used for dominant hand in BSL
                const PointingGesture = new fp.GestureDescription('Pointing');
                addCurl(PointingGesture, fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
                addDirection(PointingGesture, fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
                addDirection(PointingGesture, fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.9);
                addDirection(PointingGesture, fp.Finger.Index, fp.FingerDirection.DiagonalUpRight, 0.9);
                // Allow thumb to be loose
                for(let finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                    addCurl(PointingGesture, finger, fp.FingerCurl.FullCurl, 1.0);
                    addCurl(PointingGesture, finger, fp.FingerCurl.HalfCurl, 0.9);
                }

                // Generic "OpenPalm" (All fingers extended) - used for passive hand in BSL
                const OpenPalmGesture = new fp.GestureDescription('OpenPalm');
                for(let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                    addCurl(OpenPalmGesture, finger, fp.FingerCurl.NoCurl, 1.0);
                }

                // ASL/Existing Gestures
                const HelloGesture = new fp.GestureDescription('Hello');
                for(let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                   HelloGesture.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
                }

                const ThumbsDownGesture = new fp.GestureDescription('No');
                addCurl(ThumbsDownGesture, fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
                addDirection(ThumbsDownGesture, fp.Finger.Thumb, fp.FingerDirection.VerticalDown, 1.0);
                for(let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                    addCurl(ThumbsDownGesture, finger, fp.FingerCurl.FullCurl, 1.0);
                }

                 // Gesture 'C' (ASL/BSL similar)
                 const CGesture = new fp.GestureDescription('C');
                 for(let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                    addCurl(CGesture, finger, fp.FingerCurl.HalfCurl, 1.0);
                 }
                 addCurl(CGesture, fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);

                 // --- Words ---

                 // I Love You (ILY) - Thumb, Index, Pinky out
                 const ILYGesture = new fp.GestureDescription('I_Love_You');
                 addCurl(ILYGesture, fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
                 addDirection(ILYGesture, fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);
                 addCurl(ILYGesture, fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
                 addDirection(ILYGesture, fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
                 addCurl(ILYGesture, fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
                 addDirection(ILYGesture, fp.Finger.Pinky, fp.FingerDirection.VerticalUp, 1.0);
                 for(let finger of [fp.Finger.Middle, fp.Finger.Ring]) {
                     addCurl(ILYGesture, finger, fp.FingerCurl.FullCurl, 1.0);
                 }

                 // OK / F Gesture
                 const OKGesture = new fp.GestureDescription('OK');
                 addCurl(OKGesture, fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
                 addCurl(OKGesture, fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
                 for(let finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                      addCurl(OKGesture, finger, fp.FingerCurl.NoCurl, 1.0);
                      addDirection(OKGesture, finger, fp.FingerDirection.VerticalUp, 1.0);
                 }

                 // Confident (Fist)
                 const ConfidentGesture = new fp.GestureDescription('Confident');
                 for(let finger of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
                     addCurl(ConfidentGesture, finger, fp.FingerCurl.FullCurl, 1.0);
                 }

                 // Aeroplane / Shaka (Thumb and Pinky out, others curled)
                 const AeroplaneGesture = new fp.GestureDescription('Aeroplane');
                 addCurl(AeroplaneGesture, fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
                 addCurl(AeroplaneGesture, fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
                 for(let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring]) {
                     addCurl(AeroplaneGesture, finger, fp.FingerCurl.FullCurl, 1.0);
                 }

                const gestures = new fp.GestureEstimator([
                    fp.Gestures.VictoryGesture,
                    fp.Gestures.ThumbsUpGesture,
                    HelloGesture,
                    ThumbsDownGesture,
                    PointingGesture,
                    // OpenPalmGesture, // Conflicts with Hello
                    CGesture,
                    ILYGesture,
                    OKGesture,
                    ConfidentGesture,
                    AeroplaneGesture
                ]);

                // Helper: Get Euclidean distance between two keypoints
                const getDistance = (p1, p2) => {
                    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                };

                // Analyze detected hands
                if (hands.length > 0) {
                    // Process each hand to judge its shape
                    const handResults = await Promise.all(hands.map(async (hand) => {
                        let landmarks = [];
                        if (hand.keypoints3D) {
                           landmarks = hand.keypoints3D.map(pt => [pt.x, pt.y, pt.z]);
                        } else {
                           landmarks = hand.keypoints.map(pt => [pt.x, pt.y, 0]);
                        }
                        const estimated = await gestures.estimate(landmarks, 8.0);
                        return { 
                            hand: hand, 
                            gestures: estimated.gestures, 
                            maxConfidenceGesture: estimated.gestures.length > 0 ? 
                                estimated.gestures.reduce((prev, current) => (prev.score > current.score) ? prev : current) : null
                        };
                    }));

                    let detectedWord = "";


                    // --- BSL Two-Handed Logic & Complex Gestures ---
                    if (hands.length === 2) {
                        const h1 = handResults[0];
                        const h2 = handResults[1];
                        const g1 = h1.maxConfidenceGesture?.name;
                        const g2 = h2.maxConfidenceGesture?.name;

                        // Calculate distance between wrists (approximate hand distance)
                        const distWrists = getDistance(h1.hand.keypoints[0], h2.hand.keypoints[0]);
                        const CLOSE_THRESHOLD = 150; // Adjust as needed

                        // Together: Two fists/Confident close together
                        if ((g1 === 'Confident' || g1 === 'No') && (g2 === 'Confident' || g2 === 'No') && distWrists < CLOSE_THRESHOLD) {
                             detectedWord = "Together";
                        }
                        
                        // Help: One Flat/Hello, One ThumbsUp/Confident
                        // Check combinations
                        else if (((g1 === 'Hello' && g2 === 'Confident') || (g2 === 'Hello' && g1 === 'Confident')) && distWrists < CLOSE_THRESHOLD) {
                             detectedWord = "Help";
                        }
                        
                        // Accident: Two Hello/OpenPalm collision
                        else if (g1 === 'Hello' && g2 === 'Hello' && distWrists < CLOSE_THRESHOLD) {
                             detectedWord = "Accident";
                        }

                        // --- Existing BSL Vowels Logic ---
                        else {
                            let pointer = null;
                            let base = null;

                            // Simple heuristic: check if one has "Pointing" gesture
                            if (g1 === 'Pointing') { pointer = h1; base = h2; }
                            else if (g2 === 'Pointing') { pointer = h2; base = h1; }

                            if (pointer && base) {
                                const pointerTip = pointer.hand.keypoints[8]; // Index Tip
                                const baseKeypoints = base.hand.keypoints;
                                
                                // Threshold for "touching" in pixels (adjust based on camera res, 50 is loose)
                                const TOUCH_THRESHOLD = 50; 

                                // Calculate distances to Base fingertips
                                const distThumb = getDistance(pointerTip, baseKeypoints[4]);
                                const distIndex = getDistance(pointerTip, baseKeypoints[8]);
                                const distMiddle = getDistance(pointerTip, baseKeypoints[12]);
                                const distRing = getDistance(pointerTip, baseKeypoints[16]);
                                const distPinky = getDistance(pointerTip, baseKeypoints[20]);

                                if (distThumb < TOUCH_THRESHOLD) detectedWord = "A";
                                else if (distIndex < TOUCH_THRESHOLD) detectedWord = "E";
                                else if (distMiddle < TOUCH_THRESHOLD) detectedWord = "I";
                                else if (distRing < TOUCH_THRESHOLD) detectedWord = "O";
                                else if (distPinky < TOUCH_THRESHOLD) detectedWord = "U";
                            }
                        }
                    }

                    // --- Single Handed Logic (Fallback or Specific) ---
                    if (!detectedWord) {
                        for (const res of handResults) {
                            if (res.maxConfidenceGesture) {
                                const name = res.maxConfidenceGesture.name;
                                const map = {
                                    "thumbs_up": "Good",
                                    "victory": "Peace",
                                    "Hello": "Hi",
                                    "No": "Wrong",
                                    "C": "C",
                                    "Pointing": "Pointing", // Debug
                                    "I_Love_You": "Awesome",
                                    "OK": "Nice",
                                    "Confident": "Confident",
                                    "Aeroplane": "Aeroplane"
                                };
                                if (map[name] && name !== 'Pointing' && name !== 'OpenPalm') {
                                    detectedWord = map[name];
                                }
                            }
                        }
                    }

                    // --- Output Handling ---
                    if (mounted && detectedWord && lastSpokenWord.current !== detectedWord) {
                        const utterance = new SpeechSynthesisUtterance(detectedWord);
                        window.speechSynthesis.speak(utterance);
                        
                        lastSpokenWord.current = detectedWord;
                        setTranslatedText(prev => {
                            if (prev === "Waiting for gesture...") return detectedWord;
                            return prev + " " + detectedWord;
                        });
                    }

                    if (mounted && canvasRef.current) {
                        const ctx = canvasRef.current.getContext("2d");
                        drawHand(hands, ctx);
                    }
                }
            }
        };

        if (isRecording) {
            interval = setInterval(() => {
                runDetection();
            }, 500); 
        }

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [isRecording, model]);

    const speakText = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(translatedText);
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Text-to-speech not supported in this browser.");
        lastSpokenWord.current = "";
        }
    };
    
    const clearText = () => {
        setTranslatedText("Waiting for gesture...");
        lastSpokenWord.current = "";
    }

    return (
        <div className="page-container d-flex flex-column align-items-center pt-5">
            <h2 className="glow-text mb-4">Sign to Text Converter</h2>
            
            <div className="glass-card d-flex flex-column align-items-center" style={{ padding: '20px', width: 'fit-content' }}>
                <div style={{ position: 'relative', width: '640px', height: '480px', borderRadius: '15px', overflow: 'hidden', border: '5px solid rgba(0, 210, 255, 0.3)' }}>
                    {/* Video and Canvas overlay */}
                    <video
                        ref={videoRef}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '640px',
                            height: '480px',
                            objectFit: 'cover'
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '640px',
                            height: '480px',
                        }}
                    />
                    
                    {!isRecording && (
                        <div style={{
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            background: 'rgba(0,0,0,0.7)',
                            zIndex: 10
                        }}>
                             <i className="fa fa-video-camera fa-5x text-white mb-3"></i>
                             <p className="text-white h5">Camera is off</p>
                        </div>
                    )}
                </div>

                <div className="mt-4 p-3 w-100 text-center rounded" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,210,255,0.3)' }}>
                     <p className="h3 mb-0" style={{ color: '#00d2ff', minHeight: '40px' }}>
                        {translatedText}
                    </p>
                </div>

                <div className="mt-4 d-flex gap-3">
                    {!isRecording ? (
                        <Button 
                            variant="info" 
                            size="lg" 
                            onClick={startCamera} 
                            style={{ width: '200px', fontWeight: 'bold' }}
                            disabled={!model}
                        >
                            {model ? <span><i className="fa fa-play me-2"></i> Start Camera</span> : 'Loading Model...'}
                        </Button>
                    ) : (
                        <Button 
                            variant="danger" 
                            size="lg" 
                            onClick={stopCamera} 
                            style={{ width: '200px', fontWeight: 'bold' }}
                        >
                            <i className="fa fa-stop me-2"></i> Stop Camera
                        </Button>
                    )}
                    <Button variant="secondary" size="lg" onClick={clearText}>Clear Text</Button>
                </div>
                
                 <div className="mt-3">
                    <Button variant="outline-info" onClick={speakText} disabled={translatedText === "Waiting for gesture..."}>
                            <i className="fa fa-volume-up me-2"></i> Speak Output
                    </Button>
                 </div>
                
                <p className="mt-3 text-white-50 small">
                    Make sure your hand is visible in the frame. The model detects hand gestures and translates them.
                </p>
            </div>
        </div>
    );
}

export default SignToText;
