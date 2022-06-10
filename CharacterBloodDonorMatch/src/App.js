// import React, { useState, useEffect } from "react";
// import React from "react";
import Home from "./Pages/Home/Home";
import Character from "./Pages/Character/Character";

import { Route, Routes } from "react-router-dom"
// import "./App.css"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element = {<Home/>}/>
        <Route exact path="/Character" element = {<Character/>}/>
      </Routes>
    </div>
  );
}

export default App;
