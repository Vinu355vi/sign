import '../App.css'
import React, { useState, useEffect, useRef } from "react";
import Slider from 'react-input-slider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import xbot from '../Models/xbot/xbot.glb';
import ybot from '../Models/ybot/ybot.glb';
import xbotPic from '../Models/xbot/xbot.png';
import ybotPic from '../Models/ybot/ybot.png';

import * as words from '../Animations/words';
import * as alphabets from '../Animations/alphabets';
import { defaultPose } from '../Animations/defaultPose';

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Convert() {
  const [text, setText] = useState("");
  const [bot, setBot] = useState(ybot);
  const [speed, setSpeed] = useState(0.1);
  const [pause, setPause] = useState(800);

  const componentRef = useRef({});
  const { current: ref } = componentRef;

  let textFromAudio = useRef(null);
  let textFromInput = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    let mounted = true;

    ref.flag = false;
    ref.pending = false;

    ref.animations = [];
    ref.characters = [];

    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0x1e293b); // Dark background for canvas

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 5, 5);
    ref.scene.add(spotLight);
    
    // Add ambient light for better visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    ref.scene.add(ambientLight);

    ref.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    ref.camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth * 0.57 / (window.innerHeight - 70),
        0.1,
        1000
    )
    ref.renderer.setSize(window.innerWidth * 0.57, window.innerHeight - 70);

    const canvas = document.getElementById("canvas");
    if (canvas) {
      canvas.innerHTML = "";
      canvas.appendChild(ref.renderer.domElement);
    }

    ref.camera.position.z = 1.6;
    ref.camera.position.y = 1.4;

    let loader = new GLTFLoader();
    loader.load(
      bot,
      (gltf) => {
        if (!mounted) return;
        gltf.scene.traverse((child) => {
          if ( child.type === 'SkinnedMesh' ) {
            child.frustumCulled = false;
          }
    });
        ref.avatar = gltf.scene;
        ref.scene.add(ref.avatar);
        defaultPose(ref);
      },
      (xhr) => {
        // console.log(xhr);
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    return () => {
        mounted = false;
    }

  }, [ref, bot]);

  ref.animate = () => {
    if(ref.animations.length === 0){
        ref.pending = false;
      return ;
    }
    requestAnimationFrame(ref.animate);
    
    // Safety check: ensure avatar is loaded
    if (!ref.avatar) return;

    if(ref.animations[0].length){
        if(!ref.flag) {
          if(ref.animations[0][0]==='add-text'){
            setText((prev) => prev + ref.animations[0][1]);
            ref.animations.shift();
          }
          else{
            for(let i=0;i<ref.animations[0].length;){
              let [boneName, action, axis, limit, sign] = ref.animations[0][i]
              if(sign === "+" && ref.avatar.getObjectByName(boneName)[action][axis] < limit){
                  ref.avatar.getObjectByName(boneName)[action][axis] += speed;
                  ref.avatar.getObjectByName(boneName)[action][axis] = Math.min(ref.avatar.getObjectByName(boneName)[action][axis], limit);
                  i++;
              }
              else if(sign === "-" && ref.avatar.getObjectByName(boneName)[action][axis] > limit){
                  ref.avatar.getObjectByName(boneName)[action][axis] -= speed;
                  ref.avatar.getObjectByName(boneName)[action][axis] = Math.max(ref.avatar.getObjectByName(boneName)[action][axis], limit);
                  i++;
              }
              else{
                  ref.animations[0].splice(i, 1);
              }
            }
          }
        }
    }
    else {
      ref.flag = true;
      setTimeout(() => {
        ref.flag = false
      }, pause);
      ref.animations.shift();
    }
    ref.renderer.render(ref.scene, ref.camera);
  }

  const sign = (input) => {
    
    var str = input.toUpperCase();
    var strWords = str.split(' ');
    setText('')

    for(let word of strWords){
      if(words[word] && typeof words[word] === "function"){
        ref.animations.push(['add-text', word+' ']);
        words[word](ref);
        
      }
      else{
        for(const [index, ch] of word.split('').entries()){
          if(index === word.length-1)
            ref.animations.push(['add-text', ch+' ']);
          else 
            ref.animations.push(['add-text', ch]);
          if(alphabets[ch]){
              alphabets[ch](ref);
          }
          
        }
      }
    }
    
    if(!ref.pending){
      ref.pending = true;
      ref.animate();
    }
  }

  const startListening = () =>{
    SpeechRecognition.startListening({continuous: true});
  }

  const stopListening = () =>{
    SpeechRecognition.stopListening();
  }

  return (
    <div className="page-container">
      <div className="space-between">
        <div style={{width:'58%', height:'calc(100vh - 70px)', borderRight:'1px solid rgba(255,255,255,0.1)'}} id="canvas"></div>
        <div style={{width:'42%', padding: '30px'}} className="d-flex flex-column justify-content-center">
            
            <div className="glass-card">
                <div className="heading h2 glow-text mb-4">
                    Text to Sign
                </div>

                <div className="space-between align-items-center mb-4">
                    <label className="text-white">Live Caption:</label>
                    <input type='text' className='form-control w-75' disabled value={text} placeholder="Captions will appear here..."/>
                </div>
                
                <hr className="my-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

                <div className="mb-3">
                    <label className="text-white mb-2">Input Text:</label>
                    <textarea 
                        className="form-control" 
                        rows="3" 
                        placeholder="Enter text to convert to sign language..."
                        onChange={(e) => { textFromInput.current.value = e.target.value; }}
                        ref={textFromInput}
                    ></textarea>
                </div>

                <div className="d-flex gap-3 mb-4">
                    <button className="btn btn-info flex-grow-1" onClick={() => {
                         ref.flag = false;
                         ref.pending = false;
                         ref.animations = [];
                         ref.characters = [];
                         setText("");
                         if (textFromInput.current) {
                             sign(textFromInput.current.value);
                         }
                    }}>
                        <i className="fa fa-play me-2"></i> Convert Text
                    </button>
                    <button className="btn btn-outline-light flex-grow-1" onClick={() => { 
                        setText(""); 
                        if(textFromInput.current) textFromInput.current.value = ""; 
                        ref.flag = false;
                        ref.pending = false;
                        ref.animations = [];
                        ref.characters = [];
                    }}>
                        <i className="fa fa-trash me-2"></i> Clear
                    </button>
                </div>
            </div>

            <div className="glass-card">
                <div className="d-flex align-items-center mb-3">
                    <button 
                        className={`btn ${listening ? 'btn-danger' : 'btn-success'} me-3 rounded-circle d-flex align-items-center justify-content-center`}
                        style={{ width: '50px', height: '50px' }}
                        onClick={() => { if (!listening) startListening(); else stopListening(); }}
                    >
                        <i className={`fa ${listening ? 'fa-microphone-slash' : 'fa-microphone'}`} style={{ marginLeft: 0 }}></i>
                    </button>
                    <div className="flex-grow-1">
                        <label className="text-white mb-1 d-block">Speech Input:</label>
                        <input type='text' className='form-control' value={transcript} disabled placeholder="Speech text..."/>
                    </div>
                </div>
                <button className="btn btn-info w-100" onClick={() => {
                     if(transcript === "") {
                         alert("Please speak something!");
                         return;
                     }
                     if(textFromInput.current) textFromInput.current.value="";
                     
                     // Reset state like input button
                     ref.flag = false;
                     ref.pending = false;
                     ref.animations = [];
                     ref.characters = [];
                     setText("");
                     sign(transcript);
                }}>
                    <i className="fa fa-refresh me-2"></i> Convert Speech
                </button>
            </div>

            <div className="glass-card p-3">
                 <div className="space-between align-items-center">
                    <div>
                        <span className="text-white me-3">Speed: {speed}</span>
                        <div style={{ display: 'inline-block', touchAction: 'none' }}>
                        <Slider
                            axis="x"
                            x={speed}
                            xmin={0.1}
                            xmax={0.3}
                            xstep={0.05}
                            onChange={({ x }) => setSpeed(parseFloat(x.toFixed(2)))}
                            styles={{
                                track: { backgroundColor: 'rgba(255,255,255,0.1)' },
                                active: { backgroundColor: '#00d2ff' },
                                thumb: { width: 15, height: 15, backgroundColor: 'white' }
                            }}
                        />
                        </div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-white">Avatar:</span>
                        <div className={`p-1 ${bot === ybot ? 'border border-info rounded' : ''}`} style={{cursor:'pointer'}} onClick={() => { setBot(ybot); }}>
                            <img src={ybotPic} alt="YBot" width="40" style={{borderRadius:'5px'}}/>
                        </div>
                        <div className={`p-1 ${bot === xbot ? 'border border-info rounded' : ''}`} style={{cursor:'pointer'}} onClick={() => { setBot(xbot); }}>
                             <img src={xbotPic} alt="XBot" width="40" style={{borderRadius:'5px'}}/>
                        </div>
                    </div>
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default Convert;