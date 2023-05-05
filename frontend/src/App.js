import React from "react";
import Uploader from "./Uploader";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <div className="nav">
          <h2>Flood Water Mapping Using Radar Imagery</h2>
      </div>
      <Uploader />
    </div>
  );
};

export default App;
