
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Photoframe from "./frame/photframe";

function App() {
  return (
        <Router>
      <Routes>
        <Route path="/" element={<Photoframe />} />
        
      </Routes>
    </Router>
  );
}

export default App;
