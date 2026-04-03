import React from "react";
import "../App.css";
import "font-awesome/css/font-awesome.min.css";
import Services from "../Components/Home/Services";
import Intro from "../Components/Home/Intro";
import Masthead from "../Components/Home/Masthead";

function Home() {
  return (
    <div style={{ backgroundColor: '#0f172a' }}>

      <Masthead />

      {/* <Intro /> Intro is mostly duplicate text now */}
      
      <Services />
      
      <div style={{ height: '100px' }}></div> {/* Spacer */}
    </div>
  );
}

export default Home;
