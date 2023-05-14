import React from "react";
import "./App.css";
import img from "../src/asset/icon.jpeg";

const ImageContainer = (data) => {
  return (
    <>
      <img className="result-image" src={data ? img : `data:image/png;base64,${data}`} alt="secret" />
    </>
  );
};

export default ImageContainer;
